import axios from 'axios'
import router from '../router'
// import {
//   Message
// } from 'element-ui'
const service = axios.create({
  // 设置超时时间
  timeout: 60000,
  baseURL: process.env.BASE_URL
})

/**
 * 请求前拦截
 * 用于处理需要在请求前的操作
 */
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
/**
 * 请求响应拦截
 * 用于处理需要在请求返回后的操作
 */
service.interceptors.response.use(response => {
  const responseCode = response.status
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  if (responseCode === 200) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(response)
  }
}, error => {
  // 服务器返回不是 2 开头的情况，会进入这个回调
  // 可以根据后端返回的状态码进行不同的操作
  const responseCode = error.response.status
  switch (responseCode) {
    // 401：未登录
    case 401:
      // 跳转登录页
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
      break
      // 403: token过期
    case 403:
      // 弹出错误信息
      // Message({
      //   type: 'error',
      //   message: '登录信息过期，请重新登录'
      // })
      // 清除token
      localStorage.removeItem('token')
      // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
      setTimeout(() => {
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }, 1000)
      break
      // 404请求不存在
    case 404:
      // Message({
      //   message: '网络请求不存在',
      //   type: 'error'
      // })
      break
      // 其他错误，直接抛出错误提示
    default:
      // Message({
      //   message: error.response.data.message,
      //   type: 'error'
      // })
  }
  return Promise.reject(error)
})

export default service

//图片上传
export const uploadFile = formData => {
  const res = service.request({
    method: 'post',
    url: '/upload',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res
}

//图片上传调用方式
// async uploadFile(e) {
//   const file = document.getElementById('file').files[0]
//   const formdata = new FormData()
//   formdata.append('file', file)
//   await uploadFile(formdata)
// }
