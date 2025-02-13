import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.flipkart.com/*"];

export const FlipkartModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on flipkart and captures those activities that the user has permitted",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 0,

  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "Page Visit",
        title: "Visited pages",
        description:
          "This item collects all pages in Flipkart that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in Flipkart web pages",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectReferrer",
      },
    ],
  },
  content: {
    mapping: {
      win: PlatformType.Desktop,
      mac: PlatformType.Desktop,
      ios: PlatformType.Mobile,
      ipados: PlatformType.Desktop,
      linux: PlatformType.Desktop,
      android: PlatformType.Mobile,
      cros: PlatformType.Desktop,
      openbsd: PlatformType.Desktop,
      unknown: PlatformType.Desktop,
    },
    url_matches: urls,
    desktop: [
      {
        name: "searchQuery",
        description: "This item collects flipkart search query",
        url_match: "*://*.flipkart.com/*",
        title: "search query",
        type: "event",
        is_enabled: true,
        ready_at: "windowLoad",
        events: [
          {
            selector: ".L0Z3Pu",
            event_name: "click",
          },
          {
            selector: "._3704LK",
            event_name: "keydown",
            key_code: 13,
          },
        ],
        objects: [
          {
            selector: "._3704LK",
            properties: [
              {
                selector: "",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
          {
            selector: "document",
            properties: [
              {
                property: "URL",
                name: "link",
                type: "url",
              },
            ],
          },
        ],
      },
      {
        name: "searchSuggestionSelect",
        description:
          "This item collects search suggestions that has been selected by user",
        url_match: "*://*.flipkart.com/*",
        title: "Search Suggestion",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "._2M8cLY.header-form-search",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: ".r85cly",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "",
                property: "innerText",
                name: "query",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "searchResult",
        description: "This item collects search results in flipkart web pages",
        url_match: "*://*.flipkart.com/search*",
        title: "Search Result",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "load",
          },
        ],
        objects: [
          {
            selector: "._3704LK",
            properties: [
              {
                selector: "",
                property: "value",
                name: "searchQuery",
                type: "text",
              },
            ],
          },
          {
            selector: "._1xHGtK._373qXS",
            name: "searchResult1",
            index_name: "rank",
            properties: [
              {
                selector: "._2WkVRV",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: ".IRpwTa",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3",
                property: "innerText",
                name: "price",
                type: "text",
              },
            ],
          },
          {
            selector: "._3pLy-c.row",
            name: "searchResult2",
            index_name: "rank",
            properties: [
              {
                selector: "._4rR01T",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3._1_WHN1",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "._3LWZlK",
                property: "innerText",
                name: "rate",
                type: "text",
              },
            ],
          },
          {
            selector: "._3YgSsQ",
            name: "searchResult3",
            index_name: "rank",
            properties: [
              {
                selector: ".s1Q9rs",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "._3LWZlK",
                property: "innerText",
                name: "rate",
                type: "text",
              },
            ],
          },
          {
            selector: "._4ddWXP",
            name: "searchResult4",
            index_name: "rank",
            properties: [
              {
                selector: ".s1Q9rs",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "._3LWZlK",
                property: "innerText",
                name: "rate",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "clickSearchResult",
        description:
          "This item collects information about a product that has been selected (or clicked on a search resault) by user",
        url_match: "*://*.flipkart.com/*",
        title: "Clicked Search Results",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "body",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: "._2UzuFa",
            event_name: "click",
          },
          {
            selector: "._2UzuFa",
            event_name: "contextmenu",
          },
          {
            selector: ".IRpwTa",
            event_name: "click",
          },
          {
            selector: ".IRpwTa",
            event_name: "contextmenu",
          },
          {
            selector: "._3bPFwb",
            event_name: "click",
          },
          {
            selector: "._3bPFwb",
            event_name: "contextmenu",
          },
          {
            selector: "._1fQZEK",
            event_name: "click",
          },
          {
            selector: "._1fQZEK",
            event_name: "contextmenu",
          },
          {
            selector: "._2rpwqI",
            event_name: "click",
          },
          {
            selector: "._2rpwqI",
            event_name: "contextmenu",
          },
          {
            selector: ".s1Q9rs",
            event_name: "click",
          },
          {
            selector: ".s1Q9rs",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "._3704LK",
            properties: [
              {
                selector: "",
                property: "value",
                name: "searchQuery",
                type: "text",
              },
            ],
          },
          {
            selector: "<",
            properties: [
              {
                selector: "._2WkVRV",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: ".IRpwTa",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3",
                property: "innerText",
                name: "price",
                type: "text",
              },
            ],
          },
          {
            selector: "<<",
            properties: [
              {
                selector: "._2WkVRV",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: ".IRpwTa",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3",
                property: "innerText",
                name: "price",
                type: "text",
              },
            ],
          },
          {
            selector: "",
            properties: [
              {
                selector: "._4rR01T",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3._1_WHN1",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "._3LWZlK",
                property: "innerText",
                name: "rate",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<",
            properties: [
              {
                selector: ".s1Q9rs",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "._3LWZlK",
                property: "innerText",
                name: "rate",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToWishlist",
        description:
          "This item collects all products in flipkart web pages that has been added by user to love list",
        url_match: "*://*.flipkart.com/*",
        title: "Add to Wish List",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "body",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: "._2hVSre",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".B_NuCI",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3._16Jk6d",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "._3LWZlK",
                property: "innerText",
                name: "rate",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToBasket",
        description:
          "This item collects the products that has been added to the basket by user",
        url_match: "*://*.flipkart.com/*",
        title: "Add to Basket",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "body",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: "._2KpZ6l._2U9uOA._3v1-ww",
            event_name: "click",
          },
          {
            selector:
              "._1YokD2._3Mn1Gg.col-12-12:nth-child(2) ._3dsJAO:first-child",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".B_NuCI",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3._16Jk6d",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "._3LWZlK",
                property: "innerText",
                name: "rate",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToBasketMultipleItem",
        description:
          "This item collects the multiple products that has been added to the basket by user",
        url_match: "*://*.flipkart.com/*",
        title: "Add to Basket Multiple Items",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "._2KpZ6l._1t_O3S._2ti6Tf._3AWRsL",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "._3E8aIl.mtoPr4",
            name: "addToBasket",
            index_name: "rank",
            properties: [
              {
                selector: ".s1Q9rs",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "._3LWZlK",
                property: "innerText",
                name: "rate",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "buyNow",
        description:
          "This item collects the products that has been selected by user for buying",
        url_match: "*://*.flipkart.com/*",
        title: "Buy it Now",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "._2KpZ6l._2U9uOA.ihZ75k._3AWRsL",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".B_NuCI",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._30jeq3._16Jk6d",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "._3LWZlK",
                property: "innerText",
                name: "rate",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "saveForLater",
        description:
          "This item collects information about products that has been saved by user for later",
        url_match: "*://*.flipkart.com/*",
        title: "Save for Later",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "body",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector:
              "._1YokD2._3Mn1Gg.col-12-12:first-child ._3dsJAO:first-child",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<",
            properties: [
              {
                selector: "._2Kn22P.gBNbID",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._253qQJ",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: "._2-ut7f._1WpvJ7",
                property: "innerText",
                name: "price",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "checkout",
        description:
          "This item collects information about products that has been selected by user for buying",
        url_match: "*://*.flipkart.com/*",
        title: "checkout",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "body",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: "._2KpZ6l._2ObVJD._3AWRsL",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<.zab8Yh._10k93p",
            name: "products",
            index_name: "rank",
            properties: [
              {
                selector: "._2Kn22P.gBNbID",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "._253qQJ",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: "._2-ut7f._1WpvJ7",
                property: "innerText",
                name: "price",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<<._35mLK5",
            properties: [
              {
                selector: "._I_XQO > .Ob17DV:first-child span",
                property: "innerText",
                name: "itemsPrice",
                type: "text",
              },
              {
                selector: "._I_XQO > .Ob17DV:nth-child(3) span",
                property: "innerText",
                name: "shipping",
                type: "text",
              },
              {
                selector: ".Ob17DV._3X7Jj1",
                property: "innerText",
                name: "totalAmount",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
