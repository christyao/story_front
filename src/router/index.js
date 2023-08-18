import { createRouter, createWebHistory } from 'vue-router';
import CharacterDetails from '../components/CharacterDetails.vue'; // 假设组件路径
import CreateCharacter from '../components/CreateCharacter.vue'; // 导入创建角色组件
import StoryDetails from '../components/StoryDetails.vue'; // 导入创建角色组件


const routes = [
  // ...其他路由
  {
    path: '/CreateCharacter', // 根路径
    name: 'CreateCharacter',
    component: CreateCharacter // 创建角色
  },
  {
    path: '/CharacterDetails',
    name: 'CharacterDetails',
    component: CharacterDetails //查看角色详情
  },
  {
    path: '/', // 根路径
    name: 'StoryDetails',
    component: StoryDetails // 绘本
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
