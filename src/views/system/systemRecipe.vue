<template>
  <div>
    <system-header>
      <el-select
        @change="selectChange"
        v-model="age"
        clearable
        placeholder="请选择食谱适用年龄"
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
        type="text"
        v-model="title"
        :style="{
          margin: '0 15px',
          width: '200px',
          height: '32px',
        }"
        placeholder="请输入食谱标题"
      ></el-input>
      <el-button @click="searchTitle" size="small " type="primary">
        查询</el-button
      >
    </system-header>
    <tableMy
      :column="column"
      :data="data"
      :operation="operation"
      :onPagination="{
        pageSize,
        currentPage,
        total,
        currentChange: currentChange,
      }"
    ></tableMy>
  </div>
</template>

<script>
import tableMy from "./component/tableMy.vue";
import systemHeader from "./component/systemHeader";
import { getSystemRecipe, systemRecipeIsRecommend } from "@/api/system";
import { getContent } from "../../utils/gitlab";
export default {
  components: { tableMy, systemHeader },
  data() {
    return {
      age: "",
      title: "",
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
      column: [
        {
          key: 1,
          prop: "index",
          label: "序号",
          width: 100,
        },
        {
          key: 2,
          prop: "recipeTitle",
          label: "食谱名称",
          width: 200,
        },
        {
          key: 3,
          prop: "username",
          label: "创建人",
          width: 150,
        },
        {
          key: 4,
          prop: "createTime",
          label: "创建时间",
          width: 150,
        },
        {
          key: 5,
          prop: "recipeDesc",
          label: "食谱简介",
        },
      ],
      data: [],
      operation: {
        key: 6,
        //   prop: "operation",
        label: "操作",
        width: 200,
        operations: [
          {
            id: 1,
            label: "首页推荐",
            value: "取消推荐",
            onClick: this.onRecommend,
          },
        ],
      },
      total: 0,
      currentPage: 1,
      pageSize: 8,
    };
  },
  methods: {
    async getSystemRecipeItem(current = 1) {
      let params = {
        pageSize: this.pageSize,
        pageNum: current,
        title: this.title,
        age: this.age,
      };
      try {
        let res = await await getSystemRecipe(params);
        let r = res.data.records.map((item, index) => {
          return {
            ...item,
            index: index + 1,
            recipeDesc: getContent(item.recipeDesc),
          };
        });
        this.data = r;
        this.total = res.data.total;
        this.currentPage = current;
      } catch (e) {
        console.log(e);
      }
    },
    currentChange(current) {
      this.getSystemRecipeItem(current);
    },
    selectChange(value) {
      this.age = value;
      this.getSystemRecipeItem();
    },
    searchTitle() {
      this.getSystemRecipeItem();
    },
    async onRecommend({ isRecommend, id }) {
      try {
        let params = {
          isRecommend: isRecommend === 0 ? 1 : 0,
          id,
        };
        let res = await systemRecipeIsRecommend(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: res.message,
          });
        } else {
          this.$message({
            typeof: "error",
            message: res.message,
          });
        }
      } catch (e) {
        console.log(e);
      }
      this.getSystemRecipeItem();
    },
  },
  mounted() {
    this.getSystemRecipeItem();
  },
};
</script>

<style lang="less" scoped>
/deep/.el-input__inner {
  height: 32px;
}
/deep/.el-input__icon {
  line-height: 0;
}
</style>