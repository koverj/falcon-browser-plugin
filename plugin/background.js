chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.storage.local.get(["isActive", "activeBuild"], result => {
    if (result.isActive && changeInfo.url) {
      getData(changeInfo.url, result.activeBuild);
    }
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (sender.tab) {
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.storage.local.get(["activeBuild"], result => {
      getData(tabs[0].url, result.activeBuild);
    });
  });

  sendResponse({ status: "loaded..." });
});

const getData = (currentTabUrl, activeBuild) => {
  chrome.storage.sync.get(["koverj_url"], result => {
    const encodedUrl = encodeURIComponent(`${currentTabUrl}`);
    const req = new XMLHttpRequest();
    req.open(
      "GET",
      `${result.koverj_url}/locators?url=${encodedUrl}&buildId=${activeBuild}`,
      true
    );
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send();

    req.onreadystatechange = function() {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        saveToStorage(this.responseText);
        broadcast({ command: "init" });
      }
    };
  });
};

const saveToStorage = data => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code: `localStorage.setItem("locators", ${JSON.stringify(data)});`
    });
  });
};

const broadcast = message => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, message, () => {});
  });
};
