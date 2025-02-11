<template>
  <div>
    <system-header>
      <el-input
        type="text"
        v-model="title"
        :style="{ width: '200px', marginRight: '15px', height: '32px' }"
        placeholder="请输入用户名"
      ></el-input>
      <el-button size="small " type="primary" @click="getSystemUser(1, title)">
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
      :isAdd="false"
    ></tableMy>
    <el-dialog title="修改成员等级" :visible.sync="dialogVisible" width="900">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户等级">
          <el-select v-model="form.userRank" placeholder="请选择用户等级">
            <el-option key="1" label="普通成员" :value="0"> </el-option>
            <el-option key="2" label="管理员" :value="1"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableMy from "./component/tableMy.vue";
import systemHeader from "./component/systemHeader";
import { getSystemUser, deleteSystemUser, editSystemUser } from "@/api/system";
export default {
  components: { tableMy, systemHeader },

  data() {
    return {
      column: [
        {
          key: 1,
          prop: "index",
          label: "序号",
          width: 100,
        },
        {
          key: 2,
          prop: "username",
          label: "用户名",
        },
        {
          key: 3,
          prop: "phone",
          label: "手机号",
        },
        {
          key: 4,
          prop: "userRank",
          label: "级别",
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
            label: "修改成员级别",
            value: "修改成员级别",
            onClick: this.onEdit,
          },
          //   {
          //     id: 2,
          //     label: "删除",
          //     value: "删除",
          //     onClick: this.onDelete,
          //   },
        ],
      },
      total: 0,
      currentPage: 1,
      pageSize: 8,
      title: "",
      editId: 0,
      dialogVisible: false,
      form: {
        userRank: 0,
      },
    };
  },
  methods: {
    async getSystemUser(current = 1, title = "") {
      let params = {
        pageSize: this.pageSize,
        pageNum: current,
        title: title,
      };
      try {
        let res = await getSystemUser(params);
        let r = res.data.records.map((item, index) => {
          return {
            ...item,
            index: index + 1,
            userRank: item.userRank ? "管理员" : "普通成员",
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
      this.getSystemUser(current, this.title);
    },
    onDelete(item) {
      deleteSystemUser(item.id).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "用户删除成功",
          });
          this.getSystemUser();
        } else {
          this.$message.error("用户删除失败");
        }
      });
    },
    onEdit(item) {
      this.editId = item.id;
      this.dialogVisible = true;
      this.form.userRank = item.userRank === "管理员" ? 1 : 0;
    },
    handleOk() {
      let params = {
        id: this.editId,
        userRank: this.form.userRank,
      };
      editSystemUser(params).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "用户等级修改成功",
          });
          this.getSystemUser();
          this.dialogVisible = false;
        } else {
          this.$message.error("用户等级修改失败");
        }
      });
    },
  },
  mounted() {
    this.getSystemUser();
  },
};
</script>

<style>
</style>