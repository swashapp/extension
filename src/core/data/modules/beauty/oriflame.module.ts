import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.oriflame.com/*"];

export const OriflameModule: OnDiskModule = {
  description: "This module Captures a user shopping behaviour on oriflame",
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
          "This item collects all pages in oriflame that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in oriflame web pages",
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
        description: "This item collects oriflame search query",
        url_match: "*://*.oriflame.com/*",
        title: "search query",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "input[placeholder='Search']",
            event_name: "keydown",
            key_code: 13,
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "p.query",
                property: "innerText",
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
        url_match: "*://*.oriflame.com/*",
        title: "Search Suggestion",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "input[placeholder='Search']",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector:
              "[data-testid='Presentation-top-area-popular-search-queries-link'] span",
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
        description: "This item collects search results in oriflame web pages",
        url_match: "*://*.oriflame.com/*",
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
            selector: "p.query",
            properties: [
              {
                selector: "",
                property: "innerText",
                name: "searchQuery",
                type: "text",
              },
            ],
          },
          {
            selector: ".product-box-root",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: "[data-testid^='Presentation-product-box-brand']",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: "[data-testid^='Presentation-product-box-name']",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: "[data-testid^='Presentation-product-box-prices']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-testid^='Presentation-product-box-rating']",
                property: "attributes['title'].value",
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
          "This item collects information about a product that has been selected (or clicked on a search result) by user",
        url_match: "*://*.oriflame.com/*",
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
            selector: "[data-testid^='Presentation-product-box-img']",
            event_name: "click",
          },
          {
            selector: "[data-testid^='Presentation-product-box-img']",
            event_name: "contextmenu",
          },
          {
            selector: "[data-testid^='Presentation-product-box-name']",
            event_name: "click",
          },
          {
            selector: "[data-testid^='Presentation-product-box-name']",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "p.query",
            properties: [
              {
                selector: "",
                property: "innerText",
                name: "searchQuery",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<",
            properties: [
              {
                selector: "[data-testid^='Presentation-product-box-brand']",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: "[data-testid^='Presentation-product-box-name']",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: "[data-testid^='Presentation-product-box-prices']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-testid^='Presentation-product-box-rating']",
                property: "attributes['title'].value",
                name: "rate",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "sharedProduct",
        description:
          "This item collects the products that has been shared by user",
        url_match: "*://*.oriflame.com/*",
        title: "Shared Product",
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
            selector: "button.product-detail-1ro4vh4",
            event_name: "click",
          },
          {
            selector: "button.product-detail-1ro4vh4",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "[data-testid='Presentation-product-detail-main']",
            properties: [
              {
                selector: ".product-detail-u2npz0",
                property: "innerText",
                name: "brandName",
                type: "text",
              },
              {
                selector:
                  "[data-testid='Presentation-product-detail-summary-name']",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".product-detail-12w8wvc",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".MuiInputBase-input",
                property: "value",
                name: "quantity",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "buyNow",
        description:
          "This item collects all products in amazon web pages that has been selected by user for buying",
        url_match: "*://*.oriflame.com/*",
        title: "Buy it Now",
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
            selector: "button.product-detail-c3kzf",
            event_name: "click",
          },
          {
            selector: "button.product-detail-c3kzf",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "[data-testid='Presentation-product-detail-main']",
            properties: [
              {
                selector: ".product-detail-u2npz0",
                property: "innerText",
                name: "brandName",
                type: "text",
              },
              {
                selector:
                  "[data-testid='Presentation-product-detail-summary-name']",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".product-detail-12w8wvc",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".MuiInputBase-input",
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
        url_match: "*://*.oriflame.com/*",
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
            selector: ".inner-wrapper.text-ellipsis",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<<<<.row.row-item",
            name: "products",
            index_name: "rank",
            properties: [
              {
                selector: ".product-name.product-name-text",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector:
                  ".k-formatted-value.prod-quantity.js-arrows-picker.k-input",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: ".col.col-price",
                property: "innerText",
                name: "itemPrice",
                type: "text",
              },
              {
                selector: ".w-total-price-medals",
                property: "innerText",
                name: "totalItemPrice",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<",
            properties: [
              {
                selector: ".to-pay",
                property: "innerText",
                name: "totalPrice",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
