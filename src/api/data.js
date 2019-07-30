import axios from './index.js'

export const getData = () => {
  return axios.request({
    url: '/visitor/admin/v1/devices',
    method: 'get',
    params: {
      name: 'dog',
      age: 60
    }
  })
}

export const postData = () => {
  return axios.request({
    url: 'post_data',
    data: {
      name: 'dog',
      age: 60
    },
    method: 'post'
  })
}
