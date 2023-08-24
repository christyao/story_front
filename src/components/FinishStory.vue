<template>
  <t-navbar :fixed="true" left-arrow @click="goBack()">

    <!-- 顶部导航栏 -->
    <template #left>
      <span class="custom-title">生成绘本</span>
    </template>
  </t-navbar>

  <!-- 主角信息 -->
  <div class="character-block">
    <div class="character-container ">
      <div class="character-image">
        <t-avatar size="large" class="character-avatar" image="https://tdesign.gtimg.com/mobile/demos/avatar_1.png"></t-avatar>
      </div>
      <div class="character-info">
        <div class="character-name">王二兔</div>
        <div class="character-tag">5岁 / 男 / 可爱 / 好动</div>
      </div>
    </div>
  </div>

  <!-- 历史故事线 -->
  <div v-for="plot,index in album_plot" :key="index">
    <div class="story-title-block">
      <div class="story-title">第{{index + 1}}话</div>
      <img src="@/assets/mask-group.png" class="story-title-img">
    </div>

    <div class="story-history-block">
      <div class="story-history-image">
        <img class="history-image" :src="plot.image">
      </div>
      <div class="plot-block">
        <div class="plot-text">{{ plot.plot_description }}</div>
      </div>
    </div>
  </div>

  <!-- 分享按钮 -->
  <div class="submit-block">
      <t-button 
        class="randomize-button" 
        theme="primary" 
        size="medium"  
        shape="round" 
        @click="shareStory"
        :disabled="isButtonDisabled">
        <span class="change-text">分享到朋友圈</span>
      </t-button>
    <t-button class="next-button" size="medium" theme="danger" block variant="outline" shape="round" @click="download">下载</t-button>
  </div>

</template>
<script>
  import { Toast } from 'tdesign-mobile-vue';
  import axios from 'axios';
  export default {
    name: 'FinishStory',
    data() {
      return {
        charaters: {
          race:'兔子',
          img:'path/to/your/image.png',
          name:'王二兔',
          description:'可爱活泼',
          age:'5',
        },
        theme_id:1,
        album_id:1,
        user_id:1,
        album:{},
        album_plot:[],
        isButtonDisabled: false,
      };
    },
    created(){
      this.initData();
    },
    mounted(){
      // 
    },
    computed: {
      // 
    },
    methods: {
      initData()
      {
        this.album_id = this.$route.query.album_id;
        this.getAlbum();
      },
      getAlbum()
      {
        let album_id = this.album_id;
        axios.get('http://127.0.0.1:5000/getAlbum', {
          params: {
            album_id: album_id
          }
        }).then(response => {
              this.album = response.data;
              this.album_plot = JSON.parse(this.album.content);
              // console.log(this.album);
              // console.log(this.album_plot);
        });
      },
      goBack() {
        this.$router.go(-1);
      },
      download()
      {
        Toast({
          // icon: () => h(ErrorCircleIcon),
          direction: 'column',
          theme: 'success',
          message: '敬请期待...',
        });
      },
      shareStory()
      {
        Toast({
          // icon: () => h(ErrorCircleIcon),
          direction: 'column',
          theme: 'success',
          message: '敬请期待...',
        });
      }
    }
  }

</script>

<style scoped>
  .character-block
  {
    height: 120px;
/*    background-color: rgb(244,248,247);*/
  }
  .character-container 
  {
    width: 360px;
    height: 104px;
    border-radius: 5px;
    background: white;
    margin: 0 auto;
    display: flex;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 
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
  .story-image {
    width: 172px;
    height: 172px;
    border-radius: 20px;
    border: 5px solid white;
    transition: all 0.3s ease-in-out;
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
  .submit-block
  {
    margin: 30px 0;
    display: flex;
    justify-content: space-between;
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
  .history-image
  {
    width: 364px;
    height: 364px;
    border-radius: 16px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 
  }
</style>
