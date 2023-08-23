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
  <div class="story-title-block">
    <div class="story-title">第{{album_plot.length + 1}}话</div>
    <div class="story-hint">（选择故事线）</div>
    <img src="@/assets/mask-group.png" class="story-title-img">
  </div>
  
  <!-- 图片组 -->
  <div class="plot" v-show="!upscaleVisible">
    <div 
      v-for="plot in plots"
      :key="plot.id"
      class="plot-image" 
      @click="selectImage(plot.id)">
      <img 
        :class="['story-image' , { 'image-selected': selectedImage === plot.id }]" 
        :src="plot.image_url">
      <div class="image-text">{{plot.plot}}</div>
    </div>
  </div>

  <!-- 放大图片 -->
  <transition name="fade">
      <div class="upscale-block" v-show="upscaleVisible">
          <img :src="upscale_image" class="upscale-image">
      </div>
  </transition>

  <!-- 桥段显示 -->
  <div class="plot-block"><div class="plot-text">{{plotText}}</div></div>

  <!-- 提交按钮 -->
  <div class="submit-block">
      <t-button 
        class="randomize-button" 
        theme="primary" 
        size="medium"  
        shape="round" 
        :icon="randomIconSlot" 
        @click="randomizePlot"
        :disabled="isButtonDisabled">
        <span class="change-text">{{ buttonText }}</span>
        <span class="remaining-text">(剩余：{{ remainingChanges }})</span>
      </t-button>
    <t-button class="next-button" size="medium" theme="danger" block variant="outline" shape="round" @click="nextStep">
    {{change_btn ? '保存并下一步':'优化图片' }}</t-button>
  </div>

</template>
<script>
  // import RandomButton from '@/components/RandomButton.vue'; // 导入RandomButton组件
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
        plots: [],
        plotText: "",
        selectedImage:null,
        theme_id:1,
        album_id:1,
        user_id:1,
        album:{},
        album_plot:[],
        chapter_next:0,
        remainingChanges:6, // 初始剩余更换次数
        upscale_image:'',
        change_btn:false,
        change_description:'',
        upscaleVisible: false,
        isButtonDisabled: false,
        buttonText: '',
        image_detail:'',
        selectedImageId:null,
      };
    },
    created(){
      // 
    },
    mounted(){
      this.getAlbum();
    },
    computed: {
      computedPlotText() {
        return this.plots.length > 0 ? this.plots[0].plot : '';
      },
    },
    methods: {
      randomIconSlot() {
        return h('img', {
          src: randomIcon,
          alt: 'random-icon',
          style: { marginRight: '8px' },
        });
      },
      selectImage(imageNumber) {
        let plot = this.plots.find(p => p.id === imageNumber);
        this.selectedImage = imageNumber;
        if (plot) {
          this.plotText = plot.plot;
          this.selectedImageId = plot.description.image_id
        } else {
          console.error(`Plot with ID ${imageNumber} not found!`);
        }
      },
      randomizePlot(){
        this.isButtonDisabled = true; // 禁用按钮
        this.buttonText = "随机中..."; // 设置按钮文本为 "加载中..."
        if (this.change_btn)
        {
          axios.get('http://127.0.0.1:5000/changeImage', {
            params: {
              description: this.change_description,
              album_id: this.album_id,
              user_id: this.user_id
            }
          }).then(response => {
                console.log(response.data);
                for (var i = this.plots.length - 1; i >= 0; i--) {
                  if (this.plots[i].id == this.selectedImage)
                  {
                    console.log(this.album_plot);
                    this.upscale_image = response.data.generated_image_url;
                    this.image_detail = response.data.image_details;
                  }
                }
                this.isButtonDisabled = false; // 启用按钮
                this.buttonText = '换图片'; 
          });
        }else
        {
          if (this.remainingChanges > 0) {
            this.remainingChanges -= 1;
          }
          axios.get('http://127.0.0.1:5000/getPlot', {
            params: {
              chapter_next: this.album_plot.length + 1,
              theme_id: this.theme_id,
            }
          }).then(response => {
                this.plots = response.data;
                console.log(this.plots);
                this.isButtonDisabled = false; // 启用按钮
                this.buttonText = '换剧情'; 
          });
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
              console.log(this.album_plot);
              this.randomizePlot();
        });
      },
      nextStep()
      {
        if(this.upscaleVisible)
        {
          this.saveAlbum();
        }else
        {
          if (this.selectedImage) {
            for (var i = this.plots.length - 1; i >= 0; i--) {
              if (this.plots[i].id == this.selectedImage)
              {
                this.upscale_image = this.plots[i].image_url;
                this.change_description = this.plots[i].description.content;
                this.showUpscaleImage();
                this.buttonText = '换图片';
                if(this.upscaleVisible)
                {
                  this.change_btn = true;
                }else
                {
                  this.change_btn = false;
                } 
              }
            }
          }else
          {
            // 
          }
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
          plot_id: this.selectedImage,
        };
        console.log(formData);
        axios.get('http://127.0.0.1:5000/saveAlbum', {
          params: {
            album_id: this.album_id,
            formData: formData,
          }
        }).then(response => {
          console.log(response.data);
          this.refreshStory(response.data);
          this.upscaleVisible = false;
        });
      },
      refreshStory(data)
      {
        this.album = data;
        this.album_plot = JSON.parse(this.album.content);
        this.chapter_next = this.album_plot.length + 1;
        console.log(this.album_plot);
        this.randomizePlot();
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
  .upscale-image
  { 
    border-radius: 10px;
    width: 100%;
    height: 390px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.6s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
      opacity: 0;
  }

</style>
