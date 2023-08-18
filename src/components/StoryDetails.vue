<template>
  <t-navbar :fixed="true" left-arrow>

    <!-- 顶部导航栏 -->
    <template #left>
      <span class="custom-title">绘本创作</span>
    </template>
    <template #right>
      <t-button size="extra-small" theme="danger" variant="outline" shape="round" style="margin-right: 10px;">生成绘本</t-button>
      <t-icon name="ellipsis" size="24px" />
    </template>
  </t-navbar>

  <!-- 主角信息 -->
  <div class="character-container ">
    <div class="character-image">
      <t-avatar size="large" class="character-avatar" image="https://tdesign.gtimg.com/mobile/demos/avatar_1.png"></t-avatar>
    </div>
    <div class="character-info">
      <div class="character-name">王二兔</div>
      <div class="character-tag">5岁 / 男 / 可爱 / 好动</div>
    </div>
  </div>

  <!-- 故事线选择 -->
  <div class="story-title-block">
    <div class="story-title">第一话</div>
    <div class="story-hint">（选择故事线）</div>
    <img src="@/assets/mask-group.png" class="story-title-img">
  </div>
  
  <!-- 图片组 -->
  <div class="plot">
    <div class="plot-image" @click="selectImage(1)">
      <img :class="['story-image' , { 'image-selected': selectedImage === 1 }]" src="@/assets/ex1.png">
      <div class="image-text">曾经,隐藏在森林深处的小屋。这片骑士正在唱歌，那是一个微风轻拂的日子仿佛时间停止了般宁静.</div>
    </div>

    <div class="plot-image" @click="selectImage(2)">
      <img :class="['story-image' , { 'image-selected': selectedImage === 2 }]" src="@/assets/ex2.png">
      <div class="image-text">有一天,宁静的小镇，那儿的孩子们正在玩耍，那是一个阳光明媚的日子都充满了生机与活力。</div>
    </div>

    <div class="plot-image" @click="selectImage(3)">
      <img :class="['story-image' , { 'image-selected': selectedImage === 3 }]" src="@/assets/ex3.png">
      <div class="image-text">某个花香四溢的花园。而那边的商贩正在冥想，那是一个微风轻拂的日子都充满了生机与活力。</div>
    </div>

    <div class="plot-image" @click="selectImage(4)">
      <img :class="['story-image' , { 'image-selected': selectedImage === 4 }]" src="@/assets/ex4.png">
      <div class="image-text">在一个阳光明媚的日子里。这片隐藏在森林深处的小屋的农民正在种植充满了欢声笑语。</div>
    </div>
  </div>

  <!-- 桥段显示 -->
  <div class="plot-block"><div class="plot-text">曾经,隐藏在森林深处的小屋。这片骑士正在唱歌，那是一个微风轻拂的日子仿佛时间停止了般宁静.</div></div>

  <!-- 提交按钮 -->
  <div class="submit-block">
    <RandomButton class="randomize-button" @click="randomizeCharacter" />
    <t-button class="next-button" size="medium" theme="danger" block variant="outline" shape="round">下一话</t-button>
  </div>
</template>
<script>
  import RandomButton from '@/components/RandomButton.vue'; // 导入RandomButton组件
  export default {
    components: { RandomButton }, // 注册RandomButton组件
    name: 'StoryDetails',
    data() {
      return {
        charaters: {
          race:'兔子',
          img:'path/to/your/image.png',
          name:'王二兔',
          description:'可爱活泼',
          age:'5',
        },
        selectedImage:null,
      };
    },
    created(){

    },
    mounted(){

    },
    methods: {
      selectImage(imageNumber) {
        this.selectedImage = imageNumber;
      },
      randomizeCharacter(){
        console.log('1');
      }
    }
  }

</script>

<style scoped>
  .character-container 
  {
    width: 360px;
    height: 104px;
    border-radius: 5px;
    background: rgba(243, 244, 246, 1);
    margin: 0 auto;
    display: flex;
  }
  .character-image
  {
    height: 104px;
    width: 104px;
  }
  .character-avatar
  {
    margin-top: 20px;
  }
  .character-info
  {
    margin-top: 25px;
    text-align: left;
  }
  .character-name
  {
    font-size: 14px;
    font-weight: bold;
  }
  .character-tag
  {
    font-size: 14px;
    margin-top: 15px;
    color: rgba(100, 100, 100, 1.0);
  }
  .story-title-block
  {
    width: 100%;
    margin: 10px 0 0 0;
  }
  .story-title, .story-hint
  {
    width: 100%;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: rgba(60, 60, 60, 1.0);
  }
  .story-title-img
  {
    width: 100%;
    margin: 10px 0;
  }
  .plot
  {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 400px;
  }
  .plot-image {
    flex: 0 0 calc(50% - 15px); /* 15px为间距，您可以根据实际需求进行调整 */
    margin-bottom: 20px; /* 根据需要增加间距 */
    height: auto;
    position: relative;
  }
  .story-image {
    width: 172px;
    height: 172px;
    border-radius: 20px;
    border: 5px solid white;
    transition: all 0.3s ease-in-out;
  }
  .plot-image .image-selected {
    border: 5px solid rgb(238, 63, 77, 1.0);
  }
  .plot-block
  {
    height: 60px;
    width: 100%;
    margin: 10px auto;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 
    font-size: 12px;
    line-height: 20px;
    text-align: left;
    display: flex;          /* 设置为flex容器 */
    align-items: center;    /* 垂直居中内容 */
    justify-content: center; /* 水平居中内容 */
  }
  .plot-text
  {
    margin: 10px;
    font-weight: 500;
  }
  .image-checkmark-icon
  {
    position: absolute;
    top: 10px;
    left: 115px;
    width: 25px;
    height: 25px;
    transition: all 0.3s ease-in-out;
    opacity: 1; /* 默认为透明 */
  }
  .image-text
  {
    position: absolute;
    bottom: 10px;
    right: 15px;
    width: 100px;
    height: 25px;
    transition: all 0.3s ease-in-out;
    opacity: 1;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
    font-weight: bold;
  }
  .custom-icon
  {
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }
  .image-checkmark-icon img 
  {
    width: 100%;      /* 使图片填充整个容器 */
    height: 100%;
    object-fit: contain;  /* 保证图片在容器内部按比例缩放 */
  }
  .submit-block
  {
    margin: 30px 0;
    display: flex;
    justify-content: space-between;
  }
  .refresh-button
  {
    width: 258px;
/*    margin: 0 5px;*/
  }
  .next-button
  {
  flex: 1;
  --td-button-font-weight: normal;
  }
  .randomize-button
  {
    flex: 1.5;
    margin-Right: 12px;
  }
</style>
