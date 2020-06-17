var i;
var audio;
var getMoreButton;
var newGetMoreButton;
var timeId;
var stopFlag;
var listBox;
var commitNumber;
//清理评论
function clearCommit() {
  var newContent = document.createElement("div");
  var getMoreButton = document.getElementsByClassName("WB_cardmore")[0];
  if (!getMoreButton) {
    console.log("请重新输入一次clearCommit()");
    return;
  }
  newContent.setAttribute("node-type", "comment_list");
  newContent.setAttribute("class", "list_ul");
  listBox.removeChild(listBox.children[0]);
  newContent.appendChild(getMoreButton);
  listBox.appendChild(newContent);
  console.log("清理完成");
}
//获取数据的方法
function getMore(newButton, cb) {
  getMoreButton = newButton;
  i++;
  getMoreButton.click();
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  cb && cb(i);
  console.log("第" + i + "次");
}
function handleBegin(cb) {
  newGetMoreButton = document.getElementsByClassName("WB_cardmore")[0];
  if (!newGetMoreButton) {
    if (commitNumber > listBox.children[0].childElementCount) {
      continueRun(cb);
    } else if (commitNumber === listBox.children[0].childElementCount) {
      var lastChild =
        listBox.children[0].children[listBox.children[0].childElementCount - 1];
      if (lastChild.className.includes("WB_empty")) {
        lastChild.remove()
        continueRun(cb);
      } else {
        clearInterval(timeId);
        audio.play().then(alert("找不到加载更多按钮，请看看是不是翻到沙发了")); //播放提示音乐，如果不想播放，把这一行删除，并去掉下面这行的头部的//
        //alert("找不到加载更多按钮，请看看是不是翻到沙发了");
      }
    } else {
      clearInterval(timeId);
      audio.play().then(alert("找不到加载更多按钮，请看看是不是翻到沙发了")); //播放提示音乐，如果不想播放，把这一行删除，并去掉下面这行的头部的//
      //alert("找不到加载更多按钮，请看看是不是翻到沙发了");
    }
  } else {
    commitNumber = listBox.children[0].childElementCount;
    getMore(newGetMoreButton, cb);
  }
  if (stopFlag) {
    clearInterval(timeId);
  }
}
//开始爬楼
function begin(cb) {
  stopFlag = 0;
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, 1000);
  setTimeout(() => {
    timeId = setInterval(() => {
      handleBegin(cb);
    }, 1000); //这里是设置每1000ms一次查询
  }, 1000);
}
//恢复错误数据导致的爬楼错误
function continueRun(cb) {
  console.log("请求返回错误，自动修复");
  i--;
  clearInterval(timeId);
  listBox.children[0].appendChild(getMoreButton);
  getMore(getMoreButton, cb);
  begin(cb);
}
//停止爬楼
function stop() {
  stopFlag = 1;
}
//停止播放音乐
function stopMusic() {
  audio && audio.pause();
}
//初始化
function init() {
  i = 0;
  audio = new Audio("https://t.cn/A6Ag3iqY"); //这里是结束后播放的音乐链接
  getMoreButton = document.getElementsByClassName("WB_cardmore")[0];

  stopFlag = 0;
  listBox = document.getElementsByClassName("list_box")[0];
  commitNumber = listBox.children[0].childElementCount;
}
//生成楼层排名
const showOrder = () => {
  var commitList = document.getElementsByClassName("list_box")[0].children[0]
    .children;
  var length = commitList.length;
  let i = 1;
  for (i; i <= 200; i++) {
    if (i > length) {
      break;
    }
    var parent = commitList[length - i];
    var orderDom = document.createElement("div");
    orderDom.setAttribute("style", "color: #aaa;");
    orderDom.textContent = "下面是" + i + "楼";
    parent.insertBefore(orderDom, parent.children[0]);
  }
};
const sendRequest = (i) => {
  chrome.runtime.sendMessage({ action: "updateTime", time: i });
};

// 事件和消息
chrome.extension.onRequest.addListener(function (request, sender, cb) {
  // 触发不同的功能
  switch (request.action) {
    case "begin":
      init();
      begin(sendRequest);
      break;
    case "stop":
      stop();
      break;
    case "continue":
      begin(sendRequest);
      break;
    case "reContinue":
      continueRun(sendRequest);
      break;
    case "stopMusic":
      stopMusic();
      break;
    case "clearCommit":
      clearCommit();
      break;
    case "showOrder":
      showOrder();
      break;
    default:
      console.log("null action");
  }
  cb && cb();
});
