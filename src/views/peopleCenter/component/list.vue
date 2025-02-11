<template>
  <div v-if="data.length !== 0">
    <ul>
      <li v-for="item in data" :key="item.id">
        <div
          :style="{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }"
        >
          <div class="li_left">
            <div
              v-if="item.isAuditState == 2"
              class="li_left_title"
              @click="
                $router.push({
                  path: '/mainNav/recipeDesc',
                  query: { id: item.id },
                })
              "
            >
              {{ item.recipeTitle }}
            </div>
            <div v-else class="li_left_title1">
              {{ item.recipeTitle }}
            </div>
            <div class="li_left_time">创建时间：{{ item.createTime }}</div>
          </div>
          <div class="li_right">
            <div
              class="li_right_a"
              @click="
                $router.push({
                  path: '/mainNav/addRecipe',
                  query: { id: item.id },
                })
              "
            >
              修改
            </div>
            <div class="li_right_a" @click="() => deleteRecipe(item.id)">
              删除
            </div>
          </div>
        </div>
      </li>
    </ul>
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
  <el-empty v-else :image-size="200"></el-empty>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: [],
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
    deleteRecipe: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style lang="less" scoped>
ul {
  padding: 10px 10px;
  li {
    padding: 10px 0;
    .li_left {
      width: 810px;
      .li_left_title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 18px;
        color: #2c2c2c;
        cursor: pointer;
        &:hover {
          color: #1890ff;
        }
      }
      .li_left_title1 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 18px;
        color: #2c2c2c;
      }
      .li_left_time {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 22px;
      }
    }
    .li_right {
      color: #1890ff;
      .li_right_a {
        display: inline-block;
        margin: 0 5px;
        cursor: pointer;
      }
    }
  }
}
</style>