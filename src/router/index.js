import { createRouter, createWebHistory } from 'vue-router';
import CharacterDetails from '../components/CharacterDetails.vue'; // 假设组件路径
import CreateCharacter from '../components/CreateCharacter.vue'; // 导入创建角色组件
import StoryDetails from '../components/StoryDetails.vue'; // 绘本编辑组件
import FinishStory from '../components/FinishStory.vue'; // 生成绘本组件



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
    component: StoryDetails // 绘本编辑
  },
    {
    path: '/FinishStory', // 根路径
    name: 'FinishStory',
    component: FinishStory // 绘本生成
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
