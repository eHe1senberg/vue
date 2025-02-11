<template>
  <div class="content">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      @select="handleSelect"
      :style="{
        width: '200px',
        minHeight: '600px',
        overflowX: 'hidden',
        overflowY: 'auto',
      }"
    >
      <el-menu-item index="/mainNav/peopleCenter/personData"
        >个人资料</el-menu-item
      >
      <el-menu-item index="/mainNav/peopleCenter/myRecipe"
        >我发布的</el-menu-item
      >
      <el-menu-item index="/mainNav/peopleCenter/myCollect"
        >我的收藏</el-menu-item
      >
      <el-menu-item index="/mainNav/peopleCenter/myConcern"
        >我的关注</el-menu-item
      >
      <el-menu-item index="/mainNav/peopleCenter/myFans">我的粉丝</el-menu-item>
      <el-menu-item index="/mainNav/peopleCenter/editMyInfo"
        >修改资料</el-menu-item
      >
    </el-menu>
    <div :style="{ flex: '1', padding: '0 20px' }">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "",
    };
  },
  methods: {
    handleSelect(index, indexPath) {
      if (this.$route.path === index) return;
      this.$router.push({ path: index });
    },
  },
  watch: {
    $route: {
      handler() {
        this.activeIndex = this.$route.path;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  display: flex;
}
</style>