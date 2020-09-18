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
      // chrome.tabs.sendRequest(tab.id, { action: "exportFile" }, () => {});
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

  //导入分页数据
  let importInput = document.getElementById("importFile");
  importInput.onchange = (e) => {
    const file = importInput.files && importInput.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      if (reader.result) {
        const pagination = JSON.parse(reader.result);
        //显示文件内容
        //隐藏导出。因为数据会出问题。
        document
          .getElementById("exportFile")
          .setAttribute("style", "display: none");
        document
          .getElementById("baseOption")
          .setAttribute("style", "display: none");
        //提示导入的数据
        document.getElementById(
          "paginationLabel"
        ).textContent = `已支持1~${pagination.length}页的跳转(越小越早)，请在下方输入页码跳转：`;
        //展示跳转功能
        document
          .getElementById("pagination")
          .setAttribute("style", "display: block");
        chrome.tabs.getSelected(null, function (tab) {
          chrome.tabs.sendRequest(
            tab.id,
            { action: "importPagination", data: pagination },
            () => {}
          );
        });
      }
    };
    reader.readAsText(file);
  };

  //导出分页txt文件的内容
  let exportFileButton = document.getElementById("exportFile");
  exportFileButton.onclick = () => {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.sendRequest(tab.id, { action: "exportFile" }, () => {});
    });
  };

  let jumpPaginationButton = document.getElementById("jumpPage");
  jumpPaginationButton.onclick = () => {
    var page = document.getElementById("paginationInput").value;
    if (page) {
      chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendRequest(
          tab.id,
          { action: "jumpPagination", data: page },
          () => {}
        );
      });
    }
  };

  chrome.runtime.onMessage.addListener(function (request, sender) {
    // 触发不同的功能
    if (request.action === "updateTime") {
      document.getElementById("content").textContent =
        "已爬取" + request.time + "次";
    }
  });
});
