import qs from 'qs'
import request from '../util/request'
import CONFIG from '../util/common'

export async function uploaderFileHandle (data = {}) {
  return request({
    method: 'post',
    url: `${CONFIG.upload}/image_transport.php`,
    data: qs.stringify(data)
  })
}
