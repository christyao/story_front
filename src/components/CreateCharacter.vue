<template>
  <!-- 标题栏 -->
  <t-navbar :fixed="true" class="navbar" left-arrow @left-click="handleClick">
    <template #left>
      <span class="custom-title">绘本创作</span>
    </template>
  </t-navbar>

  <!-- 角色版块 -->
  <div class="character-creation" @click="changeCharacter">
    <div class="character-title">
      <div class="main-title">创建角色</div>
      <img class="separator" :src="separatorImage" alt="分隔线" />
      <div class="subtitle">选择一个喜欢的角色</div>
    </div>
    <div class="character-container">
      <t-image
          class="character-image"
          :src="character.image"
          fit="cover"
          shape="round"
      >
      </t-image>
      <TInput
        v-model="character.description"
        placeholder="我是谁？"
        type="textarea"
        :rows="3"
      />
    </div>
  </div>

  <!-- 操作区 -->
  <div class="button-container">
    <RandomButton class="randomize-button" @click="randomizeCharacter" />
    <TButton class="create-button" theme="primary" variant="outline" type="submit" size="medium" shape="round" @click="createCharacter">创建角色</TButton>
  </div>
</template>



<script>
import { Button as TButton, Navbar as TNavbar, Input as TInput, Image as TImage } from 'tdesign-mobile-vue';
import RandomButton from '@/components/RandomButton.vue'; // 导入RandomButton组件
import axios from 'axios';

export default {
  components: { TButton, TNavbar, TInput, TImage, RandomButton }, // 注册RandomButton组件
  data() {
    return {
      
      character: {
        image: '', // 将在 created 钩子中设置
        description: '' // 将在 created 钩子中设置
      },
      fakeCharacters: [ // 假数据
        { image: require('@/assets/character1.png'), description: '角色1的描述...' },
        { image: require('@/assets/character2.png'), description: '角色2的描述...' },
        // 更多角色...
      ],
      separatorImage: require('@/assets/separator.png'), // 分隔线图片
    };
  },
  created() {
    // 设置 character 的初始值为 fakeCharacters 的第一个元素
    this.character = this.fakeCharacters[0];
  },
  methods: { // 这里添加了 methods 对象
    randomizeCharacter() {
      // 定义请求参数
      const requestParams = {
        preset: false // 您可以根据需要更改此值
      };

      // 打印请求参数到控制台
      console.log('Request parameters:', requestParams);

      // 使用Axios发送GET请求
      axios.get('/api/roles/preset/random', { params: requestParams })
        .then(response => {
          // 从响应中提取相关字段
          const data = response.data;
          console.log(data);
          // 重新组装为character对象所需的格式
          this.character = {
            description: data.description,
            image: data.image, // 假设image字段包含图片URL
            // 您还可以根据需要添加其他字段
          };
        })
        .catch(error => {
          // 处理错误
          console.error(error);
        });
    },
    createCharacter() {
      // 转到下一个页面
      this.$router.push('/character-details'); // 假设路由路径
    },
    handleClick() {
      console.log('left-click');
    },
    changeCharacter() {
      // 在这里处理更换角色的逻辑

    }
  }
};

</script>

<style scoped>
.navbar {
  z-index: 1000;
}

.custom-title {
  margin-left: 20px;
  font-size: 18px;
  font-weight: 600;
}

.character-creation {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.character-title {
  text-align: center;
  padding: 16px;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.separator {
  margin: 8px;
  display: block;
  max-width: 100%;
  height: auto;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.character-container {
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.character-image {
  width: 100%;
  position: relative;
  display: block;
  margin: 0 auto;
}

.button-container {
  padding: 16px;
  display: flex;
  margin-top: 34px;
  justify-content: space-between;
}

.create-button {
  flex: 1;
  --td-button-font-weight: normal;
}

.randomize-button {
  flex: 1.5;
  margin-Right: 12px;
}
</style>
