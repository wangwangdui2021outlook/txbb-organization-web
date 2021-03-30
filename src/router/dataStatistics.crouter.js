export default {
  path: '/dataStatistics',
  component: () => import('@/views/layout'),
  meta: {
    role: [20000],
    title: '数据中心',
    icon: 'iconfont icon-shujugailan'
  },
  children: [
    {
      path: '',
      name: 'dataStatistics',
      component: () => import('@/views/dataStatistics/index'),
      meta: {
        title: '数据大盘',
        icon: 'iconfont icon-shujugailan',
        role: [21000],
      },
      children: [

      ]
    }
  ]
}