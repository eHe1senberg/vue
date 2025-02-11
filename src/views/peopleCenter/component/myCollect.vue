<template>
  <div class="content">
    <div class="title">我的收藏</div>
    <el-divider></el-divider>
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
              <div class="li_left_time">创建时间：{{ item.createTime }}</div>
            </div>
            <div class="li_right">
              <div class="li_right_a" @click="addCollectItem(item.id)">
                取消收藏
              </div>
            </div>
          </div>
        </li>
      </ul>
      <el-pagination
        :style="{ textAlign: 'center', marginTop: '10px' }"
        layout="prev, pager, next"
        background
        :total="total"
        :current-page="currentPage"
        @current-change="currentChange"
        :page-size="pageSize"
      >
      </el-pagination>
    </div>
    <el-empty v-else :image-size="200"></el-empty>
  </div>
</template>

<script>
import { getMyCollect } from "../../../api/personCenter";
import { addCollect } from "../../../api/recipe";
export default {
  data() {
    return {
      data: [],
      pageSize: 7,
      total: 0,
      currentPage: 1,
    };
  },
  methods: {
    async getMyCollectItem(current = 1) {
      let params = {
        pageSize: this.pageSize,
        pageNum: current,
      };
      try {
        let res = await getMyCollect(params);
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
      this.getMyCollectItem(value);
    },
    async addCollectItem(id) {
      let params = {
        isCollect: 0,
        id: id,
      };
      try {
        let res = await addCollect(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "食谱取消收藏成功",
          });
        } else {
          this.$message.error("食谱取消收藏失败");
        }
        this.getMyCollectItem();
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.getMyCollectItem();
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 8px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 10%);
  width: 100%;
  display: block;

  .title {
    font-size: 16px;
    color: rgb(102, 102, 102);
    padding: 0 10px;
    margin-top: 15px;
  }
  ul {
    padding: 10px 10px;
    list-style: none;
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
}
/deep/.el-empty {
  width: 100%;
}
</style>