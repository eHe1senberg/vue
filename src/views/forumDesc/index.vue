<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/mainNav' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/mainNav/forum' }">交流论坛</el-breadcrumb-item>
      <el-breadcrumb-item>论坛详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div style="
          font-size: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
          line-height: 50px;
        ">
        <span>{{ data?.title }}</span>
        <span style="color: #409eff; cursor: pointer" @click="scrollToAnchor('write')">回复</span>
      </div>
      <el-divider></el-divider>
      <div class="father">
        <div class="left">
          <img class="img" :src="data.image
              ? `/healthy/uploads/${data.image}`
              : require('@/assets/img/avaty.png')
            " alt="" />
          <el-popover width="100" trigger="hover" placement="bottom">
            <div slot="reference" class="username">{{ data.username }}</div>
            <div class="popover">
              <el-button @click="privateLetter(data.userId)" type="text" :style="{ color: 'red' }">私信</el-button>
            </div>
          </el-popover>
          <img class="label" src="@/assets/img/top.png" />
        </div>
        <div class="right">
          <div class="right_content" v-html="data.content"></div>
          <div class="bottom">
            <span class="span">1楼</span>
            <span class="span">{{ data.createTime }}</span>
            <span @click="scrollToAnchor('write')" class="span" style="color: #2d64b3; cursor: pointer">回复</span>
          </div>
        </div>
      </div>

      <!-- 楼下 -->
      <div v-for="(item, index) in data.comment" :key="item.id">
        <el-divider></el-divider>
        <div class="father">
          <div class="left">
            <img class="img" :src="item.image
                ? `/healthy/uploads/${item.image}`
                : require('@/assets/img/avaty.png')
              " alt="" />
            <el-popover width="100" trigger="hover" placement="bottom">
              <div slot="reference" class="username">{{ item.username }}</div>
              <div class="popover">
                <el-button @click="privateLetter(item.userId)" type="text" :style="{ color: 'red' }">私信</el-button>
              </div>
            </el-popover>
            <img v-if="item.userId === data.userId" class="label" src="@/assets/img/top.png" />
          </div>
          <div class="right">
            <div class="right_content" v-html="item.replyMsg"></div>
            <div class="bottom">
              <span class="span">{{ index + 2 }}楼</span>
              <span class="span">{{ item.createDate }}</span>
              <span @click="item.comment = !item.comment" v-if="!item.comment" class="span"
                style="color: #2d64b3; cursor: pointer">回复({{ item.children.length }})</span>
              <span @click="item.comment = !item.comment" v-else class="span"
                style="color: #2d64b3; cursor: pointer">收起回复</span>
              <div class="right_comment" :style="!item.comment ? { display: 'none' } : {}">
                <ul class="ul">
                  <li class="li" v-for="json in item.children" :key="json.id">
                    <img class="cooment_img" :src="json.image
                        ? `/healthy/uploads/${json.image}`
                        : require('@/assets/img/avaty.png')
                      " />
                    <div>
                      <div style="margin-left: 50px">
                        <span style="font-size: 14px; color: #409eff">{{ json.username }}：</span>
                        <span>{{ json.replyMsg }}</span>
                      </div>
                      <div style="text-align: right">
                        <span>{{ json.createDate }}</span>
                        <span class="span" style="
                            margin-left: 10px;
                            color: #2d64b3;
                            cursor: pointer;
                          " @click="
                            (dialogVisible = true),
                            (value = `回复 ${json.username}：`),
                            (commentId = item.id)
                            ">回复</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <el-button @click="
                  (dialogVisible = true), (value = ''), (commentId = item.id)
                  " type="primary">回复层主</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="write" id="write">
      <div class="write_title">发表回复</div>
      <el-input type="textarea" rows="10" placeholder="你的评论是我最大的动力" v-model="textarea" maxlength="300">
      </el-input>
      <el-button class="write_bu" @click="addCommentItem('write')">发表评论</el-button>
    </div>
    <el-dialog title="回复" :show-close="false" :visible.sync="dialogVisible" width="800" :destroy-on-close="true">
      <el-input type="textarea" rows="10" placeholder="你的评论是我最大的动力" v-model="value" maxlength="300">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { scrollToAnchor } from "../../utils/gitlab";
import { addForumComment, getForumInfo, addChatUser } from "../../api/forum";
export default {
  data() {
    return {
      dialogVisible: false,
      value: "",
      textarea: "",
      data: {},
      commentId: 0,
    };
  },
  methods: {
    scrollToAnchor(write) {
      scrollToAnchor(write);
    },
    getForumInfo() {
      let params = {
        id: this.$route.query.id,
      };
      getForumInfo(params).then((res) => {
        this.data = res.data;
      });
    },
    async addCommentItem(type = "write", pid = 0) {
      if (!this.textarea && type === "write") {
        this.$message.error("请输入评论");
        return;
      }

      let params = {
        replyMsg: pid ? this.value : this.textarea,
        forumId: this.$route.query.id,
        pid: pid,
      };
      try {
        let res = await addForumComment(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: pid ? "回复成功" : "评论成功",
          });
        } else {
          this.$message.error(pid ? "回复失败" : "评论失败");
        }
        this.getForumInfo();
        this.textarea = "";
        this.value = "";
      } catch (e) {
        console.log(e);
      }
    },
    handlOk() {
      if (!this.value) {
        this.$message.error("请输入回复");
        return;
      }
      this.addCommentItem("reply", this.commentId);

      this.dialogVisible = false;
    },
    privateLetter(userId) {
      if (userId == localStorage.getItem("userId")) {
        return this.$message.error("自己不能私信自己");
      }
      let params = {
        chatUserId: userId,
      };
      addChatUser(params);
      setTimeout(() => {
        this.$router.push({
          path: "/mainNav/privateLetter",
          query: { userId },
        });
      }, 500);
    },
  },
  mounted() {
    this.getForumInfo();
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
  margin-top: 20px;
  width: 1200px;
  line-height: 40px;
  border-radius: 4px;
  background-color: #fff;
  color: #101010;
  font-size: 14px;
  box-shadow: 0px 1px 4px 0px rgb(0 0 0 / 15%);
  font-family: Roboto;
  //   padding: 0 10px;
  position: relative;
}

/deep/.el-divider--horizontal {
  margin: 2px 0;
}

.father {
  min-height: 300px;
  display: flex;

  .left {
    width: 250px;
    background: #fafbfc;
    text-align: center;
    padding-top: 30px;
    position: relative;

    .img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    .username {
      font-size: 20px;
      cursor: pointer;

      &:hover {
        color: #409eff;
        text-decoration: underline;
      }
    }

    .label {
      position: absolute;
      right: 0;
      top: 0;
      width: 60px;
      height: 60px;
      cursor: auto !important;
    }
  }

  .right {
    flex: 1;

    .right_content {
      padding: 30px 30px 20px 30px;
      font-size: 17px;
      min-height: 190px;
    }

    .bottom {
      padding: 0 30px 20px 30px;
      text-align: right;
      color: #999;
      font-size: 15px;

      .span {
        margin-right: 10px;
      }

      .right_comment {
        background: #f7f8fa;
        border: 1px solid #f0f1f2;

        .ul {
          text-align: left;
          padding: 15px;

          .li {
            line-height: 20px;
            overflow: hidden;
            font-size: 17px;
            margin-bottom: 20px;

            .cooment_img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              float: left;
            }
          }
        }
      }
    }
  }
}

.popover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
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
</style>