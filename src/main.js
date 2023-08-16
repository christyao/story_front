import { createApp } from 'vue';
import TDesign from 'tdesign-mobile-vue';
import App from './App.vue';
import router from './router';

// 引入组件库的少量全局样式变量
import 'tdesign-mobile-vue/es/style/index.css';

const app = createApp(App);

// 使用TDesign组件库
app.use(TDesign);

// 使用路由
app.use(router);

// 挂载应用程序
app.mount('#app');

