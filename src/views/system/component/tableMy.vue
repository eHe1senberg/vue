<template>
  <div>
    <div class="top">
      <span>共{{ onPagination.total }}数据</span>
      <el-button v-if="isAdd" @click="onAdd" size="small " type="primary"
        >新增</el-button
      >
    </div>
    <el-table :data="data" style="width: 100%">
      <el-table-column
        v-for="item in column"
        :key="item.key"
        :prop="item.prop"
        :label="item.label"
        :show-overflow-tooltip="true"
        :width="item.width ? item.width : ''"
      >
      </el-table-column>
      <el-table-column
        v-if="isOperation"
        :label="operation.label"
        :width="operation.width ? operation.width : ''"
      >
        <template slot-scope="scope">
          <el-button
            v-for="item in operation.operations"
            :key="item.id"
            type="text"
            @click="item.onClick(scope.row)"
            >{{
              scope.row.isRecommend === 1 ? item.value : item.label
            }}</el-button
          >
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <el-pagination
      :style="{ textAlign: 'center', marginTop: '10px' }"
      layout="prev, pager, next"
      background
      :total="onPagination.total"
      :current-page="onPagination.currentPage"
      @current-change="onPagination.currentChange"
      :page-size="onPagination.pageSize"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    isOperation: {
      type: Boolean,
      default: true,
      require: false,
    },
    operation: {
      type: Object,
      default: () => ({ operations: [] }),
      require: true,
    },
    column: {
      type: Array,
      default: () => [],
      require: true,
    },
    data: {
      type: Array,
      default: () => [],
      require: true,
    },
    onPagination: {
      type: Object,
      default: () => ({
        pageSize: 10,
        total: 0,
        currentPage: 1,
        currentChange: () => {},
      }),
      require: false,
    },
    isAdd: {
      type: Boolean,
      default: false,
    },
    onAdd: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
</style>