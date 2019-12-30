<template>
  <!-- <div class="v-form-input"> -->
    <!-- <div class="from-box-main"> -->
      <div class="box">
        <!-- <h3>邮件配置</h3> -->
        <el-form :model="params" :rules="rules2" ref="params" label-position="left">
          <el-form-item label="服务器:" :label-width="formLabelWidth" prop="mailServer">
            <el-input style="width:180px;" type="text" v-model="params.mailServer" placeholder="请输入服务器地址"
              :style='{width:inputLabelWidth}' />
          </el-form-item>
          <el-form-item label="端口:" :label-width="formLabelWidth" prop="port">
            <el-input style="width:180px;" type="text" v-model="params.port" placeholder="请输入端口"
              :style='{width:inputLabelWidth}' />
          </el-form-item>
          <el-form-item label="发件人邮箱地址:" :label-width="formLabelWidth" prop="senderMail">
            <el-input style="width:180px;" type="text" v-model="params.senderMail" placeholder="请输入发件人邮箱的地址"
              :style='{width:inputLabelWidth}' />
          </el-form-item>
          <!-- <el-form-item label="发件人:" :label-width="formLabelWidth" prop="senderUser">
            <el-input style="width:180px;" type="text" v-model="params.senderUser" placeholder="请输入发件人名字"
              :style='{width:inputLabelWidth}' />
          </el-form-item> -->
          <el-form-item label="密码:" :label-width="formLabelWidth" prop="password">
            <el-input style="width:180px;" type="password" v-model="params.password" placeholder="请输入密码"
              :style='{width:inputLabelWidth}' autocomplete="new-password" />
          </el-form-item>
          <el-form-item label="加密:" :label-width="formLabelWidth" prop="useSSL">
            <el-switch v-model="params.useSSL" :active-value="1" :inactive-value="0" active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <br />
          <el-form-item label="" :label-width="formLabelWidth" prop="name">
            <el-button type="primary" :loading="btnLoading" @click="serviceConfirm">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    <!-- </div> -->
  <!-- </div> -->
</template>

<script>
  import {
    httpAjax,
    httpGet
  } from 'api/common'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        let myreg1 = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (value == '') {
          callback('请输入手机号')
        } else if (!myreg1.test(value)) {
          callback('请输入正确的邮箱地址');
        } else {
          callback();
        }
      };
      return {
        btnLoading: false,
        params: {
          mailServer: '',
          port: '',
          senderMail: '',
        //   senderUser: '',
          password: '',
          useSSL: '',
        },
        inputLabelWidth: '300px',
        formLabelWidth: '140px',
        rules2: {
          mailServer: [{
            // validator: validatePass,
            required: true,
            message: '请输入服务器地址',
            trigger: 'blur'
          }],
          port: [{
            required: true,
            message: '请输入端口',
            trigger: 'blur'
          }],
          senderMail: [{
              required: true,
              message: '请输入邮箱地址',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
        //   senderUser: [{
        //     required: true,
        //     message: '请输入发件人名字',
        //     trigger: 'blur'
        //   }],
          password: [{
            // validator: validatePass,
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        }

      }
    },
    mounted() {},
    created() {
      this.getVmList()
    },
    methods: {
      getVmList() {
        const url = `system/getMailInfo?${Math.random()}`
        httpGet(url).then((res) => {
          this.params = {
            id: res.id,
            mailServer: res.mailServer,
            port: res.port,
            senderMail: res.senderMail,
            // senderUser: res.senderUser,
            password: res.password,
            useSSL: res.useSSL,
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      serviceConfirm() {
        this.$refs['params'].validate((valid) => {
          let params = {
            ...this.params
          };
          if (valid) {
            this.btnLoading = true;
            httpAjax('system/mailAdd', params).then(res => {
              if (res.success == 'success') {
                  this.$message({
                      type: 'success',
                  message: '保存成功!'
                });
              } else {
                  this.$message({
                      type: 'error',
                  message: res.resultDesc
                });
              }
              this.getVmList();
                this.btnLoading = false;
            }).catch(() => {
              this.btnLoading = false;
              this.$message({
                type: 'error',
                message: '通讯错误!'
              });
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>
<style scoped>
/* .v-form-input .box{
    height: auto;
} */
</style>