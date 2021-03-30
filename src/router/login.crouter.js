export default {
  path: '/login',
  component: () => import('@/views/login/index'),
  name: 'login',
  meta: {
    role: [1]
  }
}