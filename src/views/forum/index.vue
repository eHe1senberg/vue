<template>
  <div class="content">
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }"
    >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/mainNav' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>交流论坛</el-breadcrumb-item>
      </el-breadcrumb>
      <el-input
        placeholder="请输入文章名称"
        v-model="title"
        :style="{ width: '300px', marginLeft: '10px' }"
      >
        <el-button
          @click="() => getForumList()"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
    </div>
    <div
      class="top"
      :style="is_more ? {} : { overflow: 'hidden', height: '40px' }"
    >
      <div class="top_div" ref="top_div">
        <span class="top_span">论坛标签：</span>
        <span
          v-for="(item, index) in lableList"
          :key="item.id"
          :style="
            select_index === index
              ? { color: '#409eff', cursor: 'pointer' }
              : { cursor: 'pointer' }
          "
          class="top_span"
          @click="handlLable(item, index)"
          >{{ item.lableName }}</span
        >
        <span
          @click="is_more = !is_more"
          v-if="is_textShow"
          class="top_more"
          style="color: #409eff; position: absolute; right: 10px; top: 0"
          >查看更多
          <i
            :class="is_more ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
          ></i>
        </span>
      </div>
    </div>
    <div class="cetent">
      <span :style="{ padding: '0 20px' }">{{
        lableList[select_index].lableName
      }}</span>
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
            <div
              class="title"
              v-pvForum="item.id"
              @click="
                $router.push({
                  path: '/mainNav/forumDesc',
                  query: { id: item.id },
                })
              "
            >
              {{ item.title }}
            </div>
            <div class="content">{{ item.content }}</div>
            <div
              style="
                font-size: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <i class="el-icon-chat-line-round"></i>
                <span style="margin-left: 5px">{{ item.commentNum }}</span>
                <i class="el-icon-view" style="margin-left: 15px"></i>
                <span style="margin-left: 5px">{{ item.viewNum }}</span>
              </div>
              <div style="color: #ccc">#{{ item.lableName }}</div>
            </div>
          </li>
        </ul>
        <el-pagination
          :style="{ textAlign: 'center', marginTop: '10px' }"
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
          :current="current"
          @current-change="getForumList"
        >
        </el-pagination>
      </div>

      <el-empty v-else :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import { getForumLable, getForumList } from "@/api/forum";
import { getContent } from "../../utils/gitlab";
export default {
  data() {
    return {
      is_more: false,
      is_textShow: false,
      select_index: 0,
      lableList: [{ id: null, lableName: "" }],
      data: [],
      pageSize: 6,
      total: 0,
      current: 1,
      title: "",
    };
  },
  methods: {
    getForumLableItem() {
      getForumLable().then((res) => {
        let item = {
          id: null,
          lableName: "全部",
        };
        res.data.unshift(item);
        this.lableList = res.data;
        this.getForumList();
      });
    },
    getTopDivHeight() {
      if (this.$refs.top_div.clientHeight > 40) {
        this.is_textShow = true;
      } else {
        this.is_textShow = false;
      }
    },
    handlLable(item, index) {
      if (this.select_index === index) return;
      this.select_index = index;
      this.getForumList();
    },
    getForumList(current = 1) {
      let { pageSize, title, select_index } = this;
      let params = {
        pageNum: current,
        pageSize,
        title,
        forumLableId: this.lableList[select_index].id,
      };
      getForumList(params).then((res) => {
        let list = res.data.records.map((item, index) => {
          return {
            ...item,
            content: getContent(item.content),
          };
        });
        this.data = list;
        this.total = res.data.total;
        this.current = current;
      });
    },
  },
  mounted() {
    this.getForumLableItem();
    this.$nextTick(() => {
      this.getTopDivHeight();
    });
  },
};
</script>

<style lang="less" scoped>
.top {
  margin-top: 20px;
  width: 1200px;
  line-height: 40px;
  border-radius: 4px;
  background-color: #fff;
  color: #101010;
  font-size: 14px;
  box-shadow: 0px 1px 4px 0px rgb(0 0 0 / 15%);
  font-family: Roboto;
  padding: 0 10px;
  position: relative;
}
.top_div {
  width: 1130px;
}
.top_span {
  margin-right: 10px;
}
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