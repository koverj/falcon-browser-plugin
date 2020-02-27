chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command === "init") {
    addStyle(request.locator);
  }
  sendResponse({ result: "success" });
});

function addStyle(locator) {
  const element = $(locator);
  if (!element) {
    return;
  }

  element.css({ "border": "3px solid #f26522"});
}
