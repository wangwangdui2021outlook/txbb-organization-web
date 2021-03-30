import globalDefine from '@/util/common'

let matchPlatform = (val) => {
  if (!val) return ''
  let platformType = {}
  platformType[globalDefine.PLATFORM_TAOBAO] = '淘宝'
  platformType[globalDefine.PLATFORM_TIANMAO] = '天猫'
  platformType[globalDefine.PLATFORM_JINGDONG] = '京东'
  platformType[globalDefine.PLATFORM_PINDUODUO] = '拼多多'
  return platformType[val]
}

let matchBankNum = (val) => {
  let newNum = ''
  newNum = '****    ****    ****    ' + val.substr(val.length - 4)
  return newNum
}
export { matchPlatform, matchBankNum }
