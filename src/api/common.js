// eslint-disable-next-line
import request from '@/utils/request'
// eslint-disable-next-line
import qs from 'qs'

console.log('process.env.VUE_APP_FILE_API', process.env.VUE_APP_FILE_API)
const fileBaseUrl = process.env.VUE_APP_FILE_API
export function uploadImage(file) {
  console.log('e', file)
  const fullUrl = fileBaseUrl + '/file/upload/image'
  const formData = new FormData()
  formData.append('file', file)
  const obj = { method: 'POST', body: formData }
  return fetch(fullUrl, obj).then((response) => {
    return response.json()
  }).then(res => {
    return res.data
  })
}

