<template>
  <div>
    <el-input v-model="title" placeholder="请输入食谱标题"></el-input>
    <quill-editor
      v-model="textarea"
      ref="myQuillEditor"
      :options="editorOption"
    >
    </quill-editor>

    <div class="content">
      <div :style="{ padding: '20px' }">
        <div class="content_ti">食谱适用年龄:</div>
        <div class="content_t">
          请选择年龄：
          <el-select
            size="mini"
            v-model="selectValue"
            clearable
            placeholder="请选择食谱适用年龄"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :value="item.value"
              :label="item.label"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </div>
        <div class="content_ti" :style="{ marginTop: '20px' }">食谱步骤:</div>
        <div class="content_t" v-for="item in data" :key="item.id">
          <div>第{{ item.id }}步：</div>
          <div :style="{ marginTop: '10px' }">
            步骤详情:
            <el-input
              type="textarea"
              :rows="10"
              placeholder="请输入步骤详情"
              v-model="item[`desc`]"
            ></el-input>
            步骤缩略图：
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="(file) => beforeAvatarUpload(file, item.id)"
              action="http://localhost:8080/"
              :http-request="() => {}"
            >
              <img
                v-if="item[`file`]"
                :src="`/healthy/uploads/${item[`file`]}`"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
        <el-button @click="handleAdd">添加下一步</el-button>
        <el-button
          type="danger"
          v-if="this.data.length !== 1"
          @click="data.pop()"
          >删除本步骤</el-button
        >
        <div class="content_ti" :style="{ marginTop: '20px' }">
          食谱展示缩略图：
        </div>
        <div class="content_t">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUploadHome"
            action="http://localhost:8080/"
            :http-request="() => {}"
          >
            <img
              v-if="home.file"
              :src="`/healthy/uploads/${home.file}`"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="foot">
      <el-button @click="addRecipeItem">添加食谱</el-button>
      <el-button @click="$router.push('/mainNav/recipe')">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  addRecipe,
  addStepImage,
  getRecipeDesc,
  editRecipe,
} from "../../../api/recipe";
import { addAnnouncementImage } from "@/api/system";
import Quill from "quill";
import QuillBetterTable from "quill-better-table";
import imageResize from "quill-image-resize-module"; // 图片缩放组件引用
import { ImageDrop } from "quill-image-drop-module"; // 图片拖动组件引用
Quill.register("modules/imageDrop", ImageDrop); // 注册
Quill.register("modules/imageResize", imageResize); // 注册
export default {
  data() {
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"], // 引用  代码块
      [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
      ["link", "image"], // 链接、图片
    ];
    return {
      title: "",
      textarea: "",
      selectValue: "",
      data: [
        {
          id: 1,
          desc: "",
          file: "",
        },
      ],
      home: {
        file: "",
      },
      options: [
        {
          id: 1,
          label: "1岁",
          value: "1",
        },
        {
          id: 2,
          label: "2岁",
          value: "2",
        },
        {
          id: 3,
          label: "3岁",
          value: "3",
        },
        {
          id: 4,
          label: "4岁",
          value: "4",
        },
        {
          id: 5,
          label: "5岁",
          value: "5",
        },
        {
          id: 6,
          label: "6岁",
          value: "6",
        },
      ],
      imgId: 0,
      editorOption: {
        placeholder: "请输入食材简介",
        theme: "snow",
        modules: {
          imageDrop: true, //图片拖拽
          imageResize: {
            //放大缩小
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white",
            },
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
                let self = this;
                let input = document.createElement("input");
                input.type = "file";
                input.addEventListener("change", async (e) => {
                  let file = input.files[0];
                  if (file.type !== "image/jpeg" && file.type !== "image/png") {
                    return that.$message.error("请上传图片");
                  }
                  try {
                    let formData = new FormData();
                    formData.append("image", file);
                    let res = await addAnnouncementImage(formData);
                    if (res.code === 200) {
                      let url = `/healthy/uploads/${res.data}`;
                      let length = self.quill.getSelection(true).index;
                      //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
                      self.quill.insertEmbed(length, "image", url);
                      self.quill.setSelection(length + 1);
                    } else {
                    }
                  } catch (e) {
                    console.log(e);
                  }
                });
                input.click();
              },
            },
          },
        },
      },
    };
  },
  methods: {
    async addStepImageItem(file) {
      try {
        let formData = new FormData();
        formData.append("stepImage", file);
        let res = await addStepImage(formData);
        console.log(res.data);
        return res.data;
      } catch (e) {
        this.$message.error("添加图片失败");
      }
    },
    async beforeAvatarUpload(file, id) {
      console.log(id);
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG或PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
      this.data[id - 1].file = await this.addStepImageItem(file);
    },
    async beforeAvatarUploadHome(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      this.home.file = await this.addStepImageItem(file);
    },
    handleAdd() {
      let { desc, file } = this.data[this.data.length - 1];
      if (!desc || !file) {
        this.$message.error("请将上一步填写完整");
        return;
      }
      let item = {
        id: this.data.length + 1,
        desc: "",
        file: "",
      };
      this.data.push(item);
    },
    async addRecipeItem() {
      if (!this.title) {
        this.$message.error("请填写食谱标题");
        return;
      }
      if (!this.textarea) {
        this.$message.error("请填写食谱介绍");
        return;
      }
      if (!this.selectValue) {
        this.$message.error("请选择适用年龄");
        return;
      }
      if (!this.home.file) {
        this.$message.error("请上传封面");
        return;
      }
      if (
        !this.data[this.data.length - 1].desc ||
        !this.data[this.data.length - 1].file
      ) {
        this.$message.error("请将步骤填写完整");
        return;
      }
      let formData = new FormData();
      formData.append("recipeTitle", this.title);
      formData.append("recipeDesc", this.textarea);
      formData.append("image", this.home.file);
      formData.append("age", this.selectValue);

      try {
        if (this.$route.query.id) {
          let arr = this.data.map((item) => {
            return {
              stepId: item.id,
              stepDesc: item.desc,
              stepImage: item.file,
              id: item.dd,
            };
          });
          formData.append("files", JSON.stringify(arr));
          formData.append("id", this.$route.query.id);
          let res = await editRecipe(formData);
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            this.$router.push("/mainNav/recipe");
            return;
          }
        } else {
          let arr = this.data.map((item) => {
            console.log(item);
            return {
              stepId: item.id,
              stepDesc: item.desc,
              stepImage: item.file,
            };
          });
          formData.append("files", JSON.stringify(arr));
          let res = await addRecipe(formData);
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.$router.push("/mainNav/recipe");
            return;
          }
        }
        this.$message.error("添加失败");
      } catch (e) {
        console.log(e);
      }
    },
    async getRecipeDescItem() {
      let { id } = this.$route.query;
      try {
        let res = await getRecipeDesc(id);
        console.log(res);
        let r = res.data.children.map((item) => {
          return {
            id: item.stepId,
            desc: item.stepDesc,
            file: item.stepImage,
            dd: item.id,
          };
        });
        this.data = r;
        this.title = res.data.recipeTitle;
        this.textarea = res.data.recipeDesc;
        this.selectValue = res.data.isAge;
        this.home.file = res.data.recipeImage;
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    if (this.$route.query.id) {
      this.getRecipeDescItem();
    }
  },
};
</script>

<style scoped lang="less">
div /deep/.el-input__inner {
  // height: 60px;
  font-size: 20px;
}
.content {
  line-height: 20px;
  background-color: rgb(255, 255, 255);
  text-align: left;
  box-shadow: 0px 1px 2px 0px rgb(0 0 0 / 10%);
  margin-top: 25px;
}
.foot {
  line-height: 20px;
  background-color: rgb(255, 255, 255);
  text-align: left;
  box-shadow: 0px 1px 2px 0px rgb(0 0 0 / 10%);
  margin-top: 25px;
  border-radius: 10px;
  padding: 10px 20px;
}
.content_ti {
  font-weight: 700;
  font-size: 20px;
}
.content_t {
  font-size: 16px;
  margin-top: 20px;
}
.avatar-uploader /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/deep/.ql-editor {
  min-height: 300px;
}
</style>