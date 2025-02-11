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
        <el-breadcrumb-item>食谱</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <el-select
          v-model="selectValue"
          clearable
          placeholder="请选择食谱适用年龄"
          @change="selectChange"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}
          </el-option>
        </el-select>
        <el-input
          placeholder="请输入食谱名称"
          v-model="title"
          :style="{ width: '300px', marginLeft: '10px' }"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="() => getRecipeList()"
          ></el-button>
        </el-input>
      </div>
    </div>

    <el-row
      :gutter="16"
      :style="{ marginTop: '20px' }"
      v-if="recipeItem.length"
    >
      <el-col :span="8" v-for="item in recipeItem" :key="item.id">
        <div
          class="content_item"
          @click="handlTiao(item.id)"
          v-pvRecipe="item.isAge"
        >
          <div class="content_item_div">
            <img
              :src="`/healthy/uploads/${item.image}`"
              alt=""
              :style="{ width: '100%', height: '200px' }"
            />
          </div>

          <div class="content_item_title">
            {{ item.recipeTitle }}
          </div>
          <div class="content_item_desc">
            {{ item.recipeDesc }}
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
      @current-change="getRecipeList"
    >
    </el-pagination>
    <i
      @click="$router.push('/mainNav/addRecipe')"
      class="el-icon-circle-plus-outline"
      :style="{
        fontSize: '40px',
        position: 'absolute',
        top: '200px',
        right: 'calc((100% - 1200px)/4)',
        cursor: 'pointer',
      }"
    />
  </div>
</template>

<script>
import { getRecipe } from "../../api/recipe";
import { getContent } from "../../utils/gitlab";
export default {
  data() {
    return {
      title: "",
      pageSize: 6,
      total: 0,
      recipeItem: [],
      selectValue: "",
      options: [
        {
          id: 1,
          label: "1岁",
          value: "1",
        },
        {
          id: 2,
          label: "2岁",
          value: "2",
        },
        {
          id: 3,
          label: "3岁",
          value: "3",
        },
        {
          id: 4,
          label: "4岁",
          value: "4",
        },
        {
          id: 5,
          label: "5岁",
          value: "5",
        },
        {
          id: 6,
          label: "6岁",
          value: "6",
        },
      ],
    };
  },
  methods: {
    async getRecipeList(pageNum = 1) {
      try {
        let params = {
          title: this.title,
          pageNum: pageNum,
          pageSize: this.pageSize,
          age: this.selectValue,
        };
        let res = await getRecipe(params);
        let r = res.data.records.map((item) => ({
          ...item,
          recipeDesc: getContent(item.recipeDesc),
        }));
        this.recipeItem = r;
        this.total = res.data.total;
      } catch (e) {
        console.log(e);
      }
    },
    handlTiao(id) {
      this.$router.push({
        path: "/mainNav/recipeDesc",
        query: { id: id },
      });
    },
    selectChange(value) {
      this.selectValue = value;
      this.getRecipeList();
    },
  },
  mounted() {
    this.getRecipeList();
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