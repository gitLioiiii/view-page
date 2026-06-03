// 静态数据集（mock 数据库）
// 所有图片/头像用 SVG data URI（本地生成），视频用公开样例地址，确保静态部署不依赖任何后端。

import { avatar, cover, sampleVideo } from './placeholders'

// ============ 用户 ============
function makeUser(o) {
  return {
    status: '正常',
    gender: 'none',
    birthday: '',
    phone: '',
    email: '',
    province: '',
    city: '',
    avatar: avatar(o.name || o.username, o.username),
    ...o,
  }
}

export const USERS = [
  makeUser({ id: 1, username: 'admin', name: '系统管理员', role: 'admin', gender: 'man', birthday: '1995-03-12', phone: '13800000001', email: 'admin@demo.com', province: '广东省', city: '深圳市' }),
  makeUser({ id: 2, username: 'moderator', name: '审核员·小李', role: 'admin', gender: 'woman', birthday: '1998-07-22', phone: '13800000002', email: 'lee@demo.com', province: '广东省', city: '广州市' }),
  makeUser({ id: 3, username: 'lixin', name: '测试', role: 'user', gender: 'woman', birthday: '2003-09-01', phone: '13800000003', email: 'lixin@demo.com', province: '广东省', city: '深圳市' }),
  makeUser({ id: 4, username: 'zhangsan', name: '张三', role: 'user', gender: 'man', birthday: '2000-01-15', phone: '13800000004', email: 'zhangsan@demo.com', province: '北京市', city: '北京市' }),
  makeUser({ id: 5, username: 'lisi', name: '李四', role: 'user', gender: 'man', birthday: '1999-11-30', phone: '13800000005', email: 'lisi@demo.com', province: '上海市', city: '上海市' }),
  makeUser({ id: 6, username: 'wangwu', name: '王五', role: 'user', gender: 'woman', birthday: '2001-05-09', phone: '13800000006', email: 'wangwu@demo.com', province: '浙江省', city: '杭州市' }),
  makeUser({ id: 7, username: 'zhaoliu', name: '赵六', role: 'user', gender: 'man', birthday: '1997-02-18', phone: '13800000007', email: 'zhaoliu@demo.com', province: '江苏省', city: '南京市' }),
  makeUser({ id: 8, username: 'sunqi', name: '孙七', role: 'user', gender: 'woman', birthday: '2002-12-25', phone: '13800000008', email: 'sunqi@demo.com', province: '四川省', city: '成都市' }),
  makeUser({ id: 9, username: 'zhouba', name: '周八', role: 'user', gender: 'man', birthday: '1996-06-06', phone: '13800000009', email: 'zhouba@demo.com', province: '湖北省', city: '武汉市', status: '已禁用' }),
  makeUser({ id: 10, username: 'wujiu', name: '吴九', role: 'user', gender: 'woman', birthday: '2000-08-08', phone: '13800000010', email: 'wujiu@demo.com', province: '广东省', city: '深圳市' }),
  makeUser({ id: 11, username: 'zhengshi', name: '郑十', role: 'user', gender: 'man', birthday: '1994-04-04', phone: '13800000011', email: 'zheng@demo.com', province: '福建省', city: '厦门市' }),
  makeUser({ id: 12, username: 'guest', name: '访客用户', role: 'user', gender: 'none', province: '广东省', city: '广州市' }),
]

