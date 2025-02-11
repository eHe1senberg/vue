<template>
  <div class="login">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-position="center"
      label-width="100px"
      class="demo-ruleForm"
      :style="{ width: '100%', padding: '0 50px' }"
    >
      <el-form-item label="用户名" prop="user">
        <el-input
          type="text"
          v-model="ruleForm.user"
          autocomplete="off"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkpass">
        <el-input
          type="password"
          v-model="ruleForm.checkpass"
          autocomplete="off"
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          type="text"
          v-model="ruleForm.phone"
          autocomplete="off"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="短信验证码" prop="phonecode">
            <el-input
              type="text"
              v-model="ruleForm.phonecode"
              autocomplete="off"
              placeholder="请输入短信验证码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button
            :disabled="isClick"
            type="primary"
            @click="getPhoneCodeItem('ruleForm')"
            >{{ codeMessage }}</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="验证码" prop="code">
            <el-input
              type="text"
              v-model="ruleForm.code"
              autocomplete="off"
              placeholder="请输入验证码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div id="code1" @click="getCodeSvg"></div>
        </el-col>
      </el-row>
      <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
      <div class="register">
        已有帐号?
        <a
          :style="{ color: '#409EFF', cursor: 'pointer' }"
          @click="
            () => {
              this.$router.push('/login');
            }
          "
          >立即登录</a
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import { getCaptcha, getPhoneCodeReguser, regUser } from "../../api/login";
import { setCookie } from "../../utils/auth";
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
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!/^.{6,15}$/.test(value)) {
        return callback(new Error("请输入15位以下,6位以上"));
      } else {
        return callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    return {
      codeMessage: "获取验证码",
      isClick: false,
      ruleForm: {
        pass: "",
        user: "",
        phonecode: "",
        code: "",
        checkpass: "",
        phone: "",
      },
      rules: {
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        user: [{ required: true, validator: validateUser, trigger: "blur" }],
        checkpass: [
          { required: true, validator: validateCheckPass, trigger: "blur" },
        ],
        phonecode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append("username", this.ruleForm.user);
          formData.append("password", this.ruleForm.pass);
          formData.append("phone", this.ruleForm.phone);
          formData.append("phoneCode", this.ruleForm.phonecode);
          formData.append("code", this.ruleForm.code);
          try {
            let res = await regUser(formData);
            if (res.code === 200) {
              this.$message({
                message: "注册成功",
                type: "success",
              });
              this.$router.push("/login");
            } else {
              this.$message.error(res.message);
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    },
    async getCodeSvg() {
      try {
        let res = await getCaptcha();  // 获取验证码数据
        let code = document.querySelector("#code1");

        // 创建 img 标签，并设置 Base64 图片
        let img = document.createElement("img");
        img.src = "data:image/png;base64," + res.img; 
        img.style.display = "block";
        img.style.width = "100%";
        img.style.height = "100%";

        // 清空 code 容器并插入新 img
        code.innerHTML = "";
        code.appendChild(img);

      } catch (e) {
        console.log(e);
      }
    },
    getPhoneCodeItem(formName = "ruleForm") {
      this.$refs[formName].validateField(["phone"], async (valid) => {
        if (!valid) {
          //校验通过走这里,每通过一次,会往这个数组里加一个""
          let formData = new FormData();
          formData.append("phone", this.ruleForm.phone);
          try {
            let res = await getPhoneCodeReguser(formData);
            if (res.code === 200) {
              this.$message({
                message: res.message,
                type: "success",
              });
            } else {
              this.$message.error(res.message);
            }

            let time = 60;
            this.codeMessage = `${time}s`;
            this.isClick = true;
            let timer = setInterval(() => {
              time--;
              this.codeMessage = `${time}s`;
              if (time === 0) {
                this.isClick = false;
                this.codeMessage = "获取验证码";
                clearInterval(timer);
              }
            }, 1000);
          } catch (e) {
            console.log(e);
          }
        } else {
          this.$message.error("手机号不能为空");
        }
      });
    },
  },
  mounted() {
    this.getCodeSvg();
  },
};
</script>

<style scoped lang="less">
.login {
  margin: 150px auto;
  width: 500px;
  height: 600px;
  background: #fff;
  box-shadow: 0 0 4px 0 rgba(153, 152, 152, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
div /deep/.el-button {
  width: 100%;
}
.register {
  color: rgb(174, 173, 173);
  text-align: center;
  margin-top: 10px;
}
</style>