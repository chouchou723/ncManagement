<template>
  <div class="v-form-input">
    <div class="from-box-main">
      <div class="box">
        <h3>上传Licence</h3>
        <el-form :model="params" ref="params" label-position="left">
          <el-form-item label="" :label-width="formLabelWidth" prop="des" v-if="params.des">
            <div style="color:#f10000;font-size:13px;">{{params.des}}</div>
          </el-form-item>
          <el-form-item label="机器码:" :label-width="formLabelWidth" prop="uuid">
            <el-input style="width:180px;" type="text" v-model="params.uuid" readonly placeholder="请输入机器码"
              :style='{width:inputLabelWidth}' />
          </el-form-item>
          <el-form-item label="用户标识:" :label-width="formLabelWidth" prop="userLogo">
            <el-input style="width:180px;" v-model="params.userLogo" readonly placeholder="请输入用户标识"
              :style='{width:inputLabelWidth}' />
          </el-form-item>
          <el-form-item label="用户数:" :label-width="formLabelWidth" prop="userNum">
            <el-input style="width:180px;" v-model="params.userNum" readonly :style='{width:inputLabelWidth}' />
          </el-form-item>
          <el-form-item label="联系电话:" :label-width="formLabelWidth" prop="email">
            <div>
             {{telphone}}
            </div>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            <el-upload class="upload-demo" action="/api/uploader/licenceUpload" accept="file"
              :on-success="handlesuccess" :on-error="handleError" :before-upload="beforeUpload" :show-file-list="false">
              <el-button type="primary" :loading="btnLoading"><i class="el-icon-upload"
                  style="margin-right:5px"></i>上传Licence文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    httpGet,
    addTableScrollBar
  } from 'api/common'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        let myreg1 = /\d/;
        if (value && !myreg1.test(value)) {
          callback('请输入正确的邮箱地址');
        } else {
          callback();
        }
      };
      return {
        btnLoading: false,
        params: {
          uuid: '',
          userLogo: '',
          userNum: '',
          des: ''
        },
        inputLabelWidth: '300px',
        formLabelWidth: '110px',
        telphone:''

      }
    },
    created() {
      this.getVmList()
      this.getTelphone()
    },
    methods: {
         getTelphone() {//获取热线
        const url = `system/getTelephone?${Math.random()}`
        httpGet(url).then((res) => {
        //   console.log(res)
          this.telphone = res.telephone||123123;
        }).catch((error) => {
          console.log(error)
        })
      },
      beforeUpload(file, fileList) { //文件判断
        const isLic = file.name.split('.').slice(-1)[0] === 'lic';
        //     const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLic) {
          this.$message.error('必须上传LIC文件!');
          return false;
        }
        this.btnLoading = true;
      },
      getVmList() {
        const url = `licence/findLicence?${Math.random()}`
        httpGet(url).then((res) => {
          //   console.log(res)
          let nowTime = new Date().getTime()
          let unknownTime = new Date(res.dueDate).getTime()
          if (res.des) {
            this.params.des = res.des
          } else if (unknownTime < nowTime) {
            this.params.des = '* Licence过期，请提供如下信息联系我们, 并上传Licence文件'
          } else {
            this.params = {
              uuid: res.uuid,
              userLogo: res.userLogo,
              userNum: res.userNum,
              des: ''
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      handlesuccess() {
        this.$message.success('上传成功');
        this.btnLoading = false;
        this.getVmList()
      },
      handleError() {
        this.$message.error('上传失败')
      }
    }
  }

</script>
