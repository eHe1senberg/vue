<template>
  <div class="content">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      @select="handleSelect"
      :style="{
        width: '200px',
        minHeight: '850px',
        overflowX: 'hidden',
        overflowY: 'auto',
      }"
    >
      <el-menu-item index="/mainNav/menu/systemUser">用户管理</el-menu-item>
      <el-menu-item index="/mainNav/menu/systemFoodMaterial"
        >食材管理</el-menu-item
      >
      <el-menu-item index="/mainNav/menu/systemRecipe">食谱管理</el-menu-item>
      <el-menu-item index="/mainNav/menu/systemAnnouncement"
        >通知公告管理</el-menu-item
      >
      <el-menu-item index="/mainNav/menu/systemAudit">审核</el-menu-item>
    </el-menu>
    <div :style="{ flex: '1', padding: '20px' }">
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

<style scoped lang="less">
.content {
  margin-left: calc((1200px - 100vw) / 2);
  margin-right: calc((1200px - 100vw) / 2);
  margin-top: -15px;
  display: flex;
}
</style>