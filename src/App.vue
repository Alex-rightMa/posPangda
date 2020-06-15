<template>
  <div id="app">
    <mainNav/>
    <div class="mainBorad">
      <router-view/>
    </div>
  </div>
</template>

<script>
import mainNav from '@/components/common/mainNav'
export default {
  name: 'App',
  components:{
    mainNav
  }
}
</script>

<style lang="less">
  #app{
    display: flex;
  }
  .mainBorad {
    flex: 1;
    background-color: tomato;
  }
</style>
