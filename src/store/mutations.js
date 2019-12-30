import * as types from './mutation-types'
// import {setToKen} from '../utils/cookie'
// const ava = {
//     admin:require('../assets/img/system.png'),
//     tenant:require('../assets/img/tenent.png'),
//     user:require('../assets/img/user.png'),
//     support:require('../assets/img/online.png'),
//     troubleshooting:require('../assets/img/trobuleShooting.png'),
//     asset:require('../assets/img/tenent.png'),
// }
var nowPro = 0;
var loop = null;
var loopSpeed = 0.2;
var sliceS = 0;
const updateProgress = (state, status) => {
  cancelAnimationFrame(loop);
  if (nowPro < status.progress) { //当前进度<=传进来的进度时
    loop = requestAnimationFrame(() => {
      state.uploadList[status.name].progress = nowPro + loopSpeed; //修改列表中的状态
      //   if (status.progress !== 0) { //当第一次3个进程的0进度传进来是不修改nowPro,保证初始,之后nowPro就等于新值,
      nowPro += loopSpeed;
      //   }
      updateProgress(state, status)
    });
  } else { //当当前进度>=传进来的进度时,重置
    state.uploadList[status.name].progress = status.progress; //修改列表中的状态
    nowPro = status.progress
  }
}
const mutations = {
  [types.SET_TOKEN](state, code) {
    // if (code === '0') {  // 系统管理员权限
    //     state.stateCode = code
    //     sessionStorage.setItem('role', 'admin');
    // } else if ( code === '1') { // 云管理员权限
    //     state.stateCode = code
    //     sessionStorage.setItem('role', 'tenantAdmin');
    // } else if ( code === '2' ) {  //  用户权限 
    //     state.stateCode = code
    // }
    // if(!code){
    //     sessionStorage.setItem('role', 'user');
    // }else{
    sessionStorage.setItem('role', code);
    // sessionStorage.setItem('avatar',ava[code])
    // }
    // setToKen(code)
  },
  [types.SET_VIEW_KEY](state, key) {
    state.renderViewKey = key
  },
  changeUse(state, key) {
    if (key) {
      state.canUse = false;
    } else {
      state.canUse = !state.canUse
    }
  },
  removeTab(state) {
    state.tagsView = []
    state.fileList = [];
    state.uploadList = {}
  },
  setFormData(state, data) {
    state.formData = data
  },
  setType(state, data) {
    state.type = data
  },
  // getImg(state,url){
  //     state.getImg = url
  // },
  addView(state, view) {
    let re = state.tagsView.some(item => {
      return item.name === view.name
    })
    if (re) {
      return
    } else {
      state.tagsView = [...state.tagsView, view]
    }
  },
  DELVIEW(state, view) {
    for (const [i, v] of state.tagsView.entries()) {
      // console.log(view)
      if (v.name === view.name) {
        state.tagsView.splice(i, 1)
        break
      }
    }
  },
  DELOTHER(state, view) {
    state.tagsView = state.tagsView.filter(v => {
      return v.name === view.name
    })
  },
  getChat(state, status) {
    state.chatStatus = status
  },
  checkWs(state, status) {
    state.checkWs = status
  },
  SETFILE(state, file) { //实际上传的文件列表
    state.fileList = [...state.fileList, file]
  },
  resetFile(state) {
    state.fileList = [];
  },
  delFile(state, fileName) {
    let idx;
    state.fileList.filter((item, index) => {
      if (item.name === fileName) {
        idx = index
      }
    })
    if (idx !== undefined) {
      state.fileList.splice(idx, 1)
    }
  },
  setUploadList(state, file) { //新增文件列表
    state.uploadList = {
      ...state.uploadList,
      [file.name]: {
        name: file.name,
        size: file.size,
        progress: 0, //file.percentage,
        status: file.status
      }
    }
  },
  setUploadStatus(state, status) { //设置文件列表中的文件状态
    state.uploadList[status.name].status = status.type; //修改列表中的状态
    state.uploadStatus = status; //包括名字和状态,需要传到header
    if (status.type === 'cancel') { //如果是取消,删除文件列表
      delete state.uploadList[status.name]
      if (Object.keys(state.uploadList).length !== 0) {
        state.uploadList = {
          ...state.uploadList
        }
      } else {
        state.uploadList = {};
      }
    }
  },

  changeStatue(state, status) { //根据progress的监听后,改变文件状态和进度
    if (state.uploadList[status.name]) {
      state.uploadList[status.name].status = 'downloading'; //修改列表中的状态
      if (status.progress === 1) {
        nowPro = 0;
        cancelAnimationFrame(loop);
        state.uploadList[status.name].progress = status.progress; //修改列表中的状态
        return
      }
      //   console.log(status.sliceNum,1234)
      sliceS = (1 / status.sliceNum); //计算每个切片每次增加的进度
      if (sliceS > 0.01) { //每次大于1%的话
        loopSpeed = (sliceS / 4); //把进度分成4小次增加;
        // console.log(state.uploadList[status.name].progress, nowPro, loopSpeed, 999)
        // loop = requestAnimationFrame(updateProgress(status));
        updateProgress(state, status)
      } else {
        state.uploadList[status.name].progress = status.progress; //修改列表中的状态

      }
    }

  },
  changeIsClick(state, boole) {
    state.isClick = boole;
  },
  setNowStatus(state, data) {
      if(data.allDone){
        state.allDone = data.allDone;
      }else{
          state.usedRate = (data.usedRate - 0).toFixed(2);
          state.leftQuota = data.leftQuota;
          state.usedQuota = data.usedQuota;
          state.leftRaw = data.leftRaw;
      }
  },
  resetFileAll(state) {
    state.fileList = [];
    state.uploadList = {};
    state.uploadStatus = {};
    state.isClick = false;
  }
}


export default mutations