// ============ 敏感词 ============
const WORD_SAMPLES = [
  ['赌博', 'violence', 'high'], ['代开发票', 'advertising', 'medium'], ['免费领取', 'spam_mail', 'low'],
  ['暴力血腥', 'violence', 'high'], ['色情', 'porn', 'high'], ['加微信', 'advertising', 'medium'],
  ['内部消息', 'spam_mail', 'medium'], ['违禁药品', 'violence', 'high'], ['低俗', 'porn', 'medium'],
  ['诈骗', 'violence', 'high'], ['博彩', 'violence', 'high'], ['刷单', 'advertising', 'medium'],
  ['政治谣言', 'political', 'high'], ['钓鱼链接', 'spam_mail', 'high'], ['辱骂', 'other', 'low'],
  ['假冒伪劣', 'advertising', 'medium'], ['传销', 'violence', 'high'], ['不良信息', 'other', 'low'],
]
export const SENSITIVE_WORDS = WORD_SAMPLES.map(([word, category, level], i) => ({
  id: i + 1,
  word,
  category,
  level,
  effective: i % 4 !== 3,
  createdAt: `2026-0${(i % 5) + 1}-${String((i % 27) + 1).padStart(2, '0')} 10:${String((i * 7) % 60).padStart(2, '0')}:00`,
}))

// ============ 作品 ============
const WORK_TITLES = [
  ['深圳湾的日落', '用延时摄影记录城市黄昏', 'approved'],
  ['周末骑行 vlog', '骑行 30 公里的轻松一天', 'approved'],
  ['家常菜教程：番茄牛腩', '手把手教你炖出软糯牛腩', 'approved'],
  ['一只猫的下午', '记录我家主子的慵懒时光', 'approved'],
  ['校园生活随拍', '毕业季的那些瞬间', 'approved'],
  ['咖啡拉花练习', '从零开始学拉花第 7 天', 'approved'],
  ['夜跑碎碎念', '坚持夜跑的第 100 天', 'reviewing'],
  ['街头采访片段', '随机采访路人的周末计划', 'pending'],
  ['未知来源素材', '含疑似违规画面，等待复核', 'rejected'],
  ['搞笑配音合集', '被系统判定需人工复核', 'manual_rejected'],
  ['旅行混剪', '对审核结果有异议，已申诉', 'appealing'],
  ['宠物搞怪集锦', '申诉未通过的作品', 'appeal_rejected'],
]
export const WORKS = WORK_TITLES.map(([title, description, status], i) => {
  const author = USERS[(i % 9) + 3]
  return {
    id: i + 1,
    contentId: i + 1,
    title,
    description,
    status,
    coverUrl: cover(title, title),
    videoUrl: sampleVideo(i),
    author: author.name,
    authorAvatar: avatar(author.name, author.username),
    createdAt: `2026-05-${String((i % 28) + 1).padStart(2, '0')} ${String((9 + i) % 24).padStart(2, '0')}:30:00`,
  }
})

// ============ 人工审核记录 ============
export const MANUAL_RECORDS = Array.from({ length: 14 }, (_, i) => {
  const work = WORKS[i % WORKS.length]
  const pass = i % 3 !== 0
  return {
    id: i + 1,
    contentId: work.contentId,
    workTitle: work.title,
    username: work.author,
    reviewerName: i % 2 === 0 ? 'admin' : 'moderator',
    decision: pass ? 'pass' : 'reject',
    reason: pass ? '内容合规，准予通过。' : '画面含疑似违规内容，未予通过。',
    reviewedAt: `2026-05-${String((i % 28) + 1).padStart(2, '0')} 16:${String((i * 5) % 60).padStart(2, '0')}:00`,
  }
})

// ============ 待审核队列 ============
const QUEUE_STATUS = ['pending', 'approved', 'rejected', 'appealed', 'appeal_approved', 'pending', 'appealed', 'approved']
export const QUEUE = QUEUE_STATUS.map((status, i) => {
  const work = WORKS[(i + 6) % WORKS.length]
  const done = status !== 'pending' && status !== 'appealed'
  return {
    id: i + 1,
    contentId: work.contentId,
    workTitle: work.title,
    username: work.author,
    status,
    reviewerName: done ? (i % 2 === 0 ? 'admin' : 'moderator') : '',
    reviewReason: done ? '已完成人工复核。' : '',
    manualReviewTriggeredAt: `2026-05-${String((i % 28) + 1).padStart(2, '0')} 12:00:00`,
    reviewCompletedAt: done ? `2026-05-${String((i % 28) + 1).padStart(2, '0')} 13:20:00` : '',
  }
})

