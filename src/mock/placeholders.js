// 占位资源生成器
// 纯前端生成 SVG data URI，零外部依赖，避免静态部署（GitHub Pages）时图片裂图。

const PALETTE = [
  '#7BC0FC', '#89E9E0', '#C396ED', '#FFB6A3',
  '#95D475', '#FFD66B', '#F76560', '#5EDFD6',
  '#3491FA', '#722ED1', '#FF7D00', '#0FC6C2',
]

// 基于字符串稳定地选一个颜色（同样的 seed 永远得到同样的颜色）
function pick(seed, arr) {
  const s = String(seed)
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return arr[h % arr.length]
}

function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// 字母头像：彩色底 + 首字母
export function avatar(name = 'U', seed = name) {
  const bg = pick(seed, PALETTE)
  const letter = String(name).trim().charAt(0).toUpperCase() || 'U'
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">` +
    `<rect width="120" height="120" rx="12" fill="${bg}"/>` +
    `<text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Segoe UI,Microsoft YaHei,Arial" font-size="56" fill="#ffffff">${letter}</text>` +
    `</svg>`
  return svgToDataUri(svg)
}

// 作品封面：双色渐变 + 标题文字
export function cover(title = '作品', seed = title) {
  const c1 = pick(seed, PALETTE)
  const c2 = pick(`${seed}~`, PALETTE)
  const safe = String(title).slice(0, 12).replace(/[<>&]/g, '')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>` +
    `</linearGradient></defs>` +
    `<rect width="640" height="360" fill="url(#g)"/>` +
    `<text x="50%" y="52%" dy=".35em" text-anchor="middle" font-family="Microsoft YaHei,Segoe UI,Arial" font-size="40" font-weight="bold" fill="#ffffff" opacity="0.92">${safe}</text>` +
    `<text x="50%" y="78%" text-anchor="middle" font-family="Segoe UI,Arial" font-size="18" fill="#ffffff" opacity="0.65">CONTENT MODERATION DEMO</text>` +
    `</svg>`
  return svgToDataUri(svg)
}

// 公开样例视频（Google 公开测试视频，稳定可用），点击作品/查看视频时播放
export const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
]

export function sampleVideo(i = 0) {
  return SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length]
}
