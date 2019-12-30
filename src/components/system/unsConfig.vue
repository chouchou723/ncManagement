<template>
  <!-- <div class="v-form-input"> -->
    <!-- <div class="from-box-main"> -->
      <div class="box">
        <h3>UNS配置</h3>
        <el-form :model="params" :rules="rules2" ref="params" label-position="left">
          <el-form-item label="UNS连接地址:" :label-width="formLabelWidth" prop="link">
            <el-input style="width:180px;" type="text" v-model="params.link" placeholder="请输入UNS连接地址"
              :style='{width:inputLabelWidth}' />
              <div>(地址如：https://172.16.5.204)</div>
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
    httpAjax,httpGet
  } from 'api/common'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        let myreg1 = /^(https:\/\/)[0-9.]+$/;
        if (value == '') {
          callback('请输入UNS连接地址')
        } else if (!myreg1.test(value)) {
          callback('请输入正确的UNS连接地址');
        } else {
          callback();
        }
      };
      return {
        btnLoading: false,
        params: {
          link:'',
        },
        inputLabelWidth: '300px',
        formLabelWidth: '140px',
        rules2: {
          link: [{
            validator: validatePass,
            required: true,
            // message: '请输入未登陆时长',
            trigger: 'blur'
          }],
        }

      }
    },
    mounted() {},
created() {
      this.getVmList()
    },
    methods: {
        getVmList() {
        const url = `system/findWiConfig?${Math.random()}`
        httpGet(url).then((res) => {
        //   console.log(res)
          this.params.link = res.link;
        }).catch((error) => {
          console.log(error)
        })
      },
      serviceConfirm() {//提交
        this.$refs['params'].validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            httpAjax('system/saveWiLink', {link:this.params.link}).then(res => {
                if (res.success == 'success') {
              this.btnLoading = false;
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
.v-form-input h3{
    padding-top:0;
}
</style>