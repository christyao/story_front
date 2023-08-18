<template>
  <t-button class="randomize-button" theme="primary" size="large"  shape="block" :icon="randomIconSlot" @click="clickHandler">
    <span class="change-text">换一换</span>
    <span class="remaining-text">(剩余：{{ remainingChanges }})</span>
  </t-button>
</template>

<script>
import { h, ref } from 'vue';
import randomIcon from '@/assets/icon-random.svg';

export default {
  props: {
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const remainingChanges = ref(5); // 初始剩余更换次数

    const randomIconSlot = () => {
      return h('img', {
        src: randomIcon,
        alt: 'random-icon',
        style: { marginRight: '8px' },
      });
    };

    const clickHandler = () => {
      if (remainingChanges.value > 0) {
        remainingChanges.value -= 1;
        props.onClick();
      }
    };

    return {
      randomIconSlot,
      clickHandler,
      remainingChanges,
    };
  },
};

</script>

<style scoped>
.randomize-button.t-button {
  /* 您可以在此处定义按钮样式 */

}

.change-text {
  /* 您可以在此处定义“换一个”文本的样式 */
}

.remaining-text {
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  margin-top: 10px;
  margin-left:10px;
  font-weight:normal;
}
</style>
