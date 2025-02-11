<template>
  <div>
    <div class="content">
      <div :style="{ padding: '26px' }">
        <div class="content_title">{{ recipeDescItem.recipeTitle }}</div>
        <div
          :style="{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            marginTop: '5px',
          }"
        >
          <div>适用年龄：{{ recipeDescItem.isAge }}岁</div>
          <div class="content_time">{{ recipeDescItem.createTime }}</div>
        </div>
        <el-divider></el-divider>
        <div class="content_desc" v-html="recipeDescItem.recipeDesc"></div>
      </div>
    </div>
    <div :style="{ marginTop: '30px' }">
      <div class="step">
        <div :style="{ display: 'flex', alignItems: 'center' }">
          <img src="@/assets/img/mo.png" alt="" />
          <div class="step_title">
            {{ recipeDescItem.recipeTitle }}的做法步骤
          </div>
        </div>
        <div
          class="step_st"
          v-for="item in recipeDescItem.children"
          :key="item.id"
        >
          <img :src="`/healthy/uploads/${item.stepImage}`" alt="" />
          <div :style="{ marginLeft: '20px' }">
            <div class="step_id">{{ item.stepId }}</div>
            <div class="step_desc">{{ item.stepDesc }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="save" v-if="$route.query.isAuditState == 0">
      <el-button type="primary" size="small" @click="systemRecipePassItem(2)"
        >审核通过</el-button
      >
      <el-button type="danger" size="small" @click="systemRecipePassItem(1)"
        >审核不通过</el-button
      >
      <el-button size="small" @click="$router.push('/mainNav/menu/systemAudit')"
        >返回审核页</el-button
      >
    </div>
  </div>
</template>

<script>
import { getSystemRecipeDesc, systemRecipePass } from "../../api/system";
export default {
  data() {
    return {
      recipeDescItem: {},
    };
  },
  methods: {
    async getSystemRecipeDescItem() {
      let { id } = this.$route.query;
      try {
        let res = await getSystemRecipeDesc(id);
        this.recipeDescItem = res.data;
      } catch (e) {
        console.log(e);
      }
    },
    async systemRecipePassItem(isAuditState) {
      let { id } = this.$route.query;
      let params = {
        id,
        isAuditState,
      };
      try {
        let res = await systemRecipePass(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "审核成功",
          });
          this.$router.push("/mainNav/menu/systemAudit");
        } else {
          this.$message.console.error("审核失败");
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.getSystemRecipeDescItem();
  },
};
</script>

<style lang="less" scoped>
.cla {
  line-height: 20px;
  border-radius: 4px;
  background-color: #fff;
  color: #101010;
  font-size: 14px;
  box-shadow: 0px 1px 4px 0px rgb(0 0 0 / 15%);
  font-family: Roboto;
}
.content {
  margin-top: 30px;
  // width: 1200px;
  .cla;
  .content_title {
    // width: 1148px;
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
    margin-left: 10px;
  }
  .content_desc {
    width: 1157px;
    color: #626262;
    font-size: 16px;
    text-align: left;
    font-family: SourceHanSansSC-medium;
    img {
      cursor: auto !important;
    }
  }
}
.step {
  .cla;
  padding: 30px;
  margin-top: 30px;
  .step_title {
    color: #ff6767;
    font-size: 25px;
    margin-left: 10px;
  }
  .step_st {
    display: flex;
    margin-top: 30px;
    img {
      width: 300px;
      height: 200px;
    }
    .step_id {
      border: 1px solid #ddd;
      color: #999;
      border-radius: 50%;
      font-size: 16px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      width: 28px;
    }
    .step_desc {
      margin-top: 15px;
      font-size: 17px;
      font-weight: 500;
      width: 820px;
    }
  }
}
.save {
  .cla;
  padding: 30px;
  margin-top: 30px;
}
</style>