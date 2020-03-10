var version = "1.3";

const BACKEND_URL = "http://localhost:8086/locators";

const loadData = () => {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    tabs => {
      getData(tabs[0].url);
    }
  );
};

const getData = currentTabUrl => {
  const encodedUrl = encodeURIComponent(`${currentTabUrl}`);
  const req = new XMLHttpRequest();
  req.open("GET", `${BACKEND_URL}?url=${encodedUrl}`, true);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.send();

  req.onreadystatechange = function() {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      saveToStorage(this.responseText);
      broadcast({ command: "init" });
    }
  };
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

const onStart = () => {
  document
    .getElementById("loadData")
    .addEventListener("click", onClickLoadData, false);
};

const onClickLoadData = () => {
  chrome.tabs.getSelected(null, loadData);
};

document.addEventListener("DOMContentLoaded", onStart, false);
