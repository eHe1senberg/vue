<template>
  <div>
    <system-header>
      <el-input
        type="text"
        v-model="title"
        :style="{
          margin: '0 15px',
          width: '200px',
          height: '32px',
        }"
        placeholder="请输入公告标题"
      ></el-input>
      <el-button size="small " type="primary" @click="searchTitle">
        查询</el-button
      >
    </system-header>
    <table-my
      :isAdd="true"
      :data="data"
      :column="column"
      :operation="operation"
      :onPagination="{
        pageSize,
        currentPage,
        total,
        currentChange: currentChange,
      }"
      :onAdd="onAdd"
    >
    </table-my>

    <el-dialog :title="modelTitle" :visible.sync="dialogVisible" width="1000">
      <el-form :rules="rules" ref="forms" :model="form" label-width="80px">
        <el-form-item label="公告标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入公告标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <quill-editor
            v-model="form.content"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item prop="isAlert">
          <el-checkbox v-model="form.isAlert">是否弹窗</el-checkbox>
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
import SystemHeader from "./component/systemHeader.vue";
import TableMy from "./component/tableMy.vue";
import {
  getSystemAnnouncement,
  addSystemAnnouncement,
  getSystemAnnouncementItemApi,
  updateSystemAnnouncement,
  deleteSystemAnnouncement,
  addAnnouncementImage,
} from "../../api/system";
import { getContent } from "../../utils/gitlab";
export default {
  components: {
    SystemHeader,
    TableMy,
  },
  data() {
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image"],
    ];
    var validateTitle = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入公告名称"));
      } else if (!/^.{1,50}$/.test(value)) {
        return callback(new Error("请输入50位以下"));
      } else {
        return callback();
      }
    };
    var validateDesc = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入公告内容"));
      } else {
        return callback();
      }
    };
    return {
      rules: {
        title: [{ required: true, validator: validateTitle, trigger: "blur" }],
        content: [{ required: true, validator: validateDesc, trigger: "blur" }],
      },
      title: "",
      column: [
        {
          key: 1,
          prop: "index",
          label: "序号",
          width: 100,
        },
        {
          key: 2,
          prop: "title",
          label: "公告名称",
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
          prop: "isAlert",
          label: "是否弹窗",
          width: 100,
        },
        {
          key: 6,
          prop: "content",
          label: "公告简介",
        },
      ],
      data: [],
      operation: {
        key: 7,
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
        ],
      },
      total: 0,
      currentPage: 1,
      pageSize: 8,
      modelTitle: "新建公告",
      dialogVisible: false,
      editorOption: {
        placeholder: "请输入公告内容",
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
                let self = this;
                let input = document.createElement("input");
                input.type = "file";
                input.addEventListener("change", async (e) => {
                  let file = input.files[0];
                  if (file.type !== "image/jpeg") {
                    return self.$message.error("请上传图片");
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
      form: {
        title: "",
        content: "",
        isAlert: false,
      },
      modelid: 0,
    };
  },
  methods: {
    async getSystemAnnouncementItem(current = 1) {
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
        this.data = list;
        this.total = res.data.total;
        this.currentPage = current;
      } catch (e) {
        console.log(e);
      }
    },
    currentChange(current) {
      this.getSystemAnnouncementItem(current);
    },
    onAdd() {
      this.dialogVisible = true;
      this.modelTitle = "新建公告";
      this.$nextTick(() => {
        this.$refs["forms"].resetFields();
      });
    },
    async onEdit(item) {
      this.dialogVisible = true;
      this.modelTitle = "修改公告";
      this.modelid = item.id;
      try {
        let res = await getSystemAnnouncementItemApi(this.modelid);
        this.form = {
          ...res.data,
          isAlert: res.data.isAlert === 0 ? false : true,
        };
      } catch (e) {
        console.log(e);
      }
    },
    async onDelete(item) {
      try {
        let res = await deleteSystemAnnouncement(item.id);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
        } else {
          this.$message.error("删除失败");
        }
        this.getSystemAnnouncementItem();
      } catch (e) {
        console.log(e);
      }
    },
    searchTitle() {
      this.getSystemAnnouncementItem();
    },
    handlok() {
      this.$refs["forms"].validate(async (valied) => {
        if (valied) {
          let formData = new FormData();
          formData.append("title", this.form.title);
          formData.append("content", this.form.content);
          formData.append("isAlert", this.form.isAlert ? 1 : 0);
          if (this.modelTitle === "新建公告") {
            try {
              let res = await addSystemAnnouncement(formData);
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "通知公告创建成功",
                });
                this.getSystemAnnouncementItem();
              } else {
                this.$message.error("通知公告创建失败");
              }
              this.dialogVisible = false;
            } catch (e) {
              console.log(e);
            }
          } else {
            try {
              formData.append("id", this.modelid);
              let res = await updateSystemAnnouncement(formData);
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "通知公告修改成功",
                });
                this.getSystemAnnouncementItem();
              } else {
                this.$message.error("通知公告修改失败");
              }
              this.dialogVisible = false;
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
    },
  },
  mounted() {
    this.getSystemAnnouncementItem();
  },
};
</script>

<style lang="less" scoped>
/deep/.el-input__inner {
  height: 32px;
}
/deep/.ql-editor {
  min-height: 300px;
}
</style>