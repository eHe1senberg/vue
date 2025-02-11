<template>
  <div class="content">
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <div class="title">修改信息</div>
      <div class="title1" v-if="!isEdit" @click="isEdit = !isEdit">修改</div>
      <div
        v-else
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div class="title1" @click="editUserInfoItem('ruleForm')">保存</div>
        <div
          class="title1"
          @click="
            (isEdit = !isEdit),
              getEditUserInfoItem(),
              $refs['ruleForm'].clearValidate()
          "
        >
          取消
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <el-form
      :model="infoForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="user">
        <el-input
          type="text"
          v-model="infoForm.user"
          autocomplete="off"
          placeholder="请输入用户名"
          :disabled="!isEdit"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          type="password"
          v-model="infoForm.pass"
          autocomplete="off"
          placeholder="请输入密码"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          type="text"
          v-model="infoForm.phone"
          autocomplete="off"
          placeholder="请输入手机号"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          action="http://localhost:8080/"
          :http-request="() => {}"
          :disabled="!isEdit"
        >
          <img
            v-if="infoForm.imageUrl"
            :src="`/healthy/uploads/${infoForm.imageUrl}`"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addFoodMaterialImage } from "@/api/system";
import { getEditUserInfo, editUserInfo } from "@/api/personCenter";
export default {
  data() {
    var validateUser = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入用户名"));
      } else if (!/^.{1,15}$/.test(value)) {
        return callback(new Error("请输入15位以下"));
      } else {
        return callback();
      }
    };
    return {
      isEdit: false,
      infoForm: {
        pass: "*********",
        user: "",
        phone: "",
        imageUrl: "",
        id: null,
      },
      rules: {
        user: [{ required: true, validator: validateUser, trigger: "blur" }],
      },
    };
  },
  methods: {
    getEditUserInfoItem() {
      getEditUserInfo().then((res) => {
        let { id, username, phone, image } = res.data;
        this.infoForm.id = id;
        this.infoForm.user = username;
        this.infoForm.phone = phone;
        this.infoForm.imageUrl = image;
      });
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

      this.infoForm.imageUrl = await this.addStepImageItem(file);
    },
    editUserInfoItem(ref) {
      console.log(this.$refs[ref]);
      this.$refs[ref].validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append("username", this.infoForm.user);
          formData.append("image", this.infoForm.imageUrl);
          editUserInfo(formData).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "个人信息修改成功",
              });
              this.isEdit = false;
              this.getEditUserInfoItem();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
  },
  mounted() {
    this.getEditUserInfoItem();
  },
};
</script>

<style scoped lang="less">
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
  .title1 {
    font-size: 16px;
    color: #409eff;
    padding: 0 10px;
    margin-top: 15px;
    cursor: pointer;
  }

  .avatar-uploader /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
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
}
</style>