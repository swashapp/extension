import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.etsy.com/*"];

export const EtsyModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on etsy and captures those activities that the user has permitted",
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
          "This item collects all pages in Etsy that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in Etsy web pages",
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
        description: "This item collects etsy search query",
        url_match: "*://*.etsy.com/*",
        title: "search query",
        type: "event",
        is_enabled: true,
        ready_at: "windowLoad",
        events: [
          {
            selector: "#gnav-search",
            event_name: "submit",
          },
          {
            selector: "button[aria-label='Search']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "#global-enhancements-search-query",
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
        url_match: "*://*.etsy.com/*",
        title: "Search Suggestion",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "#gnav-header",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: ".as-suggestion strong",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "",
                property: "textContent",
                name: "query",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "searchResult",
        description: "This item collects search results in etsy web pages",
        url_match: "*://*.etsy.com/search*",
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
            selector: "#global-enhancements-search-query",
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
            selector: ".js-merch-stash-check-listing.v2-listing-card",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".v2-listing-card__title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".lc-price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".star-rating-5.stars-smaller",
                property: "ariaLabel",
                name: "rate",
                type: "text",
              },
              {
                selector: ".v2-listing-card__info span span:nth-child(2)",
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
        url_match: "*://*.etsy.com/*",
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
            selector: ".v2-listing-card__img",
            event_name: "click",
          },
          {
            selector: ".v2-listing-card__img",
            event_name: "contextmenu",
          },
          {
            selector: ".v2-listing-card__info .v2-listing-card__title",
            event_name: "click",
          },
          {
            selector: ".v2-listing-card__info .v2-listing-card__title",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "#global-enhancements-search-query",
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
            selector: "<",
            properties: [
              {
                selector: ".v2-listing-card__title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".lc-price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".star-rating-5.stars-smaller",
                property: "ariaLabel",
                name: "rate",
                type: "text",
              },
              {
                selector: ".v2-listing-card__info span span:nth-child(2)",
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
          "This item collects all products in etsy web pages that has been added by user to love list",
        url_match: "*://*.etsy.com/*",
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
            selector: "[data-ui='favorite-listing-button']",
            event_name: "click",
          },
          {
            selector: ".favorite-listing-button-icon-container",
            event_name: "click",
          },
          {
            selector: ".favorite-listing-button-icon-container span",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "#listing-page-cart .wt-text-body-01",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector:
                  "#listing-page-cart div[data-buy-box-region='price'] p",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "#reviews .wt-display-flex-xs span span span",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: "#reviews .wt-display-flex-xs h2",
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
        url_match: "*://*.etsy.com/*",
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
            selector: ".wt-validation .wt-btn.wt-btn--filled.wt-width-full",
            event_name: "click",
          },
          {
            selector: "[data-selector='add-to-cart-button']",
            event_name: "click",
          },
          {
            selector: ".add-to-cart-form .wt-width-full",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "#listing-page-cart .wt-text-body-01",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector:
                  "#listing-page-cart div[data-buy-box-region='price'] p",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "#reviews .wt-display-flex-xs span span span",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: "#reviews .wt-display-flex-xs h2",
                property: "innerText",
                name: "reviewCount",
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
        url_match: "*://*.etsy.com/*",
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
            selector: "button.wt-btn.wt-btn--outline.wt-width-full",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "#listing-page-cart .wt-text-body-01",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector:
                  "#listing-page-cart div[data-buy-box-region='price'] p",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "#reviews .wt-display-flex-xs span span span",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: "#reviews .wt-display-flex-xs h2",
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
        url_match: "*://*.etsy.com/*",
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
              "[rel='save-for-later'] .wt-btn.wt-btn--transparent.wt-btn--small.wt-btn--transparent-flush-left",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<",
            properties: [
              {
                selector:
                  ".wt-text-link-no-underline.wt-text-body-01.wt-line-height-tight.wt-break-word",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".wt-select__element",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: ".currency-value",
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
        url_match: "*://*.etsy.com/*",
        title: "checkout",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector:
              ".proceed-to-checkout.wt-btn.wt-btn--filled.wt-mt-xs-2.wt-width-full",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<<.wt-flex-xs-3.wt-pl-xs-2.wt-pl-lg-3",
            name: "products",
            index_name: "rank",
            properties: [
              {
                selector:
                  ".wt-text-link-no-underline.wt-text-body-01.wt-line-height-tight.wt-break-word",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".wt-select__element",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: ".currency-value",
                property: "innerText",
                name: "price",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<",
            properties: [
              {
                selector:
                  ".wt-b-xs-none.wt-mt-xs-1 tr:first-child .currency-value",
                property: "innerText",
                name: "itemsPrice",
                type: "text",
              },
              {
                selector:
                  ".wt-b-xs-none.wt-mt-xs-1 tr:nth-child(2) .currency-value",
                property: "innerText",
                name: "shipping",
                type: "text",
              },
              {
                selector:
                  ".wt-p-xs-0.wt-b-xs-none.wt-text-right-xs.wt-no-wrap .wt-text-title-01 .currency-value",
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
