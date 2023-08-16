<template>
  <div id="app">
    <router-view></router-view> <!-- 路由视图将渲染当前路由组件 -->
  </div>
</template>

<script>
// 您不需要引入任何特定组件，除非您希望在此文件中使用它们
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
