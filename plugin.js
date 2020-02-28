var version = "1.3";

const BACKEND_URL = "http://localhost:8086/locators";

function getCurrentTabUrl() {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function(tabs) {
      chrome.tabs.insertCSS(tabs[0].id, {
        file: "koverj.css"
      });
      getData(tabs[0].url);
    }
  );
}

const getData = currentTabUrl => {
  console.log(currentTabUrl);

  const req = new XMLHttpRequest();
  req.open("GET", `${BACKEND_URL}?url=${currentTabUrl}`, true);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.send();

  req.onreadystatechange = function() {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      hightLightElements(JSON.parse(this.responseText));
    }
  };
};

const hightLightElements = data => {
  console.log(data);

  Object.entries(data).forEach(([locator, value]) => {
    findElement(locator, value);
  });
};

const findElement = (locator, value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { command: "init", locator: locator, value: value },
      function(response) {
        console.log(response.result);
      }
    );
  });
};

const onStart = () => {
  document
    .getElementById("loadData")
    .addEventListener("click", onClickLoadData, false);
};

const onClickLoadData = () => {
  chrome.tabs.getSelected(null, getCurrentTabUrl);
};

document.addEventListener("DOMContentLoaded", onStart, false);
