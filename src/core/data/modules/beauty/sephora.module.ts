import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = [
  "*://*.sephora.de/*",
  "*://*.sephora.ae/*",
  "*://*.sephora.com.au/*",
  "*://*.sephora.com.br/*",
  "*://*.sephora.bh/*",
  "*://*.sephora.cn/*",
  "*://*.sephora.dk/*",
  "*://*.sephora.es/*",
  "*://*.sephora.com/*",
  "*://*.sephora.gr/*",
  "*://*.sephora.hk/*",
  "*://*.sephora.co.id/*",
  "*://*.sephora.it/*",
  "*://*.sephora.com.kw/*",
  "*://*.sephora.my/*",
  "*://*.sephora.nz/*",
  "*://*.sephora.om/*",
  "*://*.sephora.ph/*",
  "*://*.sephora.pl/*",
  "*://*.sephora.pt/*",
  "*://*.sephora.cz/*",
  "*://*.sephora.ro/*",
  "*://*.sephora.ru/*",
  "*://*.sephora.se/*",
  "*://*.sephora.sg/*",
  "*://*.sephora.fr/*",
  "*://*.sephora.co.th/*",
  "*://*.sephora.com.tr/*",
  "*://*.sephora.qa/*",
];

export const SephoraModule: OnDiskModule = {
  description: "This module Captures a user shopping behaviour on sephora",
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
          "This item collects all pages in sephora that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in sephora web pages",
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
        description: "This item collects sephora search query",
        url_match: "*://*.sephora.*/*",
        title: "search query",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#site_search_combobox [type='search']",
            event_name: "keydown",
            key_code: 13,
          },
        ],
        objects: [
          {
            selector: ".css-1kv6lx6",
            properties: [
              {
                selector: "",
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
        name: "searchResult",
        description:
          "This item collects all products information in sephora web pages and search results",
        url_match: "*://*.sephora.*/*",
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
            selector: ".css-1kv6lx6",
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
            selector: ".css-klx76",
            name: "products",
            index_name: "rank",
            properties: [
              {
                selector: "",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".css-12z2u5",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: ".ProductTile-name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".css-1f35s9q",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-comp^='StarRating']",
                property: "attributes['aria-label'].value",
                name: "rate",
                type: "text",
              },
              {
                selector: "[data-at='review_count']",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
              {
                selector: ".css-1fy1xmz",
                property: "innerText",
                name: "newLable",
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
        url_match: "*://*.sephora.*/*",
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
            selector: "picture.css-yq9732",
            event_name: "click",
          },
          {
            selector: "picture.css-yq9732",
            event_name: "contextmenu",
          },
          {
            selector: ".ProductTile-name",
            event_name: "click",
          },
          {
            selector: ".ProductTile-name",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: ".css-1kv6lx6",
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
            selector: "<<.css-klx76",
            properties: [
              {
                selector: "",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".css-12z2u5",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: ".ProductTile-name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".css-1f35s9q",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-comp^='StarRating']",
                property: "attributes['aria-label'].value",
                name: "rate",
                type: "text",
              },
              {
                selector: "[data-at='review_count']",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
              {
                selector: ".css-1fy1xmz",
                property: "innerText",
                name: "newLable",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<.css-klx76",
            properties: [
              {
                selector: "",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".css-12z2u5",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: ".ProductTile-name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".css-1f35s9q",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-comp^='StarRating']",
                property: "attributes['aria-label'].value",
                name: "rate",
                type: "text",
              },
              {
                selector: "[data-at='review_count']",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
              {
                selector: ".css-1fy1xmz",
                property: "innerText",
                name: "newLable",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "searchSuggestionSelect",
        description:
          "This item collects previous search querys and search suggestions that has been selected by user",
        url_match: "*://*.sephora.*/*",
        title: "Search Suggestion",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "#site_search_input",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: ".css-1rr4qq7",
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
        name: "addToWishlist",
        description:
          "This item collects all products in bathandbodyworks web pages that has been added by user to love list ",
        url_match: "*://*.sephora.*/*",
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
            selector: ".css-29qfqk eanm77i0",
            event_name: "click",
          },
          {
            selector: ".css-29qfqk eanm77i0",
            event_name: "contextmenu",
          },
          {
            selector: ".css-7yqnvc",
            event_name: "click",
          },
          {
            selector: ".css-7yqnvc",
            event_name: "contextmenu",
          },
          {
            selector: ".css-1q7f8mb",
            event_name: "click",
          },
          {
            selector: ".css-1q7f8mb",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "[data-at='brand_name']",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: "[data-at='product_name']",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".css-18jtttk .css-0",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".css-1tbjoxk",
                property: "attributes['aria-label'].value",
                name: "rate",
                type: "text",
              },
              {
                selector: "[data-at='number_of_reviews']",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
              {
                selector: "[data-at='product_flag_label']",
                property: "innerText",
                name: "newLable",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToBasket",
        description:
          "This item collects the products that has been added to the basket by user ",
        url_match: "*://*.sephora.*/*",
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
            selector: "button[data-at='add_to_basket_btn']",
            event_name: "click",
          },
          {
            selector:
              ".css-5glkxh [data-comp='StyledComponent BaseComponent ']",
            event_name: "click",
          },
          {
            selector:
              ".css-1901pih [data-comp='StyledComponent BaseComponent ']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "[data-at='brand_name']",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: "[data-at='product_name']",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".css-18jtttk .css-0",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".css-1tbjoxk",
                property: "attributes['aria-label'].value",
                name: "rate",
                type: "text",
              },
              {
                selector: "[data-at='number_of_reviews']",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
              {
                selector: "[data-at='product_flag_label']",
                property: "innerText",
                name: "newLable",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "checkout",
        description:
          "This item collects information about products that has been selected by user for buying ",
        url_match: "*://*.sephora.*/*",
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
            selector: ".css-x04nfy.eanm77i0",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<.css-8wpmc2.eanm77i0",
            name: "products",
            properties: [
              {
                selector: "[data-at='bsk_sku_brand']",
                property: "innerText",
                name: "brandName",
                type: "text",
              },
              {
                selector: "[data-at='bsk_sku_name']",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".css-1p4nz1q.eanm77i0",
                property: "innerText",
                name: "description",
                type: "text",
              },
              {
                selector: "[data-at='bsk_sku_price']",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "[data-at='sku_qty']",
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
                selector: "[data-at='bsk_total_merch']",
                property: "innerText",
                name: "totalItemPrice",
                type: "text",
              },
              {
                selector: "[data-at='bsk_total_ship']",
                property: "innerText",
                name: "shippingPrice",
                type: "text",
              },
              {
                selector: "[data-at='bsk_total_tax']",
                property: "innerText",
                name: "tax",
                type: "text",
              },
              {
                selector: "[data-at='bsk_total_cc']",
                property: "innerText",
                name: "totalPrice",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "clickBrands",
        description:
          "This item collects the Brands in sephora that has been selected by a user",
        url_match: "*://*.sephora.*/*",
        title: "brands",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".css-xyl2uf.e65zztl0",
            event_name: "click",
          },
          {
            selector: ".css-gibayv.e65zztl0",
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
                name: "brandName",
                type: "text",
              },
              {
                selector: "span.css-16fulbm.e65zztl0",
                property: "innerText",
                name: "newLable",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
