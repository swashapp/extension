import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.target.com/*"];

export const TargetModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on target and captures those activities that the user has permitted",
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
          "This item collects all pages in Target that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in Target web pages",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectReferrer",
      },
    ],
  },
  content: {
    mapping: {
      win: PlatformType.Mobile,
      mac: PlatformType.Mobile,
      ios: PlatformType.Mobile,
      ipados: PlatformType.Mobile,
      linux: PlatformType.Mobile,
      android: PlatformType.Mobile,
      cros: PlatformType.Desktop,
      openbsd: PlatformType.Desktop,
      unknown: PlatformType.Desktop,
    },
    url_matches: urls,
    desktop: [
      {
        name: "searchQuery",
        description: "This item collects target search query",
        url_match: "*://*.target.com/*",
        title: "search query",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#search",
            event_name: "keydown",
            key_code: 13,
          },
          {
            selector: "button[aria-label='search']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "#search",
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
        url_match: "*://*.target.com/*",
        title: "Search Suggestion",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: ".styles__SearchForm-sc-wnzihy-1",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: ".TypeaheadItemText",
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
        description: "This item collects search results in target web pages",
        url_match: "*://*.target.com/s*",
        title: "Search Result",
        type: "event",
        ready_at: "windowChange",
        observing_target_node:
          "[data-component-id='WEB-c_web_productgrid_v01']",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: false,
        },
        is_enabled: true,
        events: [
          {
            selector: "",
            event_name: ".",
          },
        ],
        objects: [
          {
            selector: "#search",
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
            selector: ".styles__StyledRow-sc-wmoju4-0",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: "[data-test*='ProductCardBrandAndRibbonMessage']",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: "[data-test='product-title']",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-test='current-price']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-test='ratings']",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: "[data-test='rating-count']",
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
        url_match: "*://*.target.com/*",
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
            selector:
              "[class^='ProductCardImageWrapper-sc-'] a[class^='styles__StyledLink-']",
            event_name: "click",
          },
          {
            selector:
              ".styles__StyledProductCardBody-sc-9lksuw-0 a[data-test='product-title']",
            event_name: "contextmenu",
          },
          {
            selector:
              ".styles__StyledProductCardBody-sc-9lksuw-0 a[data-test='product-title']",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "#search",
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
            selector: "<<<<<",
            properties: [
              {
                selector: "[data-test*='ProductCardBrandAndRibbonMessage']",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: "[data-test='product-title']",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-test='current-price']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-test='ratings']",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: "[data-test='rating-count']",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToWishlist",
        description:
          "This item collects all products in target web pages that has been added by user to love list",
        url_match: "*://*.target.com/*",
        title: "Add to Wish list",
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
            selector: "button[data-test='FavoritesButton']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "#pageBodyContainer div div",
            properties: [
              {
                selector: "[data-test='itemDetail-brand']",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: "[data-test='product-title']",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-test='product-price']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-test='ratings'] span",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: "[class^='styles__StyledFeedbackCount']",
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
        url_match: "*://*.target.com/*",
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
            selector: "button[data-test='shippingButton']",
            event_name: "click",
          },
          {
            selector: "[id^='addToCartButton']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "#pageBodyContainer div div",
            properties: [
              {
                selector: "[data-test='itemDetail-brand']",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: "[data-test='product-title']",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-test='product-price']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-test='ratings'] span",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: "[class^='styles__StyledFeedbackCount']",
                property: "innerText",
                name: "reviewCount",
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
        url_match: "*://*.target.com/*",
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
            selector: "[data-test='SFLBtn']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<<",
            properties: [
              {
                selector: "[data-test='cartItem-title-url']",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-test='cartItem-price']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-test='cartItem-qty']",
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
        url_match: "*://*.target.com/*",
        title: "checkout",
        type: "event",
        ready_at: "DOMChange",
        observing_target_node: "body",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: "[data-test='checkout-button']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<<[data-test='cartItem']",
            name: "products",
            index_name: "rank",
            properties: [
              {
                selector: "[data-test='cartItem-title-url']",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "[data-test='cartItem-price']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-test='cartItem-qty']",
                property: "value",
                name: "quantity",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<<<<",
            properties: [
              {
                selector:
                  "[data-test='cart-summary-subTotal'] .Col__StyledCol-sc-1c90kgr-0.bWQhia p.h-text-bs",
                property: "innerText",
                name: "itemsPrice",
                type: "text",
              },
              {
                selector: ".h-text-bs.h-text-red",
                property: "innerText",
                name: "shipping",
                type: "text",
              },
              {
                selector: ".h-text-lg.h-text-bold:nth-child(2)",
                property: "innerText",
                name: "order total",
                type: "text",
              },
              {
                selector: "#summary-amount",
                property: "innerText",
                name: "tax",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
