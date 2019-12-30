<template>
  <div class="v-form-input">
    <div class="from-box-main">
      <div class="box">
        <h3>热线配置</h3>
        <el-form :model="params" :rules="rules2" ref="params" label-position="left">
          <el-form-item label="热线电话:" :label-width="formLabelWidth" prop="link">
            <el-input style="width:180px;" type="text" v-model="params.link" placeholder="请输入热线电话"
              :style='{width:inputLabelWidth}' />
          </el-form-item>
          <br />
          <el-form-item label="" :label-width="formLabelWidth" prop="name">
            <el-button type="primary" :loading="btnLoading" @click="serviceConfirm">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    httpAjax,httpGet
  } from 'api/common'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        let myreg1 = /^\d+\d+\d$/
        if (value == '') {
          callback('请输入热线电话')
        } else if (!myreg1.test(value)) {
          callback('请输入正确的热线电话');
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
            // validator: validatePass,
            required: true,
            message: '请输入热线电话号码',
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
        const url = `system/getTelephone?${Math.random()}`
        httpGet(url).then((res) => {
        //   console.log(res)
          this.params.link = res.telephone;
        }).catch((error) => {
          console.log(error)
        })
      },
      serviceConfirm() {//提交
        this.$refs['params'].validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            httpAjax('system/saveTelephone', {telephone:this.params.link}).then(res => {
                if (res.success == 'success') {
              this.btnLoading = false;
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.getVmList()
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
