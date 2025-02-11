<template>
  <div>
    <div class="">
      <div class="common_item">
        <el-avatar
          :src="
            data.creatorLogo
              ? `/healthy/uploads/${data.creatorLogo}`
              : require('@/assets/img/avaty.png')
          "
        ></el-avatar>
        <div :style="{ marginLeft: '10px', flex: '1' }">
          <span class="common_item_title">{{ data.username }}</span>
          <span class="common_item_time">{{ data.createTime }}</span>
          <div class="common_item_desc">{{ data.replyMsg }}</div>
        </div>
      </div>
      <div class="common_img">
        <span :style="{ cursor: 'pointer' }">
          <img
            @click="like(data.isLike, isVis, data.id)"
            v-if="data.isLike"
            src="@/assets/img/zan.svg"
            alt=""
          />
          <img
            @click="like(data.isLike, isVis, data.id)"
            v-else
            src="@/assets/img/zanxiao.svg"
            alt=""
          />
          <span class="common_img_span">{{
            data.likeCount ? data.likeCount : 0
          }}</span>
        </span>
        <span
          v-if="isVis"
          :style="{
            cursor: 'pointer',
            marginLeft: '10px',
            display: 'flex',
            alignItems: 'center',
          }"
        >
          <img src="@/assets/img/pinglun.svg" alt="" />
          <span class="common_img_span" @click="open(data.id)">回复</span>
        </span>
      </div>
    </div>
    <div :style="{ marginLeft: '45px', marginTop: '15px' }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {},
      require: true,
    },
    open: {
      type: Function,
      require: true,
    },
    isVis: {
      type: Boolean,
      default: false,
      require: true,
    },
    like: {
      type: Function,
      require: true,
    },
  },
};
</script>

<style scoped lang="less">
.common {
  .common_item {
    display: flex;
    .common_item_title {
      font-size: 14px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
    }
    .common_item_time {
      color: #ccc;
      white-space: nowrap;
      cursor: auto;
      font-size: 13px;
      line-height: 18px;
      margin-left: 5px;
    }
    .common_item_desc {
      font-size: 15px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.65);
      margin-top: 5px;
    }
  }
  .common_img {
    margin-left: 50px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    img {
      width: 14px;
      height: 14px;
    }
    .common_img_span {
      font-size: 14px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-left: 5px;
    }
  }
}
</style>