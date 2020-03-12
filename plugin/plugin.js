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
    },
    false
  );
};

const onOptions = () => {
  document
    .querySelector("#go-to-options")
    .addEventListener("click", function() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL("options.html"));
      }
    });
};

document.addEventListener("DOMContentLoaded", onStart, false);
document.addEventListener("DOMContentLoaded", onDisable, false);
// document.addEventListener("DOMContentLoaded", onOptions, false);
