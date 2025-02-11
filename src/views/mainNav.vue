<template>
  <div>
    <el-container>
      <el-header>
        <div class="header">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 100%;
            "
          >
            <img
              @click="$router.push('/mainNav')"
              style="
                height: 100%;
                position: relative;
                top: -10px;
                left: 5px;
                margin-right: 10px;
              "
              src="@/assets/img/title.png"
              alt=""
            />
            <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item index="/mainNav">总览 </el-menu-item>
              <el-menu-item index="/mainNav/foodMaterial"
                >食材展示
              </el-menu-item>
              <el-menu-item index="/mainNav/recipe">食谱展示</el-menu-item>
              <el-menu-item index="/mainNav/announcement"
                >通知公告</el-menu-item
              >
              <el-menu-item v-if="user.userRank === 1" index="/mainNav/menu"
                >系统管理</el-menu-item
              >
              <el-menu-item index="/mainNav/forum">交流论坛</el-menu-item>
            </el-menu>
          </div>
          <div style="display: flex; align-items: center">
            <el-badge :is-dot="isDot" class="item" style="margin-right: 20px">
              <i
                @click="$router.push('/mainNav/privateLetter'), (isDot = false)"
                style="cursor: pointer; font-size: 30px"
                class="el-icon-bell"
              ></i>
            </el-badge>

            <el-popover placement="top-start" width="200" trigger="hover">
              <i
                slot="reference"
                class="el-icon-edit"
                style="cursor: pointer; font-size: 30px; margin-right: 20px"
              ></i>
              <div class="popover">
                <el-button
                  type="text"
                  style="color: #000"
                  @click="$router.push('/mainNav/addRecipe')"
                  >写食谱</el-button
                >
                <el-divider></el-divider>
                <el-button
                  type="text"
                  style="color: #000"
                  @click="$router.push('/mainNav/addForum')"
                  >写论坛</el-button
                >
              </div>
            </el-popover>
            <el-popover placement="bottom" width="100" trigger="click">
              <img
                class="a"
                slot="reference"
                :src="user.image ? `/healthy/uploads/${user.image}` : tx"
                alt=""
              />
              <div class="popover">
                <span class="username">{{ user.username }}</span>
                <el-divider></el-divider>
                <el-button
                  type="text"
                  @click="$router.push('/mainNav/peopleCenter')"
                  >个人信息</el-button
                >
                <el-divider></el-divider>
                <el-button
                  type="text"
                  :style="{ color: 'red' }"
                  @click="deleteCookie"
                  >退出登录</el-button
                >
              </div>
            </el-popover>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="main">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
    <el-dialog :title="modelTitle" :visible.sync="dialogVisible" width="800">
      <div v-html="modleContent"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { removeCookie } from "../utils/auth";
import { getUser } from "../api/personCenter";
import {
  getSystemAnnouncementAlter,
  getSystemAnnouncementAlterRead,
} from "../api/system";
export let ws = null;
export default {
  data() {
    return {
      tx: require("@/assets/img/avaty.png"),
      activeIndex: "/mainNav",
      user: {},
      dialogVisible: false,
      modleContent: "",
      modelTitle: "",
      modelId: 0,
      isDot: false,
    };
  },
  methods: {
    handleSelect(index, indexPath) {
      if (this.$route.path === index) return;
      this.$router.push({ path: index });
    },
    deleteCookie() {
      removeCookie();
      this.$router.push("/login");
    },
    async userInfo() {
      try {
        let res = await getUser();
        this.user = res.data;
      } catch (e) {
        console.log(e);
      }
    },
    async getSystemAnnouncementAlterItem() {
      try {
        let res = await getSystemAnnouncementAlter();
        if (
          res.data.length === 0 ||
          res.data[0].isRead !== 0 ||
          res.data[0].isAlert !== 1
        )
          return;
        this.modleContent = res.data[0].content;
        this.modelTitle = res.data[0].title;
        this.modelId = res.data[0].id;
        this.dialogVisible = true;
        let r = await getSystemAnnouncementAlterRead(this.modelId);
      } catch (e) {
        console.log(e);
      }
    },
    initWebSocket() {
      let that = this;
      ws = new WebSocket(
        `ws:localhost:8000?id=${localStorage.getItem("userId")}`
      );
      ws.onopen = function () {
        console.log("localhost:8000，连接成功");
      };
      ws.onmessage = function (e) {
        let item = JSON.parse(e.data);
        if (item.code === 300) {
          const h = that.$createElement;
          that.$notify({
            title: "新消息",
            message: h(
              "i",
              { style: "color: red" },
              "您有一条新的私信请去私信中心查看"
            ),
          });
          that.isDot = true;
          that.$bus.$emit("getMessage", item);
        } else if (item.code === 301) {
          that.$bus.$emit("getMessage", item);
        }
      };
      ws.onclose = function (e) {
        console.log("close");
        that.reconnect();
      };
    },
    reconnect() {
      console.log("正在进行重连");
      let that = this;
      // 进行重连
      setTimeout(function () {
        that.initWebSocket();
      }, 1000);
    },
  },
  mounted() {
    this.userInfo();
    this.getSystemAnnouncementAlterItem();
    this.initWebSocket();
  },
};
</script>

<style scoped lang="less">
.header {
  height: 60px;
  background: rgb(255, 255, 255);
  box-shadow: rgb(0 0 0 / 20%) 0px 1px 8px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main {
  width: 1200px;
  margin: 0 auto;
}
div /deep/.el-header {
  padding: 0;
}
.a {
  margin-right: 50px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.popover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .username {
    text-align: center;
    padding: 12px 0;
    font-size: 16px;
    font-weight: 400;
  }
}
.el-button--text:hover {
  color: #409eff !important;
}
</style>