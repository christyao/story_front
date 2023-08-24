<template>
  <t-navbar :fixed="true" left-arrow>

    <!-- 顶部导航栏 -->
    <template #left>
      <span class="custom-title">绘本创作</span>
    </template>
    <template #right>
      <t-button size="extra-small" theme="danger" variant="outline" shape="round" style="margin-right: 10px;" @click="navigateToFinishStory()">生成绘本</t-button>
      <t-icon name="ellipsis" size="24px" />
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
      <!-- <div class="story-hint">（定制绘本插图）</div> -->
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


  <!-- 故事线选择 -->
  <div class="story-title-block" v-show="chapter_length < 10">
    <div class="story-title">第{{album_plot.length + 1}}话</div>
    <div class="story-hint">（选择故事线）</div>
    <img src="@/assets/mask-group.png" class="story-title-img">
  </div>
  
  <!-- 图片组 -->
  <div class="plot" v-show="!upscaleVisible && !refresh_loading && chapter_length < 10">
    <div 
      v-for="plot in plots"
      :key="plot.id"
      class="plot-image" 
      @click="selectImage(plot.id)">
      <img 
        :class="['story-image' , { 'image-selected': selectPlotId === plot.id }]" 
        :src="plot.image_url">
      <div class="image-text">{{plot.plot}}</div>
    </div>
  </div>

  <!-- 放大图片 -->
  <transition name="fade">
    <div v-if="isButtonDisabled || upscaleVisible" class="transition-container">
      <div class="upscale-block" v-if="upscaleVisible">
          <img :src="upscale_image" class="upscale-image">
      </div>
      <div class="upscale-block" v-else><div class="upscale-loading">剧情正在刷新中...</div></div>
    </div>
  </transition>

  <!-- 桥段显示 -->
  <div class="plot-block"><div class="plot-text">{{ chapter_length<10 ? plotText:'故事已完毕' }}</div></div>

  <!-- 提交按钮 -->
  <div class="submit-block" v-if="chapter_length < 10">
      <t-button 
        class="randomize-button" 
        theme="primary" 
        size="medium"  
        shape="round" 
        :icon="randomIconSlot" 
        @click="randomizePlot"
        :disabled="isButtonDisabled">
        <span class="change-text">{{ buttonText }}</span>
        <span class="remaining-text">(剩余：{{ upscaleVisible ? change_image_numbers:change_plot_numbers  }})</span>
      </t-button>
    <t-button class="next-button" size="medium" theme="danger" block variant="outline" shape="round" @click="nextStep">
    {{upscaleVisible ? '保存并下一步':'优化图片' }}</t-button>
  </div>

