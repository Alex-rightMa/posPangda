// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import './assets/css/nomoralize.css'/*引入公共样式*/
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui'

import axios from 'axios'
Vue.prototype.$axios = axios
// 添加响应拦截器
axios.interceptors.response.use( response =>{
  if(response.status === 200){// 接口正常直接返回数据
    response = response.data;
  }
  return response;
},  error =>{
  return Promise.reject(error);
});

require('./mock')


Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
