<template>
  <div class="content">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      :style="{ width: '100%' }"
    >
      <el-tab-pane label="已发布" name="2">
        <list
          :onPagination="{
            pageSize: pageSize,
            total: total,
            currentPage: currentPage,
            currentChange: currentChange,
          }"
          :data="data"
          :deleteRecipe="deleteRecipe"
        ></list>
      </el-tab-pane>
      <el-tab-pane label="待审核" name="0">
        <list
          :onPagination="{
            pageSize: pageSize,
            total: total,
            currentPage: currentPage,
            currentChange: currentChange,
          }"
          :data="data"
          :deleteRecipe="deleteRecipe"
        ></list>
      </el-tab-pane>
      <el-tab-pane label="审核未通过" name="1">
        <list
          :onPagination="{
            pageSize: pageSize,
            total: total,
            currentPage: currentPage,
            currentChange: currentChange,
          }"
          :data="data"
          :deleteRecipe="deleteRecipe"
        ></list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import list from "./list.vue";
import { getMyRecipe, deleteRecipe } from "../../../api/personCenter";
export default {
  components: { list },
  data() {
    return {
      activeName: "2",
      data: [],
      pageSize: 7,
      total: 0,
      currentPage: 1,
    };
  },
  methods: {
    async getMyRecipeItem(current = 1) {
      let params = {
        isAuditState: this.activeName,
        pageSize: this.pageSize,
        pageNum: current,
      };
      try {
        let res = await getMyRecipe(params);
        if (res.code == 200) {
          this.data = res.data.records;
          this.total = res.data.total;
          this.currentPage = current;
        }
      } catch (e) {
        console.log(e);
      }
    },
    currentChange(value) {
      this.getMyRecipeItem(value);
    },
    handleClick(e) {
      this.getMyRecipeItem();
    },
    async deleteRecipe(id) {
      try {
        let res = await deleteRecipe(id);
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
        } else {
          this.$message.error("删除失败");
        }
        this.getMyRecipeItem();
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.getMyRecipeItem();
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 8px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 10%);
  width: 100%;
}
</style>