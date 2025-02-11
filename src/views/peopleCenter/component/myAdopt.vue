<template>
    <div class="content">
        <div style="display: flex;gap:2;align-items: center;">
            <div class="title">
                我的采纳
            </div>
            <el-tooltip effect="dark" :content="advice" placement="top">
                <i class="el-icon-warning-outline"></i>
            </el-tooltip>
        </div>
        <el-divider></el-divider>
        <div v-if="data.length !== 0">
            <ul>
                <li v-for="item in data" :key="item.id">
                    <div :style="{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }">
                        <div class="li_left">
                            <div class="li_left_title" @click="
                                $router.push({
                                    path: '/mainNav/recipeDesc',
                                    query: { id: item.recipeId },
                                })
                                ">
                                {{ item.recipeName }}
                            </div>
                            <div class="li_left_time">采纳时间：{{ item.ctime }}</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <el-empty v-else :image-size="200"></el-empty>
    </div>
</template>

<script>
import { adoptList } from "../../../api/recipe";
export default {
    data() {
        return {
            data: [],
            advice: ''
        };
    },
    methods: {
        async getMyAdoptItem() {
            try {
                let res = await adoptList();
                if (res.code == 200) {
                    this.data = res.data.list || [];
                    this.advice = res.data.advice || '';
                }
            } catch (e) {
                console.log(e);
            }
        },
    },
    mounted() {
        this.getMyAdoptItem();
    },
};
</script>

<style lang="less" scoped>
.content {
    padding: 8px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 10%);
    width: 100%;
    display: block;

    .title {
        font-size: 16px;
        color: rgb(102, 102, 102);
        padding: 0 10px;
        margin-top: 15px;
    }

    ul {
        padding: 10px 10px;
        list-style: none;

        li {
            padding: 10px 0;

            .li_left {
                width: 810px;

                .li_left_title {
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

                .li_left_title1 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 18px;
                    color: #2c2c2c;
                }

                .li_left_time {
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 14px;
                    line-height: 22px;
                }
            }

            .li_right {
                color: #1890ff;

                .li_right_a {
                    display: inline-block;
                    margin: 0 5px;
                    cursor: pointer;
                }
            }
        }
    }
}

/deep/.el-empty {
    width: 100%;
}
</style>