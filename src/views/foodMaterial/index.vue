<template>
  <div>
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }"
    >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/mainNav' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>食材</el-breadcrumb-item>
      </el-breadcrumb>
      <el-input
        placeholder="请输入食材"
        v-model="title"
        :style="{ width: '300px' }"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="() => getFoodMaterialList()"
        ></el-button>
      </el-input>
    </div>

    <el-row
      :gutter="16"
      :style="{ marginTop: '20px' }"
      v-if="foodMaterialItem.length"
    >
      <el-col :span="8" v-for="item in foodMaterialItem" :key="item.id">
        <div class="content_item" @click="handlTiao(item.id)">
          <div class="content_item_div">
            <img
              :src="`/healthy/uploads/${item.image}`"
              alt=""
              :style="{ width: '100%', height: '200px' }"
            />
          </div>
          <div class="content_item_title">
            {{ item.foodMaterialTitle }}
          </div>
          <div class="content_item_desc">
            {{ item.foodMaterialDesc }}
          </div>
        </div>
      </el-col>
    </el-row>
    <el-empty v-else description="暂无数据"></el-empty>
    <el-pagination
      :style="{ textAlign: 'center', marginTop: '10px' }"
      background
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      :hide-on-single-page="true"
      @current-change="getFoodMaterialList"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getFoodMaterial } from "../../api/foodMaterial";
import { getContent } from "../../utils/gitlab";
export default {
  data() {
    return {
      title: "",
      pageSize: 6,
      total: 0,
      foodMaterialItem: [],
    };
  },
  methods: {
    async getFoodMaterialList(pageNum = 1) {
      try {
        let params = {
          title: this.title,
          pageNum: pageNum,
          pageSize: this.pageSize,
        };
        let res = await getFoodMaterial(params);
        let r = res.data.records.map((item) => {
          return {
            ...item,
            foodMaterialDesc: getContent(item.foodMaterialDesc),
          };
        });
        this.foodMaterialItem = r;
        this.total = res.data.total;
      } catch (e) {
        console.log(e);
      }
    },
    handlTiao(id) {
      this.$router.push({
        path: "/mainNav/foodMaterialDesc",
        query: { id: id },
      });
    },
  },
  mounted() {
    this.getFoodMaterialList();
  },
};
</script>

<style scoped lang="less">
.content_item {
  height: 360px;
  border-radius: 4px;
  margin-top: 20px;
  background-color: #fff;
  cursor: pointer;
  box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 10%);
  border-radius: 4px;
  .content_item_div {
    width: 100%;
    height: 200px;
    overflow: hidden;
  }
  &:hover {
    box-shadow: 0px 0px 10px 2px rgb(0 0 0 / 10%);
    img {
      transform: scale(1.25);
      transition: all 0.4s ease-in;
    }
  }
  .content_item_title {
    font-size: 20px;
    line-height: 40px;
    margin: 0 10px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .content_item_desc {
    font-size: 16px;
    line-height: 25px;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }
}
</style>