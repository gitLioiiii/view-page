import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import mockAdapter from '@/mock'

// 是否使用本地 mock 数据（默认开启，用于无后端的静态部署 / GitHub Pages 展示）
// 如需连接真实后端，在 .env 中设置 APP_USE_MOCK=false
const useMock = import.meta.env.APP_USE_MOCK !== 'false'

const instance = axios.create({
  baseURL: import.meta.env.APP_BASE_URL,
  ...(useMock ? { adapter: mockAdapter } : {}),
})

// 请求拦截器：自动添加Authorization头
instance.interceptors.request.use((config) => {
    const userStore = useUserStore()

    if (userStore.logged) {
        // Spring Security 资源服务器要求 Bearer 前缀
        config.headers.Authorization = `Bearer ${userStore.user.token}`
    }

    return config
})

// 响应拦截器：处理token过期
instance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // 检查是否是401未授权错误
        if (error.response && error.response.status === 401) {
            const userStore = useUserStore()

            // 清除用户登录状态
            userStore.logout()

            // 跳转到登录页
            router.push({ name: 'login' })
        }
        return Promise.reject(error)
    }
)

export default instance
