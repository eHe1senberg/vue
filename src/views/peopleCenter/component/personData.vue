<template>
  <div>
    <div class="top">
      <div class="top_content">
        <div :style="{ display: 'flex' }">
          <img
            class="avatar"
            :src="
              user.userInfo.image
                ? `/healthy/uploads/${user.userInfo.image}`
                : require('@/assets/img/avaty.png')
            "
            alt=""
            :style="{ borderRadius: '50%' }"
          />
          <div :style="{ marginLeft: '20px' }">
            <div class="top_content_title">
              {{ user.userInfo.username }}
              <el-tag>{{
                user.userInfo.userRank ? "管理员" : "普通成员"
              }}</el-tag>
            </div>
            <div :style="{ marginTop: '10px' }">
              <i
                class="el-icon-phone"
                :style="{ width: '14px', height: '14px' }"
              ></i>
              <span :style="{ marginLeft: '5px' }">{{
                user.userInfo.phone
              }}</span>
            </div>
          </div>
        </div>
        <div :style="{ display: 'flex' }">
          <div class="top_content_right">
            <div class="top_content_right_number">{{ user.recipeCount }}</div>
            <div class="top_content_right_name">我的发布</div>
          </div>
          <div class="top_content_right">
            <div class="top_content_right_number">{{ user.fromMy }}</div>
            <div class="top_content_right_name">我的关注</div>
          </div>
          <div class="top_content_right">
            <div class="top_content_right_number">{{ user.toMy }}</div>
            <div class="top_content_right_name">我的粉丝</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom_top">基础信息</div>
      <el-divider></el-divider>
      <div class="bottom_row1">
        <span class="bottom_row1_tilte">用户名：</span>
        <span>{{ user.userInfo.username }}</span>
      </div>
      <div class="bottom_row1" :style="{ background: '#f7f7f7' }">
        <span class="bottom_row1_tilte">手机号：</span>
        <span>{{ user.userInfo.phone }}</span>
      </div>
      <div class="bottom_row1">
        <span class="bottom_row1_tilte">角色：</span>
        <span>{{ user.userInfo.userRank ? "管理员" : "普通成员" }}</span>
      </div>
      <div class="bottom_row2" :style="{ background: '#f7f7f7' }">
        <span class="bottom_row2_tilte">我发布的：</span>
        <span
          class="bottom_row2_desc"
          v-for="(item, index) in user.recipe"
          :key="index"
          >{{ item.recipeTitle + "," }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from "../../../api/personCenter";
export default {
  data() {
    return {
      user: {
        userInfo: {},
      },
    };
  },
  methods: {
    async getUserInfoItem() {
      try {
        let res = await getUserInfo();
        this.user = res.data;
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.getUserInfoItem();
  },
};
</script>

<style lang="less" scoped>
.top {
  height: 200px;
  margin: auto 0;
  box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 10%);
  background-color: #fff;
  .top_content {
    padding: 40px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .avatar {
      width: 94px;
      height: 94px;
    }
    .top_content_title {
      font-size: 20px;
      color: rgb(51, 51, 51);
    }
    .top_content_right {
      padding: 0 5px;
      .top_content_right_number {
        font-size: 20px;
        color: #f7a02b;
      }
    }
  }
}
.bottom {
  padding: 24px 23px;
  height: 436px;
  box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 10%);
  margin-top: 10px;
  background-color: #fff;
  .bottom_top {
    font-size: 16px;
  }
  .bottom_row1 {
    padding: 10px 2px;
    span {
      font-size: 16px;
    }
    .bottom_row1_tilte {
      display: inline-block;
      width: 100px;
      text-align: right;
      color: #101010;
    }
  }
  .bottom_row2 {
    padding: 10px 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    max-height: 60px;

    span {
      font-size: 16px;
    }
    .bottom_row2_tilte {
      display: inline-block;
      width: 100px;
      text-align: right;
      color: #101010;
    }
    .bottom_row2_desc {
      display: inline-block;
      margin-right: 10px;
    }
  }
}
/deep/.el-tag {
  border-radius: 30px;
}
</style>