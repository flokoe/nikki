import Activity from './views/Activity.js'
import Profile from './views/Profile.js'
import History from './views/History.js'

const routes = [
  {path: '/', name: 'activity', component: Activity},
  {path: '/profile', name: 'profile', component: Profile},
  {path: '/history', name: 'history', component: History},
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router
