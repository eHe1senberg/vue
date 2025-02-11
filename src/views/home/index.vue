<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-carousel height="373px">
          <span v-if="rotograph.length">
            <el-carousel-item v-for="item in rotograph" :key="item.id">
              <img
                @click="
                  $router.push({
                    path: '/mainNav/recipeDesc',
                    query: { id: item.id },
                  })
                "
                :style="{ width: '100%', height: '100%' }"
                :src="`/healthy/uploads/${item.image}`"
                alt=""
              />
            </el-carousel-item>
          </span>
          <span v-else>
            <el-carousel-item>
              <img
                :style="{ width: '100%', height: '100%' }"
                :src="require('@/assets/img/hb.jpg')"
                alt=""
              />
            </el-carousel-item>
          </span>
        </el-carousel>
      </el-col>
      <el-col :span="8">
        <div class="time_card">
          <el-calendar>
            <template slot="dateCell" slot-scope="data">
              <p :class="data.data.isSelected ? 'is-selected' : ''">
                {{ data.data.day.split("-").slice(2).join("") }}
              </p>
            </template>
          </el-calendar>
        </div>
      </el-col>
    </el-row>
    <div :style="{ marginTop: '50px' }">
      <div
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          alignItem: 'center',
        }"
      >
        <span class="hot_foodMaterial">热门食材</span>
        <div class="more" @click="$router.push('/mainNav/foodMaterial')">
          <span>查看更多</span>
          <i class="el-icon-arrow-right" />
        </div>
      </div>
      <!-- 大 -->
      <el-row :gutter="20" :style="{ marginTop: '25px', height: '300px' }">
        <el-col :span="8" v-if="recommendedIngredients.length !== 0">
          <el-card
            :body-style="{ padding: '0px', height: '300px' }"
            shadow="hover"
          >
            <img
              :style="{ width: '100%', height: '194px' }"
              :src="`/healthy/uploads/${recommendedIngredients[0].image}`"
              class="image"
            />
            <div
              class="title"
              @click="
                $router.push({
                  path: '/mainNav/foodMaterialDesc',
                  query: {
                    id: recommendedIngredients[0].id,
                  },
                })
              "
            >
              {{ recommendedIngredients[0].foodMaterialTitle }}
            </div>
            <div class="desc">
              {{ recommendedIngredients[0].foodMaterialDesc }}
            </div>
          </el-card>
        </el-col>
        <!-- 小 -->
        <el-col :span="16" v-if="recommendedIngredients.length > 1">
          <el-row :gutter="20">
            <div v-for="(item, index) in recommendedIngredients" :key="item.id">
              <el-col
                v-if="index !== 0"
                :span="12"
                :style="index >= 3 ? { marginTop: '20px' } : {}"
              >
                <el-card
                  :body-style="{
                    padding: '0px',
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                  }"
                  shadow="hover"
                >
                  <img
                    :style="{
                      width: '100px',
                      height: '100px',
                      paddingLeft: '14px',
                    }"
                    :src="`/healthy/uploads/${item.image}`"
                    class="image"
                  />
                  <div>
                    <div
                      class="title"
                      @click="
                        $router.push({
                          path: '/mainNav/foodMaterialDesc',
                          query: {
                            id: item.id,
                          },
                        })
                      "
                    >
                      {{ item.foodMaterialTitle }}
                    </div>
                    <div class="desc">
                      {{ item.foodMaterialDesc }}
                    </div>
                  </div>
                </el-card>
              </el-col>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div :style="{ marginTop: '50px', marginBottom: '400px' }">
      <div
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          alignItem: 'center',
        }"
      >
        <span class="hot_foodMaterial">热门食谱</span>
        <div class="more" @click="$router.push('/mainNav/recipe')">
          <span>查看更多</span>
          <i class="el-icon-arrow-right" />
        </div>
      </div>
      <!-- 大 -->
      <el-row :gutter="20" :style="{ marginTop: '25px', height: '300px' }">
        <el-col :span="8" v-if="recommendedRecipe.length !== 0">
          <el-card
            :body-style="{ padding: '0px', height: '300px' }"
            shadow="hover"
          >
            <img
              :style="{ width: '100%', height: '194px' }"
              :src="`/healthy/uploads/${recommendedRecipe[0].image}`"
              class="image"
            />
            <div
              v-pvRecipe="recommendedRecipe[0].isAge"
              class="title"
              @click="
                $router.push({
                  path: '/mainNav/recipeDesc',
                  query: {
                    id: recommendedRecipe[0].id,
                  },
                })
              "
            >
              {{ recommendedRecipe[0].recipeTitle }}
            </div>
            <div class="desc">
              {{ recommendedRecipe[0].recipeDesc }}
            </div>
          </el-card>
        </el-col>
        <!-- 小 -->
        <el-col :span="16" v-if="recommendedRecipe.length > 1">
          <el-row :gutter="20">
            <div v-for="(item, index) in recommendedRecipe" :key="item.id">
              <el-col
                :span="12"
                v-if="index !== 0"
                :style="index >= 3 ? { marginTop: '20px' } : {}"
              >
                <el-card
                  :body-style="{
                    padding: '0px',
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                  }"
                  shadow="hover"
                >
                  <img
                    :style="{
                      width: '100px',
                      height: '100px',
                      paddingLeft: '14px',
                    }"
                    :src="`/healthy/uploads/${item.image}`"
                    class="image"
                  />
                  <div>
                    <div
                      v-pvRecipe="item.isAge"
                      class="title"
                      @click="
                        $router.push({
                          path: '/mainNav/recipeDesc',
                          query: {
                            id: item.id,
                          },
                        })
                      "
                    >
                      {{ item.recipeTitle }}
                    </div>
                    <div class="desc">
                      {{ item.recipeDesc }}
                    </div>
                  </div>
                </el-card>
              </el-col>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="foot">
      <div>
        <p class="p">关于我们</p>
        <div :style="{ marginTop: '30px' }">
          <p class="p">贡献者</p>
          <p class="p">支持与服务</p>
          <p class="p">
            <i class="el-icon-s-custom" :style="{ marginRight: '10px' }" />xxx
          </p>
          <p class="p">
            <i
              class="el-icon-notebook-1"
              :style="{ marginRight: '10px' }"
            />88888888@qq.com
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getRotograph,
  getRecommendedIngredients,
  getRecommendedRecipe,
} from "../../api/home";
export default {
  data() {
    
    return {
      rotograph: [],
      recommendedIngredients: [],
      recommendedRecipe: [],
    };

  },
  methods: {
    async getRotographItem() {
      try {
        let res = await getRotograph();
        this.rotograph = res.data;
      } catch (err) {
        console.log(err);
      }
    },
    async getRecommendedIngredientsItem() {
      try {
        let res = await getRecommendedIngredients();
        this.recommendedIngredients = res.data;
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    },
    async getRecommendedRecipeItem() {
      try {
        let res = await getRecommendedRecipe();
        this.recommendedRecipe = res.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getRotographItem();
    this.getRecommendedIngredientsItem();
    this.getRecommendedRecipeItem();
  },
};
</script>

<style scoped lang="less">
.time_card {
  background-color: rgb(255, 255, 255);
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
.hot_foodMaterial {
  text-align: left;
  font-size: 24px;
}
.more {
  color: rgb(27, 154, 238);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
}

div /deep/.el-calendar-table .el-calendar-day {
  height: 38px;
}
div /deep/.el-calendar-table tr td:first-child {
  border-left: 0;
}
div /deep/.el-calendar-table tr:first-child td {
  border-top: 0;
}
div /deep/.el-calendar-table td {
  border-bottom: 0;
  border-right: 0;
}
.is-selected {
  color: #1989fa;
}
.title {
  padding: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
}
.desc {
  padding: 0 14px 0 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.foot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  color: #fff;
  height: 350px;
  background-color: #000;
  padding: 40px calc((100vw - 1200px) / 2) 0 calc((100vw - 1200px) / 2);
}
</style>