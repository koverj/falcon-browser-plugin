const mysidebar_btn = "#mysidebar";
const tests_list = ".kj-tests-list";

const missingLocators = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "init") {
    const locators = getLocatorsFromStorage();
    if (!locators) {
      return;
    }

    $(".notifyjs-wrapper").remove();
    $(".tooltipster-base").remove();

    // brutal hack to wait for dom content load
    setTimeout(() => {
      Object.entries(locators).forEach(([locator, value]) => {
        addStyle(locator, value);
        initTooltipListeners();
      });
    }, 1000);
    sendResponse({ result: "success" });
  }

  return true;
});

const getLocatorsFromStorage = () => {
  const locators = localStorage.getItem("locators");
  return JSON.parse(locators);
};

const getLocatorsFromStorageById = (identifier) => {
  const storage = getLocatorsFromStorage();
  const filtered = filter(storage, (_, v) => {
    return v.id === identifier;
  });

  return filtered;
};

const filter = (obj, fun) =>
  Object.entries(obj).reduce(
    (prev, [key, value]) => ({
      ...prev,
      ...(fun(key, value) ? { [key]: value } : {}),
    }),
    {}
  );

const addStyle = (locator, value) => {
  let element = findElement(locator, value);
  if (!element) {
    $.notify(`${locator} is missing`, "error");
    missingLocators.push({ [locator]: value });
    return;
  }

  if (element.length > 1) {
    element = $(element[0]);
  }

  if ($(element).is(":hidden")) {
    element = element.parent();
  }

  // check if tooltipster is initialized for the element
  const data = $(element).data();
  if (data && data.tooltipsterNs) {
    $(element).tooltipster("destroy");
  }

  $(element).tooltipster({
    content: `<span class='kj-icon' title="${locator}" id="${value.id}">${value.tests.length}</span>`,
    contentAsHTML: true,
    autoClose: false,
    trigger: "custom",
    interactive: true,
    position: "bottom",
    animation: "grow",
    maxWidth: 25,
  });

  $(element).tooltipster("show");
};

const findElement = (locator, value) => {
  try {
    if (value.type === "css") {
      return $(locator);
    }

    if (value.type === "xpath") {
      return findElementByXpath(locator);
    }
  } catch (error) {
    missingLocators.push({ [locator]: value });
  }
};

const findElementByXpath = (path) => {
  return $(
    document.evaluate(
      path,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue
  );
};

const addSideBar = () => {
  if (document.getElementById("sidebars") === null) {
    let sidebars = document.createElement("div");
    sidebars.setAttribute("id", "sidebars");
    sidebars.setAttribute("class", "sidebars");

    let sidebar = document.createElement("div");
    sidebar.setAttribute("id", "mysidebar");
    sidebar.setAttribute("class", "koverj-sidebar right");

    let closeBtn = document.createElement("a");
    closeBtn.setAttribute("id", "closeSidebars");
    closeBtn.setAttribute("class", "kj-close-sidebars");

    let header = document.createElement("div");
    header.setAttribute("class", "kj-sidebar-header");
    header.appendChild(closeBtn);

    let locatorText = document.createElement("div");
    locatorText.setAttribute("class", "kj-locator-text");

    let span = document.createElement("span");
    span.appendChild(closeBtn);

    let spanText = document.createElement("span");
    spanText.setAttribute("class", "kj-sidebar-header-text");
    spanText.textContent = "Tests";

    header.appendChild(span);
    header.appendChild(spanText);

    sidebar.appendChild(header);

    sidebar.appendChild(locatorText);
    sidebars.appendChild(sidebar);
    document.body.appendChild(sidebars);

    $("#closeSidebars").on("click", function () {
      $(mysidebar_btn).sidebar({ side: "right" }).trigger("sidebar:close");
    });
  }
};

const initTooltipListeners = () => {
  $(document)
    .off("click")
    .on("click", ".kj-icon", (event) => {
      addSideBar();

      $(mysidebar_btn)
        .sidebar({ side: "right" })
        .trigger("sidebar:open")
        .on("sidebar:opened", function () {
          $(tests_list).remove();
          $(".kj-locator-text").text(event.target.title);

          const locatorId = event.target.id;
          const rawLocator = getLocatorsFromStorageById(locatorId);

          if (Object.keys(rawLocator).length == 0) {
            return;
          }

          const value = Object.values(rawLocator)[0];

          let tests = value.tests;
          let sidebar = document.getElementById("mysidebar");

          let ul = document.createElement("ul");
          ul.setAttribute("class", "kj-tests-list");
          for (test in tests) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.textContent = tests[test];
            a.href = "#";
            li.appendChild(a);
            ul.appendChild(li);
          }
          sidebar.appendChild(ul);
        });
    });
};
