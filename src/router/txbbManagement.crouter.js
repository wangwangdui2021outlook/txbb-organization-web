export default {
  path: '/txbbManagement',
  component: () => import('@/views/layout'),
  meta: {
    role: [30000],
    title: '天线包包管理',
    icon: 'iconfont icon-pingtai-liulanqi'
  },
  children: [
    {
      path: '',
      name: 'txbbManagement',
      component: () => import('@/views/txbbManagement/index'),
      meta: {
        title: '天线包包管理',
        icon: 'iconfont icon-pingtai-liulanqi',
        role: [31000],
      },
      children: [

      ]
    }
  ]
}