</template>
<script>
  import { Toast } from 'tdesign-mobile-vue';
  import { h } from 'vue';
  import randomIcon from '@/assets/icon-random.svg';
  import axios from 'axios';
  export default {
    // components: { RandomButton }, // 注册RandomButton组件
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
        plots: [], // 记录随机生成剧情
        plotText: "", // 记录动态选择时的剧情
        selectPlotId:null, // 记录随机剧情中，被选择剧情的id
        theme_id:1, // 绘本主题，由上一页传入
        album_id:1, // 绘本id，由上一页传入
        user_id:1, // 用户id，由上一页传入
        album:{}, // 记录绘本对象
        album_plot:[], // 记录绘本已有剧情
        chapter_next:0, // 记录绘本编辑到哪个章节
        // 统计随机次数，上限5次，页面加载时默认随机一次
        change_image_numbers:3, // 初始剩余换图次数
        change_plot_numbers:3, // 初始剩余换剧情次数
        upscale_image:'', // 记录放大显示图片的地址
        image_description:'', // 记录随机生成图片已选择部分的生图描述
        upscaleVisible: false, // 判断放大图片模块是否显示
        isButtonDisabled: false, // 判断按钮点击后是否需要禁用
        buttonText: '', // 提交按钮文案
        image_detail:'', // 记录换图片后的图片对象
        selectedImageId:null, // 记录已选择图片的id
        refresh_loading:true, // 记录是否正在刷新中的状态
        chapter_length:0, // 限制绘本长度
      };
    },
    created(){
      // 
    },
    mounted(){
      // 初始化数据
      this.getAlbum();
      this.smoothScrollToBottom(); // 添加此行来滚动到底部
    },
    computed: {
      computedPlotText() {
        return this.plots.length > 0 ? this.plots[0].plot : '';
      },
    },
    methods: {
      smoothScrollToBottom(duration = 600) {
        const start = window.scrollY || window.pageYOffset;
        let startTime = null;

        const animation = currentTime => {
          const documentHeight = document.body.scrollHeight;
          const windowHeight = window.innerHeight;
          const distance = documentHeight - windowHeight - start;

          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          window.scrollTo(0, start + distance * progress + 80);
          if (progress < 1) {
            window.requestAnimationFrame(animation);
          }
        };

        window.requestAnimationFrame(animation);
      },
      randomIconSlot() {
        return h('img', {
          src: randomIcon,
          alt: 'random-icon',
          style: { marginRight: '8px' },
        });
      },
      selectImage(imageNumber) {
        let plot = this.plots.find(p => p.id === imageNumber);
        if (plot) {
          this.selectPlotId = imageNumber;
          this.plotText = plot.plot;
          this.selectedImageId = plot.description.image_id
        }
      },
      randomizePlot(){
        if(this.chapter_length > 9)
        {
          this.showWarning('已超过剧情长度，请生成绘本完成');
        }else{
          this.refresh_loading = true; // 隐藏剧情部分
          this.isButtonDisabled = true; // 禁用按钮
          this.buttonText = "随机中..."; // 设置按钮文本为 "随机中..."
          if (this.upscaleVisible) // 换图片请求
          {
            if (this.change_image_numbers > 0) {
              axios.get('http://127.0.0.1:5000/changeImage', {
                params: {
                  description: this.image_description,
                  album_id: this.album_id,
                  user_id: this.user_id
                }
              }).then(response => {
                  // console.log(response.data);
                  this.upscale_image = response.data.generated_image_url;
                  this.image_detail = response.data.image_details;
                  this.isButtonDisabled = false; // 启用按钮
                  this.refresh_loading = false; // 显示剧情部分
                  this.change_image_numbers --; // 扣除随机图片次数
              });
            }else{
              this.showWarning('随机次数不足，请充值...');
              this.refresh_loading = false; // 显示剧情部分
              this.isButtonDisabled = false; // 启用按钮
            }
          }else // 换剧情请求
          {
            if (this.change_plot_numbers > 0) {
              axios.get('http://127.0.0.1:5000/getPlot', {
              params: {
                  chapter_next: this.album_plot.length + 1,
                  theme_id: this.theme_id,
                }
              }).then(response => {
                    this.plots = response.data;
                    this.isButtonDisabled = false; // 启用按钮
                    this.initDefaultSelect(); // 默认选中随机选项第一个
                    this.refresh_loading = false; // 显示剧情部分
                    this.change_plot_numbers --; // 扣除随机剧情次数
              });
            }else{
              this.showWarning('随机次数不足，请充值...');
              this.refresh_loading = false; // 显示剧情部分
              this.isButtonDisabled = false; // 启用按钮
            }  
          }
        }
      },
      initDefaultSelect()
      {
        if (this.plots.length > 0) {
          this.selectPlotId = this.plots[0].id;
          this.plotText = this.plots[0].plot;
          this.selectedImageId = this.plots[0].description.image_id;
        }
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
            this.chapter_next = this.album_plot.length + 1;
            // 初始化时进行一次随机
            this.randomizePlot();
            // 记录绘本长度
            this.chapter_length = this.album_plot.length;
        });
      },
      nextStep()
      {
        if(this.upscaleVisible) // 保存绘本
        {
          this.saveAlbum();
        }else // 放大图片
        {
          let plot = this.plots.find(p => p.id === this.selectPlotId);
          // console.log(plot);
          this.upscale_image = plot.image_url;
          this.iamge_description = plot.description.content;
          this.showUpscaleImage();
          this.buttonText = '换图片';
        }
      },
      showUpscaleImage() {
        this.upscaleVisible = true;
      },
      hideUpscaleImage() {
        this.upscaleVisible = false;
      },
      saveAlbum()
      {
        let formData = 
          {
          image: this.upscale_image,
          image_id: this.image_detail.id ? this.image_detail.id : this.selectedImageId,
          plot_description: this.plotText,
          plot_id: this.selectPlotId,
        };
        axios.get('http://127.0.0.1:5000/saveAlbum', {
          params: {
            album_id: this.album_id,
            formData: formData,
          }
        }).then(response => {
          this.refreshStory(response.data);
          this.upscaleVisible = false;
          this.smoothScrollToBottom(); // 添加此行来滚动到底部
        });
      },
      refreshStory(data)
      {
        this.album = data;
        this.album_plot = JSON.parse(this.album.content);
        this.chapter_next = this.album_plot.length + 1;
        this.chapter_length = this.album_plot.length;
        this.randomizePlot();
      },
      navigateToFinishStory() {
        if(this.chapter_length > 0)
        {
          this.$router.push({
            name: 'FinishStory',
            query: {
              theme_id:this.theme_id,
              album_id:this.album_id,
              user_id:this.user_id,
              album:this.album,
              album_plot:this.album_plot,
            }
          });
        }else{
          this.showWarning('请先完成剧情创建');
        }
      },
      showWarning(content){
        let text = content;
        Toast({
          direction: 'column',
          theme: 'success',
          message: text,
        });
      },
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
  .plot
  {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 400px;
    transition: opacity 0.5s ease-in-out;
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
  .history-image
  {
    width: 364px;
    height: 364px;
    border-radius: 16px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 
  }
  .remaining-text {
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    margin-top: 10px;
    margin-left:10px;
    font-weight:normal;
  }
  .upscale-block
  {
    transition: opacity 0.5s ease-in-out;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }
  .upscale-image, .upscale-loading
  { 
    border-radius: 10px;
    width: 100%;
    height: 390px;
  }
  .upscale-loading
  {
    display: flex;
    align-items: center;    /* 垂直居中 */
    justify-content: center; /* 水平居中 */
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.6s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
      opacity: 0;
  }

</style>
