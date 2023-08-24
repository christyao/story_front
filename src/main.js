import { createApp } from 'vue';
import TDesign from 'tdesign-mobile-vue';
import App from './App.vue';
import router from './router';
import './main.css';
import axios from 'axios';


// 引入组件库的少量全局样式变量
import 'tdesign-mobile-vue/es/style/index.css';

const app = createApp(App);

// 使用TDesign组件库
app.use(TDesign);

// 使用路由
app.use(router);

// 挂载应用程序
app.mount('#app');

// 配置Axios的基础URL
axios.defaults.baseURL = 'http://127.0.0.1:5000';