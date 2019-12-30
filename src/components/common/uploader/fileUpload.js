/**
 * Fileupload v1.0.0
 * (c) fwx426328
 */
// let that = this;
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    typeof define === 'function' && define.cmd ? define(factory) :
    (global.Fileupload = factory());
})(this, function () {
  'use strict';
  var version = '1.0.0';

  function isDef(v) {
    return v !== undefined && v !== null;
  };

  function isTrue(v) {
    return v === true;
  };

  function isObject(obj) {
    return obj !== null && typeof obj === 'object';
  };

  function isFunction(it) {
    return Object.prototype.toString.call(it) === '[object Function]';
  };

  function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  };

  function noop() {};

  //   function slice(it) {
  //     return [].slice.call(it);
  //   };

  function assert(condition, message) {
    if (!condition) {
      throw new Error(("Fileupload.js: " + message));
    }
  };


  function fileSlice(file, size) { //切片
    var fileList = [];
    let len = file.size / size;
    for (let i = 0; i <= len; i++) {
      var start = i * size;
      var end = (i + 1) * size;
      var blob = file.slice(start, end);
      fileList.push({
        index: i,
        blob: blob
      });
    };
    return fileList;
  };

  function hasProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  function eachProp(obj, func) {
    var prop;
    for (prop in obj) {
      if (hasProp(obj, prop)) {
        if (func(obj[prop], prop)) {
          break;
        }
      }
    }
  };

  function mixin(target, source, force) {
    if (source) {
      eachProp(source, function (val, prop) {
        if (isTrue(force) || !hasProp(target, prop)) {
          target[prop] = val;
        };
      });
    };
    return target;
  };

  var ajaxSetting = {
    type: 'GET',
    dataType: 'json',
    data: {},
    processData: true
  };

  function ajax(options) {
    options = mixin(options, ajaxSetting);
    var params = options.data;
    if (options.processData) {
      params = formatParams(params);
    }
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var status = xhr.status;
        if (status >= 200 && status < 300) {
          options.success && options.success(xhr.responseText, xhr.responseXML);
        } else {
          options.error && options.error(status);
        }
      }
    }

    if (options.type == "GET") {
      xhr.open("GET", options.url + "?" + params, true);
      xhr.send(null);
    } else if (options.type == "POST") {
      xhr.open("POST", options.url, true);
      if (options.processData) {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      }
      xhr.send(params);
    }
  };

  //格式化参数
  function formatParams(data) {
    var arr = [];
    for (var name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
  };


  function Fileupload(option) {

    assert(isObject(option), 'constructor only accept object');

    assert(isString(option['upload']), 'upload\' must be string');
    var URL_UPLOAD_FILE = option['upload'];

    assert(isString(option['query']), 'query\' must be string');
    var URL_QUERY_FILE = option['query'];

    assert(isString(option['merge']), 'merge\' must be string');
    var URL_MERGER_FILE = option['merge'];

    assert(isFunction(option['filesign']), 'filesign\' must be function');
    var FILE_SIGN_FUN = option['filesign'];
    var IS_LOACL_CACHE = isDef(option['cache']) ? Boolean(option['cache']) : true;

    var THREAD_NUM = 3;

    var SLICE_SIZE = option['slicesize'] || 16 * 1024 * 1024;
    var _goonFile = ''; //恢复下载文件名
    var _sliceNum = 0; //总切片数
    var _currentUuid = ''; //uuid
    var _isPause = false;
    var _isGoon = false;
    var _isDelete = false;
    var _allStop = false;
    var _isFail = 0;
    var _nowThreadNum = 0;
    var _delFileName = ''; //删除的文件名
    var _fileList = [];
    var _fileListBack = [] //暂停时 存放的备份列表
    var _currentSliceList = [];
    var _mergeFileList = [];
    var _threadId = 0;
    var _currentFile = null;
    var _successThreadNum = 0;
    var _user = sessionStorage.getItem('username')
    // var _totalSize = 0;
    var _onMap = {
      complete: noop,
      query: noop,
      merge: noop,
      upload: noop,
      success: noop,
      pause: noop,
      error: noop,
      progress: noop
    };

    // function initVariable() {//每次会add新的file时的重置
    //   _fileList = [];
    //   // _fileListBack=[];
    //   _currentSliceList = [];
    // //   _mergeFileList = [];
    // //   _threadId = 0;
    //   _currentFile = null;
    //   _successThreadNum = 0;
    //   _totalSize = 0;
    // };

    function getMd5(file, fn) {
      var fileReader = new FileReader();
      try {
        fileReader.readAsArrayBuffer(file);
      } catch (e) {
        fn(e);
      };
      fileReader.onload = function (e) {
        var md5 = FILE_SIGN_FUN(e.target.result);
        //console.log(md5, 777666555)
        fn(md5);
      };
    };


    function startThread() {
      _successThreadNum = 0; //初始化
      _threadId = 0;
      _allStop = false; //初始化,true表示所有进程已经停止
      for (var i = 0; i < THREAD_NUM; i++) { //限制3个进程上传
        upload();
      };
    };

    function initFileSlice() { //初始化当期文件,必须在文件数在1以上,0进来虽然会return,但其他地方会继续
      //console.log(_fileList.length, 'ccc')
      if (_fileList.length === 0) {
        return;
      };
      _currentFile = _fileList.shift();
      _currentUuid = getUuid();
      _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取头一个文件开始上传
      // _currentFile = _fileList.pop();

      _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
      // console.log(_currentSliceList,3)

    };

    function getUuid() {
      var d = new Date().getTime();
      var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-';
      var uuid = str.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16); //(先用&跟0x3位运算,再用|跟0x8位运算),最后统一转成16进制
      });
      return uuid + sessionStorage.getItem('username');
    }

    function mergeFile() { //检查文件是否合并成功,上传的最后一步
    //   if (_mergeFileList.indexOf(_currentFile.name) > -1) {
    //     return;
    //   };
    //   console.log()
      _onMap.progress.call(this, { //当前完成
        progressN: 1,
        filename: _currentFile.name,
        sliceNum:_sliceNum
      });
      _onMap.complete.call(this, _currentFile.name); //通知上传完成
      ajax({
        url: URL_MERGER_FILE,
        type: 'POST',
        data: {
          user: _user,
          fileName: _currentFile.name,
          uuid: _currentUuid
        },
        success: function (data) {
          //可能会要添加接口code成功与否的判断
          let d = JSON.parse(data);
          if (d.result === 'success') {
            _mergeFileList.push(_currentFile.name);
            _onMap.merge.call(this, _currentFile.name); //告知合并完成
            //   _onMap.complete.call(this, _currentFile.name); //当前完成
          } else {
            _onMap.error.call(this, _currentFile.name); //上传报错时不进行操作    
          }
          if (_fileList.length > 0) { //此时如果是多文件上传,则开始下一个上传,如果此时是删除状态,跳出,不自动进行下一个,由删除方法里去执行
            _threadId = 0; //下一个文件开始上传,所以重置已上传的切片数
            _currentFile = _fileList.shift();
            _currentUuid = getUuid();
            _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传

            _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
            startThread();
          } else {
            _onMap.pause.call(this);
            _allStop = true;

            _onMap.success.call(this, null); //全部成功
            // _onMap.progress.call(this, 1);
          }
        },
        error: function (e) {
          //   _onMap.merge.call(this, e);
          _onMap.error.call(this, _currentFile.name); //上传报错时不进行操作
          if (_fileList.length > 0) { //此时如果是多文件上传,则开始下一个上传,如果此时是删除状态,跳出,不自动进行下一个,由删除方法里去执行
            _threadId = 0; //下一个文件开始上传,所以重置已上传的切片数
            _currentFile = _fileList.shift();
            _currentUuid = getUuid();
            _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传

            _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
            startThread();
          } else {
            _onMap.pause.call(this);
            _allStop = true;

            _onMap.success.call(this, null); //全部成功
            // _onMap.progress.call(this, 1);
          }
          console.error('[Fileupload mergeFile]' + e);
        }
      });
    };

    function queryFile(md5, fn) {
      if (IS_LOACL_CACHE) {
        var isExistMd5 = window.localStorage.getItem(md5);
        if (isExistMd5 == md5) {
          var msg = {
            isExist: 1,
            message: 'local exist'
          };
          _onMap.query.call(this, msg);
          return fn(msg);
        };
      }
      //console.log(_currentFile, 777)
      ajax({
        url: URL_QUERY_FILE,
        type: 'POST',
        dataType: "json",
        data: {
          md5: md5,
          user: _user,
          uuid: _currentUuid,
          fileName: _currentFile.name
        },
        success: function (data) {
          if (data) {
            _onMap.query.call(this, data);
            fn(JSON.parse(data));
          }
        },
        error: function (e) {
          _onMap.error.call(this, _currentFile.name); //上传报错时不进行操作

          if (_fileList.length > 0) { //此时如果是多文件上传,则开始下一个上传,如果此时是删除状态,跳出,不自动进行下一个,由删除方法里去执行
            _threadId = 0; //下一个文件开始上传,所以重置已上传的切片数
            _currentFile = _fileList.shift();
            _currentUuid = getUuid();
            _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传

            _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
            startThread();
          } else {
            _onMap.pause.call(this);
            _allStop = true;

            _onMap.success.call(this, null); //全部成功
            // _onMap.progress.call(this, 1);
          }
          console.error('[Fileupload queryFile]' + e);
        }
      });
    };

    function getProgress() {
      //   var progress = (_threadId * SLICE_SIZE / _currentFile.size).toFixed(2) //_totalSize; 
      var progress = (_threadId / _sliceNum) //_totalSize; 
    //   console.log(_threadId, _sliceNum, 9999)
      if (progress >= 0.99) {
        progress = 0.99;
      }
      return {
        progressN: progress,
        filename: _currentFile.name,
        sliceNum:_sliceNum

      };
    };

    // var uploadtimer = null;```````````````````````

    function upload() {
      //console.log(_isFail, 999999999)
      //报错
      if (_isFail !== 0) {
        //console.log(12321312)
        // _nowThreadNum++;
        _successThreadNum++;
        if (_successThreadNum + _isFail === THREAD_NUM) {
          _fileListBack.push(_currentFile);
          _isFail = 0;
          _isPause = false;
          _isDelete = false;
          _isGoon = false;
          if (_fileList.length === 0) { //接着判断当前只有一个时,也不用重新再开下载
            _onMap.pause.call(this);
            _allStop = true;

            return;
          };
          _currentFile = _fileList.shift();
          _currentUuid = getUuid();
          _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传
          _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
          _threadId = 0;
          _successThreadNum = 0;
          startThread();
        }
        return
      }
      //暂停
      if (_isPause) { //需要修改,暂停时自动进行下一个
        // if(_fileList.length===0){//代表此时已经没有其他需要上传的
        //     clearTimeout(uploadtimer);
        //     uploadtimer = setTimeout(function() {
        //       startThread();
        //     }, 300);
        //     if (uploadtimer) {
        //       return;
        //     }
        // }else{
        //否则就进行下一个文件上传
        _successThreadNum++;
        if (_isFail !== 0) { //先暂停后报错时,假如线程先报错,再进入暂停判断
          if (_successThreadNum + _isFail === THREAD_NUM) {
            _fileListBack.push(_currentFile);
            _isFail = 0;
            _isPause = false;
            _isDelete = false;
            _isGoon = false;
            if (_fileList.length === 0) { //接着判断当前只有一个时,也不用重新再开下载
              _onMap.pause.call(this);
              _allStop = true;

              return;
            };
            _currentFile = _fileList.shift();
            _currentUuid = getUuid();
            _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传
            _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
            _threadId = 0;
            _successThreadNum = 0;
            startThread();
          }
          return
        }
        if (_successThreadNum === THREAD_NUM) { //暂停逻辑:暂停后,等待3个线程进来,把当前文件放到备份列表中,判断当前上传列表是不是不为0,是的话取消暂停,同时开始下一个下载
          _successThreadNum = 0;
          //初始
          _isPause = false; //重置暂停
          if (_isDelete) { //先删除,后暂停
            _isDelete = false;
            if (_currentFile.name === _delFileName) { //删除正在进行中的
              _threadId = 0;
              if (_fileList.length === 0) { //接着判断当前只有一个时,也不用重新再开下载
                _onMap.pause.call(this);
                _allStop = true;

                return;
              };
              _currentFile = _fileList.shift();
              _currentUuid = getUuid();
              _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //不然就取头一个文件开始上传
              _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
              startThread();
              return
            } else {
              let onFileIdx;
              let pauseFileIdx;
              _fileList.filter((item, index) => { //等待中的
                if (item.name === _delFileName) {
                  onFileIdx = index;
                }
              })
              if (onFileIdx !== undefined) {
                _fileList.splice(index, 1) //从列表中删除
              }
              _fileListBack.filter((item, index) => { //暂停中的
                if (item.name === _delFileName) {
                  pauseFileIdx = index;
                }
              })
              if (pauseFileIdx !== undefined) {
                _fileListBack.splice(index, 1) //从备份列表中删除
              }
            }
          }
          //console.log(_currentFile, 888)
          _fileListBack.push(_currentFile); //把当前文件放到备份列表中
          if (_isGoon) {
            _isGoon = false;
            let idx;
            let fileName = _goonFile;
            let idx_currentFile = _fileListBack.filter((item, index) => {
              if (item.name === fileName) {
                idx = index;
                return item
              }
            })[0]; //取下一个文件开始上传
            if (idx_currentFile) {
              _fileListBack.splice(idx, 1) //从备份中删除该文件
              _fileList.push(idx_currentFile) //直接把点击恢复的文件插入继续下载列表的最后
            }
          }
          //   if (_isGoon) { //暂停还在继续,但是此时已经点了继续,因为点过暂停,所以肯定是在back列表中,如果恢复下载的时候,暂停线程正在执行,当执行完时,判断是不是要恢复下载,
          //     _isGoon = false; //恢复下载指定的
          //     let ix;
          //     _currentFile = _fileListBack.filter((item, index) => {
          //       if (item.name === _goonFile) {
          //         ix = index;
          //         return item
          //       }
          //     })[0]; //取下一个文件开始上传
          //     _fileListBack.splice(ix, 1) //从备份中删除该文件
          //     _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
          //     _threadId = 0;
          //     _successThreadNum = 0;
          //     startThread();
          //     return
          //   }
          //只是暂停的状态,
          // _onMap.pause.call(this, _currentFile);//告诉当前文件停止
          if (_fileList.length !== 0) { //加入文件列表不止一条,继续下一条的上传
            // //console.log(_fileList, 123)
            _currentFile = _fileList.shift();
            _currentUuid = getUuid();
            _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传
            _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
            _threadId = 0;
            startThread();
          } else { //如果此时是0了,进程已经结束,需要通知组件
            _onMap.pause.call(this);
            _allStop = true;

          } //如果当前只有一个上传项目,则无需做操作,停止上传
        }
        return;
        // }
      }
      //删除状态
      if (_isDelete) { //没其他操作,仅删除
        if (_currentFile.name === _delFileName) { //判断删的是当期在进行的
          _successThreadNum++;
          if (_isFail !== 0) { //假如线程先报错,再进入删除判断
            if (_successThreadNum + _isFail === THREAD_NUM) {
              _fileListBack.push(_currentFile);
              _isFail = 0;
              _isPause = false;
              _isDelete = false;
              _isGoon = false;
              if (_fileList.length === 0) { //接着判断当前只有一个时,也不用重新再开下载
                _onMap.pause.call(this);
                _allStop = true;

                return;
              };
              _currentFile = _fileList.shift();
              _currentUuid = getUuid();
              _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传
              _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
              _threadId = 0;
              _successThreadNum = 0;
              startThread();
            }
            return
          }
          if (_successThreadNum === THREAD_NUM) {//线程全部跑完,检查有没有下一个,有就继续
            _isDelete = false;
            _successThreadNum = 0;
            _threadId = 0;
            if (_fileList.length === 0) {//接着判断当前只有一个时,也不用重新再开下载
              _onMap.pause.call(this);
              _allStop = true;

              return;
            };
            _currentFile = _fileList.shift();
            _currentUuid = getUuid();
            _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //不然就取头一个文件开始上传
            _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
            startThread();
          }
          return
        }
      }
      //没有剩余切片
      if (_currentSliceList.length == 0) {//此时已经上传完成,假如有1,2,3,4号4个切片,如果4先完成,此时length=0,因此无需再上传,因为只会通过3个线程上传,所以是1,2,3传成功之后会再次进入upload,
        _successThreadNum++; //此时是1->4,_successThreadNum++,2->4,_successThreadNum++,此时为2,3->4,_successThreadNum++=3
        // _nowThreadNum++;
        //console.log(_isFail, 2423432424)
        if (_isFail !== 0) {
          if (_successThreadNum + _isFail === THREAD_NUM) {
            _fileListBack.push(_currentFile);
            _isFail = 0;
            _isPause = false;
            _isDelete = false;
            _isGoon = false;
            if (_fileList.length === 0) { //接着判断当前只有一个时,也不用重新再开下载
              _onMap.pause.call(this);
              _allStop = true;

              return;
            };
            _currentFile = _fileList.shift();
            _currentUuid = getUuid();
            _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传
            _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
            _threadId = 0;
            _successThreadNum = 0;
            startThread();
          }
          return
        }
        _isFail = 0;
        _isPause = false;
        _isDelete = false;
        _isGoon = false;
        if (_successThreadNum === THREAD_NUM) { //此时_successThreadNum=3,所以清零检查合并
          _successThreadNum = 0;
          //console.log(99999999, _successThreadNum)
          mergeFile();
        }
        //console.log(_isFail, 55555)
        return;
      };
      // //console.log(_currentSliceList)
      _onMap.progress.call(this, getProgress());

      var blobTemp = _currentSliceList.shift();
      if (blobTemp) {
        // var blobTemp = _currentSliceList.pop();
        (function (temp) {
          getMd5(temp.blob, function (md5) {
            queryFile(md5, function (data) {
                // console.log(data,55779)
              //   if (data.code == 0) {
              //     //console.warn('[Fileupload upload ajax error]');
              //   }
              //console.log(data.exist,2233499090)
              if (data.exist === 'yes') {
                _threadId++;
                upload();
              } else {
                //console.log(temp.blob, _currentFile.name, _currentFile.size, temp.index, md5, 2221342424);
                var formData = new FormData();
                formData.append('file', temp.blob);
                formData.append('fileName', _currentFile.name);
                formData.append('user', _user);
                formData.append('fileSize', _currentFile.size);
                formData.append('sliceNum', _sliceNum); //总片数
                formData.append('indexNum', temp.index);
                formData.append('uuid', _currentUuid);
                formData.append('md5', md5);
                ajax({
                  url: URL_UPLOAD_FILE,
                  type: 'POST',
                  cache: false,
                  data: formData,
                  processData: false,
                  contentType: false,
                  success: function (data) {
                    _threadId++;
                    _onMap.upload.call(this, data);
                    // if (_isFail === 0) {
                    upload();
                    // }
                    IS_LOACL_CACHE && window.localStorage.setItem(md5, md5);
                  },
                  error: function (e) {
                    _isFail++;
                    _onMap.error.call(this, _currentFile.name); //上传报错时不进行操作
                    if (_isFail + _successThreadNum === 3) { //失败数等于调接口数
                      _fileListBack.push(_currentFile);
                      _isFail = 0;
                      _isPause = false;
                      _isDelete = false;
                      _isGoon = false;
                      //console.log(_fileList, _currentFile)
                      if (_fileList.length === 0) { //接着判断当前只有一个时,也不用重新再开下载
                        _onMap.pause.call(this);
                        _allStop = true;

                        return;
                      };
                      _currentFile = _fileList.shift();
                      _currentUuid = getUuid();
                      _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传
                      _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
                      _threadId = 0;
                      _successThreadNum = 0;
                      startThread();
                    }
                    // else if (_currentSliceList.length == 0) { //2个成功,1个失败时,
                    //   _isFail = 0;
                    //   _isPause = false;
                    //   _isDelete = false;
                    //   if (_fileList.length === 0) { //接着判断当前只有一个时,也不用重新再开下载
                    //     _onMap.pause.call(this);_allStop = true;
                    //     return;
                    //   };
                    //   _currentFile = _fileList.shift();_currentUuid = getUuid();_sliceNum = Math.ceil(_currentFile.size/SLICE_SIZE) //取下一个文件开始上传
                    //   _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
                    //   _threadId = 0;
                    //   _successThreadNum = 0;
                    //   startThread();
                    // } else { //3个线程全报错,程序中止

                    // }

                    // _currentSliceList.push(temp);
                    // _onMap.upload.call(this, data);
                    // upload();
                    console.log('[Fileupload upload fail, try again]');
                  }
                });
              }
            });
          });
        })(blobTemp);

      } else {
        _successThreadNum++ //
        if (_successThreadNum === THREAD_NUM) { //此时_successThreadNum=3,所以清零检查合并
          //console.log(10213131231)
          _successThreadNum = 0;
          mergeFile();
        }
      }
    }



    this.addFile = function (fileArr) {
      //   initVariable();
      _fileList = [..._fileList, ...fileArr] //slice(fileArr);//改装成es6 添加文件的方法
      //console.log(_fileList, 'aaa')

      //   //console.log(_fileList)
      //   _fileList.forEach(function (file) {
      //     _totalSize += file.size;
      //   });
    };

    this.upload = function (status) { //this.的都是给外部调用
      // //console.log(_fileList,status)
      if (status === 'first') { //第一次进来时启动进程, 如果终止上传后,再次添加也会启动
        initFileSlice(); //每次添加后都会调用
        startThread();
        //console.log(status, 'aaabb')

      }
    };

    this.on = function (type, fn) {
      if (isFunction(fn)) {
        _onMap[type] = fn;
      }
      if (isObject(type)) {
        _onMap = mixin(type, _onMap);
      }
    };

    this.setPause = function (pause) {
      _isPause = Boolean(pause);
    }
    this.setGoonFile = function (fileName) { //暂停恢复传文件进来
      _goonFile = fileName; //逻辑有误
      //继续下载的逻辑:因为只有全部暂停的情况下,继续下载才会有用,所以先取消暂停,从备份列表中取出文件,同时从备份列表中删除,切片,重置线程,重开下载
      if (_allStop) { //表示此时进程全部是停止状态,列表全部进入back
        let ix;
        _currentFile = _fileListBack.filter((item, index) => {
          if (item.name === fileName) {
            ix = index;
            return item
          }
        })[0]; //取下一个文件开始上传
        _sliceNum = Math.ceil(_currentFile.size / SLICE_SIZE) //取下一个文件开始上传
        _fileListBack.splice(ix, 1) //从备份中删除该文件
        _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
        _threadId = 0;
        _currentUuid = getUuid();
        _successThreadNum = 0;
        startThread();
      } else { //表示此时进程还在继续
        _isGoon = true;
        let idx;
        let idx_currentFile = _fileListBack.filter((item, index) => {
          if (item.name === fileName) {
            idx = index;
            return item
          }
        })[0]; //取下一个文件开始上传
        if (idx_currentFile) {
          _fileListBack.splice(idx, 1) //从备份中删除该文件
          _fileList.push(idx_currentFile) //直接把点击恢复的文件插入继续下载列表的最后
        }

      }
    }
    this.deleteFile = function (fileName) { //删除上传列表
      _delFileName = fileName; //删除逻辑:,如果正在进行中,先暂停,此时其他下载线程进入upload的暂停当前,同时根据isdelete停止后续下一个文件
      _isDelete = true; //如果线程全完了,在mergeFile加了判断跳出, 如果没完进入upload也会判断跳出
      if (!_isPause) { //此时不存在正在暂停的状态:全部暂停的情况和没有点暂停的情况
        if (_currentFile.name !== _delFileName || (_allStop && _currentFile.name === _delFileName)) { //删除等待的或者被暂停的
          _isDelete = false;
          let onFileIdx;
          let pauseFileIdx;
          _fileList.filter((item, index) => { //等待中的
            if (item.name === fileName) {
              onFileIdx = index;
            }
          })
          if (onFileIdx !== undefined) {
            _fileList.splice(index, 1) //从列表中删除
            return
          }
          _fileListBack.filter((item, index) => { //暂停中的
            if (item.name === fileName) {
              pauseFileIdx = index;
            }
          })
          if (pauseFileIdx !== undefined) {
            _fileListBack.splice(index, 1) //从备份列表中删除
            return
          }
        } //如果此时删的是当前的,一种是当前全部传完了,被删除拦截后,删除, 没有被删除拦截,可能就是merge,或者没传完继续到传完后被删除拦截->删除
        //  else {
        //     _isDelete = false;
        //   if (_fileList.length === 0) { //接着判断当前只有一个时,也不用重新再开下载
        //     return;
        //   };
        //   _currentFile = _fileList.shift();_currentUuid = getUuid();_sliceNum = Math.ceil(_currentFile.size/SLICE_SIZE) //取下一个文件开始上传
        //   _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
        //   _threadId = 0;
        //   _successThreadNum = 0;
        //   startThread();
        //   //console.log('rrrr')
        // }
      }
    }
    // this.failGoon = function () { //上传失败后自动继续,因为失败不会加线程数,所以不会进入任何状态和操作,此时只要判断就行;
    //   _isPause = false;
    //   _isDelete = false;
    //   _isFail = false;
    //   if (_fileList.length === 0) { //接着判断当前只有一个时,也不用重新再开下载
    //     _onMap.pause.call(this);_allStop = true;
    //     return;
    //   };
    //   _currentFile = _fileList.shift();_currentUuid = getUuid();_sliceNum = Math.ceil(_currentFile.size/SLICE_SIZE) //取下一个文件开始上传
    //   _currentSliceList = fileSlice(_currentFile, SLICE_SIZE);
    //   _threadId = 0;
    //   _successThreadNum = 0;
    //   startThread();
    // }
  };

  Fileupload.prototype.version = version;

  return Fileupload;

});
export default this.Fileupload;
