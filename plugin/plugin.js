const onStart = () => {
  document.getElementById("loadData").addEventListener(
    "click",
    () => {
      chrome.runtime.sendMessage({ message: "init" }, response => {
        chrome.storage.local.set({ isActive: true });
      });
    },
    false
  );
};

const onDisable = () => {
  document.getElementById("disable").addEventListener(
    "click",
    () => {
      chrome.storage.local.set({ isActive: false });
      // chrome.tabs.getSelected(null, function(tab) {
      //   var code = "window.location.reload();";
      //   chrome.tabs.executeScript(tab.id, { code: code });
      // });
    },
    false
  );
};

document.addEventListener("DOMContentLoaded", onStart, false);
document.addEventListener("DOMContentLoaded", onDisable, false);