// ============ 聊天历史 ============
export const CHAT_MESSAGES = [
  { type: 'system', content: '欢迎来到内容审核演示聊天室，消息会经过 AI 审核后展示。', createdAt: '2026-06-03 09:00:00' },
  { userId: 4, username: 'zhangsan', name: '张三', avatar: avatar('张三', 'zhangsan'), content: '大家好呀，这个审核系统看起来不错！', type: 'text', createdAt: '2026-06-03 09:02:11' },
  { userId: 6, username: 'wangwu', name: '王五', avatar: avatar('王五', 'wangwu'), content: '是的，发消息会先经过敏感词和 AI 审核~', type: 'text', createdAt: '2026-06-03 09:03:40' },
  { userId: 3, username: 'lixin', name: '李欣', avatar: avatar('李欣', 'lixin'), content: '这是一个用于简历展示的纯前端 Demo 😄', type: 'text', createdAt: '2026-06-03 09:05:02' },
]

// ============ 报表数据 ============
export const REVIEW_REPORT = {
  overview: {
    totalViolations: 1287,
    todayViolations: 36,
    pendingReview: QUEUE.filter((q) => q.status === 'pending').length + 5,
    appealCount: QUEUE.filter((q) => q.status === 'appealed').length + 2,
    violationTypesCount: SENSITIVE_WORDS.filter((w) => w.effective).length,
  },
  dailyTrend: {
    dates: ['05-28', '05-29', '05-30', '05-31', '06-01', '06-02', '06-03'],
    counts: [42, 58, 31, 49, 65, 38, 36],
  },
  sensitiveWordsDistribution: {
    totalWords: SENSITIVE_WORDS.filter((w) => w.effective).length,
    distribution: [
      { name: '暴力恐怖', value: SENSITIVE_WORDS.filter((w) => w.effective && w.category === 'violence').length },
      { name: '色情低俗', value: SENSITIVE_WORDS.filter((w) => w.effective && w.category === 'porn').length },
      { name: '广告营销', value: SENSITIVE_WORDS.filter((w) => w.effective && w.category === 'advertising').length },
      { name: '垃圾邮件', value: SENSITIVE_WORDS.filter((w) => w.effective && w.category === 'spam_mail').length },
      { name: '政治敏感', value: SENSITIVE_WORDS.filter((w) => w.effective && w.category === 'political').length },
      { name: '其他', value: SENSITIVE_WORDS.filter((w) => w.effective && w.category === 'other').length },
    ].filter((d) => d.value > 0),
  },
}

// ============ 审核阈值配置 ============
export const REVIEW_CONFIG = {
  imagePassThreshold: 30,
  imageRejectThreshold: 70,
  videoRejectViolationRate: 30,
  videoRejectMaxScore: 70,
  videoManualViolationRate: 10,
  videoManualMaxScore: 30,
  videoFrameInterval: 3,
  coverModerationMode: 'local',
}

// ============ AI 审核详情（供 AIreviewCard 抽屉展示） ============
export function buildAiReview() {
  return {
    status: 'reviewing',
    finalProcessingTime: 3.84,
    reviewedAt: '2026-06-02 15:20:31',
    reviewResults: {
      textReview: {
        result: '通过',
        reason: '标题与描述未检出敏感词，文本合规。',
        riskLevel: '低',
        sensitiveWords: [],
        processingTime: 0.42,
      },
      imageReview: {
        result: '人工审核',
        reason: '封面图片违规匹配分数处于中等区间，转人工复核。',
        matchScore: 56.3,
        processingTime: 1.15,
      },
      videoReview: {
        result: '人工审核',
        reason: '检出 2 个风险帧，违规率未达自动拒绝阈值，转人工复核。',
        riskyCount: 2,
        maxScore: 62.7,
        riskyList: [
          { timestamp: 12.5, score: 62.7, reason: '画面疑似含敏感场景' },
          { timestamp: 27.0, score: 48.1, reason: '画面疑似含违规文字' },
        ],
        processingTime: 2.27,
      },
    },
  }
}
