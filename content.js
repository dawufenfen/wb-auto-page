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
function getMore(newButton) {
  getMoreButton = newButton;
  i++;
  getMoreButton.click();
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  console.log("第" + i + "次");
}
//开始爬楼
function begin() {
  stopFlag = 0;
  timeId = setInterval(() => {
    newGetMoreButton = document.getElementsByClassName("WB_cardmore")[0];
    if (!newGetMoreButton) {
      if (commitNumber >= listBox.children[0].childElementCount) {
        continueRun();
      } else {
        clearInterval(timeId);
        audio.play(); //播放提示音乐，如果不想播放，把这一行删除
        alert("找不到加载更多按钮，请看看是不是翻到沙发了");
      }
    } else {
      commitNumber = listBox.children[0].childElementCount;
      getMore(newGetMoreButton);
    }
    if (stopFlag) {
      clearInterval(timeId);
    }
  }, 1000); //这里是设置每1000ms一次查询
}
//恢复错误数据导致的爬楼错误
function continueRun() {
  console.log("请求返回错误，自动修复");
  i--;
  clearInterval(timeId);
  listBox.children[0].appendChild(getMoreButton);
  getMore(getMoreButton);
  begin();
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
// 事件和消息
chrome.extension.onRequest.addListener(function (request, sender, sendRequest) {
  // 触发不同的功能
  switch (request.action) {
    case "begin":
      init();
      begin();
      break;
    case "stop":
      stop();
      break;
    case "continue":
      begin();
      break;
    case "reContinue":
      continueRun();
      break;
    case "stopMusic":
      stopMusic();
      break;
    case "clearCommit":
      clearCommit();
      break;
    default:
      console.log("null action");
  }
});
