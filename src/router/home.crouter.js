export default {
  path: '',
  redirect: '/home',
  component: () => import('@/views/layout'),
  meta: {
    role: [10000],
    title: '首页'
  },
  children: [
    {
      path: '',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {
        title: '平台首页',
        icon: 'iconfont icon-pingtaishouye',
        role: [11000],
      },
    },
  ],
}