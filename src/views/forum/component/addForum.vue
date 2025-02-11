<template>
  <div>
    <el-input v-model="title" placeholder="请输入论坛文章标题"></el-input>
    <quill-editor
      v-model="textarea"
      ref="myQuillEditor"
      :options="editorOption"
    >
    </quill-editor>
    <div class="content">
      <div :style="{ padding: '20px' }">
        <div class="content_ti">论坛标签:</div>
        <div class="content_t">
          请选择论坛标签：
          <el-select
            size="mini"
            v-model="selectValue"
            clearable
            placeholder="请选择论坛标签"
          >
            <el-option
              v-for="item in lableList"
              :key="item.id"
              :value="item.value"
              :label="item.label"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="foot">
      <el-button @click="handlAdd">添加论坛文章</el-button>
      <el-button @click="$router.push('/mainNav/forum')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { addAnnouncementImage } from "@/api/system";
import { getForumLable, addForum } from "@/api/forum";

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
      lableList: [],
      selectValue: "",
      editorOption: {
        placeholder: "请输入发布内容",
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
    getForumLableItem() {
      getForumLable().then((res) => {
        this.lableList = res.data.map((item) => {
          return {
            id: item.id,
            value: item.id,
            label: item.lableName,
          };
        });
      });
    },
    handlAdd() {
      if (!this.title) return this.$message.error("标题不能为空");
      if (!this.textarea) return this.$message.error("内容不能为空");
      if (!this.selectValue) return this.$message.error("请选择标签");
      let formData = new FormData();
      formData.append("title", this.title);
      formData.append("content", this.textarea);
      formData.append("forumLableId", this.selectValue);
      addForum(formData).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "发布成功",
          });
          this.$router.push("/mainNav/forum");
        } else {
          this.$message.error("发布失败");
        }
      });
    },
  },
  mounted() {
    this.getForumLableItem();
  },
};
</script>

<style lang="less" scoped>
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
/deep/.ql-editor {
  min-height: 300px;
}
</style>