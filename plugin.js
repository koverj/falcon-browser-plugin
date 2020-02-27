var version = "1.3";

const BACKEND_URL = "http://localhost:8086/locators";

const getData = () => {
  const req = new XMLHttpRequest();
  req.open("GET", BACKEND_URL, true);
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
  console.log("Load data");
  console.log(data);

  data.forEach(element => {
    element.locators.forEach(locator => {
      findElement(locator);
    });
  });
};

const findElement = locator => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { command: "init", locator: locator },
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
  chrome.tabs.getSelected(null, getData);
};

document.addEventListener("DOMContentLoaded", onStart, false);
