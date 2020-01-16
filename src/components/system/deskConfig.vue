<template>
  <div id="deskConfig">
    <div class="search-wrap">
      <el-input placeholder="请输入商品名称" style="width:185px;" clearable v-model="applyUser" @keyup.enter.native="clearData"
        @clear="clearData(1)">
      </el-input>
      <el-button icon="el-icon-search" circle @click="searchData"></el-button>
      <el-button type="primary" style="float:right;margin-right:10px;" @click="updateDesk">新增</el-button>
      <!-- <el-button type="primary" style="float:right;margin-right:10px;" @click="assignDesk">分配云管理员</el-button> -->

    </div>
    <!-- <div class="button-wrap"> -->
    <!-- </div> -->
    <div class="table-wrap" id="table-wrap">
      <el-table :data="tableData" v-loading="vmTableLoadingState" :height="tableHeight" @select="checkSelect" stripe
        :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="name" label="商品名称" min-width="130">
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
        <el-table-column prop="visible" label="IP分配" width="100">
          <template slot-scope="scope">
            <div>
              {{scope.row.ipDistri==='dynamic'?'动态IP':'静态IP'}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="visible" label="IP分配" width="80">
          <template slot-scope="scope">
            <div >
              {{scope.row.ipDistri==='dynamic'?'动态':'静态'}}
            </div>
          </template>
        </el-table-column>  -->
        <el-table-column prop="visible" label="审批规则" width="100">
          <template slot-scope="scope">
            <div :style="scope.row.approval==='false'?'color:#42b983':''">
              {{scope.row.approval==='false'?'无需审批':'需要审批'}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="spec" label="内存" width="100">
               <template slot-scope="scope">
            {{scope.row.spec.split('/')[1]}}
          </template>
        </el-table-column>
         <el-table-column prop="spec" label="磁盘" width="100">
               <template slot-scope="scope">
            {{scope.row.spec.split('/')[2]}}
          </template>
        </el-table-column> -->
        <el-table-column prop="virtualNum" label="商品总数" width="100">
        </el-table-column>
        <el-table-column prop="quota" label="已分配商品数" width="120">
          <template slot-scope="scope">
            {{scope.row.merCount}}
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column prop="leftQuota" label="可分配商品数" width="120">
          <template slot-scope="scope">
            {{scope.row.leftMer}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="usedQuota" label="已使用商品数" width="120">
          <template slot-scope="scope">
            {{scope.row.usedMer}}
          </template>
        </el-table-column> -->
        <el-table-column prop="company" label="分配管理员" width="120">
          <template slot-scope="scope">
            <el-button @click="assignDesk(scope.row)" type="text" style="padding:0;">分配配额</el-button>
            <!-- <el-button type="text" style="padding:0;margin-left:0" v-if="scope.row.merCount>'0'"
              @click="showCloud(scope.row)">修改配额</el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            {{new Date(scope.row.createTime).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述">
          <template slot-scope="scope">
            <div>
              {{scope.row.description||'暂无'}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="prefix" label="前缀">
        </el-table-column> -->
        <el-table-column prop="postfix" label="桌面命名后缀">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" style="padding:0">修改</el-button>
            <!-- <el-button @click="assignDesk(scope.row)" type="text" style="padding:0;color:#42b983">分配</el-button> -->
            <el-button @click="handleClick(scope.row)" type="text" style="color:#f10000;padding:0"
              :loading="btnLoadingD&&(btnIndex===scope.row.id)">{{btnLoadingD&&(btnIndex===scope.row.id)?'删除中':'删除'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Table  :height="tableHeight" :loading="vmTableLoadingState" :columns="tableHeader" :data="tableData"></Table> -->
    </div>
    <div class='bottomWrap' v-if="tableData.length">
      <div class="page-wrap">
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize"
          layout="total, sizes, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>
    <!-- 新增 -->
    <el-dialog :title="aform.id?'修改云桌面':'新增云桌面'" :visible.sync="dialogFormVisible" :close-on-click-modal="no"
      custom-class='deskConAddDialog' top='3%' width="70%" @close='resetD("aform")' v-loading="dialogLoading"
      element-loading-text="拼命加载中">
      <el-scrollbar wrap-class="scrollbar-wrapper" id="menuList123" ref="myScrollbar">
        <el-form :model="aform" :rules="rules2" ref="aform">
          <el-form-item label="商品名称：" :label-width="formLabelWidth" prop="name">
            <el-input v-model="aform.name" placeholder='请输入商品名称' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
          <el-form-item label="FusionAccess：" :label-width="formLabelWidth" prop="faIp">
            <el-select style="width:190px;" placeholder="请选择FusionAccess" v-model="aform.faIp" @change="faidChange"
              :style='{width:inputLabelWidth}'>
              <el-option v-for="(item,index) in faIdList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择域：" :label-width="formLabelWidth" prop="domain">
            <el-select style="width:190px;" placeholder="请选择选择域" v-model="aform.domain" :style='{width:inputLabelWidth}'
              @change="domainChange">
              <el-option v-for="(item,index) in domainList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择OU：" :label-width="formLabelWidth" prop="ou">
            <el-select style="width:190px;" placeholder="请选择选择OU" v-model="aform.ou" :style='{width:inputLabelWidth}'>
              <el-option v-for="(item,index) in ouSelectList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="站点：" :label-width="formLabelWidth" prop="site">
            <el-select style="width:190px;" placeholder="请选择站点" v-model="aform.site" :style='{width:inputLabelWidth}'
              @change="siteChange">
              <el-option v-for="(item,index) in siteList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集群：" :label-width="formLabelWidth" prop="cluster">
            <el-select style="width:190px;" placeholder="请选择集群" v-model="aform.cluster" :style='{width:inputLabelWidth}'
              @change="clusterChange">
              <el-option v-for="(item,index) in clusterList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择端口组：" :label-width="formLabelWidth" prop="port">
            <el-select style="width:190px;" placeholder="请选择选择端口组" v-model="aform.port"
              :style='{width:inputLabelWidth}'>
              <el-option v-for="(item,index) in portList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="虚机组：" :label-width="formLabelWidth" prop="virtualGroup">
            <el-select style="width:190px;" placeholder="请选择虚机组" v-model="aform.virtualGroup" @change="typeChange"
              :style='{width:inputLabelWidth}'>
              <el-option v-for="(item,index) in virtualGroupList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="桌面组：" :label-width="formLabelWidth" prop="deskGroup">
            <el-select style="width:190px;" placeholder="请选择桌面组" v-model="aform.deskGroup"
              :style='{width:inputLabelWidth}'>
              <el-option v-for="(item,index) in deskgroupList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="桌面类型：" :label-width="formLabelWidth" prop="deskType">
            <el-select style="width:190px;" :style='{width:inputLabelWidth}' v-model="defaultV">
              <el-option value="defaultV"
                :label="this.aform.virtualGroup.split('=')[2]==='copyClone'?'完整复制':this.aform.virtualGroup.split('=')[2]==='linkedClone'?'链接克隆':'全内存'">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择模板：" :label-width="formLabelWidth" prop="template">
            <el-select style="width:190px;" placeholder="请选择选择模板" v-model="aform.template" @change="templateChange"
              :style='{width:inputLabelWidth}'>
              <el-option v-for="(item,index) in templateList" :key="index" :value="item.value" :label="item.label">
                {{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="IP分配方式：" :label-width="formLabelWidth" prop="ipDistri">
            <el-radio-group v-model="aform.ipDistri">
              <el-radio label="dynamic">动态IP</el-radio>
              <el-radio label="static">静态IP</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="IP地址范围：" :label-width="formLabelWidth" prop="ipScope" v-if="aform.ipDistri==='static'">
            <el-input v-model="aform.ipScope" placeholder='请输入IP地址范围' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
          <el-form-item label="子网掩码：" :label-width="formLabelWidth" prop="subnetMask" v-if="aform.ipDistri==='static'">
            <el-input v-model="aform.subnetMask" placeholder='请输入子网掩码' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
          <el-form-item label="默认网关：" :label-width="formLabelWidth" prop="gateway" v-if="aform.ipDistri==='static'">
            <el-input v-model="aform.gateway" placeholder='请输入默认网关' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
          <el-form-item label="首选 DNS 服务器：" :label-width="formLabelWidth" prop="dnsServer"
            v-if="aform.ipDistri==='static'">
            <el-input v-model="aform.dnsServer" placeholder='请输入首选 DNS 服务器' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
          <el-form-item label="备选 DNS 服务器：" :label-width="formLabelWidth" prop="backupDns"
            v-if="aform.ipDistri==='static'">
            <el-input v-model="aform.backupDns" placeholder='请输入备选 DNS 服务器' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
          <el-form-item label="系统盘：" :label-width="formLabelWidth" prop="sysDataStores">
            <el-menu :default-active="aform.sysMode" class="el-menu-demo" mode="horizontal" @select="handleSelectSys"
              style="width:90%">
              <el-menu-item index="thinConfigMode">精简模式</el-menu-item>
              <el-menu-item index="commonConfigMode">普通模式</el-menu-item>
              <el-menu-item index="lazyZeroedConfigMode">普通延迟置零</el-menu-item>
            </el-menu>
            <el-table :data="tableDataSys" style="width: 90%" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}" @select="checkSelectSys" @row-click="rowClickSys"
              ref="multipleTableSys">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="id" prop="id">
              </el-table-column>
              <el-table-column label="数据存储" prop="name">
              </el-table-column>
              <el-table-column label="剩余容量(GB)" prop="freeSizeGB" width="110">
              </el-table-column>
              <el-table-column label="总容量(GB)" prop="capacityGB">
              </el-table-column>
              <el-table-column label="精简配置" prop="isThin">
                <template slot-scope="scope">
                  {{scope.row.isThin+''}}
                </template>
              </el-table-column>
              <el-table-column label="是否虚拟化" prop="isVirtual">
                <template slot-scope="scope">
                  {{scope.row.isVirtual+''}}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="用户盘：" :label-width="formLabelWidth" prop="userDataStores">
            <el-menu :default-active="aform.userMode" class="el-menu-demo" mode="horizontal" @select="handleSelectUser"
              style="width:90%">
              <el-menu-item index="thinConfigMode">精简模式</el-menu-item>
              <el-menu-item index="commonConfigMode">普通模式</el-menu-item>
              <el-menu-item index="lazyZeroedConfigMode">普通延迟置零</el-menu-item>
            </el-menu>
            <el-table :data="tableDataUser" style="width:90%" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}" @select="checkSelectUser" @row-click="rowClickUser"
              ref="multipleTableUser">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="id" prop="id">
              </el-table-column>
              <el-table-column label="数据存储" prop="name">
              </el-table-column>
              <el-table-column label="剩余容量(GB)" prop="freeSizeGB" width="110">
              </el-table-column>
              <el-table-column label="总容量(GB)" prop="capacityGB">
              </el-table-column>
              <el-table-column label="精简配置" prop="isThin">
                <template slot-scope="scope">
                  {{scope.row.isThin+''}}
                </template>
              </el-table-column>
              <el-table-column label="是否虚拟化" prop="isVirtual">
                <template slot-scope="scope">
                  {{scope.row.isVirtual+''}}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth" prop="email">
            <div style="color:#f10000">
              桌面实际发放时将以如下输入的CPU，内存，磁盘大小规格进行发放
            </div>
          </el-form-item>
          <el-form-item label="CPU(核)：" :label-width="formLabelWidth" prop="cpu">
            <el-input-number v-model="aform.cpu" controls-position="right" :min="1">
            </el-input-number>
          </el-form-item>
          <el-form-item label="内存(GB)：" :label-width="formLabelWidth" prop="memory">
            <el-input-number v-model="aform.memory" controls-position="right" :min="1">
            </el-input-number>
          </el-form-item>
          <el-form-item label="用户盘(GB)：" :label-width="formLabelWidth">
            <!-- <el-input-number v-model="aform.disk" controls-position="right" :min="1">
            </el-input-number> -->
            <el-input :value="userDisk" readonly class="templateInput">
            </el-input>
            <span style="margin-left:5px">(由选择的模板决定)</span>
          </el-form-item>
          <el-form-item label="系统盘(GB)：" :label-width="formLabelWidth">
            <el-input :value="systemDisk" readonly class="templateInput">
            </el-input>
            <span style="margin-left:5px">(由选择的模板决定)</span>
            <!-- <div>{{this.aform.template.split('|')[2]}}GB</div> -->
          </el-form-item>
          <el-form-item label="审批规则：" :label-width="formLabelWidth" prop="approval" v-if="aform.ipDistri!=='static'">
            <el-switch v-model="aform.approval" active-value="true" inactive-value="false" active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            <div>(<span style="color:#13ce66">绿色：</span>需要审批；<span style="color:#f10000">红色：</span>无需审批)</div>
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth" prop="description">
            <el-input v-model="aform.description" placeholder='请输入描述' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item>
          <el-form-item label="云桌面总数：" :label-width="formLabelWidth" prop="virtualNum">
            <el-input-number v-model="aform.virtualNum" controls-position="right" :min="1">
            </el-input-number>
            <div v-if="aform.id&&aform.merCount">已分给云管理员的配额为：{{aform.merCount}}个</div>
          </el-form-item>
          <!-- <el-form-item label="上传商品图片：" :label-width="formLabelWidth">
            <el-upload class="upload-demo" action="/api/uploader/upload" accept="images" ref="serverCert"
              :data="{type:'merIcon',foreignId:aform.id}" :on-remove="handleRemove" :auto-upload="false"
              :on-success="handlesuccess" :on-change="handleChangeUpload" :file-list="fileList" :on-error="handleError">
              <el-button type="primary"><i class="el-icon-upload" style="margin-right:5px"></i>上传商品文件</el-button>
            </el-upload>
          </el-form-item> -->
          <!-- <el-form-item label="桌面前缀：" :label-width="formLabelWidth" prop="prefix">
            <el-input v-model="aform.prefix" placeholder='如财务前缀为:cw' :style='{width:inputLabelWidth}'></el-input>
          </el-form-item> -->
          <el-form-item label="桌面命名后缀：" :label-width="formLabelWidth" prop="postfix">
            <el-input v-model="aform.postfix" placeholder='格式为"-test",字母不区分大小写,均为大写' :style='{width:inputLabelWidth}'
              @change="toUpperStr"></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="addAccount('aform')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改配额  -->
    <!-- <el-dialog title="云管理员列表" :visible.sync="transformForm" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='6%' @close='resetD("transformForm")'> -->
    <!-- <div class="search-wrap">
        <el-input placeholder="请输入代申请人名称" v-model="queryUserName" style="width:185px;" clearable @clear="queryUserList" />
        <el-button type="ghost" @click="queryUserList"><i class="el-icon-search"></i>查询</el-button>
      </div> -->
    <!-- <div class="table-wrap" id="table-wrapTran">
        <el-table :data="userListData" height="360" ref="multipleTableTran" stripe
          :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"> -->
    <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
    <!-- <el-table-column prop="name" label="账号">
          </el-table-column>
          <el-table-column prop="phone" label="电话">
          </el-table-column>
          <el-table-column prop="mail" label="邮箱">
          </el-table-column>
          <el-table-column label="操作" width="150" v-if="userListData.length">
            <template slot-scope="scope">
              <el-button @click="editMercount(scope.row)" type="text" style="padding:0">修改</el-button>
              <el-button @click="deleteManager(scope.row)" type="text" style="color:#f10000;padding:0"
                :loading="btnLoadingD&&(btnIndex===scope.row.id)">{{btnLoadingD&&(btnIndex===scope.row.id)?'删除中':'删除'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap" v-show="userListData.length" style="text-align: center;margin-right:0">
        <el-pagination @current-change="handleCurrentChange1" @size-change="handleSizeChange1"
          :current-page="currentPage5" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize1"
          layout="total, sizes, prev, pager, next" :total="countTran">
        </el-pagination> -->
    <!-- <Page :total="count" size="small" show-total show-sizer @on-change="handleCurrentChange"></Page> -->
    <!-- </div> -->
    <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary"
          @click="transformForm = false">确
          定</el-button>
        <el-button @click="transformForm = false">取 消</el-button>
      </div> -->
    <!-- </el-dialog> -->
    <!-- 分配管理员配额2  -->
    <el-dialog title="分配管理员配额" :visible.sync="transformFormSet1" :close-on-click-modal="no"
      custom-class='setCloudDialog' top='6%' @close='resetD("transformFormSet")'>
      <!-- <div class="search-wrap"> -->
      <!-- <el-input placeholder="请输入代申请人名称" v-model="queryUserName" style="width:185px;" clearable @clear="queryUserList" /> -->
      <!-- <el-button @click="assignMercount" type="primary"
          :disabled="multipleSelection.length===0||(globalData.leftMer<multipleSelection.length)">批量分配</el-button>
      </div> -->
      <div class="table-wrap" id="table-wrapTranS">
        <el-table :data="userListDataS" height="500" ref="multipleTableTranS" stripe
          :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column prop="name" label="用户">
          </el-table-column>
          <el-table-column prop="merCount" label="配额数" width="140">
            <template slot-scope="scope">
              <el-input-number size="small" v-model="scope.row.newCount" :min='scope.row.usedCount'
                :max="scope.row.maxCount" @change="calMaxMer(scope.row.id)"></el-input-number>


            </template>
          </el-table-column>
          <!-- <el-table-column prop="mail" label="邮箱">
          </el-table-column> -->
          <el-table-column label="" width="150">
            <template slot-scope="scope">
              <el-button @click="dispatchCloud(scope.row)" type="text" style="margin-left:10px;padding:0"
                v-if="scope.row.newCount!==scope.row.merCount" :loading="btnLoadingD&&(btnIndex===scope.row.id)">
                {{btnLoadingD&&(btnIndex===scope.row.id)?'修改中':'修改'}}</el-button>
              <el-button @click="cancelMaxMer(scope.row,scope.row.id)" type="text" style="color:#f10000;padding:0"
                v-if="scope.row.newCount!==scope.row.merCount">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap" v-show="userListDataS.length" style="text-align: center;margin-right:0">
        <el-pagination @current-change="handleCurrentChange1S" @size-change="handleSizeChange1S"
          :current-page="currentPage5S" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize1S"
          layout="total, sizes, prev, pager, next" :total="countTranS">
        </el-pagination>
        <!-- <Page :total="count" size="small" show-total show-sizer @on-change="handleCurrentChange"></Page> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoadingD" @click="dispatchCloud" :disabled="!userListDataS.some(item=>{
            return item.newCount !==item.merCount})">分 配</el-button>
        <el-button @click="transformFormSet1 = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分配管理员配额  -->
    <!-- <el-dialog title="分配管理员配额" :visible.sync="transformFormSet" :close-on-click-modal="no" custom-class='setCloudDialog'
      top='6%' @close='resetD("transformFormSet")'>
      <div class="search-wrap"> -->
    <!-- <el-input placeholder="请输入代申请人名称" v-model="queryUserName" style="width:185px;" clearable @clear="queryUserList" /> -->
    <!-- <el-button @click="assignMercount" type="primary"
          :disabled="multipleSelection.length===0||(globalData.leftMer<multipleSelection.length)">分配配额</el-button>
      </div>
      <div class="table-wrap" id="table-wrapTranS">
        <el-table :data="userListDataS" height="360" ref="multipleTableTranS" stripe
          :header-cell-style="{'text-align':'center'}" @row-click="rowClick" @selection-change="handleSelectionChange"
          :cell-style="{'text-align':'center'}">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="账号">
          </el-table-column>
          <el-table-column prop="phone" label="电话">
          </el-table-column>
          <el-table-column prop="mail" label="邮箱">
          </el-table-column> -->
    <!-- <el-table-column label="操作" width="150" v-if="userListDataS.length">
            <template slot-scope="scope">
              <el-button @click="assignMercount(scope.row)" type="text" style="padding:0">设置</el-button>
            </template>
          </el-table-column> -->
    <!-- </el-table>
      </div>
      <div class="page-wrap" v-show="userListDataS.length" style="text-align: center;margin-right:0">
        <el-pagination @current-change="handleCurrentChange1S" @size-change="handleSizeChange1S"
          :current-page="currentPage5S" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize1S"
          layout="total, sizes, prev, pager, next" :total="countTranS">
        </el-pagination> -->
    <!-- <Page :total="count" size="small" show-total show-sizer @on-change="handleCurrentChange"></Page> -->
    <!-- </div> -->
    <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" 
          @click="transformFormSet = false">确
          定</el-button>
        <el-button @click="transformFormSet = false">取 消</el-button>
      </div> -->
    <!-- </el-dialog> -->
    <!-- 修改配额-->
    <!-- <el-dialog :title="transformFormSet?'设置配额':'修改配额'" :visible.sync="dialogFormVisibleEdit" :close-on-click-modal="no"
      custom-class='accountManageDialog' top='15%' @close='resetD("eform")'>
      <el-form :model="eform" :rules="rulesEdit" ref="eform">
        <el-form-item label="所属管理员：" :label-width="formLabelWidth" v-if="transformForm">
          <div>
            {{eform.name}}
          </div>
        </el-form-item>
        <el-form-item label="商品数：" :label-width="formLabelWidth" prop="merCount">
          <el-input-number v-model="eform.merCount" controls-position="right" @change="handleChange"
            :min="transformFormSet?1:usedCount-0===0?1:usedCount"
            :max="transformFormSet?Math.floor(globalData.leftMer/multipleSelection.length): (globalData.leftMer+basicmerCount)">
          </el-input-number>
        </el-form-item> -->
    <!-- <el-form-item label="CPU数：" :label-width="formLabelWidth" prop="cpuCount">
          <div>{{eform.cpuCount}}</div>
          <el-input-number v-model="eform.cpuCount" controls-position="right" :min="eform.merCount*globalData.cpu">
          </el-input-number>
        </el-form-item>
        <el-form-item label="内存数：" :label-width="formLabelWidth" prop="memCount">
          <div>{{eform.memCount}}</div>
          <el-input-number v-model="eform.memCount" controls-position="right" :min="eform.merCount*globalData.memory">
          </el-input-number>
        </el-form-item>
        <el-form-item label="磁盘数：" :label-width="formLabelWidth" prop="diskCount">
          <div>{{eform.diskCount}}</div>
          <el-input-number v-model="eform.diskCount" controls-position="right" :min="eform.merCount*globalData.disk">
          </el-input-number>
        </el-form-item> -->
    <!-- </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="dispatchCloud('eform')">提 交</el-button>
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>


<script>
  import {
    httpAjax,
    httpGet,
    computedTableHeight,
    addScrollBar
  } from 'api/common'
  export default {
    data() {
      var notNan = (rule, value, callback) => {
        if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
          callback('商品名称不能有特殊字符');
        } else if (/(^\_)|(\__)|(\_+$)/.test(value)) {
          callback('商品名称首尾不能出现下划线\'_\'');
        } else if (/^[0-9]*$/.test(value)) {
          callback('商品名称不能全为数字');
        } else if (!/^[\S]{1,22}$/.test(value)) {
          callback('商品名称不能出现空格');
        } else {
          callback()
        }

        //       var regex = new RegExp('\d');
        //       if (value.length < 6) {
        //   callback(new Error('请输入至少6位'));
        // } else if (/\d/.test(value)) {
        //     callback('账号不能为纯数字')
        //   } else {
        //     callback()
        //   }
      }
      var isIp = (rule, value, callback) => {
        var reg =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

        if (value == '') {
          callback(new Error('请输入IP地址范围'))
        } else if (!reg.test(value)) {
          callback('请按规范输入 IP 地址, 例如: 192.168.3.5/16')
        } else {
          callback()
        }
      }
      var subnetMaskFilter = (rule, value, callback) => {
        var reg =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

        if (!reg.test(value)) {
          callback(new Error('请按对应规范输入正确的值'))
        }
        callback()
      }
      var subnetMaskFilterBack = (rule, value, callback) => {
        var reg =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (value && !reg.test(value)) {
          callback(new Error('请按对应规范输入正确的值'))
        }
        callback()
      }
      var limitPrefix = (rule, value, callback) => {
        // var txt = value.replace(/\s/ig, '')
        // var reg2 = /[\u4e00-\u9fa5]/ig
        // var isZh = reg2.test(txt)
        // if (value && isZh) {
        //   callback('桌面命名后缀不能是中文')
        // }  else if (value &&!/^[\S]{1,22}$/.test(value)) {
        //   callback('桌面命名后缀不能出现空格');
        // } else
        if (value && value.length > 20) {
          callback('桌面命名后缀不能超过20个字符')
        } else if (value && /^\-[a-zA-Z0-9]+$/g.test(
          value)) { // /^\-[a-zA-Z0-9]+$/g如果开头必须-,/^[a-zA-Z0-9]*\-[a-zA-Z0-9]*$/g只能一个-
          callback()
        } else {
          callback('桌面命名后缀必须以符号"-"开头,剩余只能填写字母数字')
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请输入至少6位'));
        } else {
          //   var regex = new RegExp('/^[\S]{6,12}$/');
          if (!/^[\S]{6,12}$/.test(value)) {
            callback(new Error('密码必须6到12位，且不能出现空格'));
          }
          if (this.aform.confirmPwd !== '') {
            this.$refs.aform.validateField('confirmPwd');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.aform.password) {
          callback(new Error('两次输入的密码不一致!'));
        } else {
          callback();
        }
      };
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入邮箱'));
        } else if (value !== this.aform.email) {
          callback(new Error('两次输入的邮箱不一致!'));
        } else {
          callback();
        }
      };
      return {
        transformFormSet1: false,
        // basicmerCount: 0,
        // usedCount: 0,
        defaultV: 'defaultV',
        dialogLoading: false,
        tableDataSys: [],
        tableDataUser: [],
        btnLoading: false,
        btnLoadingD: false,
        btnIndex: '',
        no: false,
        tableData: [],
        userListDataS: [],
        count: 0,
        tableHeight: 400,
        total: 0,
        vmTableLoadingState: true,
        currentPage4: 1,
        currentSize: 10,
        applyUser: '',
        applyTable: '',
        applyState: '',
        dialogFormVisible: false,
        aform: {
          id: '',
          name: '',
          faIp: '',
          deskType: 'fullcopy_template',
          site: '',
          cluster: '',
          port: '',
          ipDistri: 'dynamic',
          ipScope: '',
          subnetMask: '',
          gateway: '',
          dnsServer: '',
          backupDns: '',
          userDataStores: [],
          sysDataStores: [],
          sysMode: 'thinConfigMode',
          userMode: 'thinConfigMode',
          deskGroup: '',
          virtualGroup: '',
          template: '',
          systemDisk: 0,
          //   userDisk: 0,
          domain: '',
          ou: '',
          cpu: '',
          memory: '',
          disk: 0,
          approval: 'true',
          description: '',
          virtualNum: '',
          //   uploadImg: '',
          //   serverCert: '',
          prefix: '',
          postfix: '',
        },
        faIdList: [],
        siteList: [],
        clusterList: [],
        portList: [],
        deskgroupList: [],
        virtualGroupList: [],
        templateList: [],
        domainList: [],
        ouSelectList: [],
        rules2: {
          name: [{
            required: true,
            validator: notNan,
            trigger: 'blur'
          }],
          faIp: [{
            required: true,
            message: '请选择FusionAccess',
            trigger: 'change'
          }],
          site: [{
            required: true,
            message: '请选择站点',
            trigger: 'change'
          }],
          cluster: [{
            required: true,
            message: '请选择集群',
            trigger: 'change'
          }],
          port: [{
            required: true,
            message: '请选择选择端口组',
            trigger: 'change'
          }],
          ipDistri: [{
            required: true,
            message: '请选择IP分配方式',
            trigger: 'change'
          }],
          ipScope: [{
            required: true,
            validator: isIp,
            trigger: 'blur'
          }],
          subnetMask: [{
            required: true,
            validator: subnetMaskFilter,
            trigger: 'blur'
          }],
          gateway: [{
            required: true,
            validator: subnetMaskFilter,
            trigger: 'blur'
          }],
          dnsServer: [{
            required: true,
            validator: subnetMaskFilter,
            trigger: 'blur'
          }],
          backupDns: [{
            // required: true,
            validator: subnetMaskFilterBack,
            trigger: 'blur'
          }],
          sysDataStores: [{
            required: true,
            message: '请选择系统盘',
            trigger: 'blur'
          }],
          userDataStores: [{
            required: true,
            message: '请选择用户盘',
            trigger: 'blur'
          }],
          deskType: [{
            required: true,
            message: '请选择桌面类型',
            trigger: 'change'
          }],
          deskGroup: [{
            required: true,
            message: '请选择桌面组',
            trigger: 'change'
          }],
          virtualGroup: [{
            required: true,
            message: '请选择虚机组',
            trigger: 'change'
          }],
          template: [{
            required: true,
            message: '请选择选择模板',
            trigger: 'change'
          }],
          domain: [{
            required: true,
            message: '请选择选择域',
            trigger: 'change'
          }],
          ou: [{
            required: true,
            message: '请选择选择OU',
            trigger: 'change'
          }],
          cpu: [{
            required: true,
            trigger: 'blur'
          }],
          memory: [{
            required: true,
            trigger: 'blur'
          }],
          //   disk: [{
          //     required: true,
          //     trigger: 'blur'
          //   }],
          description: [{
            // required: true,
            // validator: validateEmail,
            // trigger: 'blur'
          }],
          prefix: [{
            // required: true,
            validator: limitPrefix,
            trigger: 'blur'
          }],
          postfix: [{
            // required: true,
            validator: limitPrefix,
            trigger: 'blur'
          }],
          virtualNum: [{
            required: true,
            trigger: 'blur'
          }],
        },
        formLabelWidth: '150px',
        inputLabelWidth: '500px',
        // transformForm: false,
        userListData: [],
        currentPage5: 1,
        currentSize1: 10,
        countTran: 0,
        currentPage5S: 1,
        currentSize1S: 10,
        countTranS: 0,
        multSelectionTran: [],
        transformFormSet: false,
        globalData: {
          id: '',
          cpu: 1,
          memory: 1,
          disk: 1,
          leftQuota: ''
        },
        // eform: {
        //   name: '',
        //   merCount: 1,
        //   cpuCount: '',
        //   memCount: '',
        //   diskCount: '',
        //   cloudId: '',
        //   merId: ''
        // },
        rulesEdit: {},
        dialogFormVisibleEdit: false,
        multipleSelection: [],
        multSelectionSys: [],
        multSelectionUser: [],
        fileList: [],
        editId: '',
        userDisk: 0,
        systemDisk: 0,
      }
    },
    created() {
      this.getVmList(1);
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.tableHeight = computedTableHeight()
      // })
    },
    methods: {
      toUpperStr(v) {
        console.log(v)
        if (v) {
          this.aform.postfix = v.toUpperCase();
        }
      },
      //   beforeUpload(file, fileList) { //文件判断
      //     const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      //     if (!isJPG) {
      //       this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
      //       return false;
      //     }
      //   },
      //   handlesuccess(response, file, fileList) {
      //     if (response.id) {
      //       this.getVmList();
      //       this.btnLoading = false;
      //       this.dialogFormVisible = false;
      //     }
      //   },
      //   handleError(response, file, fileList) {
      //     this.$message.error('通信错误');
      //     this.btnLoading = false;
      //     this.dialogFormVisible = false;
      //   },
      //   handleChangeUpload(file, fileList) {
      //     const isJPG = file.raw.type.indexOf('image') > -1;
      //     if (isJPG) {
      //       this.fileList = fileList.slice(-1);
      //       this.aform.serverCert = 'upload';
      //     } else {
      //       if (this.fileList.length === 1) {
      //         this.fileList = fileList.slice(0, 1);
      //       } else {
      //         this.fileList = [];
      //       }
      //       this.$message.error('必须上传JPG或者PNG文件!');
      //     }
      //   },
      //   handleRemove() {
      //     this.aform.serverCert = ''
      //     // this.aform.clientCert = ''
      //     // this.$refs.aform.validateField('clientCert')
      //   },
      rowClickSys(row, column, event) {
        if (this.aform.sysDataStores.length > 0 && this.aform.sysDataStores[0].id !== row.id) {
          this.$refs.multipleTableSys.toggleRowSelection(this.aform.sysDataStores[0]);
          this.aform.sysDataStores = [row];
        } else if (this.aform.sysDataStores.length > 0 && this.aform.sysDataStores[0].id === row.id) {
          this.aform.sysDataStores = [];
        } else {
          this.aform.sysDataStores = [row];
        }
        this.$refs.multipleTableSys.toggleRowSelection(row);
        this.$refs.aform.validateField('sysDataStores')

      },
      checkSelectSys(selection, row) { //系统用户磁盘选择
        if (selection.length > 1) {
          this.$refs.multipleTableSys.toggleRowSelection(selection[0]);
        }
        // this.multSelectionSys = selection;
        this.aform.sysDataStores = selection;
        this.$refs.aform.validateField('sysDataStores')
      },
      rowClickUser(row, column, event) {
        if (this.aform.userDataStores.length > 0 && this.aform.userDataStores[0].id !== row.id) {
          this.$refs.multipleTableUser.toggleRowSelection(this.aform.userDataStores[0]);
          this.aform.userDataStores = [row];
        } else if (this.aform.userDataStores.length > 0 && this.aform.userDataStores[0].id === row.id) {
          this.aform.userDataStores = [];
        } else {
          this.aform.userDataStores = [row];
        }
        this.$refs.multipleTableUser.toggleRowSelection(row);
        this.$refs.aform.validateField('userDataStores')

      },
      checkSelectUser(selection, row) { //用户磁盘选择
        if (selection.length > 1) {
          this.$refs.multipleTableUser.toggleRowSelection(selection[0]);
        }
        // this.multSelectionUser = selection;
        this.aform.userDataStores = selection;
        this.$refs.aform.validateField('userDataStores')
        console.log(22)
      },

      //   handleSelectionChangeUser(val) {
      //     console.log(val, this.aa++)


      //     // this.$refs.multipleTableUser.toggleRowSelection(this.tableDataUser[0]);
      //   },
      faidChange() { //FusionAccess改变后
        this.getsiteList(1);
        this.getdomainList(1);
        // this.getdeskgroupList(1);
        this.getvirtualGroupList(1);
      },

      getfaIdList(type) { //FA
        let url =
          `merchandise/queryAllFa`
        httpAjax(url).then((res) => {
          if (res) {
            this.faIdList = res.map(item => {
              return {
                value: item.faIP,
                label: item.faName
              }
            })
            if (this.editId && !type) {
              this.aform.faIp = this.editId.faIp
            } else {
              this.aform.faIp = this.faIdList[0].value
            }
          } else {
            this.$message.error('通信错误')
          }
        }).then(() => {
          this.getsiteList(type);
          this.getdomainList(type);
          //   this.getdeskgroupList(type);
          this.getvirtualGroupList(type);

        }).catch((err) => {
          console.log(err)
        })
      },
      siteChange() { //site改变后
        this.getclusterList(1);
        this.getportList(1);
        this.gettemplateList(1);
      },
      getsiteList(type) { //SITE站点
        let url =
          `merchandise/desribeSites`
        httpAjax(url, {
          faIp: this.aform.faIp
        }).then((res) => {
          if (res) {
            this.siteList = res.map(item => {
              return {
                value: `${item.siteId}=${item.name}`,
                label: item.name
              }
            })
            if (this.editId && !type) { //修改时 但不是被change
              this.aform.site = this.editId.site
            } else {
              this.aform.site = this.siteList[0].value;
            }
          } else {
            this.$message.error('通信错误')
          }
        }).then(() => {
          this.getclusterList(type);
          this.getportList(type);
          if (this.aform.virtualGroup) {
            this.gettemplateList(type);
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      clusterChange() { //cluster改变后
        this.gettableDataSys(1);
        this.gettableDataUser(1);
      },
      getclusterList(type) { //集群
        let url =
          `merchandise/describeClusters`
        httpAjax(url, {
          faIp: this.aform.faIp,
          siteId: this.aform.site.split('=')[0]
        }).then((res) => {
          if (res) {
            this.clusterList = res.map(item => {
              return {
                value: `${item.clusterId}=${item.name}`,
                label: item.name
              }
            })
            if (this.editId && !type) {
              this.aform.cluster = this.editId.cluster
            } else {
              this.aform.cluster = this.clusterList[0].value
            }
          } else {
            this.$message.error('通信错误')
          }
        }).then(() => {
          this.gettableDataSys(type);
          this.gettableDataUser(type);
        }).catch((err) => {
          console.log(err)
        })
      },
      getportList(type) { //端口组
        let url =
          `merchandise/describePortGroupsInfo`
        httpAjax(url, {
          faIp: this.aform.faIp,
          siteId: this.aform.site.split('=')[0]
        }).then((res) => {
          if (res) {
            this.portList = res.map(item => {
              return {
                value: item.portGroupId + '|' + item.dvSwitchId + '|' + item.portGroupName,
                label: item.portGroupName
              }
            })
            if (this.editId && !type) {
              this.aform.port = this.editId.port
            } else {
              this.aform.port = this.portList[0].value
            }
            this.dialogLoading = false;

          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getdeskgroupList(type) { //桌面组
        let url =
          `merchandise/queryDgInfo`
        httpAjax(url, {
          faIp: this.aform.faIp,
          vmType: this.aform.virtualGroup.split('=')[2] //'fullcopy_template'
        }).then((res) => {
          if (res) {
            this.deskgroupList = res.map(item => {
              return {
                value: item.dgId + "|" + item.farmID + "|" + item.dgName + "|" + item.dgType,
                label: item.dgName
              }
            })
            if (this.editId && !type) {
              this.aform.deskGroup = this.editId.deskGroup
            } else {
              this.aform.deskGroup = this.deskgroupList[0].value
            }
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      typeChange() { //虚机组改变后
        this.getdeskgroupList(1)
        this.gettemplateList(1);
      },
      getvirtualGroupList(type) { //虚机组
        let url =
          `merchandise/describeResourceGroup`
        httpAjax(url, {
          faIp: this.aform.faIp
        }).then((res) => {
          if (res) {
            this.virtualGroupList = res.map(item => {
              return {
                value: item.resourceGroupInfoId + "=" + item.resourceGroupName + "=" + item.resourceGroupType,
                label: item.resourceGroupName
              }
            })
            if (this.editId && !type) {
              this.aform.virtualGroup = this.editId.virtualGroup //
            } else {
              this.aform.virtualGroup = this.virtualGroupList[0].value
            }
          } else {
            this.$message.error('通信错误')
          }
        }).then(() => {
          this.getdeskgroupList(type)
          if (this.aform.site) {
            this.gettemplateList(type);
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      templateChange() {
        //   console.log(1,this.aform.template)
        this.userDisk = this.templateList.filter(item => item.value == this.aform.template)[0].userDisk;
        this.systemDisk = this.templateList.filter(item => item.value == this.aform.template)[0].systemDisk;
        this.aform.disk = this.userDisk;
        this.aform.systemDisk = this.systemDisk;
      },
      gettemplateList(type) { //选择模板
        let url =
          `merchandise/describeTemplatesInfoBySite`
        httpAjax(url, {
          faIp: this.aform.faIp,
          siteId: this.aform.site.split('=')[0],
          group: this.aform.virtualGroup.split('=')[2] //this.aform.deskType //'fullcopy_template'
        }).then((res) => {
          if (res) {
            this.templateList = res.map(item => {
              let u = item.diskList.filter(item => item.sequenceNum === 2).map(item => item.quantityGB);
              let ud = u.length > 0 ? u.reduce((l, f) => {
                return l + f
              }, 0) : 0;
              let s = item.diskList.filter(item => item.sequenceNum === 1).map(item => item.quantityGB);
              // console.log(s)
              let sd = s.length > 0 ? s.reduce((l, f) => {
                return l + f
              }, 0) : 0;
              return {
                value: item.templateId + '|' + item.diskList[0].datastoreId + '|' + sd + '|' + item
                  .templateName,
                label: item.templateName,
                systemDisk: sd,
                userDisk: ud //item.diskList[1]?item.diskList[1].quantityGB:0
              }
            })
            if (this.editId && !type) {
              this.aform.template = this.editId.template //
              this.userDisk = this.templateList.filter(item => item.value == this.editId.template)[0]
              .userDisk; //界面显示
              this.systemDisk = this.templateList.filter(item => item.value == this.editId.template)[0].systemDisk;
              this.aform.disk = this.userDisk; //用于提交
              this.aform.systemDisk = this.systemDisk;
            } else { //新建时
              this.aform.template = this.templateList[0].value;
              this.userDisk = this.templateList[0].userDisk;
              this.systemDisk = this.templateList[0].systemDisk;
              this.aform.disk = this.userDisk;
              this.aform.systemDisk = this.systemDisk;
            }
            // console.log(this.aform.template.split('#'))
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      domainChange() { //domain变化后
        this.getouSelectList(1);
      },
      getdomainList(type) { //选择域
        let url =
          `merchandise/describeDomainInfo`
        httpAjax(url, {
          faIp: this.aform.faIp,
        }).then((res) => {
          if (res) {
            this.domainList = res.map(item => {
              return {
                value: item.domainId + "=" + item.domain,
                label: item.domain
              }
            })
            if (this.editId && !type) {
              this.aform.domain = this.editId.domain
            } else {
              this.aform.domain = this.domainList[0].value
            }
          } else {
            this.$message.error('通信错误')
          }
        }).then(() => {
          this.getouSelectList(type);
        }).catch((err) => {
          console.log(err)
        })
      },
      getouSelectList(type) { //选择ou
        let url =
          `merchandise/describeOuNameInfo`
        httpAjax(url, {
          faIp: this.aform.faIp,
          domainID: this.aform.domain.split('=')[0]
        }).then((res) => {
          if (res) {
            this.ouSelectList = res.map(item => {
              return {
                value: item.id + "=" + item.ouName,
                label: item.ouName
              }
            })
            if (this.editId && !type) {
              this.aform.ou = this.editId.ou
            } else {
              this.aform.ou = this.ouSelectList[0].value
            }
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      handleSelectSys(key) {
        this.aform.sysMode = key;
        this.aform.sysDataStores = [];
        this.$refs.multipleTableSys.toggleRowSelection(this.aform.sysDataStores[0]);
        if (this.editId) {
          this.editId.sysDataStores = [];
        }
        this.gettableDataSys();
      },
      handleSelectUser(key) {
        this.aform.userMode = key;
        this.aform.userDataStores = [];
        this.$refs.multipleTableUser.toggleRowSelection(this.aform.userDataStores[0]);
        if (this.editId) {
          this.editId.userDataStores = [];
        }
        this.gettableDataUser();
      },
      gettableDataUser() { //用户盘
        let url =
          `merchandise/describeDatastoreInfo`;
        let params = {
          page: 1,
          limit: 10,
          siteId: this.aform.site.split('=')[0],
          clusterId: this.aform.cluster.split('=')[0],
          configMode: this.aform.userMode,
          faIp: this.aform.faIp
        }
        httpGet(url, params).then((res) => {
          if (res) {
            this.tableDataUser = res.data.map(item => {
              return {
                id: item.datastoreId,
                name: item.name,
                freeSizeGB: item.freeSizeGB,
                capacityGB: item.capacityGB,
                isThin: item.isThin,
                isVirtual: item.isVirtual
              }
            })
            if (this.editId) {
              let a = this.tableDataUser.filter(item => {
                return item.id == this.editId.userDataStores[0].itemId
              })
              this.aform.userDataStores = a;
              this.$nextTick(() => {
                this.$refs.multipleTableUser.toggleRowSelection(a[0]);
              })
              // this.$refs.multipleTableUser.toggleRowSelection(a[0]);
              //   this.checkSelectUser(a);
              //  this.aform.userDataStores = selection;
            }
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      gettableDataSys() { //系统盘
        let url =
          `merchandise/describeDatastoreInfo`;
        let params = {
          page: 1,
          limit: 10,
          siteId: this.aform.site.split('=')[0],
          clusterId: this.aform.cluster.split('=')[0],
          configMode: this.aform.sysMode,
          faIp: this.aform.faIp
        }
        httpGet(url, params).then((res) => {
          if (res) {
            this.tableDataSys = res.data.map(item => {
              return {
                id: item.datastoreId,
                name: item.name,
                freeSizeGB: item.freeSizeGB,
                capacityGB: item.capacityGB,
                isThin: item.isThin,
                isVirtual: item.isVirtual
              }
            });
            if (this.editId) {
              console.log(123)
              let a = this.tableDataSys.filter(item => {
                return item.id == this.editId.sysDataStores[0].itemId
              })
              this.aform.sysDataStores = a;
              console.log(this.aform.sysDataStores)
              this.$nextTick(() => {
                this.$refs.multipleTableSys.toggleRowSelection(a[0]);
              })
            }
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      updateDesk() { //新增
        this.dialogLoading = true;
        this.getfaIdList()
        // this.dialogLoading = true;
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['myScrollbar'].wrap.scrollTop = 0;
        })

      },
      editCate(data) { //修改
        this.dialogLoading = true;
        let params = {
          id: data.id
        }
        httpAjax('merchandise/getMerchandiseInfo', params).then(res => {
          if (res) {
            this.editId = {
              ...res
            };
            this.getfaIdList() //获取那些select
            let data = res;
            this.aform.id = data.id;
            this.aform.name = data.name;
            // this.aform.deskType = data.deskType;
            this.aform.merCount = data.merCount;
            this.aform.ipDistri = data.ipDistri;
            this.aform.ipScope = data.ipScope;
            this.aform.subnetMask = data.subnetMask;
            this.aform.gateway = data.gateway;
            this.aform.dnsServer = data.dnsServer;
            this.aform.backupDns = data.backupDns;
            this.aform.sysMode = data.sysMode;
            this.aform.userMode = data.userMode;
            this.aform.cpu = data.cpu;
            // this.aform.disk = data.disk;
            this.aform.memory = data.memory;
            this.aform.virtualNum = data.virtualNum;
            this.aform.description = data.description;
            this.aform.prefix = data.prefix;
            this.aform.postfix = data.postfix;
            this.aform.approval = data.approval || 'true';
          }
        }).catch(() => {})
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['myScrollbar'].wrap.scrollTop = 0;
        })
      },
      rowClick(row, column, event) {
        if (this.multipleSelection.length > 0 && this.multipleSelection.filter(item => item.id === row.id).length ===
          0) {
          //   this.$refs.multipleTable.toggleRowSelection(row);
          this.multipleSelection = [...this.multipleSelection, row];
        } else if (this.multipleSelection.length > 0 && this.multipleSelection.filter(item => item.id === row.id)
          .length ===
          1) {
          this.multipleSelection = this.multipleSelection.filter(item => item.id !== row.id);
        } else {
          this.multipleSelection = [row];
        }
        // console.log(  this.multSelection)
        this.$refs.multipleTableTranS.toggleRowSelection(row);
      },
      //   handleSelectionChange(val) {
      //     this.multipleSelection = val;
      //   },
      //   assignMercount() { //云管理员 批量设置配额
      //     this.eform.merId = this.globalData.id;
      //     this.eform.cloudId = this.multipleSelection.map(item => {
      //       return item.id
      //     })
      //     this.eform.cpuCount = this.eform.merCount * this.globalData.cpu //+ 50
      //     this.eform.memCount = this.eform.merCount * this.globalData.memory // + 50
      //     this.eform.diskCount = this.eform.merCount * this.globalData.disk //+ 50
      //     this.dialogFormVisibleEdit = true;
      //   },
      //   assignDesk(data) { //分配配额
      //     if (data) {
      //       this.globalData = {
      //         ...data
      //       }
      //       //   console.log( this.globalData)
      //     }
      //     let url =
      //       `tenant/unsignedList?&${Math.random()}&merId=${data.id}&page=${this.currentPage5}&limit=${this.currentSize1}`
      //     httpGet(url).then((res) => {
      //       if (res.data) {
      //         this.userListDataS = res.data
      //         this.countTranS = res.count
      //         this.transformFormSet = true
      //         // this.transformFormSet1 = true
      //         this.$nextTick(() => {
      //           addScrollBar('#table-wrapTranS', true)
      //         })
      //       } else {
      //         this.$message.error('通信错误')
      //       }
      //     }).catch((err) => {
      //       console.log(err)
      //     })
      //   },
      cancelMaxMer(scope, id) {
        scope.newCount = scope.merCount;
        this.calMaxMer(id)
      },
      calMaxMer(id) {
        let nowNewCount = 0;
        this.userListDataS.forEach(item => {
          nowNewCount += item.newCount //计算当前列表全部的配额值,
        })
        this.userListDataS = this.userListDataS.map(item => {
          return {
            ...item,
            maxCount: this.globalData.leftMer + this.globalData.merCount - nowNewCount + item
              .newCount //前2个为商品配额总数,减去现在所有列表的分配的配额 等于剩余允许分配的最大,加上当前的配额
          }
        })
        // console.log(nowNewCount)
      },
      assignDesk(data) { //分配配额
        if (data) {
          this.globalData = {
            ...data
          }
          //   this.maxMer = data.leftMer;
          //   console.log( this.globalData)
        }
        let url =
          `tenant/allCloudAdmin`
        let para = {
          page: this.currentPage5S,
          limit: this.currentSize1S,
          merId: this.globalData.id
        }
        httpAjax(url, para).then((res) => {
          if (res.data) {
            this.userListDataS = res.data.map(item => {
              return {
                ...item,
                newCount: item.merCount,
                maxCount: this.globalData.leftMer + item.merCount
              }
            })
            // console.log(this.userListDataS)
            this.countTranS = res.count
            // this.transformFormSet = true
            this.transformFormSet1 = true
            this.$nextTick(() => {
              addScrollBar('#table-wrapTranS', true)
            })
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //   deleteManager(data) {//删除
      //     this.$confirm('确定删除该用户的配额吗?', '删除配额', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       this.btnIndex = data.id
      //       this.btnLoadingD = true;
      //       let params = {
      //         merId: this.globalData.id,
      //         cloudIds: [data.id]
      //       }
      //       httpAjax('merchandise/deleteCloud', {
      //         "ids": JSON.stringify(params)
      //       }).then(res => {
      //         if (res) {
      //           this.$message({
      //             type: 'success',
      //             message: '删除成功'
      //           });
      //           this.showCloud();
      //           this.getVmList();
      //         } else {
      //           this.$message({
      //             type: 'error',
      //             message: '删除失败!'
      //           });
      //         }
      //         this.btnLoadingD = false;
      //       }).catch(() => {
      //         this.$message({
      //           type: 'error',
      //           message: '删除失败!'
      //         });
      //         this.btnLoadingD = false;
      //       })
      //     }).catch(() => {

      //     })
      //   },
      dispatchCloud(row = {}) {
        let params;
        if (row.id) {
          this.btnIndex = row.id;
          params = {
            merId: this.globalData.id,
            user: JSON.stringify([{
              id: row.id,
              merCount: row.newCount
            }])
          }
        } else {
          let u = this.userListDataS.map(item => {
            return {
              id: item.id,
              merCount: item.newCount
            }
          })
          params = {
            merId: this.globalData.id,
            user: JSON.stringify(u)
          }
        }
        this.btnLoadingD = true;
        httpAjax('merchandise/dispachCloud', params).then(res => {
          if (res.result === 'success') {
            this.$message({
              type: 'success',
              message: '分配成功!'
            });
            if (!row.id) {
              this.transformFormSet1 = false;
            }
            this.getVmList();
          } else {
            this.$message({
              type: 'error',
              message: '分配失败!'
            });
          }
          this.btnLoadingD = false;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '分配失败!'
          });
          this.btnLoadingD = false;

        })
      },
      //   dispatchCloud() { //确认 修改管理员配额
      //     let data = {
      //       ...this.eform
      //     }
      //     let params = {
      //       merId: data.merId,
      //       user:[{id,mercount}]
      //     }
      //     this.btnLoading = true;
      //     httpAjax('merchandise/dispachCloud', {
      //       "ids": JSON.stringify(params)
      //     }, ).then(res => {
      //       if (res.result === 'success') {
      //         this.$message({
      //           type: 'success',
      //           message: '设置成功!'
      //         });
      //         this.dialogFormVisibleEdit = false;
      //         this.transformFormSet = false;
      //         this.getVmList();
      //       } else {
      //         this.$message({
      //           type: 'error',
      //           message: '设置失败!'
      //         });
      //       }
      //       this.btnLoading = false;
      //     }).catch(() => {
      //       this.$message({
      //         type: 'error',
      //         message: '设置失败!'
      //       });
      //       this.btnLoading = false;

      //     })
      //   },
      //   handleChange(val) {
      //     this.eform.cpuCount = val * this.globalData.cpu //+ 50
      //     this.eform.memCount = val * this.globalData.memory // + 50
      //     this.eform.diskCount = val * this.globalData.disk //+ 50
      //   },
      //   editMercount(data) { //云管理员 修改配额
      //     let params = {};
      //     params.cloudId = data.id;
      //     params.merId = this.globalData.id;
      //     httpAjax('merchandise/queryQuota', params).then(res => {
      //       //   if (res.visible === 'hide') {
      //       //     this.$message({
      //       //       type: 'error',
      //       //       message: '此云管理员将该商品隐藏，配额不能修改!'
      //       //     });
      //       //   } else {
      //       this.basicmerCount = res.merCount
      //       this.usedCount = res.usedCount
      //       this.eform = {
      //         name: data.name,
      //         merCount: res.merCount,
      //         cpuCount: res.cpuCount,
      //         memCount: res.memCount,
      //         diskCount: res.diskCount,
      //         cloudId: [res.cloudId],
      //         merId: res.merId
      //       }
      //       this.dialogFormVisibleEdit = true;
      //       //   }
      //     }).catch(() => {
      //       this.$message({
      //         type: 'error',
      //         message: '获取失败!'
      //       });
      //     })

      //   },
      //   showCloud(data) { //获取转移名单
      //     if (data) {
      //       this.globalData = {
      //         ...data
      //       }
      //     }
      //     let url =
      //       `merchandise/listCloudAdmin?&${Math.random()}&page=${this.currentPage5}&limit=${this.currentSize1}&merId=${this.globalData.id}`
      //     httpGet(url).then((res) => {
      //       if (res.data) {
      //         this.userListData = res.data
      //         this.countTran = res.count
      //         this.transformForm = true
      //         this.$nextTick(() => {
      //           addScrollBar('#table-wrapTran', true)
      //         })
      //       } else {
      //         this.$message.error('通信错误')
      //       }
      //     }).catch((err) => {
      //       console.log(err)
      //     })
      //   },
      //   handleCurrentChange1(val) { //修改配额
      //     this.currentPage5 = val;
      //     this.showCloud()
      //   },
      //   handleSizeChange1(val) { //修改配额
      //     this.multipleSelection = [];
      //     this.currentSize1 = val;
      //     this.showCloud()
      //   },
      handleCurrentChange1S(val) { //设置配额
        this.currentPage5S = val;
        this.assignDesk()
      },
      handleSizeChange1S(val) { //设置配额
        this.multipleSelection = [];
        this.currentSize1S = val;
        this.assignDesk()
      },

      handleClick(data) { //删除
        this.$confirm('确定删除该商品吗?', '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnIndex = data.id
          this.btnLoadingD = true;
          let params = {
            ids: data.id
          }
          httpAjax('merchandise/delete', params).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getVmList();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
            this.btnLoadingD = false;
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
            this.btnLoadingD = false;
          })
        }).catch(() => {

        })
      },
      resetD(formName) {
        switch (formName) {
          case 'aform':
            // this.$refs['aform'].resetFields();clearValidate

            this.aform = {
              id: '',
              name: '',
              faIp: '',
              deskType: 'fullcopy_template',
              site: '',
              cluster: '',
              port: '',
              ipDistri: 'dynamic',
              ipScope: '',
              subnetMask: '',
              userDataStores: [],
              sysDataStores: [],
              gateway: '',
              dnsServer: '',
              sysMode: 'thinConfigMode',
              userMode: 'thinConfigMode',
              backupDns: '',
              deskGroup: '',
              virtualGroup: '',
              template: '',
              systemDisk: 0,
              //   userDisk: 0,
              domain: '',
              ou: '',
              cpu: '',
              memory: '',
              disk: 0,
              approval: 'true',
              description: '',
              virtualNum: '',
              //   uploadImg: '',
              //   serverCert: '',
              prefix: '',
              postfix: ''
            }
            // this.$refs['myScrollbar'].wrap.scrollTop = 0;
            console.log(1)
            this.$refs['aform'].resetFields();
            // this.fileList = [];
            this.editId = '';
            break;
            //   case 'eform':
            //     this.eform = {
            //       name: '',
            //       merCount: 1,
            //       cpuCount: '',
            //       memCount: '',
            //       diskCount: '',
            //       cloudId: '',
            //       merId: ''
            //     }
            //     this.basicmerCount = 0;
            //     this.usedCount = 0;
            //     break;
            //   case 'transformForm':
            //     this.currentPage5 = 1;
            //     this.currentSize1 = 10;
            //     break;

          case 'transformFormSet':
            this.multipleSelection = [];
            this.currentPage5S = 1;
            this.currentSize1S = 10;
            break;

          default:
            break;
        }
      },
      addAccount(formName) { //提交桌面
        this.$refs[formName].validate((valid) => {
          let f = {
            ...this.aform
          };
          if (f.ipDistri === 'static') {
            f.approval = 'true'
          }
          if (valid) {
            this.btnLoading = true;
            httpAjax('merchandise/saveMerchandise', {
              "product": JSON.stringify(f)
            }).then(res => {
              if (res.result == 'success') {
                this.dialogFormVisible = false;
                this.getVmList();
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                // this.aform.id = res.id
                // setTimeout(() => {
                //   if (this.aform.serverCert == 'upload') {
                //     this.$refs.serverCert.submit();
                //   } else {
                // }, 200)
              } else {
                this.$message({
                  type: 'error',
                  message: res.resultDesc || '提交失败!'
                });
              }
              this.btnLoading = false;
              //   this.getVmList()
              //   this.dialogFormVisible = false;
            }).catch(() => {
              this.btnLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      searchData() {
        this.getVmList('', 1)
      },
      clearData(num) {
        this.getVmList('', 1)
      },

      getVmList(first, page) {
        page ? this.currentPage4 = page : '';
        let para = {
          page: this.currentPage4,
          limit: this.currentSize,
          name: this.applyUser,
        }
        const url = `merchandise/merchandiseList?${Math.random()}`
        httpGet(url, para).then((res) => {
          this.tableData = res.data;
          this.tableHeight = computedTableHeight()
          this.vmTableLoadingState = false;
          this.count = res.count;
          this.$nextTick(() => {
            this.setScrollBar('#table-wrap')
          })
        }).then(() => {
          if (this.transformFormSet1) {
            let d = this.tableData.filter(item => {
              return item.id === this.globalData.id
            })
            this.assignDesk(d[0])
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      handleCurrentChange(val) {
        this.currentPage4 = val;
        this.getVmList()
      },
      handleSizeChange(val) {
        this.currentSize = val;
        this.getVmList()
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
    justify-content: flex-end;
    align-items: center;
    color: #606266;
  }

  #menuList123 {
    height: calc(78vh - 120px);
  }

  .templateInput {
    width: 140px;
  }

</style>
<style>
  .templateInput .el-input__inner {
    text-align: center;
  }

  .setCloudDialog .el-table-column--selection.is-leaf .cell {
    display: inline-block;
  }

</style>
