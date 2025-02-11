<template>
  <div>
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }"
    >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/mainNav' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>通知公告</el-breadcrumb-item>
      </el-breadcrumb>
      <el-input
        placeholder="请输入公告名称"
        v-model="title"
        :style="{ width: '300px', marginLeft: '10px' }"
      >
        <el-button
          @click="() => getSystemAnnouncement()"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
    </div>
    <div class="cetent">
      <span :style="{ padding: '0 20px' }">全部公告</span>
      <el-divider></el-divider>
      <div v-if="data.length !== 0">
        <ul class="ul">
          <li v-for="item in data" :key="item.id">
            <div
              :style="{
                color: 'rgba(0, 0, 0, 0.45)',
                display: 'flex',
                alignItems: 'center',
              }"
            >
              <img
                :src="
                  item.image
                    ? `/healthy/uploads/${item.image}`
                    : require('@/assets/img/avaty.png')
                "
                alt=""
                :style="{ width: '30px', height: '30px', borderRadius: '50%' }"
              />
              <span :style="{ marginLeft: '10px' }">{{ item.username }}</span>
              <span :style="{ marginLeft: '20px' }"
                >创建时间：{{ item.createTime }}</span
              >
            </div>
            <div class="title" @click="handltiao(item.id)">
              {{ item.title }}
            </div>
            <div class="content">{{ item.content }}</div>
          </li>
        </ul>
        <el-pagination
          :style="{ textAlign: 'center', marginTop: '10px' }"
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
          :current="current"
          @current-change="getSystemAnnouncement"
        >
        </el-pagination>
      </div>

      <el-empty v-else :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import {
  getSystemAnnouncement,
  getSystemAnnouncementItemApi,
} from "../../api/system";
import { getContent } from "../../utils/gitlab";
export default {
  data() {
    return {
      pageSize: 6,
      total: 0,
      current: 1,
      data: [],
      title: "",
    };
  },
  methods: {
    async getSystemAnnouncement(current = 1) {
      let { pageSize, title } = this;
      let params = {
        pageNum: current,
        pageSize,
        title,
      };
      try {
        let res = await getSystemAnnouncement(params);
        let list = res.data.records.map((item, index) => {
          return {
            ...item,
            index: index + 1,
            isAlert: item.isAlert ? "是" : "否",
            content: getContent(item.content),
          };
        });
        console.log(list);
        this.data = list;
        this.total = res.data.total;
        this.current = current;
      } catch (e) {
        console.log(e);
      }
    },
    handltiao(id) {
      this.$router.push({ path: "/mainNav/announcementDesc", query: { id } });
    },
  },
  mounted() {
    this.getSystemAnnouncement();
  },
};
</script>

<style lang="less" scoped>
.cetent {
  margin: 20px 0;
  line-height: 20px;
  border-radius: 4px;
  background-color: #fff;
  color: #101010;
  font-size: 14px;
  box-shadow: 0px 1px 4px 0px rgb(0 0 0 / 15%);
  font-family: Roboto;
  padding: 30px 0;
}
.ul {
  list-style-type: none;
  li {
    padding: 10px 40px;
    border-bottom: 1px solid #e8e8e8;
    div {
      padding: 10px 0;
    }
    .title {
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
    .content {
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      cursor: pointer;
    }
  }
}
</style>