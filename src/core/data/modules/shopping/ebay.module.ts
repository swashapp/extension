import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = [
  "*://*.ebay.com/*",
  "*://*.ebay.co.uk/*",
  "*://*.ebay.de/*",
  "*://*.ebay.fr/*",
  "*://*.ebay.it/*",
  "*://*.ebay.es/*",
];

export const EbayModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on ebay and captures those activities that the user has permitted",
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
          "This item collects all pages in Ebay that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in Ebay web pages",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectReferrer",
      },
    ],
  },
  content: {
    url_matches: urls,
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
    desktop: [
      {
        name: "searchQuery",
        description: "This item collects ebay search query",
        url_match: "*://*.ebay.*/*",
        title: "search query",
        type: "event",
        is_enabled: true,
        ready_at: "windowLoad",
        events: [
          {
            selector: "#gh-ac-box2",
            event_name: "keydown",
            key_code: 13,
          },
          {
            selector: "#gh-btn",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: ".gh-tbl2",
            properties: [
              {
                selector: "#gh-ac",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "#gh-cat option:checked",
                property: "innerText",
                name: "category",
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
        url_match: "*://*.ebay.*/*",
        title: "Search Suggestion",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: ".gh-tbl",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: "[role='option']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "",
                property: "text",
                name: "query",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "savedSearch",
        description:
          "This item collects the search query that has been saved by user",
        url_match: "*://*.ebay.*/*",
        title: "Saved Searches",
        type: "event",
        is_enabled: true,
        ready_at: "windowLoad",
        events: [
          {
            selector: ".faux-link",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: ".gh-tbl2",
            properties: [
              {
                selector: "#gh-ac",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "searchResult",
        description: "This item collects search results in ebay web pages",
        url_match: "*://*.ebay.*/sch/*",
        title: "Search Result",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "#gh-ac",
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
            selector: "#gh-cat option:checked",
            properties: [
              {
                selector: "",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
          {
            selector: ".s-item__wrapper.clearfix",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".s-item__title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".s-item__price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".BOLD.NEGATIVE",
                property: "innerText",
                name: "description",
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
        url_match: "*://*.ebay.*/*",
        title: "Clicked Search Results",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".s-item__link",
            event_name: "click",
          },
          {
            selector: ".s-item__link",
            event_name: "contextmenu",
          },
          {
            selector: ".s-item__image a",
            event_name: "click",
          },
          {
            selector: ".s-item__image a",
            event_name: "contextmenu",
          },
          {
            selector: ".s-item__title",
            event_name: "click",
          },
          {
            selector: ".s-item__title",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "#gh-ac",
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
            selector: "#gh-cat option:checked",
            properties: [
              {
                selector: "",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
          {
            selector: "<<",
            properties: [
              {
                selector: ".s-item__title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".s-item__price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".BOLD.NEGATIVE",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<",
            properties: [
              {
                selector: ".s-item__title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".s-item__price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".BOLD.NEGATIVE",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<",
            properties: [
              {
                selector: ".s-item__title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".s-item__price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".BOLD.NEGATIVE",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<",
            properties: [
              {
                selector: ".s-item__title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".s-item__price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".BOLD.NEGATIVE",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToWishlist",
        description:
          "This item collects all products in ebay web pages that has been added by user to love list",
        url_match: "*://*.ebay.*/*",
        title: "Add to Wish List",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#vi-atl-lnk-vim",
            event_name: "click",
          },
          {
            selector: "#vi-atl-lnk-99",
            event_name: "click",
          },
          {
            selector: "#vi-atl-lnk-99 > a > span",
            event_name: "click",
          },
          {
            selector: "#vi-atl-lnk-99 > a > span > svg",
            event_name: "click",
          },
          {
            selector: "#vi-atl-lnk-99 > a > span > svg > use",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".x-item-title__mainTitle",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".x-price-primary",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".d-shipping-minview .ux-textspans--BOLD",
                property: "innerText",
                name: "shippingPrice",
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
        url_match: "*://*.ebay.*/*",
        title: "Add to Basket",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".ux-call-to-action__text",
            event_name: "click",
          },
          {
            selector: "[rel='nofollow']",
            event_name: "click",
          },
          {
            selector:
              ".ux-call-to-action.fake-btn.fake-btn--fluid.fake-btn--large.fake-btn--primary[href*='https://cart.payments.ebay.com/sc/add']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".x-item-title__mainTitle",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".x-price-primary",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".d-shipping-minview .ux-textspans--BOLD",
                property: "innerText",
                name: "shippingPrice",
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
        url_match: "*://*.ebay.*/*",
        title: "Buy it Now",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#binBtn_btn_1",
            event_name: "click",
          },
          {
            selector: "#binBtn_btn_1",
            event_name: "submit",
          },
          {
            selector: "#binBtn_btn_1 > span > span",
            event_name: "click",
          },
          {
            selector: "#binBtn_btn_1 > span > span",
            event_name: "submit",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".x-item-title__mainTitle",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".x-price-primary",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".d-shipping-minview .ux-textspans--BOLD",
                property: "innerText",
                name: "shippingPrice",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "placeBid",
        description:
          "This item collects the products that has been palced bid by user",
        url_match: "*://*.ebay.*/*",
        title: "Place Bid",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#bidBtn_btn",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<<<<",
            properties: [
              {
                selector: "#itemTitle",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: "#prcIsum_bidPrice",
                property: "innerText",
                name: "startingBidPrice",
                type: "text",
              },
              {
                selector: "#MaxBidId",
                property: "value",
                name: "BidPrice",
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
        url_match: "*://*.ebay.*/*",
        title: "checkout",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".call-to-action.btn.btn--large.btn--primary",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<.grid__group.details",
            name: "products",
            index_name: "rank",
            properties: [
              {
                selector: ".BOLD",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".item-price",
                property: "innerText",
                name: "itemPrice",
                type: "text",
              },
              {
                selector: ".listbox__control",
                property: "value",
                name: "quantity",
                type: "text",
              },
            ],
          },
          {
            selector: "<<",
            properties: [
              {
                selector: ".val-col.total-row",
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
