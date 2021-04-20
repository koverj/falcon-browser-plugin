const notifyOptions = {
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
  elementPosition: "bottom left",
  globalPosition: "top right",
  // default style
  style: "koverj-pin",
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
  gap: 1
};

const mysidebar_btn = "#mysidebar";
const tests_list = ".kj-tests-list";

const missingLocators = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command === "init") {
    const locators = getLocatorsFromStorage();
    if (!locators) {
      return;
    }

    $(".notifyjs-wrapper").remove();
    
    // brutal hack to wait for dom content load
    setTimeout(() => {
      Object.entries(locators).forEach(([locator, value]) => {
        addStyle(locator, value);
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

const getLocatorsFromStorageById = identifier => {
  return filter(getLocatorsFromStorage(), (_, v) => {
    return v.id === identifier;
  });
};

const filter = (obj, fun) =>
  Object.entries(obj).reduce(
    (prev, [key, value]) => ({
      ...prev,
      ...(fun(key, value) ? { [key]: value } : {})
    }),
    {}
  );

const addStyle = (locator, value) => {
  $.notify.addStyle("koverj-pin", {
    html: `<div><a href="javascript:void(0)" title="${locator}" id="${value.id}" data-notify-text></a></div>`,
    classes: {
      base: {
        "font-weight": "bold",
        padding: "8px 15px 8px 14px",
        "text-shadow": "0 1px 0 rgba(255, 255, 255, 0.5)",
        "background-color": "#fcf8e3",
        border: "1px solid #fbeed5",
        "border-radius": "4px",
        "white-space": "nowrap",
        "padding-left": "25px",
        "background-repeat": "no-repeat",
        "background-position": "4px 11px"
      },
      error: {
        color: "#B94A48",
        "background-color": "#F2DEDE",
        "border-color": "#EED3D7",
        "background-image":
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=)"
      },
      success: {
        color: "#5ca25d",
        "background-color": "#e7f9e6",
        "border-color": "#8ddc4a",
        "background-image":
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==)"
      },
      info: {
        color: "#3A87AD",
        "background-color": "#D9EDF7",
        "border-color": "#BCE8F1",
        "background-image":
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYFAhkSsdes/QAAA8dJREFUOMvVlGtMW2UYx//POaWHXg6lLaW0ypAtw1UCgbniNOLcVOLmAjHZolOYlxmTGXVZdAnRfXQm+7SoU4mXaOaiZsEpC9FkiQs6Z6bdCnNYruM6KNBw6YWewzl9z+sHImEWv+vz7XmT95f/+3/+7wP814v+efDOV3/SoX3lHAA+6ODeUFfMfjOWMADgdk+eEKz0pF7aQdMAcOKLLjrcVMVX3xdWN29/GhYP7SvnP0cWfS8caSkfHZsPE9Fgnt02JNutQ0QYHB2dDz9/pKX8QjjuO9xUxd/66HdxTeCHZ3rojQObGQBcuNjfplkD3b19Y/6MrimSaKgSMmpGU5WevmE/swa6Oy73tQHA0Rdr2Mmv/6A1n9w9suQ7097Z9lM4FlTgTDrzZTu4StXVfpiI48rVcUDM5cmEksrFnHxfpTtU/3BFQzCQF/2bYVoNbH7zmItbSoMj40JSzmMyX5qDvriA7QdrIIpA+3cdsMpu0nXI8cV0MtKXCPZev+gCEM1S2NHPvWfP/hL+7FSr3+0p5RBEyhEN5JCKYr8XnASMT0xBNyzQGQeI8fjsGD39RMPk7se2bd5ZtTyoFYXftF6y37gx7NeUtJJOTFlAHDZLDuILU3j3+H5oOrD3yWbIztugaAzgnBKJuBLpGfQrS8wO4FZgV+c1IxaLgWVU0tMLEETCos4xMzEIv9cJXQcyagIwigDGwJgOAtHAwAhisQUjy0ORGERiELgG4iakkzo4MYAxcM5hAMi1WWG1yYCJIcMUaBkVRLdGeSU2995TLWzcUAzONJ7J6FBVBYIggMzmFbvdBV44Corg8vjhzC+EJEl8U1kJtgYrhCzgc/vvTwXKSib1paRFVRVORDAJAsw5FuTaJEhWM2SHB3mOAlhkNxwuLzeJsGwqWzf5TFNdKgtY5qHp6ZFf67Y/sAVadCaVY5YACDDb3Oi4NIjLnWMw2QthCBIsVhsUTU9tvXsjeq9+X1d75/KEs4LNOfcdf/+HthMnvwxOD0wmHaXr7ZItn2wuH2SnBzbZAbPJwpPx+VQuzcm7dgRCB57a1uBzUDRL4bfnI0RE0eaXd9W89mpjqHZnUI5Hh2l2dkZZUhOqpi2qSmpOmZ64Tuu9qlz/SEXo6MEHa3wOip46F1n7633eekV8ds8Wxjn37Wl63VVa+ej5oeEZ/82ZBETJjpJ1Rbij2D3Z/1trXUvLsblCK0XfOx0SX2kMsn9dX+d+7Kf6h8o4AIykuffjT8L20LU+w4AZd5VvEPY+XpWqLV327HR7DzXuDnD8r+ovkBehJ8i+y8YAAAAASUVORK5CYII=)"
      },
      warn: {
        color: "#C09853",
        "background-color": "#FCF8E3",
        "border-color": "#FBEED5",
        "background-image":
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABJlBMVEXr6eb/2oD/wi7/xjr/0mP/ykf/tQD/vBj/3o7/uQ//vyL/twebhgD/4pzX1K3z8e349vK6tHCilCWbiQymn0jGworr6dXQza3HxcKkn1vWvV/5uRfk4dXZ1bD18+/52YebiAmyr5S9mhCzrWq5t6ufjRH54aLs0oS+qD751XqPhAybhwXsujG3sm+Zk0PTwG6Shg+PhhObhwOPgQL4zV2nlyrf27uLfgCPhRHu7OmLgAafkyiWkD3l49ibiAfTs0C+lgCniwD4sgDJxqOilzDWowWFfAH08uebig6qpFHBvH/aw26FfQTQzsvy8OyEfz20r3jAvaKbhgG9q0nc2LbZxXanoUu/u5WSggCtp1anpJKdmFz/zlX/1nGJiYmuq5Dx7+sAAADoPUZSAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfdBgUBGhh4aah5AAAAlklEQVQY02NgoBIIE8EUcwn1FkIXM1Tj5dDUQhPU502Mi7XXQxGz5uVIjGOJUUUW81HnYEyMi2HVcUOICQZzMMYmxrEyMylJwgUt5BljWRLjmJm4pI1hYp5SQLGYxDgmLnZOVxuooClIDKgXKMbN5ggV1ACLJcaBxNgcoiGCBiZwdWxOETBDrTyEFey0jYJ4eHjMGWgEAIpRFRCUt08qAAAAAElFTkSuQmCC)"
      }
    }
  });

  $(document)
    .off("click")
    .on("click", ".notifyjs-koverj-pin-base > a", event => {
      addSideBar();

      $(mysidebar_btn)
        .sidebar({ side: "right" })
        .trigger("sidebar:open")
        .on("sidebar:opened", function() {
          const locator = Object.values(
            getLocatorsFromStorageById(event.target.id)
          )[0];

          if (!locator) {
            return;
          }

          let tests = locator.tests;
          let sidebar = document.getElementById("mysidebar");

          $(tests_list).remove();
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

  const element = findElement(locator, value);
  if (!element) {
    return;
  }

  $(element).addClass("kj-border");
  element.notify(value["tests"].length, notifyOptions);
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

const findElementByXpath = path => {
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

    let span = document.createElement("span");
    span.appendChild(closeBtn);

    let spanText = document.createElement("span");
    spanText.setAttribute("class", "kj-sidebar-header")
    spanText.textContent = "Tests";

    header.appendChild(span);
    header.appendChild(spanText);

    sidebar.appendChild(header);
    sidebars.appendChild(sidebar);
    document.body.appendChild(sidebars);

    $("#closeSidebars").on("click", function() {
      $(mysidebar_btn)
        .sidebar({ side: "right" })
        .trigger("sidebar:close");
    });
  }
};
