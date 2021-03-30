const DAMAINCONFIG = require('./../../config/domainConfig/config')
const apiURL = DAMAINCONFIG.APIURL
const PAGE_SIZE = 20
const PAGE_SIZE_TEN = 10

const CDNURL = DAMAINCONFIG.CDNURL

export default {
  api: process.env.NODE_ENV === 'development' ? '/api' : apiURL + '/Organ',
  PLAT_NAME: DAMAINCONFIG.PLAT_NAME,
  CODE_SUCCESS: 0,
  CODE_RESULT: 1012,
  CODE_FAILED: 1000,
  PAGE_SIZE_TEN: PAGE_SIZE_TEN,
  PAGE_SIZE: PAGE_SIZE,
  TOTAL: 100,
  TOKEN_TIME: 28800,
  sizeArr: [PAGE_SIZE, 50, 100, 200],
  sizeBrr: [PAGE_SIZE_TEN, PAGE_SIZE, 50, 100],
  // 图片压缩参数
  UPLOAD_IMAGE_SIZE: 1080,
  UPLOAD_IMAGE_QUALITY: 0.7,
  // form表单长度
  formLabelWidth: '110px',
  // 缓存时间
  taskOverdueTime: 60 * 60 * 2,
  // CDN路径
  CDN_UP_URL: CDNURL,
  // 接口延迟时间
  DELAY_TIME: 2000,  // 毫秒
  CONFIG: {
    CODE_SUCCESS: 0,    //成功返回状态码
    CODE_BAD_PASSWORD: 1001, //密码错误
    CODE_BANED: 1002, //禁止登录
    CODE_BAD_PARAMETER: 1003, //参数异常
    CODE_DB_ERROR: 1004, //DB操作异常
    CODE_BAD_REQUEST: 1005, //非法请求
    CODE_UNKNOWN_ERROR: 1006, //未知错误
    CODE_PERMISSION_DENIED: 1007,//权限不够
    CODE_BAD_PROVCODE: 1008, //验证码不正确
    CODE_USER_EXIT: 1009, //用户已经存在
    CODE_PAGE_END: 1010,//分页结束/数据为空
    CODE_USER_NOT_EXIT: 1011, //用户不存在
    CODE_TOKEN_INVALID: 1012, //token已失效
    CODE_USER_INVALID: 2001, //无效用户
    CODE_TASK_INSERT_BAD: 3001, //任务插入失败
    CODE_TASK_CHECK_BAD: 3002, //任务数据验证失败

    //################  一般状态  ##################
    STATUS_ABLE: 1, //正常/导出中
    STATUS_ING: 2, //审核中/留空/导出成功/ 移除异地登陆
    STATUS_DISABLE: 3, //拒绝/留空/拉黑/停用/导出失败
    STATUS_DEL: 4, //删除/导出内容为空
    STATUS_HARD_DISABLE: 99,//彻底不可用状态
    STATUS_FALSE: 0,//否 , 等待导出 , 关闭异地登陆
    STATUS_TRUE: 1,//是 ， 开启异地登陆

    //################  订单状态  ##################
    ORDER_STATUS_NOT_ALLOT: 5,//未分配
    ORDER_STATUS_ALLOTED: 10,//已分配，待生成二维码
    ORDER_STATUS_WAIT_ACCEPT: 15, //已生成二维码，待接单
    ORDER_STATUS_WAIT_DOING: 20,//已接单，待完成
    ORDER_STATUS_WAITING_AUDIT: 25,//已完成，待审核
    ORDER_STATUS_DONE: 30,//已完成
    ORDER_STATUS_CANCEL: 99,//已撤销


    //################## 二维码类型 ##################
    QR_TYPE_COUNT: 1,//次数类型
    QR_TYPE_TIME: 2,//时间类型

    //################## 短信发生类型 ##################
    SMS_REGISTER: 'register',//注册
    SMS_RESET_PWD: 'forget_pwd',//忘记密码

    //################### 性别 ####################
    SEX_MAN: 1, // 男
    SEX_WOMAN: 2, //女
    USER_SEX: function (val) {
      let arr = {}
      arr[this.SEX_MAN] = '男'
      arr[this.SEX_WOMAN] = '女'
      if (val && arr[val]) {
        return arr[val]
      } else {
        return arr
      }
    },
    //################### 任务处理方法类型 ####################
    TASK_FANKUAN: 1,
    TASK_FENPEI: 2,
    TASK_CHEHUI: 3,
    TASK_SHENGCHENG: 4,
    TASK_SHANCHU: 5,

    //################### 数据统计类型 ####################
    DATA_SEVEN: 7,
    DATA_MONTH: 30,

    // ################### 首页数据选择时间长度 ####################
    PLAT_TIME_LIMIT: 7,

    //################### 员工角色类型 ####################
    ROLE_ADMIN: 1, // 超级管理员
    ROLE_ALLOT: 2,  // 分配员
    ROLE_SEND: 3,  // 派单员

    EVERY_TIME_TASK_NUM: 300,
    TB_LEVEL: ['1心', '2心', '3心', '4心', '5心', '1钻', '2钻', '3钻', '4钻', '5钻', '1皇冠', '2皇冠', '3皇冠', '4皇冠', '5皇冠'],
    // ################## 用户状态 ##############################
    USER_STATUS_NOMAL: 1,
    USER_STATUS_BLACKLIST: 3,
    USER_STATUS_DEL: 4,
    USER_STATUS_FULLY_BLOEKED: 99,
    USER_STATUS: function (val) {
      let arr = {}
      arr[this.USER_STATUS_NOMAL] = '正常'
      arr[this.USER_STATUS_BLACKLIST] = '停用'
      arr[this.USER_STATUS_DEL] = '删除'
      arr[this.USER_STATUS_FULLY_BLOEKED] = '彻底拉黑'
      if (val && arr[val]) return arr[val]
      return arr
    },
    // ################## 用户操作筛选类型 ##############################
    OPERATE_TASK: 1,
    OPERATE_ACCOUNT: 2,
    OPERATE_MONEY: 3,
    OPERATE_TYPE: function (val) {
      let arr = {}
      arr[this.OPERATE_TASK] = '任务'
      arr[this.OPERATE_ACCOUNT] = '账号'
      arr[this.OPERATE_MONEY] = '资金'
      if (val && arr[val]) return arr[val]
      return arr
    },
    PLAT_STATUS_ONE: 1,
    PLAT_STATUS_THREE: 3,
    PLAT_STATUS: function (val) {
      let arr = {}
      arr[this.PLAT_STATUS_ONE] = '正常'
      arr[this.PLAT_STATUS_THREE] = '停用'
      if (val && arr[val]) return arr[val]
      return arr
    },
    // ################## 分销机构状态 ##############################
    INDUSTRY_STATUS_OPEN: 1,
    INDUSTRY_STATUS_NOT: 2,
    INDUSTRY_STATUS_CLOSE: 3,
    INDUSTRY_STATUS: function (val) {
      let arr = {}
      arr[this.INDUSTRY_STATUS_OPEN] = '开通'
      arr[this.INDUSTRY_STATUS_CLOSE] = '关闭'
      arr[this.INDUSTRY_STATUS_NOT] = '禁止发单'
      if(val && arr[val]) return arr[val]
      return arr
    },
  },

  // map echart function
  convertData: (data) => {
    let geoCoordMap = require('./province').PROVINCE
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value.male_num + data[i].value.female_num),
          male_num: data[i].value.male_num,
          female_num: data[i].value.female_num
        });
      }
    }
    return res;
  },
  // 加密/解密ID
  encodeId: (id) => {
    if (!id) return ''
    let sid = (id & 0xff000000)
    sid += (id & 0x0000ff00) << 8
    sid += (id & 0x00ff0000) >> 8
    sid += (id & 0x0000000f) << 4
    sid += (id & 0x000000f0) >> 4
    // sid ^= 11184810
    sid ^= 2147483648
    return sid
  },
  // 封装localStorage 带过期时间，单位为秒
  zyLocalStorage: {
    set: function (key, value, ttl_ms) {
      var data = { 
        value: value, 
        expirse: new Date(new Date().getTime() + ttl_ms * 1000).getTime(),
        reload: true
      }
      localStorage.setItem(key, JSON.stringify(data))
    },
    get: function (key) {
      var data = JSON.parse(localStorage.getItem(key))
      if (data !== null) {
        if (data.expirse != null && data.expirse < new Date().getTime()) {
          localStorage.removeItem(key)
        }else if(data.reload != true){
          localStorage.removeItem(key)
        } else {
          return data.value
        }
      }
      return null
    }
  },
  // 数组对象根据name去重
  arrayUnique: (arr, name) => {
    var hash = {}
    return arr.reduce(function (prev, cur) {
      (hash[cur[name[0]]] && hash[cur[name[1]]]) ? '' : ((hash[cur[name[0]]] = true) && (hash[cur[name[1]]] = true)) && prev.push(cur)
      return prev
    }, [])
  },
  //格式化时间格式
  formatTime: (number, format) => {
    function formatNumber (n) {
      n = n.toString()
      return n[1] ? n : '0' + n;
    }
    let time = new Date(number)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(formatNumber(time.getMonth() + 1))
    newArr.push(formatNumber(time.getDate()))

    newArr.push(formatNumber(time.getHours()))
    newArr.push(formatNumber(time.getMinutes()))
    newArr.push(formatNumber(time.getSeconds()))

    for (let i in newArr) {
      format = format.replace(formatArr[i], newArr[i])
    }
    return format
  },
  //格式化日期
  formatDate: (time, format) => {
    var t = new Date(time);
    var tf = function (i) {
      return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear())
        case 'MM':
          return tf(t.getMonth() + 1)
        case 'mm':
          return tf(t.getMinutes())
        case 'dd':
          return tf(t.getDate())
        case 'HH':
          return tf(t.getHours())
        case 'ss':
          return tf(t.getSeconds())
      }
    })
  },
  // 判断是否为数字
  isRealNum: (val) => {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
    if (val === "" || val == null) return false
    let result = !isNaN(val) ? true : false
    return result
  },
  // 时间换行显示
  trimText: (str) => {
    const text = str.replace(/ /g, "</br>");
    return text
  },
  // 检查唯一
  changeOV_ (data = {}) {
    let isExist = true
    for (let key in data) {
      if (data[key] === null || data[key] === '' || data[key] === undefined) {
        isExist = false
      }
    }
    return isExist
  },
  // 传入两个时间，判断时间间隔
  daysBetween: (sDate1, sDate2) => {
    if (!sDate1 || !sDate2) return 0
    //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
    return nDays;
  }
}
