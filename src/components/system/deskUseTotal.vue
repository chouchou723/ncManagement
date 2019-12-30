<template>
  <div>
    <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-my-tongjifenxi"></i> 合同变更流失表</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
    <!-- 工作量统计 -->
    <div style="width: 100%;height:100%;background: white;position:relative;border-radius:5px;margin-bottom:10px;"
      id="tableTotal">
      <!-- <div class="newResourceAn"
        style="position:relative;padding:10px;margin-bottom:10px;height:35px;border-bottom:1px solid gainsboro;background:white;">
        <div style='float:left;'>
          <h4 style='margin-bottom:20px;padding-top:5px;padding-left:10px;margin-right:10px'>
            <span>桌面统计</span>
          </h4>
        </div>
        <div class='dateReportS' style='float:left;'>

          <el-date-picker v-model="valueCM2" type="month" size='small' :picker-options="pickerOptions1"
            :clearable='backface' placeholder="选择日期范围" @change="updateListCM(2)" value-format="yyyy-MM">
          </el-date-picker>
        </div>
      </div> -->

      <!-- <div style="position:absolute;top:15px;right:45px;z-index:100;font-size:12px;">
        <span class='canD' @click='getDownload'><img src="../../assets/img/output.png" width='35' alt=""></span>
      </div> -->
      <div style="padding:10px;display:flex;align-items:center;flex-direction: column;" v-if="barList.length>0">
          <div v-for="(item,index) in barList" :key="index" style="width:100%;display:flex;align-items:center;margin-bottom:20px">
        <IEcharts  :option="item" style='height:450px;width:50%'>
        </IEcharts>
        <div class="table-wrap" id="table-wrap">
          <el-table ref="multipleTable" :data="tableData[index]" v-loading="vmTableLoadingState" stripe
            :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
            <el-table-column prop="title" label="分类" width="100">
            </el-table-column>
            <el-table-column prop="product" label="商品数" width="100">
            </el-table-column>
            <el-table-column prop="cpu" label="CPU" width="100">
            </el-table-column>
            <el-table-column prop="memory" label="内存" width="100">
            </el-table-column>
            <el-table-column prop="disk" label="磁盘" width="100">
            </el-table-column>
          </el-table>
        </div>

          </div>
      </div>
      <div v-if="barList.length===0"
        style="height:300px;display:flex;justify-content:center;align-items:center;color:grey">
        暂无数据
      </div>
      <!-- <IEcharts :option="line1" style='height:400px;margin-bottom:10px;'></IEcharts> -->
    </div>

  </div>
