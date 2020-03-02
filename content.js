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
  $(locator).notify(value["tests"].length, {
    // whether to hide the notification on click
    clickToHide: false,
    // whether to auto-hide the notification
    autoHide: false,
    // if autoHide, hide after milliseconds
    autoHideDelay: 5000,
    // show the arrow pointing at the element
    arrowShow: true,
    // arrow size in pixels
    arrowSize: 5,
    // position defines the notification position though uses the defaults below
    // position: "right",
    // default positions
    elementPosition: "bottom right",
    globalPosition: "top right",
    // default style
    style: "bootstrap",
    // default class (string or [string])
    className: "success",
    // show animation
    showAnimation: "slideDown",
    // show animation duration
    showDuration: 400,
    // hide animation
    hideAnimation: "slideUp",
    // hide animation duration
    hideDuration: 200,
    // padding between element and notification
    gap: 2
  });
  const element = $(locator);
  if (!element) {
    return;
  }

  // addPin(element, locator, value);
};

const addPin = (element, locator, value) => {
  element.addClass("label-relative");
  if (element.children(".label").length >= 1) {
    return;
  }

  element.append(
    `<div title='${locator}'class='label'>${value["tests"].length}</span>`
  );
};
