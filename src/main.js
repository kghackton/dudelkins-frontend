import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import vuetify from './plugins/vuetify'

import '@/css/scroll.css'
import '@/css/tables.css'
import '@/css/colors.css'
import '@/css/iconsControl.css'
import '@/css/toolbarStyle.css'
import '@/css/tooltip.css'
import '@/css/dialogs.css'
import '@/css/screenshots.css'
import Notifications from '@voerro/vue-notifications'

Vue.component('notifications', Notifications);

Vue.config.productionTip = false

const Application = new Vue({
  router,
  store,
  vuetify,
  components: {App},
  render: h => h(App)
})
Application.$mount('#app')
export default Application