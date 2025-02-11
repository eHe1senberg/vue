<template>
  <div id="app">
    <!-- <main-nav></main-nav> -->
    <router-view></router-view>
  </div>
</template>
<script>
import mainNav from "./views/mainNav.vue";
export default {
  components: {
    mainNav,
  },
};
</script>
<style>

</style>
