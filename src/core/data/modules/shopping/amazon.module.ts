import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = [
  "*://www.amazon.com/*",
  "*://www.amazon.eg/*",
  "*://www.amazon.com.br/*",
  "*://www.amazon.ca/*",
  "*://www.amazon.com.mx/*",
  "*://www.amazon.cn/*",
  "*://www.amazon.in/*",
  "*://www.amazon.co.jp/*",
  "*://www.amazon.sg/*",
  "*://www.amazon.ae/*",
  "*://www.amazon.sa/*",
  "*://www.amazon.fr/*",
  "*://www.amazon.de/*",
  "*://www.amazon.it/*",
  "*://www.amazon.nl/*",
  "*://www.amazon.pl/*",
  "*://www.amazon.es/*",
  "*://www.amazon.se/*",
  "*://www.amazon.com.tr/*",
  "*://www.amazon.co.uk/*",
  "*://www.amazon.com.au/*",
];

export const AmazonModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on amazon and captures those activities that the user has permitted",
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
          "This item collects all pages in Amazon that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in Amazon web pages",
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
        url_match: "*://www.amazon.*/*",
        description:
          "This item collects Amazon search query and search category",
        title: "Search Query",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#nav-search input[type=submit]",
            event_name: "click",
          },
          {
            selector: "#twotabsearchtextbox",
            event_name: "keydown",
            key_code: 13,
          },
        ],
        objects: [
          {
            selector: "#nav-search",
            properties: [
              {
                selector: "#twotabsearchtextbox",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "#searchDropdownBox option:checked",
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
        url_match: "*://www.amazon.*/*",
        description:
          "This item collects a search suggestion that has been selected by user",
        title: "Search Suggestion",
        type: "event",
        ready_at: "DOMChange",
        observing_target_node: "#nav-belt",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: ".s-suggestion",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "#nav-search",
            properties: [
              {
                selector: "#searchDropdownBox option:checked",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
          {
            selector: "",
            properties: [
              {
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
        url_match: "*://www.amazon.*/s*",
        description:
          "This item collects Amazon search results, search category, and corresponding search query",
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
            selector: ".s-result-list.sg-row .s-result-item",
            name: "ColSearchResult",
            index_name: "rank",
            properties: [
              {
                selector: "h2 a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: "h2 a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".a-price .a-offscreen",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".a-price.a-text-price .a-offscreen",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".a-icon-star-small",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".a-badge-label-inner.a-text-ellipsis",
                property: "innerText",
                name: "label",
                type: "text",
              },
              {
                selector: ".s-label-popover-hover span",
                property: "innerText",
                name: "sponsor",
                type: "text",
              },
              {
                selector:
                  ".a-section.a-spacing-none.a-spacing-top-micro .a-row.a-size-base.a-color-secondary:nth-child(2)",
                property: "innerText",
                name: "orderSoon",
                type: "text",
              },
            ],
          },
          {
            selector: ".a-section.a-spacing-medium",
            name: "RowSearchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".a-link-normal.a-text-normal",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: "h2 a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".a-price-whole",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".a-price.a-text-price .a-offscreen",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".a-icon-alt",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".a-badge-label-inner.a-text-ellipsis",
                property: "innerText",
                name: "label",
                type: "text",
              },
              {
                selector: ".s-label-popover-hover span",
                property: "innerText",
                name: "sponsor",
                type: "text",
              },
              {
                selector:
                  ".a-section.a-spacing-none.a-spacing-top-micro .a-row.a-size-base.a-color-secondary:nth-child(2)",
                property: "innerText",
                name: "deliveryTime",
                type: "text",
              },
            ],
          },
          {
            selector: "title",
            properties: [
              {
                property: "innerText",
                name: "query",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "#searchDropdownBox option:checked",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: ".s-pagination-selected",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "clickSearchResult",
        url_match: "*://*.amazon.*/s*",
        description:
          "This item collects information about a search result link that has been clicked by user",
        title: "Clicked Search Results",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".s-result-list.sg-row .s-result-item h2 a",
            event_name: "click",
          },
          {
            selector: ".s-result-list.sg-row .s-result-item h2 a",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "#",
            properties: [
              {
                property: "index",
                name: "rank",
                type: "text",
              },
            ],
          },
          {
            selector: "",
            properties: [
              {
                property: "href",
                name: "link",
                type: "url",
              },
              {
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<",
            properties: [
              {
                selector: ".a-price .a-offscreen",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".a-price.a-text-price .a-offscreen",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".a-icon-star-small",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".a-badge-label-inner.a-text-ellipsis",
                property: "innerText",
                name: "label",
                type: "text",
              },
              {
                selector: ".s-label-popover-hover span",
                property: "innerText",
                name: "sponsor",
                type: "text",
              },
              {
                selector:
                  ".a-section.a-spacing-none.a-spacing-top-micro .a-row.a-size-base.a-color-secondary:nth-child(2)",
                property: "innerText",
                name: "orderSoon",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "#twotabsearchtextbox",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "#searchDropdownBox option:checked",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: ".s-pagination-selected",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToBasket",
        url_match: "*://*.amazon.*/*",
        description:
          "This item collects all products in amazon web pages that has been added to the basket by user",
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
            selector: "#add-to-cart-button",
            event_name: "click",
          },
          {
            selector: "#add-to-cart-button",
            event_name: "submit",
          },
          {
            selector: ".a-button-input[value='Add to Cart']",
            event_name: "click",
          },
          {
            selector: ".a-button-input[value='Add to Cart']",
            event_name: "submit",
          },
        ],
        objects: [
          {
            selector: "#dp-container",
            properties: [
              {
                selector: "#productTitle",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "#averageCustomerReviews .a-icon-star",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".priceToPay .a-offscreen",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".basisPrice .a-offscreen",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".a-price .a-offscreen",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector:
                  "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE",
                property: "innerText",
                name: "arriveTime",
                type: "text",
              },
              {
                selector: "#a-popover-agShipMsgPopover td:nth-child(3)",
                property: "innerText",
                name: "shippingFee",
                type: "text",
                arrIndex: 1,
              },
            ],
          },
          {
            selector: "#nav-search",
            properties: [
              {
                selector: "#searchDropdownBox option:checked",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: "#twotabsearchtextbox",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
          {
            selector: "#feature-bullets",
            properties: [
              {
                property: "innerText",
                name: "features",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToWishlist",
        description:
          "This item collects all products in amazon web pages that has been added by user in wish list",
        url_match: "*://*.amazon.*/*",
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
            selector: "#wishListMainButton",
            event_name: "click",
          },
          {
            selector: "#wishListMainButton",
            event_name: "submit",
          },
        ],
        objects: [
          {
            selector: "#dp-container",
            properties: [
              {
                selector: "#productTitle",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "#averageCustomerReviews .a-icon-star",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".priceToPay .a-offscreen",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".basisPrice .a-offscreen",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".a-price .a-offscreen",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector:
                  "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE",
                property: "innerText",
                name: "arriveTime",
                type: "text",
              },
              {
                selector: "#a-popover-agShipMsgPopover td:nth-child(3)",
                property: "innerText",
                name: "shippingFee",
                type: "text",
                arrIndex: 1,
              },
            ],
          },
          {
            selector: "#nav-search",
            properties: [
              {
                selector: "#searchDropdownBox option:checked",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: "#twotabsearchtextbox",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
          {
            selector: "#feature-bullets",
            properties: [
              {
                property: "innerText",
                name: "features",
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
        url_match: "*://*.amazon.*/*",
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
            selector: "#buy-now-button",
            event_name: "click",
          },
          {
            selector: "#buy-now-button",
            event_name: "submit",
          },
        ],
        objects: [
          {
            selector: "#dp-container",
            properties: [
              {
                selector: "#productTitle",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "#averageCustomerReviews .a-icon-star",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".priceToPay .a-offscreen",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".basisPrice .a-offscreen",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".a-price .a-offscreen",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector:
                  "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE",
                property: "innerText",
                name: "arriveTime",
                type: "text",
              },
              {
                selector: "#a-popover-agShipMsgPopover td:nth-child(3)",
                property: "innerText",
                name: "shippingFee",
                type: "text",
                arrIndex: 1,
              },
            ],
          },
          {
            selector: "#nav-search",
            properties: [
              {
                selector: "#searchDropdownBox option:checked",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: "#twotabsearchtextbox",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
          {
            selector: "#feature-bullets",
            properties: [
              {
                property: "innerText",
                name: "features",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
    mobile: [
      {
        name: "searchQuery",
        url_match: "*://www.amazon.*/*",
        description:
          "This item collects Amazon search query and search category",
        title: "Search Query",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#nav-search-form input[type=submit]",
            event_name: "click",
          },
          {
            selector: "#nav-search-keywords",
            event_name: "keydown",
            key_code: 13,
          },
        ],
        objects: [
          {
            selector: "#nav-search-form",
            properties: [
              {
                selector: "#nav-search-keywords",
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
        url_match: "*://www.amazon.*/*",
        description:
          "This item collects a search suggestion that has been selected by user",
        title: "Search Suggestion",
        type: "event",
        ready_at: "DOMChange",
        observing_target_node: "#nav-search-form",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: ".s-suggestion",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
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
        url_match: "*://www.amazon.*/s*",
        description:
          "This item collects Amazon search results, search category, and corresponding search query",
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
            selector: ".s-result-list.sg-row .s-result-item",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: "a[title=status-badge]",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: "a h2",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".a-price .a-offscreen",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".a-icon-star-small",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".s-sponsored-label-text",
                property: "innerText",
                name: "sponsor",
                type: "text",
              },
            ],
          },
          {
            selector: "title",
            properties: [
              {
                property: "innerText",
                name: "query",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "clickSearchResult",
        url_match: "*://*.amazon.*/s*",
        description:
          "This item collects information about a search result link that has been clicked by user",
        title: "Clicked Search Results",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".s-result-list.sg-row .s-result-item a h2",
            event_name: "click",
          },
          {
            selector: ".s-result-list.sg-row .s-result-item a h2",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "#",
            properties: [
              {
                property: "index",
                name: "rank",
                type: "text",
              },
            ],
          },
          {
            selector: "",
            properties: [
              {
                selector: "<<",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: "#nav-search-form",
            properties: [
              {
                selector: "#nav-search-keywords",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToBasket",
        url_match: "*://*.amazon.*/*",
        description:
          "This item collects all products in amazon web pages that has been added to the basket by user",
        title: "Add to Basket",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#add-to-cart-button",
            event_name: "click",
          },
          {
            selector: "#add-to-cart-button",
            event_name: "submit",
          },
        ],
        objects: [
          {
            selector: "#productTitleGroupAnchor",
            is_required: true,
            properties: [
              {
                selector: "#title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "#acrCustomerReviewLink .a-icon-star-mini",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".priceToPay .a-offscreen",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".basisPrice .a-offscreen",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".a-price .a-offscreen",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector:
                  "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE",
                property: "innerText",
                name: "arriveTime",
                type: "text",
              },
              {
                selector: "#amazonGlobal_feature_div span",
                property: "innerText",
                name: "shippingFee",
                type: "text",
              },
            ],
          },
          {
            selector: "#nav-search-form",
            properties: [
              {
                selector: "#nav-search-keywords",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
          {
            selector: "#feature-bullets",
            properties: [
              {
                property: "innerText",
                name: "features",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToWishlist",
        description:
          "This item collects all products in amazon web pages that has been added by user in wish list",
        url_match: "*://*.amazon.*/*",
        title: "Add to Wish list",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#add-to-wishlist-button-submit",
            event_name: "click",
          },
          {
            selector: "#add-to-wishlist-button-submit",
            event_name: "submit",
          },
        ],
        objects: [
          {
            selector: "#productTitleGroupAnchor",
            is_required: true,
            properties: [
              {
                selector: "#title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "#acrCustomerReviewLink .a-icon-star-mini",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".priceToPay .a-offscreen",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".basisPrice .a-offscreen",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".a-price .a-offscreen",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector:
                  "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE",
                property: "innerText",
                name: "arriveTime",
                type: "text",
              },
              {
                selector: "#amazonGlobal_feature_div span",
                property: "innerText",
                name: "shippingFee",
                type: "text",
              },
            ],
          },
          {
            selector: "#nav-search-form",
            properties: [
              {
                selector: "#nav-search-keywords",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
          {
            selector: "#feature-bullets",
            properties: [
              {
                property: "innerText",
                name: "features",
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
        url_match: "*://*.amazon.*/*",
        title: "Buy it Now",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#buy-now-button",
            event_name: "click",
          },
          {
            selector: "#buy-now-button",
            event_name: "submit",
          },
        ],
        objects: [
          {
            selector: "#productTitleGroupAnchor",
            is_required: true,
            properties: [
              {
                selector: "#title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: "#acrCustomerReviewLink .a-icon-star-mini",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".priceToPay .a-offscreen",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".basisPrice .a-offscreen",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".a-price .a-offscreen",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector:
                  "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE",
                property: "innerText",
                name: "arriveTime",
                type: "text",
              },
              {
                selector: "#amazonGlobal_feature_div span",
                property: "innerText",
                name: "shippingFee",
                type: "text",
              },
            ],
          },
          {
            selector: "#nav-search-form",
            properties: [
              {
                selector: "#nav-search-keywords",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
          {
            selector: "#feature-bullets",
            properties: [
              {
                property: "innerText",
                name: "features",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
