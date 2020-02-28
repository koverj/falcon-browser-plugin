chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command === "init") {
    addStyle(request.locator, request.value);
  }
  sendResponse({ result: "success" });
});

function addStyle(locator, value) {
  const element = $(locator);
  if (!element) {
    return;
  }

  element.addClass("label-relative");
  if (element.children(".label").length < 1) {
    element.append(
      `<div title='${locator}'class='label'>${value["tests"].length}</span>`
    );
  }
}
