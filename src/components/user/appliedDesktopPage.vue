<template>
  <div>
    <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-my-tongjifenxi"></i> 合同变更流失表</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
    <!-- 工作量统计 -->
    <div
      style="width: 100%;height:100%;background: white;position:relative;border-radius:5px;margin-bottom:10px;" id="tableTotal">
      <div class="newResourceAn"
        style="position:relative;padding:10px;height:35px;border-bottom:1px solid gainsboro;background:white;">
        <!-- <div style='float:left;'>
          <h4 style='margin-bottom:20px;padding-top:5px;padding-left:10px;margin-right:10px'>
            <span>已申请桌面</span>
          </h4>
        </div> -->
        <div class='dateReportS' style='float:left;'>

          <el-date-picker v-model="valueCM2" type="month" :picker-options="pickerOptions1"
            clearable placeholder="选择月份" @change="updateListCM(2)" value-format="yyyy-MM">
          </el-date-picker>
           <el-cascader v-model="applyOu" placeholder="请选择部门" change-on-select :options="ouSelectList"
        :show-all-levels="false" clearable @change="clearC" @visible-change="visibleChange"></el-cascader>
        </div>
        <!-- <div style='width:140px;float:left;margin-left:10px'>
                    <el-select v-model="valueCM8" size='small'  placeholder="校区选择" @change="updateListCM(4)">
                        <el-option v-for="item in schoolList" :label="item.title" :value="item.id">
                        </el-option>
                    </el-select>
                </div>  -->
      </div>

      <div style="position:absolute;top:15px;right:45px;z-index:100;font-size:12px;">
        <span class='canD' @click='getDownload'><img src="../../assets/img/output.png" width='35' alt=""></span>
      </div>
      <IEcharts :option="line" style='height:400px;margin-bottom:10px;'></IEcharts>
      <!-- <IEcharts :option="line1" style='height:400px;margin-bottom:10px;'></IEcharts> -->
      <div style="clear:both"></div>
      <div id="tableSale2" style='width: 90%;margin:30px auto 20px '>
        <el-table :data="resourceData" border style="width: 100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}"
          >
          <el-table-column prop="date" label="日期">
                  <template slot-scope="scope">
            <div>
              {{scope.row.createTimeStr.slice(0, 10)}}
            </div>
          </template>
          </el-table-column>
          <el-table-column prop="count" label="已申请桌面数">
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination layout="prev, pager, next" :total="total2" :current-page="currentPage2" :page-size="7"
            @current-change="handleCurrentChange2">
          </el-pagination>
        </div>
      </div>
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
    //   currentPage: 1, //页数
    //   pagesize: 3, //默认每页
    //   total: 0, //总页数
      currentPage2: 1, //页数
    //   pagesize2: 7, //默认每页
      total2: 0, //总页数
      resourceData: [],
      resourceDataAll:[],
    //   options: [],
    //   options1: [],
      valueCM1: '',
      valueCM2: '',
    //   valueCM3: 'day',
    //   valueCM4: '',
    //   valueCM5: '',
    //   valueCM6: 'lastweek',
    //   valueCM7: '',
    //   valueCM8: '',
    //   backface: false,
    //   backface1: true,
    //   uname: '',
      line: {
        symbolSize: 100,
        color: ["#4dc0e5", "#952be2", "#0075aa", "#0baa32", "#b6a800", "#ed6a3a"],
        // title: {
        //     // text: '客户管理趋势图',
        //     textStyle: {
        //         fontSize: 17
        //     },
        //     padding: [15, 5, 5, 5]
        // },
        tooltip: {
          trigger: 'axis'
        },
        // dataZoom: [{
        //         startValue: '2017-05-01',
        //         textStyle:{
        //             fontSize:9
        //         }
        //     }, 
        //     {
        //         type: 'inside',

        //         // maxSpan:2
        //         // filterMode: 'filter'
        //     }],
        xAxis: {
          axisTick: { //刻度设置
            alignWithLabel: true,
            interval: 0
          },
          axisLabel: {
            // showMinLabel:true,
            showMaxLabel: true,
            rotate:45,
            interval: 0
          },
          data: []

        },
        yAxis: {
          splitLine: {
            show: true
          }
        },
        grid: {
          width: '85%'
        },
        series: [],
        backgroundColor: 'white'
      },
    //   line1: {
    //     symbolSize: 100,
    //     color: ["#952be2", "#0075aa", "#0baa32", "#b6a800", "#ed6a3a"],
    //     // title: {
    //     //     // text: '客户管理趋势图',
    //     //     textStyle: {
    //     //         fontSize: 17
    //     //     },
    //     //     padding: [15, 5, 5, 5]
    //     // },
    //     tooltip: {
    //       trigger: 'axis'
    //     },
    //     // dataZoom: [{
    //     //         startValue: '2017-05-01',
    //     //         textStyle:{
    //     //             fontSize:9
    //     //         }
    //     //     }, 
    //     //     {
    //     //         type: 'inside',

    //     //         // maxSpan:2
    //     //         // filterMode: 'filter'
    //     //     }],
    //     xAxis: {
    //       axisTick: { //刻度设置
    //         alignWithLabel: true,
    //         // interval: 0
    //       },
    //       axisLabel: {
    //         // showMinLabel:true,
    //         showMaxLabel: true,
    //         // rotate:90,
    //         // interval: 0
    //       },
    //       data: []

    //     },
    //     yAxis: {
    //       splitLine: {
    //         show: true
    //       }
    //     },
    //     grid: {
    //       width: '85%'
    //     },
    //     series: [],
    //     backgroundColor: 'white'
    //   },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    //   allT: ['合计', 1, 1, 1, 1, 1, 1, 1, 1, 1],
      currentTime: '',
      applyOu:[],
        ouSelectList:[],
    }),

    methods: {
    //   allTotal(columns, data) {
    //     // console.log(this.allT)
    //     return this.allT;
    //     // return ['合计',1,1,1,1,1,1,1,1,1]
    //   },
    clearC(v) {
            // console.log(v, this.applyOu)
        // if (v.length === 0) {
          this.getCM1Data('', 1)
        // }
      },
      visibleChange(v) {
        // if (this.applyOu.length===0) {
        //     // console.log(v, this.applyOu)
        //   return
        // }
        // if (v === false) { //才调接口
        //   this.getVmList('', 1)
        // }
      },
       getOu() {
        httpGet('tenant/findDivisions').then((res) => {
          if (res) {
            this.ouSelectList = res;
            //   console.log(this.ouSelectList)
            // this.form.ou = this.ouSelectList[0].value;
          } else {
            this.$message.error('通信错误')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      getDownload() {
            let  currentTime= this.valueCM2
        window.open('/dcp/statistic/exportAppliedDesktop?currentTime='+currentTime)
            // window.open('dcp/statistic/exportQuitDesktop')
            
        // let para = {
        //   start_date: this.valueCM2[0] ? new Date(this.valueCM2[0]).toLocaleDateString() : '',
        //   end_date: this.valueCM2[1] ? new Date(this.valueCM2[1]).toLocaleDateString() : '',
        //   cc_uid: this.valueCM1,
        //   short_date: this.valueCM6,
        //   column: this.valueCM3,
        //   channel: this.valueCM7,
        //   // school_id:this.valueCM8,
        //   download: 1
        // }
        // marketTable(para, token).then(res => {
        //   // let a = 'http://pandatest.dfth.com';
        //   let a = '';
        //   window.open(a + res.data)
        // })
      },
      // getDownload1(){
      //     this.downloadA1 = 'https://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=https%3A%2F%2Ftimgsa.baidu.com%2Ftimg%3Fimage%26quality%3D80%26size%3Db9999_10000%26sec%3D1510732763284%26di%3Da586c3c5b1215cf87979da208f428f85%26imgtype%3D0%26src%3Dhttp%253A%252F%252Feasyread.ph.126.net%252FP252hyNA-X_WiEw3rMmFtA%253D%253D%252F7917057665060942069.jpg&thumburl=https%3A%2F%2Fss2.bdstatic.com%2F70cFvnSh_Q1YnxGkpoWK1HF6hhy%2Fit%2Fu%3D3212574178%2C2908544870%26fm%3D27%26gp%3D0.jpg'
      // },
      handleCurrentChange2: function (val) { //变更页数
        this.currentPage2 = val;
         let page = (val-1)*7
        this.resourceData = this.resourceDataAll.slice(page,page+7)
        // this.getCM4Data();
        // this.fetchData();
      },
      updateListCM(i) { //第一个大表格
        // if (i == 1 && this.valueCM6 != '') {
        //   this.valueCM2 = [];
        //   this.valueCM3 = 'day'
        //   this.getCM1Data();
        //   // this.getCM2Data(); 
        //   // this.getCM3Data();                     
        //   this.getCM4Data();
        // } else if (i == 3 && this.valueCM2.length != 0) {
        //   this.valueCM6 = '';
        //   this.getCM1Data();
        //   // this.getCM2Data();
        //   // this.getCM3Data();                     
        //   this.getCM4Data();
        // } else if (i == 2 && this.valueCM2.length != 0) {
        //   this.valueCM6 = '';
          this.getCM1Data();
        //   // this.getCM2Data();
        //   // this.getCM3Data();                     
        //   this.getCM4Data();
        // } else if (i == 4) {
        //   this.getCM1Data();
        //   // this.getCM2Data();
        //   // this.getCM3Data();                     
        //   this.getCM4Data();
        // }
      },
      getCM1Data(date) { //折线图
        let para = {
          currentTime: date ? date : this.valueCM2,
           ou: this.applyOu.length > 0 ? this.applyOu.slice(-1)[0] : ''
          // school_id:this.valueCM8

        }
        const url = `statistic/findAppliedDesktop`
        httpAjax(url, para).then((res) => {
          let data = res;
          if(data.length>0){
              this.line.xAxis.data = data.map(item => {
                return item.createTimeStr.slice(0, 10)
              });
              this.line.series = [{ //以后改成动态获取
                name: "已申请桌面",
                type: "line",
                data: data.map(item => {
                  return item.count
                })
              }]
              this.line.legend = {
                orient: 'horizontal',
                top: 20,
                data: ["已申请桌面"]
                // backgroundColor:'white'
              };
               this.resourceDataAll = data;
            this.total2 = data.length;
            this.resourceData = data.slice(0,7);
              this.$nextTick(() => {
        this.setScrollBar('#tableTotal')
      })
          }else{
               this.resourceData = []
               let year = new Date().getFullYear();
              let month = this.valueCM2?new Date(this.valueCM2).getMonth()+1:new Date().getMonth()+1;
              let daynum = new Date(year,month,0).getDate();
              let a = [];
              let b = [];
              for(let i=1;i<=daynum;i++){
                  a = [...a,`${year}-${('0'+month).slice(-2)}-${('0'+i).slice(-2)}`]
                  b = [...b,0]
              }
                 this.line.xAxis.data = a
              this.line.series = [{ //以后改成动态获取
                name: "已申请桌面",
                type: "line",
                data: b
              }]
              this.line.legend = {
                orient: 'horizontal',
                top: 20,
                data: ["已申请桌面"]
                // backgroundColor:'white'
              };

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
    //       if(data.length>0){
    //           this.line1.xAxis.data = data.map(item => {
    //             return item.createTimeStr.slice(0, 10)
    //           });
    //           this.line1.series = [{ //以后改成动态获取
    //             name: "已清退桌面",
    //             type: "line",
    //             data: data.map(item => {
    //               return item.count
    //             })
    //           }]
    //           this.line1.legend = {
    //             orient: 'horizontal',
    //             bottom: 0,
    //             data: ["已清退桌面"]
    //             // backgroundColor:'white'
    //           };
    //       }else{
    //             let year = new Date().getFullYear();
    //           let month = new Date().getMonth()+1;
    //           let daynum = new Date(year,month,0).getDate();
    //           let a = [];
    //           let b = [];
    //           for(let i=1;i<=daynum;i++){
    //               a = [...a,`${year}-${('0'+month).slice(-2)}-${('0'+i).slice(-2)}`]
    //               b = [...b,0]
    //           }
    //              this.line1.xAxis.data = a
    //           this.line1.series = [{ //以后改成动态获取
    //             name: "已清退桌面",
    //             type: "line",
    //             data: b
    //           }]
    //           this.line1.legend = {
    //             orient: 'horizontal',
    //             top: -110,
    //             data: ["已清退桌面"]
    //             // backgroundColor:'white'
    //           };
    //       }
    //     }).catch((error) => {
    //       console.log(error)
    //     })
    //   },
      setScrollBar(dom) {
        // if (this.tableData.length) {
          addScrollBar(dom,'','all')
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
    // //   this.$nextTick(() => {
    // //     this.setScrollBar('#tableTotal')
    // //   })
    // },
    created() {
      this.getCM1Data();
       this.getOu()

    //   this.getCM2Data()
      //    this.getCM4Data();
      // sourceList(token).then(res => {
      //     this.options1 = res.data
      // })
      // let cam={
      //             simple:1
      //         }
      //         campusList(cam, token).then((res) => {//获取校区
      //         this.schoolList = res.data;
      //         this.schoolList.unshift({
      //             id:0,
      //             title:'全部校区'
      //         })
      //         this.valueCM8 = 0;
      //     })
      // this.funnel.series[0].data = [{
      //                 value: 50,
      //                 name: '资源认领量'
      //             },{
      //                 value: 40,
      //                 name: '客户认领量'
      //             },
      //             {
      //                 value: 30,
      //                 name: '沟通量'
      //             },
      //             {
      //                 value: 20,
      //                 name: '邀约量'
      //             },
      //             {
      //                 value: 10,
      //                 name: '到访量'
      //             },
      //             {
      //                 value: 2,
      //                 name: '签单量'
      //             }]

      // this.line.xAxis.data = ["2017-05-01", "2017-05-01", "2017-05-01", "2017-05-01", "2017-05-01", "2017-05-01", "2017-05-07"]
      // this.line.series = [{ //以后改成动态获取
      //     name: "资源认领量",
      //     type: "line",
      //     data: [2, 5, 10, 5, 1, 5, 10]
      // }, { //以后改成动态获取
      //     name: "客户认领量",
      //     type: "line",
      //     data: [2, 5, 10, 5, 1, 5, 10]
      // }, {
      //     name: "沟通量",
      //     type: "line",
      //     data: [3, 10, 12, 3, 9, 0, 2]
      // }, {
      //     name: "邀约量",
      //     type: "line",
      //     data: [4, 8, 18, 15, 4, 2, 1]
      // }, {
      //     name: "到访量",
      //     type: "line",
      //     data: [5, 11, 9, 4,19, 10, 12]
      // }, {
      //     name: "签单量",
      //     type: "line",
      //     data: [14, 18, 8, 5, 14, 12, 11]
      // }]
      // this.line.legend = {
      //                 orient: 'horizontal',
      //                 bottom: 0,
      //                 textStyle:{
      //                     fontSize:14
      //                 },
      //                 data: ["资源认领量","客户认领量", "沟通量", "邀约量", "到访量", "签单量"]
      //                 // backgroundColor:'white'
      //             };


    }
  }

</script>
<style>
  #tableSale2 .el-table th {
    background: #f2f2f2
  }

  #tableSale2 .el-table th>div {
    background: #f2f2f2
  }

  /* #tableSale2 .el-table__footer-wrapper {
    color: #1fb5ad
  } */

  /* .echarts {
    width: 100%;
    height: 400px;
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
  } */

  .block {
    text-align: center;
    margin-top: 10px;
  }

  /* .drop .el-dropdown {
    font-size: 1em;
    color: black;
  } */

  /* .dateReportS .el-date-editor--daterange.el-input {
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