</template>
<script>
  import IEcharts from 'vue-echarts-v3/src/full.js';
  import {
    httpAjax,
    httpGet,
    addScrollBar
  } from 'api/common'
  export default {
    components: {
      IEcharts
    },
    data: () => ({
      tableData: [],
    //   funnelR: {
    //     invitationRatio: '0%',
    //     visitRatio: '0%',
    //     addOrderRatio: '0%'
    //   },
    //   frozenlist: [],
    //   showshow: false,
    //   datatype: '',
    //   code: '',
    //   aid: '',
    //   myRank: 0,
    //   radio3: 'teach',
    //   schoolList: [],
    //   isCharge: true,
    //   currentPage: 1, //页数
    //   pagesize: 3, //默认每页
    //   total: 0, //总页数
      currentPage2: 1, //页数
      pagesize2: 7, //默认每页
      total2: 0, //总页数
    //   ccs: [],
    //   SADataD: [],
      resourceData: [],
    //   SAData: [{}, {}, {}],
    //   HMData: [],
    //   options: [],
    //   options1: [],
    //   valueCM1: '',
    //   valueCM2: '',
    //   valueCM3: 'day',
    //   valueCM4: '',
    //   valueCM5: '',
    //   valueCM6: 'lastweek',
    //   valueCM7: '',
    //   valueCM8: '',
    //   backface: false,
    //   backface1: true,
    //   uname: '',
      barList: [],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    //   currentTime: ''
    }),

    methods: {
      //   allTotal(columns, data) {
      //     // console.log(this.allT)
      //     return this.allT;
      //     // return ['合计',1,1,1,1,1,1,1,1,1]
      //   },
      //   getDownload() {
      //     window.open('dcp/statistic/exportQuitDesktop')
      //     window.open('dcp/statistic/exportAppliedDesktop')

      //     // let para = {
      //     //   start_date: this.valueCM2[0] ? new Date(this.valueCM2[0]).toLocaleDateString() : '',
      //     //   end_date: this.valueCM2[1] ? new Date(this.valueCM2[1]).toLocaleDateString() : '',
      //     //   cc_uid: this.valueCM1,
      //     //   short_date: this.valueCM6,
      //     //   column: this.valueCM3,
      //     //   channel: this.valueCM7,
      //     //   // school_id:this.valueCM8,
      //     //   download: 1
      //     // }
      //     // marketTable(para, token).then(res => {
      //     //   // let a = 'http://pandatest.dfth.com';
      //     //   let a = '';
      //     //   window.open(a + res.data)
      //     // })
      //   },
      // getDownload1(){
      //     this.downloadA1 = 'https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=https%3A%2F%2Ftimgsa.baidu.com%2Ftimg%3Fimage%26quality%3D80%26size%3Db9999_10000%26sec%3D1510732763284%26di%3Da586c3c5b1215cf87979da208f428f85%26imgtype%3D0%26src%3Dhttp%253A%252F%252Feasyread.ph.126.net%252FP252hyNA-X_WiEw3rMmFtA%253D%253D%252F7917057665060942069.jpg&thumburl=https%3A%2F%2Fss2.bdstatic.com%2F70cFvnSh_Q1YnxGkpoWK1HF6hhy%2Fit%2Fu%3D3212574178%2C2908544870%26fm%3D27%26gp%3D0.jpg'
      // },
      //   handleCurrentChange2: function (val) { //变更页数
      //     this.currentPage2 = val;
      //     this.getCM4Data();
      //     // this.fetchData();
      //   },
      //   updateListCM(i) { //第一个大表格
      //     if (i == 1 && this.valueCM6 != '') {
      //       this.valueCM2 = [];
      //       this.valueCM3 = 'day'
      //       this.getCM1Data();
      //       // this.getCM2Data(); 
      //       // this.getCM3Data();                     
      //       this.getCM4Data();
      //     } else if (i == 3 && this.valueCM2.length != 0) {
      //       this.valueCM6 = '';
      //       this.getCM1Data();
      //       // this.getCM2Data();
      //       // this.getCM3Data();                     
      //       this.getCM4Data();
      //     } else if (i == 2 && this.valueCM2.length != 0) {
      //       this.valueCM6 = '';
      //       this.getCM1Data();
      //       // this.getCM2Data();
      //       // this.getCM3Data();                     
      //       this.getCM4Data();
      //     } else if (i == 4) {
      //       this.getCM1Data();
      //       // this.getCM2Data();
      //       // this.getCM3Data();                     
      //       this.getCM4Data();
      //     }
      //   },
      getCM1Data(date) { //
        const url = `merchandise/merchandiseList?page=1&limit=10000`
        httpAjax(url).then((res) => {
          let data = res.data;
          if (data.length > 0) {
            res.data.map((item, index) => {
              let leftQuota = item.leftQuota.split('/')
              let total = item.total.split('/')
              let quota = item.quota.split('/');
              let usedQuota = item.usedQuota.split('/');
              this.tableData[index] = [{
                  title: '配额总数',
                  product: total[0],
                  cpu: total[1],
                  memory: total[2],
                  disk: total[3]
                },
                 {
                  title: '已分配数',
                  product: quota[0],
                  cpu: quota[1],
                  memory: quota[2],
                  disk: quota[3]
                },{
                  title: '可分配数',
                  product: leftQuota[0],
                  cpu: leftQuota[1],
                  memory: leftQuota[2],
                  disk: leftQuota[3]
                },
                {
                  title: '已使用数',
                  product: usedQuota[0],
                  cpu: usedQuota[1],
                  memory: usedQuota[2],
                  disk: usedQuota[3]
                },
                // {
                //   title: '剩余',
                //   product: leftQuota[0],
                //   cpu: leftQuota[1],
                //   memory: leftQuota[2],
                //   disk: leftQuota[3]
                // },
              ]
              this.$set(this.barList, index, {
                color: ["#f4516c", "#36a3f7", "#b6a2de", "#34bfa3"],
                angleAxis: {},
                radiusAxis: {
                  type: 'category',
                  data: ['已使用数','可分配数', '已分配数', '配额总数'],
                  z: 10
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                title: {
                  text: `商品名称:${item.name}`
                },
                polar: {},
                series: [{
                  type: 'bar',
                  data: [usedQuota[0],leftQuota[0], quota[0], total[0]],
                  coordinateSystem: 'polar',
                  name: '商品',
                  stack: 'a'
                }, {
                  type: 'bar',
                  data: [usedQuota[1],leftQuota[1], quota[1], total[1]],
                  coordinateSystem: 'polar',
                  name: 'CPU',
                  stack: 'a'
                }, {
                  type: 'bar',
                  data: [usedQuota[2],leftQuota[2], quota[2], total[2]],
                  coordinateSystem: 'polar',
                  name: '内存',
                  stack: 'a'
                }, {
                  type: 'bar',
                  data: [usedQuota[3],leftQuota[3], quota[3], total[3]],
                  coordinateSystem: 'polar',
                  name: '磁盘',
                  stack: 'a'
                }],
                legend: {
                  show: true,
                  data: ['商品', 'CPU', '内存', '磁盘'],
                  bottom: 0
                }
              })
              // this.barList[index].title={text: `商品名称:${item.name}`}
              // this.barList[index] = {
              //   angleAxis: {},
              //   radiusAxis: {
              //     type: 'category',
              //     data: ['剩余', '已用', '配额'],
              //     z: 10
              //   },
              //   tooltip: {
              //     trigger: 'axis',
              //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
              //       type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              //     }
              //   },
              //   title: {
              //     text: `商品名称:${item.name}`
              //   },
              //   polar: {},
              //   series: [{
              //     type: 'bar',
              //     data: [12, 4, 6],
              //     coordinateSystem: 'polar',
              //     name: '商品',
              //     stack: 'a'
              //   }, {
              //     type: 'bar',
              //     data: [11, 2, 3],
              //     coordinateSystem: 'polar',
              //     name: 'CPU',
              //     stack: 'a'
              //   }, {
              //     type: 'bar',
              //     data: [11, 2, 3],
              //     coordinateSystem: 'polar',
              //     name: '内存',
              //     stack: 'a'
              //   }, {
              //     type: 'bar',
              //     data: [1, 2, 3],
              //     coordinateSystem: 'polar',
              //     name: '磁盘',
              //     stack: 'a'
              //   }],
              //   legend: {
              //     show: true,
              //     data: ['商品', 'CPU', '内存', '磁盘'],
              //     bottom: 0
              //   }
              // }

            })
            this.$nextTick(() => {
              this.setScrollBar('#tableTotal')
            })
          } else {

          }
        }).catch((error) => {
          console.log(error)
        })


      },
      //   getCM2Data(date) { //清退
      //     let para = {
      //       currentTime: date ? date : this.currentTime
      //     }
      //     const url = `statistic/findQuitDesktop`
      //     httpAjax(url, para).then((res) => {
      //       let data = res;
      //       if (data.length > 0) {
      //         this.line1.xAxis.data = data.map(item => {
      //           return item.createTimeStr.slice(0, 10)
      //         });
      //         this.line1.series = [{ //以后改成动态获取
      //           name: "已清退桌面",
      //           type: "line",
      //           data: data.map(item => {
      //             return item.count
      //           })
      //         }]
      //         this.line1.legend = {
      //           orient: 'horizontal',
      //           bottom: 0,
      //           data: ["已清退桌面"]
      //           // backgroundColor:'white'
      //         };
      //       } else {
      //         this.line1.xAxis.data = []
      //         this.line1.series = [{ //以后改成动态获取
      //           name: "已清退桌面",
      //           type: "line",
      //           data: []
      //         }]
      //         this.line1.legend = {
      //           orient: 'horizontal',
      //           bottom: 0,
      //           data: ["已清退桌面"]
      //           // backgroundColor:'white'
      //         };
      //       }
      //     }).catch((error) => {
      //       console.log(error)
      //     })
      //   },
      setScrollBar(dom) {
        // if (this.tableData.length) {
        addScrollBar(dom, '', 'all')
        // }
      },
      //   getCM4Data() { //最后的表格数据
      //     let para = {
      //       start_date: this.valueCM2[0] ? new Date(this.valueCM2[0]).toLocaleDateString() : '',
      //       end_date: this.valueCM2[1] ? new Date(this.valueCM2[1]).toLocaleDateString() : '',
      //       cc_uid: this.valueCM1,
      //       short_date: this.valueCM6,
      //       column: this.valueCM3,
      //       channel: this.valueCM7,
      //       // school_id:this.valueCM8,
      //       page: this.currentPage2
      //     }
      //     marketTable(para, token).then(res => {
      //       // console.log(res.data.sum)
      //       let a = res.data.list;
      //       let c = res.data.lastPage * this.pagesize2;
      //       this.total2 = parseInt(c);
      //       this.resourceData = Object.values(a);
      //       if (this.currentPage2 == 1) {
      //         // console.log(res.data.sum)                        
      //         this.allT = res.data.sum
      //       }
      //     })
      //   },
      //   exchange(el1, el2) { //交换节点
      //     let ep1 = el1.parentNode
      //     // ep2 = el2.parentNode,//如果不是在同一个父级里
      //     let index1 = Array.prototype.indexOf.call(ep1.children, el1); //el1在父级里的index
      //     let index2 = Array.prototype.indexOf.call(ep1.children, el2); //el2在父级里的index
      //     // ep2.insertBefore(el1,ep2.children[index2]);
      //     ep1.insertBefore(el2, ep1.children[index1]); //因为是同一个父级ep1,所以直接在父级ep1里,把el2插到el1前面
      //   },
    },
    // computed: {},
    // mounted() {
    //   // let a = document.getElementById("tableSale2").getElementsByClassName("el-table__body-wrapper")[0];
    //   // let b = document.getElementById("tableSale2").getElementsByClassName("el-table__footer-wrapper")[0];   
    //   // this.exchange(a,b)
    //   // this.$nextTick(() => {
    //   //   this.setScrollBar('#tableTotal')
    //   // })
    // },
    created() {
      this.getCM1Data();
    }
  }

</script>
<style>
  /* #tableSale2 .el-table th {
    background: #f2f2f2
  }

  #tableSale2 .el-table th>div {
    background: #f2f2f2
  } */

  /* #tableSale2 .el-table__footer-wrapper {
    color: #1fb5ad
  } */
/* 
  .echarts {
    width: 100%;
    height: 450px;
    z-index: 1;
  } */

  /* #tableRSale{
         height: 443px;
     } */

  /* #tableRSale .el-table__empty-block {
        min-height: 120px;
    } */

  /* #tableright {
    border-left: none;
  }

  .block {
    text-align: center;
    margin-top: 10px;
  } */

  /* .drop .el-dropdown {
    font-size: 1em;
    color: black;
  }

  .dateReportS .el-date-editor--daterange.el-input {
    width: 191px
  }

  #reportCCdate .el-date-editor--daterange.el-input {
    width: 169px
  }

  .echarts .drop .el-dropdown {
    color: rgb(31, 181, 173);
  }

  .newResourceAn .drop .el-dropdown {
    color: rgb(31, 181, 173);
  }

  .backfa {
    transform: rotateY(180deg);
    backface-visibility: hidden;
  }

  .backfa1 {
    transform: rotateY(180deg);
    backface-visibility: hidden;
  }

  .circleSelect .el-input__inner {
    border-radius: 28px
  }

  .canD:hover {
    cursor: pointer
  } */

</style>
