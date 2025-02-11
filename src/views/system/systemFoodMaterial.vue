<template>
  <div>
    <system-header>
      <el-input
        type="text"
        v-model="title"
        :style="{ width: '200px', marginRight: '15px', height: '32px' }"
        placeholder="请输入食材标题"
      ></el-input>
      <el-button size="small " type="primary" @click="searchTitle">
        查询</el-button
      >
    </system-header>
    <tableMy
      :column="column"
      :data="data"
      :operation="operation"
      :onPagination="{
        pageSize,
        currentPage,
        total,
        currentChange: currentChange,
      }"
      :isAdd="true"
      :onAdd="onAdd"
    ></tableMy>
    <el-dialog :title="modelTitle" :visible.sync="dialogVisible" width="900">
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="食材标题" prop="footTitle">
          <el-input
            v-model="form.footTitle"
            placeholder="请输入食材标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="食材简介" prop="footDesc">
          <!-- <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入食材简介"
            v-model="form.footDesc"
          ></el-input> -->
          <quill-editor
            v-model="form.footDesc"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item label="食材封面" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            action="http://localhost:8080/"
            :http-request="() => {}"
          >
            <img
              v-if="form.imageUrl"
              :src="`/healthy/uploads/${form.imageUrl}`"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableMy from "./component/tableMy.vue";
import systemHeader from "./component/systemHeader";

import {
  getSystemFoodMaterial,
  addSystemFoodMaterial,
  addFoodMaterialImage,
  updateSystemFoodMaterial,
  deleteSystemFoodMaterial,
  systemFoodMaterialIsRecommend,
  addAnnouncementImage,
} from "@/api/system";
import { getContent } from "../../utils/gitlab";
import Quill from "quill";
import QuillBetterTable from "quill-better-table";
import imageResize from "quill-image-resize-module"; // 图片缩放组件引用
import { ImageDrop } from "quill-image-drop-module"; // 图片拖动组件引用
Quill.register("modules/imageDrop", ImageDrop); // 注册
Quill.register("modules/imageResize", imageResize); // 注册
// Quill.register(
//   {
//     "modules/better-table": QuillBetterTable,
//     "modules/resizeImage ": resizeImage,
//     "modules/imageDrop": ImageDrop,
//   },
//   true
// );
export default {
  components: { tableMy, systemHeader },
  data() {
    var validateTitle = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入食材名称"));
      } else if (!/^.{1,50}$/.test(value)) {
        return callback(new Error("请输入50位以下"));
      } else {
        return callback();
      }
    };
    var validateDesc = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入食材简介"));
      } else {
        return callback();
      }
    };
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"], // 引用  代码块
      [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
      ["link", "image"], // 链接、图片
    ];
    const that = this;
    return {
      form: {
        footTitle: "",
        footDesc: "",
        imageUrl: "",
      },
      rules: {
        footTitle: [
          { required: true, validator: validateTitle, trigger: "blur" },
        ],
        footDesc: [
          { required: true, validator: validateDesc, trigger: "blur" },
        ],
        imageUrl: [
          { required: true, message: "请上传食材缩略图", trigger: "blur" },
        ],
      },
      column: [
        {
          key: 1,
          prop: "index",
          label: "序号",
          width: 100,
        },
        {
          key: 2,
          prop: "foodMaterialTitle",
          label: "食材名称",
          width: 200,
        },
        {
          key: 3,
          prop: "username",
          label: "创建人",
          width: 150,
        },
        {
          key: 4,
          prop: "createTime",
          label: "创建时间",
          width: 150,
        },
        {
          key: 5,
          prop: "foodMaterialDesc",
          label: "食材简介",
        },
      ],
      data: [],
      operation: {
        key: 6,
        //   prop: "operation",
        label: "操作",
        width: 200,
        operations: [
          {
            id: 1,
            label: "修改",
            value: "修改",
            onClick: this.onEdit,
          },
          {
            id: 2,
            label: "删除",
            value: "删除",
            onClick: this.onDelete,
          },
          {
            id: 3,
            label: "首页推荐",
            value: "取消推荐",
            onClick: this.onRecommend,
          },
        ],
      },
      total: 0,
      currentPage: 1,
      pageSize: 8,
      title: "",
      dialogVisible: false,
      modelTitle: "新增",
      editId: 0,
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
    async getSystemFoodMaterialItem(current = 1, title = "") {
      let params = {
        pageSize: this.pageSize,
        pageNum: current,
        title: title,
      };
      try {
        let res = await getSystemFoodMaterial(params);
        let r = res.data.records.map((item, index) => {
          return {
            ...item,
            index: index + 1,
            foodMaterialDesc: getContent(item.foodMaterialDesc),
          };
        });
        this.data = r;
        this.total = res.data.total;
        this.currentPage = current;
      } catch (e) {
        console.log(e);
      }
    },
    currentChange(current) {
      this.getSystemFoodMaterialItem(current, this.title);
    },
    searchTitle() {
      this.getSystemFoodMaterialItem(1, this.title);
    },
    onAdd() {
      this.dialogVisible = true;
      this.form.footTitle = "";
      this.form.footDesc = "";
      this.form.imageUrl = "";
      this.modelTitle = "新增";
    },
    onEdit({ foodMaterialTitle, foodMaterialDesc, image, id }) {
      this.dialogVisible = true;
      this.form.footTitle = foodMaterialTitle;
      this.form.footDesc = foodMaterialDesc;
      this.form.imageUrl = image;
      this.editId = id;
      this.modelTitle = "修改";
    },
    async onDelete({ id }) {
      try {
        let res = await deleteSystemFoodMaterial(id);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "食材删除成功",
          });
        } else {
          this.$message({
            typeof: "error",
            message: "食材删除失败",
          });
        }
      } catch (e) {
        console.log(e);
      }
      this.getSystemFoodMaterialItem();
    },
    async onRecommend({ isRecommend, id }) {
      try {
        let params = {
          isRecommend: isRecommend === 0 ? 1 : 0,
          id,
        };
        let res = await systemFoodMaterialIsRecommend(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: res.message,
          });
        } else {
          this.$message({
            typeof: "error",
            message: res.message,
          });
        }
      } catch (e) {
        console.log(e);
      }
      this.getSystemFoodMaterialItem();
    },
    async beforeAvatarUpload(file) {
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

      this.form.imageUrl = await this.addStepImageItem(file);
    },
    async addStepImageItem(file) {
      try {
        let formData = new FormData();
        formData.append("image", file);
        let res = await addFoodMaterialImage(formData);
        return res.data;
      } catch (e) {
        this.$message.error("添加图片失败");
      }
    },
    async handlok() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append("foodMaterialTitle", this.form.footTitle);
          formData.append("foodMaterialDesc", this.form.footDesc);
          formData.append("image", this.form.imageUrl);
          if (this.modelTitle === "新增") {
            try {
              let res = await addSystemFoodMaterial(formData);
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "食材添加成功",
                });
              } else {
                this.$message.error("食材添加失败");
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            try {
              formData.append("id", this.editId);
              let res = await updateSystemFoodMaterial(formData);
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "食材修改成功",
                });
              } else {
                this.$message.error("食材修改失败");
              }
            } catch (e) {
              console.log(e);
            }
          }

          this.dialogVisible = false;
          this.getSystemFoodMaterialItem();
        }
      });
    },
  },
  mounted() {
    this.getSystemFoodMaterialItem();
  },
};
</script>

<style lang="less" scoped>
/deep/.el-input__inner {
  height: 32px;
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