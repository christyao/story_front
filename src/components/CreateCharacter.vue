<template>
  <t-navbar :fixed="true" class="navbar" left-arrow @left-click="handleClick">
    <template #left>
      <span class="custom-title">创建角色</span>
    </template>
  </t-navbar>
  <div class="create-character">
    <div id="tip" @click="changeCharacter">
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
        <TButton
            class="randomize-button"
            theme="primary"
            variant="outline"
            size="large"
            @click="randomizeCharacter"
            :icon="randomIcon"
        >
            <img :src="randomIcon" alt="random-icon" width="24px" height="24px" /> 随机生成
        </TButton>

        <div class="change-count">剩余更换次数: {{ remainingChanges }}</div>
      </div>
      <TButton class="create-button" type="primary" size="large" block @click="createCharacter">创建角色</TButton>
    </div>
  </div>
</template>


<script>
import { Button as TButton, Navbar as TNavbar, Input as TInput, Image as TImage } from 'tdesign-mobile-vue';
import randomIcon from '@/assets/icon-random.svg';

export default {
  components: { TButton, TNavbar, TInput, TImage },
  data() {
    return {
      randomIcon, // 将图标路径添加到组件的数据中
      character: {
        image: '', // 将在 created 钩子中设置
        description: '' // 将在 created 钩子中设置
      },
      fakeCharacters: [ // 假数据
        { image: require('@/assets/character1.png'), description: '角色1的描述...' },
        { image: require('@/assets/character2.png'), description: '角色2的描述...' },
        // 更多角色...
      ],
      remainingChanges: 5 // 剩余更换次数
    };
  },
  created() {
    // 设置 character 的初始值为 fakeCharacters 的第一个元素
    this.character = this.fakeCharacters[0];
  },
  methods: { // 这里添加了 methods 对象
    randomizeCharacter() {
      // 随机选择角色
      const selectedCharacter = this.fakeCharacters[
        Math.floor(Math.random() * this.fakeCharacters.length)
      ];
      this.character = selectedCharacter;
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
      // 可以减少剩余更换次数
      this.remainingChanges -= 1;
    }
  }
};

</script>

<style scoped>
.navbar {
  z-index: 1000; /* 确保导航条在最上层 */
}

.custom-title {
  margin-left: 8px;
  font-size: 18px;
  font-weight: 600;
}

.create-character {
  padding: 16px; /* 外层页面左右边距 */
}

#tip {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 4px 10px  rgba(0, 0, 0, 0.1);
}

.character-container {
  padding-bottom: 20px; /* 只保留下方的padding */
  text-align: center;
}

.character-image {
  width: 100%; /* 图片横向填满角色面板 */
  position: relative;
  display: block;
  margin: 0 auto;
}

.create-button {
  margin-top: 20px;
}

.randomize-button {
    margin-top: 10px;
    float: right; /* 使按钮右对齐 */    
}

.change-count {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  margin-top: 10px;
}

</style>
