<template>
  <div id="merchandise" v-loading.fullscreen="loadingState" :element-loading-text="text">
    <div class="search-wrap">
      <el-input placeholder="请输入商品名称" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <el-button type="primary" style="float:right;margin-right:10px" @click="mergeChange">合并商品</el-button>
    </div>
    <!-- <div class="button-wrap">
        :disabled="!checkDisable('mergeChange')"
      <Button type="primary">启动</Button>
     
      <el-button icon="el-icon-refresh" circle style="float:right" size="small" @click="refreshData"></el-button>
        :row-class-name="rowName"
    </div> -->
    <div class="table-wrap" id="table-wrap">
      <el-table ref="multipleTable" :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :load="load" lazy row-key="id"
        :cell-class-name="cellName" @row-click="rowClick" @selection-change="handleSelectionChangeMerge" stripe
        :header-cell-class-name="cellName">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="empty" label="" width="55">
        </el-table-column>
        <el-table-column prop="name" label="商品名称">
          <template slot-scope="scope">
            <div :style="scope.row.combination==='2'?'padding-left:15px':''">
              {{scope.row.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="combination" label="商品类型" width="100">
          <template slot-scope="scope">
            <div>
              {{scope.row.combination==='0'?'普通商品':scope.row.combination==='1'?'合并商品':'子商品'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="商品规格" width="130">
          <template slot-scope="scope">
            <!-- <div style="text-align:left;"> -->
            <div>CPU: {{scope.row.cpu}}核</div>
            <div>内存: {{scope.row.memory}}GB</div>
            <div>磁盘: {{scope.row.sysDisk+scope.row.disk}}GB</div>
            <!-- </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="visible" label="IP分配" width="80">
          <template slot-scope="scope">
            <div>
              {{scope.row.ipDistri==='dynamic'?'动态IP':'静态IP'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="visible" label="审批规则" width="80">
          <template slot-scope="scope">
            <div :style="scope.row.approval==='false'?'color:#42b983':''">
              {{scope.row.approval==='false'?'无需审批':'需要审批'}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="visible" label="显示状态" width="80">
          <template slot-scope="scope">
            <div :style="scope.row.visible==='show'?'color:#42b983':''">
              {{scope.row.visible==='show'?'显示':'隐藏'}}
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="spec" label="CPU/内存/磁盘" width="150">
        </el-table-column> -->
        <!-- <el-table-column prop="quota" label="配额(商品数/CPU/内存/磁盘)" width="220">
        </el-table-column>
        <el-table-column prop="usedQuota" label="已用(商品数/CPU/内存/磁盘)" width="220">
        </el-table-column>
        <el-table-column prop="leftQuota" label="剩余(商品数/CPU/内存/磁盘)" width="220">
        </el-table-column> -->
        <el-table-column prop="quota" label="商品总数" width="100">
          <template slot-scope="scope">
            {{scope.row.merCount}}
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="usedQuota" label="已使用商品数" width="120">
          <template slot-scope="scope">
            <el-popover placement="right" width="200" trigger="hover" v-if="scope.row.combination!=='1'">
              <!-- <div slot="reference" style="cursor:pointer"> -->
              <el-button slot="reference" type="info" plain>
                {{scope.row.usedMer}}
                <!-- </div> -->
              </el-button>
              <div>
                <div>已生成:{{scope.row.completeNum}}</div>
                <div>生成中:{{scope.row.processNum}}</div>
                <div>待审批:{{scope.row.auditNum}}</div>
                <div>生成失败:{{scope.row.failedNum}}</div>
              </div>
            </el-popover>
            <div v-else>
              {{scope.row.usedMer}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="leftQuota" label="剩余商品数" width="120">
          <template slot-scope="scope">
            <div :style="scope.row.leftMer===0?'color:#f10000':''">
              {{scope.row.leftMer}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述">
          <template slot-scope="scope">
            <div>
              {{scope.row.description||'暂无'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" min-width="200">
          <template slot-scope="scope">
            <div>
              {{new Date(scope.row.createTime).toLocaleString()}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small" v-if="scope.row.leftMer>0">{{scope.row.visible==='show'?'设置隐藏':'设置可见'}}</el-button>
         -->
            <el-button @click="handleClickOpen(scope.row)" type="text"
              v-if="scope.row.leftMer>0&&scope.row.visible==='show'">
              批量开通
            </el-button>
            <el-button @click="handleDelete(scope.row)" type="text" style="color:#f10000;margin-left:0"
              v-if="scope.row.combination==='1'" :loading="btnLoading&&(btnIndex===scope.row.id)">取消商品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div class='bottomWrap' v-if="tableData.length">
      <div class="total-wrap">
        <label>总数：</label><span class="ps-blue ps-count">{{total}}</span>
        <label>CPU/内存/磁盘：</label><span class="ps-yellow ps-count">{{cpu}}个/{{memory}}G/{{disk}}G</span>
      </div>
      <div class="page-wrap">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize"
          layout="total, sizes, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>
    <!-- 设置 -->
    <!-- <el-dialog title="设置" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='12%' width="40%" @close='resetD("aform")'>
      <el-form :model="aform" :rules="rules2" ref="aform">
        <el-form-item label="可见性：" :label-width="formLabelWidth" prop="visible">
          <el-select style="width:190px;" placeholder="请选择运行状态" v-model="aform.visible">
            <el-option value="show" label="显示">显示</el-option>
            <el-option value="hide" label="隐藏">隐藏</el-option>
          </el-select>
        </el-form-item> -->
    <!--废弃 <el-form-item label="用途：" :label-width="formLabelWidth" prop="usaged">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="aform.usaged" placeholder='请输入用途'
            :style='{width:inputLabelWidth}'></el-input>
        </el-form-item> -->
    <!-- </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 批量开通桌面new -->
    <el-dialog title="批量开通" :visible.sync="dialogFormVisibleBatch" :close-on-click-modal="no"
      :custom-class='backData.ipDistri==="static"?"merchandiseDialog":"merchandiseDialogMini"' top='12%'
      @close='resetD("batchform")'>
      <!-- <el-button type="text" @click="handleClickBatch" style="float:right;">新增</el-button> -->
      <el-form :model="batchform" ref="batchform">
        <div style="display:flex;align-items:center;" v-for="(item,index) in batchform" :key="index">
          <!-- <el-form-item label="商品数：" :label-width="formLabelWidth" prop="merCount">
          <el-input-number v-model="batchform.merCount" controls-position="right" @change="handleChange"
            :min="1"
            :max="Math.floor(backData.leftMer/multSelectionTran.length)">
          </el-input-number>
        </el-form-item> -->
          <el-form-item :label="`${index+1}. 用户名：`" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="item.userName" placeholder='请输入用户名' :style='{width:"180px"}'></el-input>
          </el-form-item>
          <el-form-item label="命名规则：" :label-width="formLabelWidth" prop="namePolicy">
            <el-select style="width:180px;" placeholder="请选择命名规则" v-model="item.namePolicy">
              <el-option :value="itema.name" :label="itema.name" v-for="(itema,index) in nameList" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`IP地址：`" :label-width="formLabelWidth" prop="ipAddress"
            v-if='backData.ipDistri==="static"'>
            <el-input v-model="item.ipAddress" :placeholder='`IP网段:${backData.ipScope}`' :style='{width:"190px"}'>
            </el-input>
            <!-- <div>目前网段:{{backData.ipScope}}</div> -->
          </el-form-item>
          <el-button type="text" @click="handleClickBatch" style="float:right;margin-bottom:22px;margin-left:20px;"
            v-if="index===0">新增</el-button>
          <el-button type="text" @click="handleClickBatchDel(index)"
            style="float:right;margin-bottom:22px;margin-left:20px;color:#f10000" v-if="index!==0">删除</el-button>
        </div>
        <!-- <el-form-item label="用途：" :label-width="formLabelWidth" prop="usaged">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="aform.usaged" placeholder='请输入用途'
            :style='{width:inputLabelWidth}'></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addBatch('batchform')">确 定</el-button>
        <el-button @click="dialogFormVisibleBatch = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 批量开通桌面  -->
    <!-- <el-dialog title="用户列表" :visible.sync="transformForm" :close-on-click-modal="no" custom-class='merchandiseD'
      top='5%' @close='resetD("transformForm")'>
      <div class="search-wrap">
        <el-input placeholder="请输入用户名名称" v-model="queryUserName" style="width:185px;" clearable
          @clear="handleClickOpenS" />
        <el-button type="ghost" @click="handleClickOpenS"><i class="el-icon-search"></i>查询</el-button> -->
    <!-- <el-button @click="assignMercount" type="primary"
          :disabled="multSelectionTran.length===0||multSelectionTran.length>backData.leftMer" style="float:right;margin-right:5px;">批量分配</el-button> -->
    <!-- </div>
      <div class="table-wrap" id="table-wrapTran">
        <el-table :data="userListData" height="340" ref="multipleTableTran" stripe
          :header-cell-style="{'text-align':'center'}" @row-click="rowClickS" @selection-change="handleSelectionChange"
          :cell-style="{'text-align':'center'}">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="用户名">
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap" v-show="userListData.length" style="text-align: center;margin-right:0">
        <el-pagination @current-change="handleCurrentChange1" @size-change="handleSizeChange1"
          :current-page="currentPage5" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize1"
          layout="total, sizes, prev, pager, next" :total="countTran">
        </el-pagination> -->
    <!-- <Page :total="count" size="small" show-total show-sizer @on-change="handleCurrentChange"></Page> -->
    <!-- </div>
      <div slot="footer" class="dialog-footer"> -->
    <!-- <div>
          <span style="color:#606266;font-size:15px;margin-right:10px">桌面开通个数:</span>
          <el-input-number size="small" v-model="openNumber" :min="1"></el-input-number>
          <span
            style="color:#606266;font-size:15px;margin-left:10px">(商品剩余总数:{{this.restNum.split('/')[0]-(this.multSelectionTran.length*this.openNumber)}})</span>

        </div> -->
    <!-- <div>
          <el-button @click="assignMercount" type="primary"
            :disabled="multSelectionTran.length===0||multSelectionTran.length>backData.leftMer">批量开通</el-button> -->
    <!-- <el-button type="primary" :loading="btnLoading" :disabled="multSelectionTran.length===0||checkNumber"
            @click="serviceConfirm">确
            定</el-button> -->
    <!-- <el-button @click="transformForm = false">取 消</el-button>
        </div>
      </div>
    </el-dialog> -->
    <!-- 命名规则 -->
    <!-- <el-dialog title="批量分配" :visible.sync="dialogFormVisibleAudit" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='12%' width="40%" @close='resetD("aform")'>
      <el-form :model="assignform" :rules="assignrule2" ref="assignform">
        <el-form-item label="商品数：" :label-width="formLabelWidth" prop="merCount">
          <el-input-number v-model="assignform.merCount" controls-position="right" @change="handleChange" :min="1"
            :max="Math.floor(backData.leftMer/multSelectionTran.length)">
          </el-input-number>
        </el-form-item>
        <el-form-item label="命名规则：" :label-width="formLabelWidth" prop="namePolicy">
          <el-select style="width:190px;" placeholder="请选择命名规则" v-model="assignform.namePolicy">
            <el-option :value="item.name" :label="item.name" v-for="(item,index) in nameList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`IP地址：`" :label-width="formLabelWidth" prop="IpAddress"
          v-if="backData.ipDistri==='static'">
          <el-input v-model="assignform.IpAddress" placeholder='请输入IP地址' :style='{width:inputLabelWidth}'></el-input>
          <div>目前网段:{{backData.ipScope}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="auditO('aform')">提 交</el-button>
        <el-button @click="dialogFormVisibleAudit = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 合并商品 -->
    <el-dialog title="合并商品" :visible.sync="dialogFormVisibleDisk" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='5%' width="45%" @close='resetD("dform")'>
      <el-form :model="dform" :rules="ruled" ref="dform">
        <el-form-item label="商品名称：" :label-width="formLabelWidth" prop="commodName">
          <el-input v-model="dform.commodName" placeholder='请输入商品名称' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item>
        <!-- <el-form-item label="描述：" :label-width="formLabelWidth" prop="describe">
          <el-input v-model="dform.describe" placeholder='请输入商品描述：' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item> -->
        <el-form-item label="描述：" :label-width="formLabelWidth" prop="description">
          <el-input v-model="dform.description" placeholder='请输入商品描述' :style='{width:inputLabelWidth}'></el-input>
        </el-form-item>
      </el-form>
      <div class="table-wrap" id="table-wrapMerge" style="margin-top:30px;">
        <el-table :data="mergeListData" height="300" stripe :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}">
          <el-table-column prop="name" label="商品名称">
          </el-table-column>
          <el-table-column prop="spec" label="CPU/内存/磁盘">
          </el-table-column>
          <el-table-column prop="priority" label="优先级">
            <template slot-scope="scope">
              <el-input-number size="small" v-model="scope.row.priority" :min="1"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="page-wrap" v-show="userListData.length" style="text-align: center;">
        <el-pagination @current-change="handleCurrentChange1" @size-change="handleSizeChange1"
          :current-page="currentPage5" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize1"
          layout="total, sizes, prev, pager, next" :total="countTran">
        </el-pagination>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addDisk('dform')">确 定</el-button>
        <el-button @click="dialogFormVisibleDisk = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <psloading v-show="loadingState" :text="text"></psloading> -->
  </div>
</template>


<script>
  import {
    httpAjax,
    httpGet,
    computedTableHeight,
    addScrollBar,addScrollBarOther
  } from 'api/common'
  export default {
    data() {
      var nan32 = (rule, value, callback) => {
        var reg =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg.test(value)) {
          callback('请按规范输入 IP 地址, 例如: 192.168.3.5')
        } else {
          callback()
        }
      }
      //   var nan16 = (rule, value, callback) => {
      //     if (value && value % 1 === 0 && value <= 16) {
      //       callback()
      //     } else {
      //       callback('请输入正确的数字')
      //     }
      //   }
      //   var nan32 = (rule, value, callback) => {
      //     if (value && value % 1 === 0 && value <= 32) {
      //       callback()
      //     } else {
      //       callback('请输入正确的数字')
      //     }
      //   }
      //   var nan1024 = (rule, value, callback) => {
      //     if (value && value % 1 === 0 && value <= 1024) {
      //       callback()
      //     } else {
      //       callback('请输入正确的数字')
      //     }
      //   }
      //   var blow255 = (rule, value, callback) => {
      //     if (value && value.length <= 255) {
      //       callback()
      //     } else {
      //       callback('请填写描述')
      //     }
      //   }
      return {
        expandChange: false,
        dialogFormVisibleBatch: false,
        batchform: [{
          userName: '',
          namePolicy: '',
          ipAddress: ''
        }],
        nameList: [],
        assignform: {
          merCount: '',
          namePolicy: '',
          IpAddress: '',
          ipDistri: '',
          ipScope: ''
        },
        assignrule2: {
          merCount: [{
            required: true,
            message: '请选择商品数',
            // validator: nan16,
            trigger: 'change'
          }],
          namePolicy: [{
            required: true,
            message: '请选择命名规则',
            // validator: nan16,
            trigger: 'change'
          }],
          IpAddress: [{
            required: true,
            validator: nan32,
            trigger: 'blur'
          }]
        },
        dialogFormVisibleAudit: false,
        btnIndex: '',
        restNum: '1/',
        mergeListData: [],
        openNumber: 1,
        btnLoading: false,
        userListData: [],
        transformForm: false,
        loadingRadio: false,
        radio3: '工作模式',
        no: false,
        tableData: [],
        queryUserName: '',
        count: 0,
        countTran: 0,
        tableHeight: 400,
        total: 0,
        cpu: 0,
        memory: 0,
        disk: 0,
        vmTableLoadingState: true,
        currentPage4: 1,
        currentPage5: 1,
        currentSize: 10,
        currentSize1: 10,
        multSelection: [],
        // multSelectionADD: [],
        multSelectionTran: [],
        applyUser: '',
        // applyTable: '',
        // applyState: '',
        // applyLoginState: '',
        loadingState: false,
        text: '请稍后',
        dialogFormVisible: false,
        aform: {
          visible: '',
          usaged: '',
        },
        rules2: {
          visible: [{
            required: true,
            message: '请选择可见性',
            trigger: 'change'
          }],
          usaged: [{
            required: true,
            message: '请输入用途',
            trigger: 'blur'
          }]
        },
        aformData: {},
        formLabelWidth: '110px',
        inputLabelWidth: '300px',
        dialogFormVisibleP: false,
        dialogFormVisibleDisk: false,
        dform: {
          commodName: '',
          //   describe: '',
          description: '',
        },
        ruled: {
          commodName: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
          //   describe: [{
          //     required: true,
          //     message: '请输入商品描述',
          //     trigger: 'blur'
          //   }],
          description: [{
            required: true,
            message: '请输入商品描述',
            trigger: 'blur'
          }],
        },
        faList: [],
        dialogFormVisibleSyn: false,
        openDeskId: '',
        backData: {
          leftMer: 0
        },
      }
    },
    created() {
      this.getVmList(1)
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.tableHeight = computedTableHeight()
      // })
    },
    computed: {
      checkNumber() {
        let all = this.restNum.split('/')[0];
        let now = this.multSelectionTran.length * this.openNumber;
        if (now > all) {
          return true;
        } else {
          return false;
        }
      },
    },
    methods: {
      exchange() {
        console.log(12)
      },
      // headName(obj){
      //     // console.log(obj)
      //     if(obj.column.label==='商品名称'){
      //         return 'productN'
      //     }
      // },
      //   rowName(obj){
      //       console.log(obj)
      //       if(obj.row.combination==='1'){
      //           return 'combinationOne'
      //       }
      //   },
      cellName(obj) {
        // console.log(obj.column.label)
        if (obj.column.label === '商品名称') {
          return 'productN'
        }
        return 'textCenter'
      },
      addBatch() {
        let valid
        if (this.backData.ipDistri !== 'static') {
          valid = this.batchform.every(item => {
            let {
              userName,
              namePolicy
            } = {
              ...item
            }
            console.log(userName, namePolicy)
            return userName !== '' && namePolicy !== ''
          })
        } else {
          valid = this.batchform.every(item => {
            let {
              userName,
              namePolicy,
              ipAddress
            } = {
              ...item
            }
            return userName !== '' && namePolicy !== '' && ipAddress !== ''
          })
        }
        if (valid) {
          //提交
          let params = {
            merId: this.backData.id,
            batchUsers: JSON.stringify(this.batchform)
          }
          this.btnLoading = true;
          httpAjax('desktop/batchOpenDesk', params).then(res => {
            //   this.nameList = res;
            if (res.result == 'success') {
              this.$message({
                type: 'success',
                message: '开通成功!请到工单列表中查看对应的进度!'
              });
            } else {
              this.$message({
                type: 'error',
                message: res.resultDesc
              });
            }
            this.dialogFormVisibleBatch = false;
            this.btnLoading = false;
            // console.log(res)
          }).catch(() => {
            this.btnLoading = false;

          })
        } else {
          this.$message.error('请输入完整信息!')
        }
      },
      handleClickBatchDel(idx) {
        this.batchform.splice(idx, 1)
      },
      handleClickBatch() {
        // console.log(this.backData)
        if (this.batchform.length < this.backData.leftMer) {
          this.batchform.push({
            name: '',
            namePolicy: '',
            IpAddress: ''
          })
        } else {
          this.$message.error('该商品的剩余商品数为' + this.backData.leftMer + ',无法再新增!')
        }
      },
      assignMercount() { //获取命名空间
        let params = {};
        params.faIp = this.backData.faIp;
        // this.dialogFormVisibleAudit = true;
        httpAjax('desktop/findNamePolicies', params).then(res => {
          this.nameList = res;
        })
      },
      load(tree, treeNode, resolve) {
        let params = {
          merId: tree.id
        }
        httpAjax('merchandise/findSubMerchandise', params).then(res => {
          //   console.log(res)
          let mapR = res.data
          //   .map(item => {
          //     return {
          //       id: item.id + 'child',
          //       name: item.name,
          //       combination: '2', //item.combination,
          //       cpu: item.cpu,
          //       memory: item.memory,
          //       sysDisk: item.sysDisk,
          //       disk: item.disk,
          //       visible: item.visible,
          //       merCount: item.merCount,
          //       usedMer: item.usedMer,
          //       leftMer: item.leftMer,
          //       description: item.description,
          //       createTime: item.createTime
          //     }
          //   })

          resolve(mapR)
        }).then(() => {
          this.$nextTick(() => {
            addScrollBar('#table-wrap', false, '', 'no')
          })
        })
        // setTimeout(() => {
        //   resolve([{
        //     id: 31,
        //     date: '2016-05-01',
        //     name: '王小虎',
        //     address: '上海市普陀区金沙江路 1519 弄'
        //   }, {
        //     id: 32,
        //     date: '2016-05-01',
        //     name: '王小虎',
        //     address: '上海市普陀区金沙江路 1519 弄'
        //   }])

        // }, 1000);
      },
      mergeChange() { //合并商品
        if (this.multSelection.length > 1) {
          let cpu = this.multSelection.map(item => item.cpu);
          let memory = this.multSelection.map(item => item.memory);
          let disk = this.multSelection.map(item => item.disk);
          let approval = this.multSelection.map(item => item.approval);
          let onlySpec = [...new Set(cpu)].length === 1 && [...new Set(memory)].length === 1 && [...new Set(disk)]
            .length === 1 && [...new Set(approval)].length === 1;
          let re = this.multSelection.every(item => {
            return item['visible'] !== 'hide' && item.combination !== '1' && item.ipDistri !== "static"
          })
          if (re && onlySpec) {
            this.dialogFormVisibleDisk = true;
            this.mergeListData = this.multSelection.map(item => {
              return {
                subMerId: item.id,
                name: item.name,
                spec: item.spec,
                priority: 1,
                cloudId: item.cloudId
              }
            });
            this.$nextTick(() => {
              addScrollBar('#table-wrapMerge', true)
            })

          } else {
            this.$message({
              message: '合并的商品必须规格相同、审批规则相同、商品类型不能为合并商品、IP分配方式不能为静态地址、且剩余数不能为0',
              type: 'error',
              duration: 6000
            });
            //   this.$message.error('合并的商品必须规格相同、审批方式相同,且剩余数不能为0,商品类型不能为合并商品,IP地址不能为静态地址')
            return
          }
        } else {
          this.$message.error('请选择1个以上商品')
          return;
        }
      },
      addDisk() { //合并商品
        this.$refs['dform'].validate((valid) => {
          let result = this.mergeListData.some(item => {
            return item.priority == undefined
          });
          if (result) {
            this.$message.error('请输入优先级')
            return
          }
          let params = {};
          params.commods = this.mergeListData;
          //   params.describe = this.dform.describe;
          params.commodName = this.dform.commodName;
          params.description = this.dform.description;
          params.cloudId = this.mergeListData[0].cloudId
          //   console.log(params)
          if (valid) {
            this.btnLoading = true;
            httpAjax('merchandise/merge', {
              merGroup: JSON.stringify(params)
            }).then(res => {
              if (res.success == "success") {
                this.$message({
                  type: 'success',
                  message: '合并成功!'
                });
                // this.$alert('修改成功! 需要花费一些时间,请耐心等待', '增加磁盘', {
                //   confirmButtonText: '确定',
                //   type: 'success',
                //   callback: action => {
                //     // this.multSelection = []
                this.getVmList()
                this.multSelection = [];
                //   }
                // });
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultDesc
                });
              }
              this.dialogFormVisibleDisk = false;
              this.btnLoading = false;
            }).catch(() => {
              this.btnLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      serviceConfirm() { //批量开通桌面
        let id = this.multSelectionTran.map(item => {
          return item.id
        }).join(',')
        let params = {};
        params.userIds = id;
        params.merId = this.openDeskId;
        params.deskNum = this.openNumber;
        this.btnLoading = true;
        httpAjax('desktop/batchOpenDesk', params).then(res => {
          if (res.success == "success") {
            this.$message({
              type: 'success',
              message: '开通成功,请在工单中查看桌面开通进度!'
            });
            this.getVmList()
            this.multSelection = [];
            this.transformForm = false;
          } else {
            this.$message({
              type: 'error',
              message: res.result || '通讯错误'
            });
          }
          this.btnLoading = false;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '通讯错误,请刷新页面后访问。'
          });
          this.btnLoading = false;

        })
      },
      handleDelete(data) {
        this.btnIndex = data.id;
        this.$confirm('确定要取消该合并商品?', '取消商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnLoading = true;
          let params = [{
            merId: data.id,
            cloudId: data.cloudId
          }];
          httpAjax('merchandise/deleteMerge', {
            merGroup: JSON.stringify(params)
          }).then(res => {
            if (res.success == "success") {
              this.$message({
                type: 'success',
                message: '取消成功!'
              });
              this.getVmList()
              this.multSelection = [];
            } else {
              this.$message({
                type: 'warning',
                message: res.resultDesc || '通讯错误,请刷新页面后访问'
              });
            }
            this.btnLoading = false;
          }).catch(() => {
            this.btnLoading = false;
          })
        }).catch(() => { //取消

        })
      },
      handleClickOpenS() { //批量开通查询
        let url =
          `user/substitutionList?${Math.random()}&page=${this.currentPage5}&limit=${this.currentSize1}&name=${this.queryUserName}`
        httpGet(url).then((res) => {
          if (res.data) {
            this.userListData = res.data
            this.countTran = res.count
            this.transformForm = true
            this.$nextTick(() => {
              addScrollBar('#table-wrapTran', true)
            })
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      handleClickOpen(data) { //批量开通
        this.openDeskId = data.id
        this.restNum = data.leftQuota;
        this.backData = data;
        this.backData.ipDistri = data.ipDistri
        console.log(this.backData)
        this.dialogFormVisibleBatch = true;
        this.assignMercount();
        // let url =
        //   `user/substitutionList?${Math.random()}&page=${this.currentPage5}&limit=${this.currentSize1}&name=${this.queryUserName}`
        // httpGet(url).then((res) => {
        //   if (res.data) {
        //     this.userListData = res.data
        //     this.countTran = res.count
        //     // this.transformForm = true
        //     this.$nextTick(() => {
        //       addScrollBar('#table-wrapTran', true)
        //     })
        //   } else {
        //     this.$message.error('通信错误')
        //   }
        // }).catch((err) => {
        //   console.log(err)
        // })
      },
      rowClick(row, column, event) {
        if (row.combination === '2') {
          return
        }
        // console.log(event)
        if (event.target.localName === 'button' || event.target.parentNode.localName === 'button') {
          return
        }
        if (row.combination === '1') {
          this.expandChange = this.expandChange === true ? false : true;
          let a = event.path.filter(item => {
            return item.className == 'el-table__row el-table__row--level-0'
          })
          a[0].querySelector('.el-icon.el-icon-arrow-right').click();
          if (this.expandChange === false) {
                this.$nextTick(() => {
               addScrollBar('#table-wrap', false, '',a[0].querySelector('.el-icon.el-icon-arrow-right'))
            })
            // setTimeout(() => {
            //   addScrollBarOther('#table-wrap', a[0].querySelector('.el-icon.el-icon-arrow-right'))
            // }, 100)
          }else{
               this.$nextTick(() => {
               addScrollBar('#table-wrap', false, '', 'no')
            })
            //    setTimeout(() => {
            //   addScrollBar('#table-wrap', false, '', 'no')
            // }, 100)
          }
          //   console.log(a[0].querySelector('.el-icon.el-icon-arrow-right'))
          //    this.$refs.multipleTable.toggleRowExpansion(row,true)
          //   return
        }
        if (this.multSelection.length > 0 && this.multSelection.filter(item => item.id === row.id).length === 0) {
          //   this.$refs.multipleTable.toggleRowSelection(row);
          this.multSelection = [...this.multSelection, row];
        } else if (this.multSelection.length > 0 && this.multSelection.filter(item => item.id === row.id).length ===
          1) {
          this.multSelection = this.multSelection.filter(item => item.id !== row.id);
        } else {
          this.multSelection = [row];
        }
        // console.log(  this.multSelection)
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      handleSelectionChangeMerge(val) {
        this.multSelection = val;
      },
      resetD(formName) {
        switch (formName) {
          case 'aform':
            this.aform = {
              visible: '',
              usaged: '',
            }
            this.$refs['aform'].resetFields();
            break;
          case 'dform': //合并商品
            this.dform = {
              commodName: '',
              //   describe: '',
              description: '',
            }
            this.$refs['dform'].resetFields();
            this.mergeListData = [];
            // this.multSelection = [];
            break;
          case 'transformForm': //批量开通
            this.multSelectionTran = []
            this.userListData = [];
            this.openNumber = 1;
            this.openDeskId = '';
            this.queryUserName = '';
            this.currentPage5 = 1;
            this.currentSize1 = 10;
            break;
          case 'batchform':
            this.batchform = [{
              name: '',
              namePolicy: '',
              IpAddress: ''
            }]
            break;
          default:
            break;
        }
      },

      addAccount(formName) { //设置可见
        this.$refs[formName].validate((valid) => {
          let f = {
            ...this.aform
          };
          if (valid) {
            this.btnLoading = true;
            httpAjax('merchandise/merSetting', f).then(res => {
              if (res.result == "success") {
                this.dialogFormVisible = false;
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                });
                // this.$alert('修改成功,需要重启虚机!', '修改规格', {
                //   confirmButtonText: '确定',
                //   type: 'success',
                //   callback: action => {
                this.getVmList()
                //   }
                // });
              } else {
                this.$message({
                  type: 'error',
                  message: '设置错误'
                });
              }
              this.btnLoading = false;
            }).catch(() => {
              this.btnLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleClick(data) { //点击设置
        let re = data.leftQuota.split('/').some(item => {
          return item < 1
        })
        if (!re) {
          this.aform = {
            visible: data.visible === 'show' ? 'hide' : 'show',
            usaged: data.usaged,
            merId: data.id
          }
          this.dialogFormVisible = true;
        } else {
          this.$message.error('该商品已经用完，无法设置，请联系系统管理员修改配额!')
        }
      },
      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },
      checkDisable(type) {
        if (this.multSelection.length > 1) {
          let cpu = this.multSelection.map(item => item.cpu);
          let memory = this.multSelection.map(item => item.memory);
          let disk = this.multSelection.map(item => item.disk);
          let approval = this.multSelection.map(item => item.approval);
          let onlySpec = [...new Set(cpu)].length === 1 && [...new Set(memory)].length === 1 && [...new Set(disk)]
            .length === 1 && [...new Set(approval)].length === 1;
          let re = this.multSelection.every(item => {
            return item['visible'] !== 'hide' && item.combination !== '1' && item.ipDistri !== "static"
          })
          return re && onlySpec;
        } else {
          return false;
        }
        // if (type === 'start') {
        //       return this.multSelection[0].runState === 'stopped'
        // } else if (type === 'restart') {
        //      return this.multSelection[0].runState === 'running'
        // } else if (type === 'quit') {
        //     return this.multSelection[0].runState !== 'deleted'
        // } else if (type === 'edit') {
        //      return this.multSelection[0].deskType === 'copyClone'
        // }
      },
      //   checkSelect(selection, row) {
      //     //   if(selection.length===1){
      //     //   }
      //     if (selection.length > 1) {
      //       this.$refs.multipleTable.toggleRowSelection(selection[0]);
      //     }
      //     this.multSelection = selection;
      //     // console.log(selection, row)
      //   },
      //   checkSelect1(selection, row) {
      //     //   if(selection.length===1){
      //     //   }
      //     if (selection.length > 1) {
      //       this.$refs.multipleTableTran.toggleRowSelection(selection[0]);
      //     }
      //     this.multSelectionTran = selection;
      //     // console.log(selection, row)
      //   },
      //   handleSelectionChange(val) {
      //     this.multSelectionTran = val;
      //   },
      //   rowClickS(row, column, event) {

      //     if (this.multSelectionTran.length > 0 && this.multSelectionTran.filter(item => item.id === row.id).length ===
      //       0) {
      //       //   this.$refs.multipleTable.toggleRowSelection(row);
      //       this.multSelectionTran = [...this.multSelectionTran, row];
      //     } else if (this.multSelectionTran.length > 0 && this.multSelectionTran.filter(item => item.id === row.id)
      //       .length === 1) {
      //       this.multSelectionTran = this.multSelectionTran.filter(item => item.id !== row.id);
      //     } else {
      //       this.multSelectionTran = [row];
      //     }
      //     // console.log(  this.multSelection)
      //     this.$refs.multipleTableTran.toggleRowSelection(row);
      //   },
      getVmList(first, page) {
        this.multSelection = []
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          merName: this.applyUser,
          //   computerName: this.applyTable,
          //   runState: this.applyState,
          //   loginState: this.applyLoginState
        }
        const url = `merchandise/settingList?${Math.random()}&online=1`
        httpGet(url, para).then((res) => {
          this.tableHeight = computedTableHeight()
          this.tableData = res.data.map(item => {
            return {
              ...item,
              hasChildren: item.combination === '1' ? true : false
            }
          });
          //   console.log(this.tableData)
          this.vmTableLoadingState = false;
          this.count = res.count;
          this.$nextTick(() => {
            this.setScrollBar('#table-wrap')
          })
          this.getStatistics()
        }).catch((error) => {
          console.log(error)
        })
      },
      handleCurrentChange(val) {
        this.multSelection = [];
        this.currentPage4 = val;
        this.getVmList()
      },
      handleSizeChange(val) {
        this.multSelection = [];
        this.currentSize = val;
        this.getVmList()
      },
      handleCurrentChange1(val) { //批量开通
        this.multSelectionTran = [];
        this.currentPage5 = val;
        this.handleClickOpenS()
      },
      handleSizeChange1(val) { //批量开通
        this.multSelectionTran = [];
        this.currentSize1 = val;
        this.handleClickOpenS()
      },
      getStatistics() {
        const url = 'desktop/merchandiseStat?online=1'
        httpAjax(url).then((res) => {
          if (res.cpuCount) {
            this.total = res.merCount
            this.cpu = res.cpuCount
            this.memory = res.memCount
            this.disk = res.diskCount
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // patternState(obj) {
      //   let state = obj.opType
      //   return state == 'set' ? '维护模式' : '工作模式'
      // },
      setScrollBar(dom) {
        // if (this.tableData.length) {
        addScrollBar(dom)
        // }
      },
    }
  }

</script>
<style scoped>
  .bottomWrap {
    position: absolute;
    padding: 0 15px 0px 15px;
    bottom: 0;
    width: calc(100% - 60px);
    height: 40px;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;
  }

  .flexsp {
    display: flex;
    justify-content: space-between;
  }

</style>
<style>
  #merchandise .el-table-column--selection.is-leaf .cell {
    display: inline-block;
  }

  #merchandise .el-table__expand-icon {
    display: inline-block;
    vertical-align: middle;
    /* width: 40px; */
    /* margin-left: -50px; */
  }

  #merchandise .el-table__expand-icon>.el-icon {
    font-size: 20px;
    margin-left: -10px;
    margin-top: -10px;
  }

  #merchandise .el-table__row--level-1 .el-table-column--selection .cell {
    display: none;
  }

  #merchandise .productN .cell {
    text-align: left;
  }

  #merchandise .el-table__header-wrapper .productN {
    padding-left: 15px;
  }

  #merchandise .textCenter .cell {
    text-align: center;
  }

  /* #merchandise .el-table__row--level-0 td:nth-child(2) .cell {
    text-align: left;
    padding-left: 30px;
  } */

  .merchandiseDialog {
    width: 70%;
  }

  @media screen and (max-width: 1380px) {
    .merchandiseDialog {
      width: 80%;
    }

    .merchandiseDialogMini {
      width: 60%;
    }
  }

</style>
