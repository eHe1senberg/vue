<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/mainNav' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/mainNav/recipe' }"
        >食谱</el-breadcrumb-item
      >
      <el-breadcrumb-item>食谱详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="16">
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
        <div class="common">
          <comment
            v-for="item in recipeDescItem.comment"
            :key="item.id"
            :data="item"
            :open="open"
            :is-vis="true"
            :like="like"
          >
            <span v-if="item.commentChildren && item.commentChildren.length">
              <comment
                v-for="item1 in item.commentChildren"
                :key="item1.id"
                :data="item1"
                :open="open"
                :isVis="false"
                :like="like"
              />
            </span>
          </comment>
        </div>
        <div class="write">
          <div class="write_title">写评论</div>
          <el-input
            type="textarea"
            rows="10"
            placeholder="你的评论是我最大的动力"
            v-model="textarea"
            maxlength="300"
          >
          </el-input>
          <el-button class="write_bu" @click="addCommentItem('write')"
            >发表评论</el-button
          >
        </div>
      </el-col>
      <el-col :span="8">
        <div class="right">
          <div class="right_content">
            <img
              :src="
                recipeDescItem.image
                  ? `/healthy/uploads/${recipeDescItem.image}`
                  : require('@/assets/img/avaty.png')
              "
              alt=""
            />
            <span class="right_content_title">{{
              recipeDescItem.username
            }}</span>
            <el-divider></el-divider>
            <div class="right_content_bottom">
              <div>
                <div class="right_content_bottom_number">
                  {{ userCount.recipeCount }}
                </div>
                <div class="right_content_bottom_wenz">发布</div>
              </div>
              <div>
                <div class="right_content_bottom_number">
                  {{ userCount.likeCount }}
                </div>
                <div class="right_content_bottom_wenz">点赞</div>
              </div>
              <div>
                <div class="right_content_bottom_number">
                  {{ userCount.collectCount }}
                </div>
                <div class="right_content_bottom_wenz">收藏</div>
              </div>
            </div>
            <el-button
              v-if="!userCount.isConcern"
              @click="addUserConcernItem"
              type="primary"
              round
              class="guan_button"
              >关注</el-button
            >
            <el-button
              v-else
              @click="addUserConcernItem"
              round
              class="guan_button"
              >取消关注</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="回复"
      :show-close="false"
      :visible.sync="dialogVisible"
      width="800"
      :destroy-on-close="true"
    >
      <el-input
        type="textarea"
        rows="10"
        placeholder="你的评论是我最大的动力"
        v-model="value"
        maxlength="300"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlOk">确 定</el-button>
      </span>
    </el-dialog>

    <div class="tool">
      <div class="top">
        <img
          @click="addCollectItem"
          class="img1"
          :src="
            count.isCollect
              ? require('@/assets/img/shoucangxuanzhong.svg')
              : require('@/assets/img/shoucang.svg')
          "
          alt=""
        />
      </div>
      <div class="bottom">
        <span>{{ count.collectNum }}</span>
      </div>
      <div class="top" :style="{ marginTop: '10px' }">
        <img
          @click="addLikeItem"
          class="img1"
          :src="
            count.isLike
              ? require('@/assets/img/zan.svg')
              : require('@/assets/img/zanxiao.svg')
          "
          alt=""
        />
      </div>
      <div class="bottom">
        <span>{{ count.likeNum }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getRecipeDesc,
  addComment,
  addCommentLike,
  getRecipeNum,
  addLike,
  addCollect,
  getUserInfo,
} from "../../api/recipe";
import { addUserConcern } from "../../api/personCenter";
import Comment from "./components/common.vue";
export default {
  components: {
    Comment,
  },
  data() {
    return {
      recipeDescItem: {},
      textarea: "",
      value: "",
      dialogVisible: false,
      commentId: 0,
      count: {},
      userCount: {},
    };
  },
  methods: {
    async getRecipeDescItem() {
      let { id } = this.$route.query;
      try {
        let res = await getRecipeDesc(id);
        this.recipeDescItem = res.data;
        this.getUserInfoItem(res.data.authorId);
      } catch (e) {
        console.log(e);
      }
    },
    async addCommentItem(type = "write", pid = 0) {
      if (!this.textarea && type === "write") {
        this.$message.error("请输入评论");
        return;
      }
      if (!this.value && type === "reply") {
        this.$message.error("请输入回复");
        return;
      }
      let params = {
        replyMsg: pid ? this.value : this.textarea,
        recipeId: this.$route.query.id,
        pid: pid,
      };
      try {
        let res = await addComment(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: pid ? "回复成功" : "评论成功",
          });
        } else {
          this.$message.error(pid ? "回复失败" : "评论失败");
        }
        this.getRecipeDescItem();
        this.textarea = "";
        this.value = "";
      } catch (e) {
        console.log(e);
      }
    },
    open(value) {
      this.dialogVisible = true;
      this.commentId = value;
    },
    handlOk() {
      this.addCommentItem("reply", this.commentId);
      this.dialogVisible = false;
    },
    async like(isLike, isComment, pid) {
      let params = {
        isLike: isLike == 1 ? 0 : 1,
        isComment,
        pid,
      };
      try {
        let res = await addCommentLike(params);
        this.getRecipeDescItem();
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: isLike ? "取消点赞成功" : "点赞成功",
          });
          return;
        }
        this.$message.error(isLike ? "取消点赞失败" : "点赞失败");
      } catch (e) {
        console.log(e);
      }
    },
    async getRecipeNumItem() {
      let { id } = this.$route.query;
      try {
        let res = await getRecipeNum(id);
        this.count = res.data;
      } catch (e) {
        console.log(e);
      }
    },
    async addLikeItem() {
      let { id } = this.$route.query;
      let params = {
        isLike: this.count.isLike ? 0 : 1,
        id: id,
      };
      try {
        let res = await addLike(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: this.count.isLike ? "食谱取消点赞成功" : "食谱点赞成功",
          });
        } else {
          this.$message.error(
            this.count.isLike ? "食谱取消点赞失败" : "食谱点赞失败"
          );
        }
        this.getRecipeNumItem();
        this.getUserInfoItem(this.recipeDescItem.authorId);
      } catch (e) {
        console.log(e);
      }
    },
    async addCollectItem() {
      let { id } = this.$route.query;
      let params = {
        isCollect: this.count.isCollect ? 0 : 1,
        id: id,
      };
      try {
        let res = await addCollect(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: this.count.isCollect ? "食谱取消收藏成功" : "食谱收藏成功",
          });
        } else {
          this.$message.error(
            this.count.isCollect ? "食谱取消收藏失败" : "食谱收藏失败"
          );
        }
        this.getRecipeNumItem();
        this.getUserInfoItem(this.recipeDescItem.authorId);
      } catch (e) {
        console.log(e);
      }
    },
    async getUserInfoItem(id) {
      try {
        let res = await getUserInfo(id);
        if ((res.code = 200)) {
          this.userCount = res.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async addUserConcernItem() {
      let params = {
        toUserId: this.recipeDescItem.authorId,
        isConcern: this.userCount.isConcern ? 0 : 1,
      };
      try {
        let res = await addUserConcern(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: this.userCount.isConcern ? "取消关注成功" : "关注成功",
          });
        } else {
          this.$message.error(res.message);
        }
        this.getUserInfoItem(this.recipeDescItem.authorId);
      } catch (e) {}
    },
  },
  mounted() {
    this.getRecipeDescItem();
    this.getRecipeNumItem();
  },
};
</script>

