document.addEventListener("DOMContentLoaded", function () {
  //给不同按钮绑定不同事件
  let beginButton = document.getElementById("begin");
  beginButton.onclick = () => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(tab.id, { action: "begin" }, () => {});
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
      chrome.tabs.sendRequest(tab.id, { action: "continue" }, () => {});
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
});
