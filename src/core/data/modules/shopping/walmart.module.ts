import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.walmart.com/*"];

export const WalmartModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on walmart and captures those activities that the user has permitted",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 0,

  ajax: {
    url_matches: urls,
    filter: {
      urls: ["<all_urls>"],
      types: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "image",
        "font",
        "object",
        "xmlhttprequest",
        "ping",
        "csp_report",
        "media",
        "websocket",
        "other",
      ],
    },
    extra_info_spec: [],
    items: [
      {
        name: "background_requests",
        title: "Triggered Background Requests",
        description:
          "This item collects all the background request after a click on specific are aon Walmart",
        is_enabled: true,
        hook: "webRequest",
        timeframe: 3000,
        events: [
          {
            object: "document",
            selector: "*",
            event_name: "click",
          },
        ],
      },
    ],
  },
  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "Page Visit",
        title: "Visited pages",
        description:
          "This item collects all pages in Walmart that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in Walmart web pages",
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
        description: "This item collects walmart search query",
        url_match: "*://*.walmart.com/*",
        title: "search query",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "[aria-label='Search icon']",
            event_name: "click",
          },
          {
            selector: ".ld.ld-Search.absolute",
            event_name: "click",
          },
          {
            selector: "[aria-label='Search']",
            event_name: "keydown",
            key_code: 13,
          },
          {
            selector: "[type='search']",
            event_name: "keydown",
            key_code: 13,
          },
        ],
        objects: [
          {
            selector: "[data-testid='search-form']",
            properties: [
              {
                selector: "[type='search']",
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
        url_match: "*://*.walmart.com/*",
        title: "Search Suggestion",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "[type='search']",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: ".list.ma0.pa0.pointer",
            event_name: "click",
          },
          {
            selector: ".list.ma0.pa0.pointer .ph3",
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
        description: "This item collects search results in walmart web pages",
        url_match: "*://*.walmart.com/search*",
        title: "Search Result",
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
            selector: "window",
            event_name: "load",
          },
        ],
        objects: [
          {
            selector: "[data-testid='search-form']",
            properties: [
              {
                selector: "[type='search']",
                property: "value",
                name: "searchQuery",
                type: "text",
              },
            ],
          },
          {
            selector: ".mb0.w-25",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: "[data-testid='list-view'] .w_V_DM",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-automation-id='product-price'] div",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".flex.mt2 .w_iUH8",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".flex.mt2 .sans-serif",
                property: "innerText",
                name: "reviewCount",
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
        url_match: "*://*.walmart.com/*",
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
            selector: "[data-testid='list-view'] .overflow-hidden",
            event_name: "click",
          },
          {
            selector: "[data-testid='list-view'] .overflow-hidden",
            event_name: "contextmenu",
          },
          {
            selector: "[data-testid='list-view'] .w_V_DM",
            event_name: "click",
          },
          {
            selector: "[data-testid='list-view'] .w_V_DM",
            event_name: "contextmenu",
          },
          {
            selector: "[data-automation-id='product-title']",
            event_name: "click",
          },
          {
            selector: "[data-automation-id='product-title']",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "[data-testid='search-form']",
            properties: [
              {
                selector: "[type='search']",
                property: "value",
                name: "searchQuery",
                type: "text",
              },
              {
                selector: "#global-search-category-label",
                property: "innerText",
                name: "searchCategory",
                type: "text",
              },
            ],
          },
          {
            selector: "<",
            properties: [
              {
                selector: "[data-testid='list-view'] .w_V_DM",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-automation-id='product-price'] div",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".flex.mt2 .w_iUH8",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".flex.mt2 .sans-serif",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
            ],
          },
          {
            selector: "<<",
            properties: [
              {
                selector: "[data-testid='list-view'] .w_V_DM",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-automation-id='product-price'] div",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".flex.mt2 .w_iUH8",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".flex.mt2 .sans-serif",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<",
            properties: [
              {
                selector: "[data-testid='list-view'] .w_V_DM",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-automation-id='product-price'] div",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".flex.mt2 .w_iUH8",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".flex.mt2 .sans-serif",
                property: "innerText",
                name: "reviewCount",
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
        url_match: "*://*.walmart.com/*",
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
            selector: ".w_hhLG.w_8nsR.w_jDfj",
            event_name: "click",
          },
          {
            selector: "[data-automation-id='atc']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".lh-copy.f6",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-testid='price-wrap']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".rating-number",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: "[itemprop='ratingCount']",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
            ],
          },
          {
            selector: "",
            properties: [
              {
                selector: "[itemprop='price']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "link-identifier='reviewsLink'",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
              {
                selector:
                  ".field-input.field-input--secondary[aria-label='Quantity']",
                property: "value",
                name: "quantity",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToWishlist",
        description:
          "This item collects all products in walmart web pages that has been added by user to love list",
        url_match: "*://*.walmart.com/*",
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
            selector: ".mt1 .ld.ld-Heart",
            event_name: "click",
          },
          {
            selector: ".mt1 button",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".lh-copy.f6",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-testid='price-wrap']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".rating-number",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: "[itemprop='ratingCount']",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
            ],
          },
          {
            selector: "",
            properties: [
              {
                selector: "[itemprop='price']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "link-identifier='reviewsLink'",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
              {
                selector:
                  ".field-input.field-input--secondary[aria-label='Quantity']",
                property: "value",
                name: "quantity",
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
        url_match: "*://*.walmart.com/*",
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
              "[data-automation-id='cart-item-save-for-later'] .button-wrapper",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<",
            properties: [
              {
                selector: ".js-btn-product.btn-fake-link.cart-item-name-link",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".price-main .price .visuallyhidden",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".field-input.field-input--secondary",
                property: "value",
                name: "quantity",
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
        url_match: "*://*.walmart.com/*",
        title: "checkout",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector:
              ".hide-content-max-m .button.ios-primary-btn-touch-fix.hide-content-max-m.checkoutBtn.button--primary",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<<<.cart-list.cart-list-active .cart-item",
            name: "products",
            index_name: "rank",
            properties: [
              {
                selector: ".js-btn-product.btn-fake-link.cart-item-name-link",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".price-main .price .visuallyhidden",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".field-input.field-input--secondary",
                property: "value",
                name: "quantity",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<",
            properties: [
              {
                selector: "[data-automation-id='cart-pos-pos-subtotal-price']",
                property: "innerText",
                name: "itemsPrice",
                type: "text",
              },
              {
                selector:
                  "[data-automation-id='order-summary-shipping-price-0']",
                property: "innerText",
                name: "shipping",
                type: "text",
              },
              {
                selector:
                  "[data-automation-id='cart-pos-pos-grand-total-amount']",
                property: "innerText",
                name: "order total",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<",
            properties: [
              {
                selector: "[data-automation-id='pac-pos-pos-subtotal-price']",
                property: "innerText",
                name: "itemsPrice",
                type: "text",
              },
              {
                selector:
                  "[data-automation-id='order-summary-shipping-price-0']",
                property: "innerText",
                name: "shipping",
                type: "text",
              },
              {
                selector:
                  "[data-automation-id='pac-pos-pos-grand-total-amount']",
                property: "innerText",
                name: "order total",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
