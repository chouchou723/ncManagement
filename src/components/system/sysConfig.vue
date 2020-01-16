<template>
  <div class="v-form-input">
    <el-scrollbar wrap-class="scrollbar-wrapper" id="sysList" ref="myScrollbar">
      <div class="from-box-main"
        style="display:flex;flex-direction:column;flex-wrap:wrap;justify-content:flex-start;align-items:center;padding-top:40px">
        <el-radio-group v-model="tabPosition" style="margin-bottom: 40px;" @change="bigClick">
          <el-radio-button label="sys">系统配置</el-radio-button>
          <el-radio-button label="file">文件中心配置</el-radio-button>
          <el-radio-button label="data">大屏配置</el-radio-button>
          <el-radio-button label="mail">邮件配置</el-radio-button>
        </el-radio-group>
        <div class="box" v-if="tabPosition==='sys'">
          <!-- <h3>系统配置</h3> -->
          <el-form :model="params" :rules="rules2" ref="params" label-position="left">
            <div style="display:flex;">
              <el-form-item label="流程开关:" :label-width="formLabelWidth" prop="secretKey">
                <el-switch v-model="params.oaSwitch" active-value="true" inactive-value="false" active-color="#13ce66"
                  inactive-color="#ff4949" @change="oaSwitchChange">
                </el-switch>
              </el-form-item>
              <el-form-item label="单点登录开关:" :label-width="formLabelWidth" prop="secretKey" style="margin-left:90px;">
                <el-switch v-model="params.sso" active-value="true" inactive-value="false" active-color="#13ce66"
                  inactive-color="#ff4949" @change="ssoChange">
                </el-switch>
              </el-form-item>

            </div>
            <el-form-item label="桌面清理时长:" :label-width="formLabelWidth" prop="unloginDays">
              <!-- <el-input style="width:180px;" v-model="params.unloginDays" placeholder="请输入未登陆时长"
              :style='{width:inputLabelWidth}' /> -->
              <el-input-number v-model="params.unloginDays" size="medium" controls-position="right" :min="7"
                :style='{width:inputLabelWidth}'>
              </el-input-number>
              <div>(单位：天，如{{params.unloginDays}}天未登陆的桌面会自动进入回收站)</div>
            </el-form-item>
            <!-- <el-form-item label="回收站清理时长:" :label-width="formLabelWidth" prop="recycleDays">
               <el-input-number v-model="params.recycleDays" size="medium" controls-position="right" :min="7"  :style='{width:inputLabelWidth}'>
            </el-input-number>
            <div>(单位：天，如{{params.recycleDays}}天后回收站中的桌面会被彻底清除)</div>
          </el-form-item> -->
            <el-form-item label="UNS连接地址:" :label-width="formLabelWidth" prop="wiLink">
              <el-input style="width:180px;" type="text" v-model="params.wiLink" placeholder="请输入UNS连接地址"
                :style='{width:inputLabelWidth}' />
              <div>(地址如：https://172.16.5.204)</div>
            </el-form-item>
            <!-- <el-form-item label="OU路径:" :label-width="formLabelWidth" prop="ou">
            <el-input style="width:180px;" type="text" v-model="params.ou" placeholder="请输入OU路径"
              :style='{width:inputLabelWidth}' />
              <div>(填写：系统运行部,多个OU使用","分隔)</div>
          </el-form-item> -->
            <el-form-item label="热线电话:" :label-width="formLabelWidth" prop="telephone">
              <el-input style="width:180px;" type="text" v-model="params.telephone" placeholder="请输入热线电话"
                :style='{width:inputLabelWidth}' />
            </el-form-item>

            <br />
            <el-form-item label="" :label-width="formLabelWidth" prop="name">
              <el-button type="primary" :loading="btnLoading" @click="serviceConfirm">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="box" v-if="tabPosition==='file'">
          <!-- <h3>系统配置</h3> -->
          <el-form :model="userQuota" ref="userQuota" label-position="left">

            <el-form-item label="用户文件空间默认大小:" label-width="200px" prop="unloginDays">
              <!-- <el-input style="width:180px;" v-model="params.unloginDays" placeholder="请输入未登陆时长"
              :style='{width:inputLabelWidth}' /> -->
              <el-input-number v-model="userQuota.quota" size="medium" controls-position="right" :min="0" :precision="0"
                :style='{width:inputLabelWidth}'>
              </el-input-number>
              <div>(单位：GB，用户文件空间默认为{{userQuota.quota}}GB)</div>
            </el-form-item>
            <!-- <el-form-item label="回收站清理时长:" :label-width="formLabelWidth" prop="recycleDays">
               <el-input-number v-model="params.recycleDays" size="medium" controls-position="right" :min="7"  :style='{width:inputLabelWidth}'>
            </el-input-number>
            <div>(单位：天，如{{params.recycleDays}}天后回收站中的桌面会被彻底清除)</div>
          </el-form-item> -->
            <br />
            <el-form-item label="" :label-width="formLabelWidth" prop="name">
              <el-button type="primary" :loading="btnLoading" @click="saveFile">保 存</el-button>
              <el-button type="danger" :loading="btnLoading" @click="resetFile">格式化</el-button>
            </el-form-item>
            <div>
              ※注意事项:
              <div style="color:#66b1ff;text-indent: 30px;line-height:24px;margin-top:5px">
                1.保存:现有用户总空间大小不变,新登入的用户的文件总空间将默认设为{{userQuota.quota}}GB
              </div>
              <div style="color:#f71f1f;text-indent: 30px;line-height:24px;">
                2.格式化:注意<span
                  style="font-size:20px;color:red;">格式化</span>将清除所有用户的文件以及系统的相关记录!同时将所有用户的的文件总空间设为{{userQuota.quota}}GB
              </div>
            </div>
          </el-form>
        </div>
        <div class="box" v-if="tabPosition==='data'">
          <!-- <h3>系统配置</h3> -->
          <el-form :model="datav" :rules="rulesData" ref="params" label-position="left">

            <el-form-item label="大屏标题:" :label-width="formLabelWidth" prop="title">
              <el-input style="width:230px;" type="text" v-model="datav.title" placeholder="请输入大屏标题" :maxlength="12"
                show-word-limit clearable />
              <!-- <div>(最多12个字)</div> -->
            </el-form-item>
            <!-- <el-form-item label="OU路径:" :label-width="formLabelWidth" prop="ou">
            <el-input style="width:180px;" type="text" v-model="params.ou" placeholder="请输入OU路径"
              :style='{width:inputLabelWidth}' />
              
          </el-form-item> -->
            <el-form-item label="大屏Logo:" :label-width="formLabelWidth" prop="logo">
              <el-upload class="avatar-uploader" action="/api/system/saveLogo" ref="clientCert"
                :on-remove="handleRemoveS" :on-change="beforeUpload" :file-list="fileList"
                :on-success="handleAvatarSuccess" :auto-upload="false">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">建议尺寸40*40或以上的正方形图片,以达到最佳显示效果</div>
              </el-upload>
            </el-form-item>

            <br />
            <el-form-item label="" :label-width="formLabelWidth" prop="name">
              <el-button type="primary" :loading="btnLoading" @click="saveLogo">保 存</el-button>
              <el-button type="success" @click="openData">点击前往<i class="el-icon-arrow-right el-icon--right"></i>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <mailSetting v-if="tabPosition==='mail'"></mailSetting>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
  import {
    httpAjax,
    httpGet
  } from 'api/common'
  import mailSetting from './mailConfig'
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
        fileList: [],
        imageUrl: '',
        datav: {
          title: '数据中心'
        },
        tabPosition: 'sys',
        btnLoading: false,
        params: {
          oaSwitch: false,
          sso: false,
          unloginDays: '',
          recycleDays: '',
          //   ou:'',
          wiLink: '',
          telephone: ''
        },
        userQuota: {
          quota: 0
        },
        inputLabelWidth: '200px',
        formLabelWidth: '140px',
        rules2: {
          unloginDays: [{
            // validator: validatePass,
            required: true,
            message: '请输入未登陆时长',
            trigger: 'blur'
          }],
          recycleDays: [{
            required: true,
            message: '请输入回收站时长',
            trigger: 'blur'
          }],
          wiLink: [{
            // validator: validatePass,
            required: true,
            // message: '请输入未登陆时长',
            trigger: 'blur'
          }],
          //    ou: [{
          //     // validator: validatePass,
          //     required: true,
          //     message: '请输入OU路径',
          //     trigger: 'blur'
          //   }],
          telephone: [{
            // validator: validatePass,
            required: true,
            message: '请输入热线电话号码',
            trigger: 'blur'
          }],
        },
        rulesData: {
          title: [{
            // validator: validatePass,
            required: true,
            message: '请输入大屏标题',
            trigger: 'blur'
          }]
        },
        imgChange: '',
        dataUrl: '',
        fileListBack: []
      }
    },
    components: {
      mailSetting
    },
    // mounted() {},
    created() {
      this.getVmList();
      //   this.getlogo();
    },
    methods: {
      openData() {
        this.dataUrl && window.open(this.dataUrl)
      },
      bigClick(tab) {
        // console.log(tab)
        if (tab === 'data') {
          this.getlogo();
        } else if (tab === 'sys') {
          this.getVmList();
          this.fileList = []
        } else {
          this.fileList = []
        }
      },
      handleAvatarSuccess() {
        this.$message.success('保存成功');
        this.getlogo();
      },
      handleRemoveS(file, fileList) {
        // console.log(file, fileList);
        this.imageUrl = '';
        this.imgChange = '';
        this.fileList = [];
        if (file.raw) {
          if (this.fileListBack[0].path) {
            this.imageUrl = '/api/' + this.fileListBack[0].path
            this.fileList = [...this.fileListBack];
          }
        } else {
          let para = {
            foreignId: this.fileListBack[0].id
          }
          httpAjax('system/removeLogo ', para).then(res => {
            //   console.log(res)
            this.getlogo();
          })
        }

      },
      getlogo() { //获取logotitle
        httpGet('system/findTitle').then(res => {
          //   console.log(res)
          this.datav.title = res.title;
          this.dataUrl = res.bigScreenUrl;
          this.imgChange = '';
          if (res.name) {
            this.fileList = [res];
            this.fileListBack = [...this.fileList]
            this.imageUrl = '/api/' + res.path
          }
        })
      },
      saveLogo() { //保存
        if (this.datav.title) {
          let para = {
            title: this.datav.title,
          }
          httpAjax('system/updateTitle', para).then(res => {
            // console.log(res)
            if (res.result === 'success') {
              if (this.imgChange) {
                this.$refs.clientCert.submit();
              } else {
                this.$message.success('保存成功');
                this.getlogo();
              }
            } else {
              this.$message.error(res.resultDesc)
            }
          })
        } else {
          this.$message.error('请输入大屏标题')
        }
      },
      beforeUpload(file, fileList) { //文件判断
        //   const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isJPG = file.raw.type.indexOf('image') > -1;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
          return false;
        } else {
          //   console.log(file)
          this.imgChange = 'changed';
          this.imageUrl = URL.createObjectURL(file.raw);
          this.fileList = fileList.slice(-1)
        }
      },
      oaSwitchChange(value) {
        httpAjax('system/oaSettingAdd', {
          oaSwitch: value
        }).then(res => {
          if (res.success == 'success') {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '设置失败!'
            });
          }
          this.getVmList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '通讯错误!'
          });
        })
      },
      ssoChange(value) {
        // console.log(value)
        httpAjax('system/signon', {
          sso: value
        }).then(res => {
          if (res.success == 'success') {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '设置失败!'
            });
          }
          this.getVmList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '通讯错误!'
          });
        })
      },
      getVmList() {
        const url = `system/findOaSwitch?${Math.random()}`
        httpGet(url).then((res) => {
          //   console.log(res)
          this.params = {
            oaSwitch: res.oaSwitch,
            oaBackSwitch: res.oaBackSwitch,
            sso: res.sso,
            recycleDays: res.recycleDays,
            unloginDays: res.unloginDays,
            telephone: res.telephone,
            //   ou:res.ou,
            wiLink: res.wiLink,
          };
          this.userQuota.quota = res.quota || 50;
        }).catch((error) => {
          console.log(error)
        })
      },
      saveFile() {
        this.btnLoading = true;
        httpAjax('system/saveUserQuota', this.userQuota).then(res => {
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
          this.getVmList()
          this.btnLoading = false;
        }).catch(() => {
          this.btnLoading = false;
          this.$message({
            type: 'error',
            message: '通讯错误!'
          });
        })
      },
      resetFile(data) { //格式化
        this.$confirm('确定格式化当前文件空间吗?', '格式化文件空间', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnLoading = true;
          httpAjax('system/saveUserQuota', this.userQuota).then(res => {
          if (res.success == 'success') {
           httpAjax('userQuota/reinitQuota').then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '格式化成功'
              });
              this.getVmList();
            } else {
              this.$message({
                type: 'error',
                message: '格式化失败!'
              });
            }
            this.btnLoading = false;
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '格式化失败!'
            });
            this.btnLoading = false;
          })
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
          
        }).catch(() => {})
      },
      serviceConfirm() {
        this.$refs['params'].validate((valid) => {
          let params = {
            ...this.params
          };
          if (valid) {
            this.btnLoading = true;
            httpAjax('system/saveSetting', this.params).then(res => {
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
              this.getVmList()
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
  .v-form-input .box {
    width: 460px;
    /* height: auto; */
  }

  #sysList {
    height: 88vh;
  }

  .from-box-main {
    box-shadow: none;
  }

</style>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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

</style>
