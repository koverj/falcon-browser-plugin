chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command === "init") {
    const locators = getLocatorsFromStorage();
    if (!locators) {
      return;
    }

    Object.entries(locators).forEach(([locator, value]) => {
      addStyle(locator, value);
    });
  }
  sendResponse({ result: "success" });
});

const getLocatorsFromStorage = () => {
  const locators = localStorage.getItem("locators");
  return JSON.parse(locators);
};

const addStyle = (locator, value) => {
  const element = $(locator);
  if (!element) {
    return;
  }

  element.addClass("label-relative");
  if (element.children(".label").length > 1) {
    return;
  }

  element.append(
    `<div title='${locator}'class='label'>${value["tests"].length}</span>`
  );
};
