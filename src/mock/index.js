// Mock 适配器
// 作为 axios 的自定义 adapter，拦截全部请求并返回本地静态数据，使项目无需后端即可独立运行（GitHub Pages 静态展示）。
// 业务代码无需任何改动：所有响应都保持后端原有的 { status, payload, message } 结构。

import {
  USERS, SENSITIVE_WORDS, WORKS, MANUAL_RECORDS, QUEUE, CHAT_MESSAGES,
  REVIEW_REPORT, REVIEW_CONFIG, buildAiReview,
} from './db'
import { avatar, cover } from './placeholders'

// ---------- 工具 ----------
const ok = (payload = {}) => ({ status: true, payload })
const fail = (message) => ({ status: false, message, payload: { message } })

function parseBody(config) {
  if (!config.data) return {}
  if (config.data instanceof FormData) return config.data
  if (typeof config.data === 'string') {
    try { return JSON.parse(config.data) } catch { return {} }
  }
  return config.data
}

function parseParams(config) {
  const out = {}
  const qIndex = (config.url || '').indexOf('?')
  if (qIndex >= 0) {
    for (const [k, v] of new URLSearchParams(config.url.slice(qIndex + 1))) out[k] = v
  }
  const p = config.params
  if (p instanceof URLSearchParams) {
    for (const [k, v] of p) out[k] = v
  } else if (p && typeof p === 'object') {
    Object.assign(out, p)
  }
  return out
}

function paginate(list, params) {
  const currentPage = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || 10
  const start = (currentPage - 1) * pageSize
  return {
    slice: list.slice(start, start + pageSize),
    pagination: { currentPage, pageSize, total: list.length },
  }
}

const includesAny = (text, kw) => !kw || String(text || '').toLowerCase().includes(String(kw).toLowerCase())

// 读取当前登录用户（mock 无服务端会话，从前端 localStorage 还原身份）
function currentUser() {
  try {
    const stored = JSON.parse(localStorage.getItem('user'))
    const username = stored?.user?.username
    const found = USERS.find((u) => u.username === username)
    if (found) return found
    if (stored?.user) return { themeImage: null, ...stored.user }
  } catch { /* ignore */ }
  return USERS.find((u) => u.username === 'lixin')
}

// 命中的敏感词（用于文本/聊天审核）
function hitWord(text) {
  const t = String(text || '')
  return SENSITIVE_WORDS.find((w) => w.effective && t.includes(w.word))
}

// 从 FormData 取上传文件并生成可预览的本地 URL（浏览器用 ObjectURL 显示真实上传图，不可用时降级为占位图）
function uploadedFileUrl(body, fallbackSeed = 'file') {
  if (body instanceof FormData) {
    const file = body.get('file')
    if (file && file.name) {
      if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        try {
          return { filename: URL.createObjectURL(file), originalFilename: file.name }
        } catch { /* 降级到占位图 */ }
      }
      return { filename: cover(file.name, file.name), originalFilename: file.name }
    }
  }
  return { filename: cover(fallbackSeed, fallbackSeed), originalFilename: `${fallbackSeed}.png` }
}

