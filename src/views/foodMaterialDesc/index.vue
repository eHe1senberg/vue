<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/mainNav' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/mainNav/foodMaterial' }"
        >食材</el-breadcrumb-item
      >
      <el-breadcrumb-item>食材详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div :style="{ padding: '26px' }">
        <div class="content_title">
          {{ foodMaterialDescItem.foodMaterialTitle }}
        </div>
        <div class="content_time">2023-02-02 16:58:27</div>
        <el-divider></el-divider>
        <div
          class="content_desc"
          v-html="foodMaterialDescItem.foodMaterialDesc"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFoodMaterialDesc, addForumComment } from "../../api/foodMaterial";
export default {
  data() {
    return {
      foodMaterialDescItem: {},
    };
  },
  methods: {
    async getFoodMaterialDescItem() {
      let { id } = this.$route.query;
      try {
        let res = await getFoodMaterialDesc(id);
        this.foodMaterialDescItem = res.data;
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.getFoodMaterialDescItem();
  },
};
</script>

<style scoped lang="less">
.content {
  margin-top: 30px;
  width: 1200px;
  line-height: 20px;
  border-radius: 4px;
  background-color: #fff;
  color: #101010;
  font-size: 14px;
  box-shadow: 0px 1px 4px 0px rgb(0 0 0 / 15%);
  font-family: Roboto;
  .content_title {
    width: 1148px;
    color: #101010;
    font-size: 36px;
    line-height: 50px;
    text-align: left;
    font-family: SourceHanSansSC-medium;
  }
  .content_time {
    color: #999;
    font-size: 14px;
    text-align: left;
    font-family: SourceHanSansSC-regular;
    margin-top: 5px;
  }
  .content_desc {
    width: 1157px;
    color: #626262;
    font-size: 16px;
    text-align: left;
    font-family: SourceHanSansSC-medium;
  }
}
</style>