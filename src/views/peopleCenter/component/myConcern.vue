<template>
  <div class="content">
    <div class="title">我的关注</div>
    <el-divider></el-divider>
    <div v-if="data.length !== 0">
      <el-row :style="{ padding: '0 50px 30px 50px' }">
        <el-col
          :span="12"
          v-for="(item, index) in data"
          :key="item.id"
          :style="
            index >= 2
              ? { marginTop: '50px', display: 'flex' }
              : { display: 'flex' }
          "
        >
          <img
            :style="{ width: '80px', height: '80px', borderRadius: '50%' }"
            :src="
              item.image
                ? `/healthy/uploads/${item.image}`
                : require('@/assets/img/avaty.png')
            "
            alt=""
          />
          <div :style="{ marginLeft: '25px' }">
            <h4 class="title_username">{{ item.username }}</h4>
            <el-button
              size="small"
              type="info"
              plain
              :style="{ marginTop: '20px' }"
              @click="removeUserConcernItem(item.id)"
              >取消关注</el-button
            >
          </div>
        </el-col>
      </el-row>
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
import { getMyConcern, addUserConcern } from "../../../api/personCenter";
export default {
  data() {
    return {
      data: [],
      pageSize: 6,
      total: 0,
      currentPage: 1,
    };
  },
  methods: {
    async getMyConcernItem(current = 1) {
      let params = {
        pageSize: this.pageSize,
        pageNum: current,
      };
      try {
        let res = await getMyConcern(params);
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
      this.getMyConcernItem(value);
    },
    async removeUserConcernItem(id) {
      let params = {
        toUserId: id,
        isConcern: 0,
      };
      try {
        let res = await addUserConcern(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "取消关注成功",
          });
        } else {
          this.$message.error("取消关注失败");
        }
        this.getMyConcernItem();
      } catch (e) {}
    },
  },
  mounted() {
    this.getMyConcernItem();
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
  .title_username {
    font-size: 18px;
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
}
</style>