// ---------- 路由表 ----------
const routes = [
  // 认证
  ['post', '/login', ({ body }) => {
    if (!body.username || !body.password) return fail('请输入用户名和密码。')
    const role = body.role === 'admin' ? 'admin' : 'user'
    const base = USERS.find((u) => u.username === body.username)
      || { id: 999, username: body.username, name: body.username, avatar: avatar(body.username, body.username) }
    return ok({ token: `mock-token-${role}-${base.id}`, user: { id: base.id, username: base.username, name: base.name, avatar: base.avatar, role } })
  }],
  ['post', '/logout', () => ok()],
  ['post', '/user/create', ({ body }) => {
    if (!body.username) return fail('用户名不能为空。')
    return ok({ user: { id: 1000, username: body.username, name: body.username } })
  }],

  // 个人信息
  ['get', '/user/current', () => ok({ user: { themeImage: null, ...currentUser() } })],
  ['post', '/user/update', ({ body }) => ok({ user: { ...currentUser(), ...body } })],

  // 用户管理（管理员）
  ['get', '/user', ({ params }) => {
    let list = USERS
    if (params.keywords) {
      const kw = params.keywords
      list = list.filter((u) => includesAny(u.username, kw) || includesAny(u.name, kw) || includesAny(u.phone, kw))
    }
    if (params.role) list = list.filter((u) => u.role === params.role)
    const { slice, pagination } = paginate(list, params)
    return ok({ users: slice, pagination })
  }],
  ['post', '/user/remove', () => ok()],

  // 作品 - 发现（仅展示已通过）
  ['get', '/works/discover', ({ params }) => {
    let list = WORKS.filter((w) => w.status === 'approved')
    if (params.keywords) list = list.filter((w) => includesAny(w.title, params.keywords))
    const { slice, pagination } = paginate(list, params)
    return ok({ works: slice, pagination })
  }],
  // 作品 - 我的作品（全部状态）
  ['get', '/works', ({ params }) => {
    let list = WORKS
    if (params.keywords) list = list.filter((w) => includesAny(w.title, params.keywords))
    if (params.status) list = list.filter((w) => w.status === params.status)
    const { slice, pagination } = paginate(list, params)
    return ok({ works: slice, pagination })
  }],
  ['get', '/works/detail', ({ params }) => {
    const work = WORKS.find((w) => String(w.contentId) === String(params.contentId || params.id)) || WORKS[0]
    return ok({ work })
  }],
  ['post', '/works/create', () => ok()],
  ['post', '/works/delete', () => ok()],
  ['post', '/works/appeal', () => ok()],

  // AI 审核（演示）
  ['post', '/moderation/text', ({ body }) => {
    const hit = hitWord(body.content)
    const moderation = hit
      ? { result: '不通过', riskLevel: '高', reason: `检出敏感词「${hit.word}」（${categoryText(hit.category)}），判定为违规内容。`, originalText: body.content }
      : { result: '通过', riskLevel: '低', reason: '未检出敏感词，内容合规。', originalText: body.content }
    return ok({ moderation })
  }],
  ['post', '/moderation/image', ({ body }) => {
    const { filename, originalFilename } = uploadedFileUrl(body, '审核图片')
    const score = Math.round(Math.random() * 100 * 10) / 10
    const result = score < REVIEW_CONFIG.imagePassThreshold ? '通过' : score >= REVIEW_CONFIG.imageRejectThreshold ? '不通过' : '人工审核'
    const reason = result === '通过' ? '未检出违规特征，图片合规。'
      : result === '不通过' ? '检出较高违规匹配分数，判定为违规图片。'
      : '违规匹配分数处于中间区间，建议转人工复核。'
    return ok({ filename, originalFilename, moderation: { result, matchScore: score, reason } })
  }],
  ['post', '/moderation/video', () => {
    const totalFrames = 20
    const violationFrames = 3
    const violationRate = Math.round((violationFrames / totalFrames) * 100)
    const keyFrames = Array.from({ length: 4 }, (_, i) => ({
      frameNumber: i + 1,
      timestamp: (i + 1) * 3,
      filename: cover(`帧${i + 1}`, `frame-${i}`), // VideoReview 会用 buildImageURL(frame.filename) 生成 imageUrl
      result: i < violationFrames ? '人工审核' : '通过',
      reason: i < violationFrames ? '画面疑似含敏感内容' : '',
    }))
    return ok({
      moderation: {
        overallResult: '人工审核',
        totalFrames, violationFrames, violationRate,
        reason: '部分抽帧检出疑似违规内容，违规率未达自动拒绝阈值，转人工复核。',
        keyFrames,
      },
    })
  }],
  ['post', '/moderation/work', () => ok({ Status: 'reviewing', review: buildAiReview() })],
  ['get', '/moderation/work/result', () => ok({ review: buildAiReview() })],

  // 人工审核
  ['get', '/manual-review/records', ({ params }) => {
    let list = MANUAL_RECORDS
    if (params.decision) list = list.filter((r) => r.decision === params.decision)
    if (params.reviewerName) list = list.filter((r) => r.reviewerName === params.reviewerName)
    const { slice, pagination } = paginate(list, params)
    return ok({ records: slice, pagination })
  }],
  ['get', '/manual-review/admins', () => ok({ admins: USERS.filter((u) => u.role === 'admin').map((u) => ({ id: u.id, username: u.username })) })],
  ['post', '/manual-review/records/remove', () => ok()],

  // 待审核队列
  ['get', '/queue', ({ params }) => {
    let list = QUEUE
    if (params.status) list = list.filter((q) => q.status === params.status)
    const { slice, pagination } = paginate(list, params)
    return ok({ queueList: slice, pagination })
  }],
  ['post', '/queue/review', () => ok()],

  // 敏感词
  ['get', '/sensitive', ({ params }) => {
    let list = SENSITIVE_WORDS
    if (params.keywords) list = list.filter((w) => includesAny(w.word, params.keywords))
    if (params.category) list = list.filter((w) => w.category === params.category)
    if (params.level) list = list.filter((w) => w.level === params.level)
    const { slice, pagination } = paginate(list, params)
    return ok({ sensitiveWords: slice, pagination })
  }],
  ['post', '/sensitive/remove', () => ok()],
  ['post', '/sensitive/create', () => ok()],
  ['post', '/sensitive/update', () => ok()],

  // 报表 / 配置
  ['get', '/reviewlist/all', () => ok(REVIEW_REPORT)],
  ['get', '/review-config', () => ok({ config: REVIEW_CONFIG })],
  ['post', '/review-config/update', () => ok()],

  // 聊天
  ['get', '/chat/history', () => ok({ messages: CHAT_MESSAGES })],
  ['post', '/chat/send', ({ body }) => {
    const hit = hitWord(body.content)
    if (hit) return fail(`消息包含敏感词「${hit.word}」，已被审核拦截。`)
    return ok({ message: { ...body, createdAt: now() } })
  }],

  // 文件上传（头像 / 封面 / 视频 / 主题背景等）
  ['post', /^\/upload\//, ({ body, url }) => {
    const seed = url.split('/').pop() || 'file'
    return ok(uploadedFileUrl(body, seed))
  }],
]

function categoryText(c) {
  return { political: '政治敏感', porn: '色情低俗', violence: '暴力恐怖', spam_mail: '垃圾邮件', advertising: '广告营销', other: '其他' }[c] || '其他'
}

function now() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function pathOf(url) {
  const u = url || ''
  const q = u.indexOf('?')
  return q >= 0 ? u.slice(0, q) : u
}

function match(method, url) {
  const path = pathOf(url)
  return routes.find(([m, p]) =>
    m === method && (p instanceof RegExp ? p.test(path) : p === path),
  )
}

// ---------- adapter ----------
export default function mockAdapter(config) {
  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''
  const route = match(method, url)

  const data = route
    ? route[2]({ body: parseBody(config), params: parseParams(config), url: pathOf(url), config })
    : ok({}) // 未登记的接口：返回空成功，避免页面报错

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data, status: 200, statusText: 'OK', headers: {}, config, request: {} })
    }, 200)
  })
}
