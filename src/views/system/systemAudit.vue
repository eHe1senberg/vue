<template>
  <div>
    <system-header>
      <el-select
        @change="selectChange"
        v-model="status"
        clearable
        placeholder="请选择审核类型"
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
      <el-button
        @click="getSystemRecipeAuditItem(1)"
        size="small "
        type="primary"
      >
        查询</el-button
      >
    </system-header>
    <tableMy
      :column="column"
      :data="data"
      :isOperation="false"
      :onPagination="{
        pageSize,
        currentPage,
        total,
        currentChange: currentChange,
      }"
    >
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isAuditState == 0"
            type="text"
            size="small"
            @click="handleTiao(scope.row)"
            >审核</el-button
          >
          <el-button
            v-if="scope.row.isAuditState == 1"
            @click="handleTiao(scope.row)"
            type="text"
            size="small"
            >查看</el-button
          >
          <el-button
            v-if="scope.row.isAuditState == 2"
            @click="handleTiao(scope.row)"
            type="text"
            size="small"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </tableMy>
  </div>
</template>

<script>
import systemHeader from "./component/systemHeader";
import tableMy from "./component/tableMy.vue";
import { getSystemRecipeAudit } from "../../api/system";
import { getContent } from "../../utils/gitlab";
export default {
  components: { systemHeader, tableMy },

  data() {
    return {
      title: "",
      status: "0",
      options: [
        {
          id: 1,
          label: "待审核",
          value: "0",
        },
        {
          id: 2,
          label: "审核未通过",
          value: "1",
        },
        {
          id: 3,
          label: "已审核",
          value: "2",
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
      total: 0,
      currentPage: 1,
      pageSize: 8,
    };
  },
  methods: {
    async getSystemRecipeAuditItem(current = 1) {
      let params = {
        pageSize: this.pageSize,
        pageNum: current,
        title: this.title,
        isAuditState: this.status,
      };
      try {
        let res = await await getSystemRecipeAudit(params);
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
      this.getSystemRecipeAuditItem(current);
    },
    selectChange(value) {
      this.status = value;
      this.getSystemRecipeAuditItem();
    },
    handleTiao({ id, isAuditState }) {
      this.$router.push({
        path: "/mainNav/menu/systemAuditDesc",
        query: { id, isAuditState },
      });
    },
  },
  mounted() {
    this.getSystemRecipeAuditItem();
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