<style scoped lang="less">
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
    // width: 1157px;
    color: #626262;
    font-size: 16px;
    text-align: left;
    font-family: SourceHanSansSC-medium;
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
      width: 200px;
      height: 150px;
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
      width: 510px;
    }
  }
}
.common {
  .cla;
  padding: 30px;
  margin-top: 30px;
}
.write {
  .cla;
  padding: 30px;
  margin-top: 30px;
  overflow: hidden;
  .write_title {
    color: #101010;
    font-size: 16px;
    font-family: SourceHanSansSC-regular;
    margin-bottom: 10px;
  }
  /deep/.el-textarea__inner {
    line-height: 20px;
    border-radius: 4px;
    background-color: #f6f6f6;
    color: #888;
    font-size: 14px;
    text-align: left;
    font-family: Microsoft Yahei;
    resize: none;
  }
  .write_bu {
    margin: 20px 0;
    float: right;
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
    text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
    -webkit-box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
    box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
  }
}
.tool {
  position: fixed;
  left: calc((100vw - 1200px) / 4);
  top: 200px;
  .top {
    width: 48px;
    height: 48px;
    line-height: 55px;
    background-color: rgba(255, 255, 255, 1);
    text-align: center;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    cursor: pointer;
    .img1 {
      width: 22px;
      height: 22px;
    }
  }
  .bottom {
    width: 48px;
    height: 22px;
    line-height: 22px;
    border-radius: 9px;
    background-color: rgba(226, 226, 226, 1);
    color: rgba(16, 16, 16, 1);
    font-size: 12px;
    text-align: center;
    font-family: Roboto;
    position: relative;
    top: -10px;
  }
}
.right {
  margin-top: 30px;
  min-height: 247px;
  line-height: 20px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  .right_content {
    padding: 20px 30px;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    .right_content_title {
      color: rgba(85, 86, 102, 1);
      font-size: 16px;
      text-align: left;
      font-family: SourceHanSansSC-regular;
      margin-left: 20px;
      position: relative;
      top: -30px;
    }
    .right_content_bottom {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .right_content_bottom_number {
        color: rgba(85, 86, 102, 1);
        font-size: 18px;
        text-align: center;
        font-family: SourceHanSansSC-regular;
      }
      .right_content_bottom_wenz {
        color: rgba(128, 128, 128, 1);
        font-size: 16px;
        text-align: center;
        font-family: SourceHanSansSC-regular;
        margin-top: 5px;
      }
    }
    .guan_button {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>