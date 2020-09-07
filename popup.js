document.addEventListener("DOMContentLoaded", function () {
  //给不同按钮绑定不同事件
  let beginButton = document.getElementById("begin");
  beginButton.onclick = () => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(
        tab.id,
        { action: "begin", tabId: tab.id },
        () => {}
      );
    });
  };

  let stopButton = document.getElementById("stop");
  stopButton.onclick = () => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(tab.id, { action: "stop" }, () => {});
    });
  };

  let continueButton = document.getElementById("continue");
  continueButton.onclick = () => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(
        tab.id,
        { action: "continue", tabId: tab.id },
        () => {}
      );
    });
  };

  let reContinueButton = document.getElementById("reContinue");
  reContinueButton.onclick = () => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(tab.id, { action: "reContinue" }, () => {});
    });
  };

  let clearCommitButton = document.getElementById("clearCommit");
  clearCommitButton.onclick = () => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(tab.id, { action: "clearCommit" }, () => {});
    });
  };

  let stopMusicButton = document.getElementById("stopMusic");
  stopMusicButton.onclick = () => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(tab.id, { action: "stopMusic" }, () => {});
    });
  };

  let showOrderButton = document.getElementById("showOrder");
  showOrderButton.onclick = () => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(tab.id, { action: "showOrder" }, () => {});
    });
  };

  //测试读取txt文件的内容
  let importInput = document.getElementById("import");
  importInput.onchange = (e) => {
    const file = importInput.files && importInput.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      if (reader.result) {
        //显示文件内容
        console.log("this is result", JSON.parse(reader.result));
      }
    };
    reader.readAsText(file);
  };

  chrome.runtime.onMessage.addListener(function (request, sender) {
    // 触发不同的功能
    if (request.action === "updateTime") {
      document.getElementById("content").textContent =
        "已爬取" + request.time + "次";
    }
  });
});
