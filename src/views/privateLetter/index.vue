<template>
  <div class="content">
    <div class="left">
      <div
        v-for="(item, index) in userList"
        :key="item.id"
        class="left_item"
        @click="handlClickIndex(item, index + 1)"
        :style="
          clickIndex === index + 1
            ? { background: '#E6F7FF', color: '#1890ff' }
            : {}
        "
      >
        {{ item.username }}
      </div>
    </div>
    <div class="right" v-if="clickIndex">
      <div class="username">{{ userList[clickIndex - 1].username }}</div>
      <el-divider />
      <div class="ulDiv" id="ulDiv">
        <ul class="ul">
          <li class="li" v-for="item in messageList" :key="item.id">
            <img
              :class="
                localStorage.getItem('userId') == item.senderId
                  ? 'imgRight'
                  : 'imgLeft'
              "
              :src="
                item.image
                  ? `/healthy/uploads/${item.image}`
                  : require('@/assets/img/avaty.png')
              "
            />
            <div
              :class="
                localStorage.getItem('userId') == item.senderId
                  ? 'sayRight'
                  : 'sayLeft'
              "
            >
              {{ item.content }}
            </div>
          </li>
        </ul>
      </div>
      <el-input
        style="margin-top: 10px"
        type="textarea"
        placeholder="请输入内容"
        v-model="value"
        :autosize="{ minRows: 4, maxRows: 4 }"
      >
      </el-input>
      <el-button class="button" type="primary" @click="sendMessage"
        >发送</el-button
      >
    </div>
    <div v-else>
      <el-empty description="暂无数据"></el-empty>
    </div>
  </div>
</template>

<script>
import { ws } from "../mainNav.vue";
import { getChatUser, getChat } from "../../api/forum";
import { scrollToAnchor } from "../../utils/gitlab";
export default {
  data() {
    return {
      clickIndex: 0,
      value: "",
      userList: [],
      messageList: [],
      localStorage: localStorage,
    };
  },
  methods: {
    findUser(arr) {},
    handlClickIndex(item, index) {
      if (this.clickIndex === index) return;
      this.clickIndex = index;
      this.value = "";
      this.$router.replace({
        path: "/mainNav/privateLetter",
        query: { userId: this.userList[this.clickIndex - 1].userId },
      });
      this.getChat();
    },
    getChatUser() {
      getChatUser().then((res) => {
        this.userList = res.data;
        if (this.$route.query.userId) {
          let i = this.userList.findIndex(
            (item) => item.userId == this.$route.query.userId
          );
          if (i === -1) return;
          this.clickIndex = i + 1;
          this.getChat();
        }
      });
    },
    getChat() {
      let params = {
        userId: this.userList[this.clickIndex - 1].userId,
      };
      getChat(params).then((res) => {
        this.messageList = res.data;
        this.$nextTick(() => {
          let div = document.querySelector("#ulDiv");
          div.scrollTop = div.scrollHeight;
        });
      });
    },
    bugs() {
      let that = this;
      this.$bus.$on("getMessage", ({ code, senderId }) => {
        //如果我是接收方
        if (code === 300) {
          //更新用户列表
          that.getChatUser();
          //如果我在当前用户聊天框  更新消息列表
          if (
            that.clickIndex !== 0 &&
            that.userList[that.clickIndex - 1].userId == senderId
          ) {
            that.getChat();
          }
        } else if (code === 301) {
          that.getChat();
        }
      });
    },
    sendMessage() {
      if (!this.value) return this.$message.error("发送内容不能为空");
      let item = {
        senderId: this.localStorage.getItem("userId"),
        receiver: this.userList[this.clickIndex - 1].userId,
        content: this.value,
      };
      ws.send(JSON.stringify(item));
      this.value = "";
    },
  },
  mounted() {
    this.getChatUser();
    this.bugs();
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 1050px;
  margin: 0 auto;
  background-color: #fff;
  overflow: hidden;
  height: 750px;
  box-shadow: 0px 1px 4px 0px rgb(0 0 0 / 15%);
  .left {
    width: 200px;
    padding: 20px 0;
    float: left;
    overflow-y: auto;
    overflow-x: hidden;
    height: 750px;

    .left_item {
      width: 200px;
      font-size: 18px;
      height: 50px;
      line-height: 50px;
      font-weight: 500;
      cursor: pointer;
      padding-left: 20px;

      &:hover {
        color: #1890ff;
      }
    }
  }
  .right {
    float: left;
    padding: 20px;
    width: 800px;

    .username {
      font-size: 25px;
      font-weight: 600;
    }

    .ulDiv {
      margin: 0 -20px;
      height: 450px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        opacity: 0.2;
      }

      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
      }

      border-bottom: 1px #ccc solid;

      .ul {
        list-style-type: none;
        padding: 0 20px;

        .li {
          margin-bottom: 10px;
          overflow: hidden;

          .imgLeft {
            width: 40px;
            float: left;
          }

          .sayLeft {
            margin-left: 5px;
            background-color: #12b7f5;
            color: #fff;
            line-height: 30px;
            padding: 5px;
            max-width: 550px;
            border-radius: 5px;
            float: left;
            word-wrap: break-word;
            word-break: break-word;
          }

          .say::after {
            clear: both;
          }

          .imgRight {
            width: 40px;
            float: right;
          }

          .sayRight {
            margin-right: 5px;
            background-color: #12b7f5;
            color: #fff;
            line-height: 30px;
            padding: 5px;
            max-width: 550px;
            border-radius: 5px;
            float: right;
            word-wrap: break-word;
            word-break: break-word;
          }

          .say1::after {
            clear: both;
          }
        }
      }
    }
    /deep/.el-textarea__inner {
      resize: none;
      border: none;
      font-size: 18px;
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        opacity: 0.5;
      }

      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
      }

      &:focus {
        border: 0px !important;
        box-shadow: none;
      }
    }
    .button {
      margin-top: 10px;
      float: right;
    }
  }
}
</style>