var i;
var audio;
var getMoreButton;
var newGetMoreButton;
var timeId;
var stopFlag;
var listBox;
var commitNumber;
var pageArr = [];
var paginationArr;
//清理评论
function clearCommit(ignoreGetMore = false) {
  var newContent = document.createElement("div");
  var getMoreButton = document.getElementsByClassName("WB_cardmore")[0];
  if (!getMoreButton && !ignoreGetMore) {
    console.log("请重新输入一次clearCommit()");
    return;
  }
  newContent.setAttribute("node-type", "comment_list");
  newContent.setAttribute("class", "list_ul");
  listBox.removeChild(listBox.children[0]);
  if (!ignoreGetMore) {
    newContent.appendChild(getMoreButton);
  }
  listBox.appendChild(newContent);
  console.log("清理完成");
}
//获取数据的方法
function getMore(newButton, cb) {
  if (pageArr && newButton) {
    var data = newButton.getAttribute("action-data");
    if (pageArr.indexOf(data) === -1) {
      pageArr.push(data);
    }
  }
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
        lastChild.remove();
        continueRun(cb);
      } else {
        clearInterval(timeId);
        audio
          .play()
          .then(() => alert("找不到加载更多按钮，请看看是不是翻到沙发了"));
      }
    } else {
      clearInterval(timeId);
      audio
        .play()
        .then(() => alert("找不到加载更多按钮，请看看是不是翻到沙发了"));
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
  // window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  // setTimeout(() => {
  //   window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  // }, 1000);
  checkPagination(() => {
    handleBegin(cb);
    timeId = setInterval(() => {
      handleBegin(cb);
    }, 1000); //这里是设置每1000ms一次查询
  });
  // setTimeout(() => {
  //   timeId = setInterval(() => {
  //     handleBegin(cb);
  //   }, 1000); //这里是设置每1000ms一次查询
  // }, 1000);
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
//导出分页数据文件
const exportFile = () => {
  if (!pageArr || pageArr.length === 0) {
    return;
  }
  const filename = "X年X月X日XXX微博的分页.txt";
  const text =
    `[
"` +
    pageArr.join(`",
"`) +
    `"
]`;

  //生成文件
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const sendRequest = (i) => {
  chrome.runtime.sendMessage({ action: "updateTime", time: i });
};
//导入分页数据，记录
const importPagination = (pagination) => {
  paginationArr = pagination;
};
//跳转分页
const jumpPagination = (page) => {
  if (!getMoreButton) {
    checkPagination(() => {
      init()
      jumpAction(page)

    })
  } else {
    jumpAction(page)

  }

};
function jumpAction(page) {
  if (page && paginationArr) {
    const pageLength = paginationArr.length;
    const actionData = paginationArr[pageLength - page];
    if (actionData) {
      //生成加载页面的按钮
      stop();
      clearCommit(true);
      var pageButton = getMoreButton;
      pageButton.setAttribute("action-data", actionData);
      listBox.children[0].appendChild(pageButton);
      pageButton.click();
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }
};

function checkPagination(cb) {
  var buttonList = document.getElementsByClassName("WB_cardmore");
  if (!buttonList || buttonList.length === 0) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    var scrollTimer = setTimeout(() => {
      window.clearTimeout(scrollTimer);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 1000);
    var cbTimer = setTimeout(() => {
      window.clearTimeout(cbTimer);
      cb();
    }, 2000);
  } else {
    cb && cb();
  }
}
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
    case "exportFile":
      exportFile();
      break;
    case "importPagination":
      importPagination(request.data);
      break;
    case "jumpPagination":
      jumpPagination(request.data);
      break;
    default:
      console.log("null action");
  }
  cb && cb();
});
