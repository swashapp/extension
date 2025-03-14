import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.bathandbodyworks.com/*"];

export const BathAndBodyWorksModule: OnDiskModule = {
  description:
    "This module Captures a user shopping behaviour on bathandbodyworks",
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
          "This item collects all pages in bathandbodyworks that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in bathandbodyworks web pages",
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
        description: "This item collects bathandbodyworks search query",
        url_match: "https://www.bathandbodyworks.com/*",
        title: "search query",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#q.valid",
            event_name: "keydown",
            key_code: 13,
          },
          {
            selector: "#headerSearch button[type='submit']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "#headerSearch",
            properties: [
              {
                selector: "#q.valid",
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
        name: "searchResult",
        description:
          "This item collects search results in bathandbodyworks web page",
        url_match: "https://www.bathandbodyworks.com/*",
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
            selector: "#headerSearch",
            properties: [
              {
                selector: "#q.valid",
                property: "value",
                name: "searchQuery",
                type: "text",
              },
            ],
          },
          {
            selector: ".product-tile",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".product-tile-link",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".promotional-message",
                property: "innerText",
                name: "promotionalMessage",
                type: "text",
              },
              {
                selector: ".product-type",
                property: "innerText",
                name: "productType",
                type: "text",
              },
              {
                selector: ".product-name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".product-sales-price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".badge.new",
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
        url_match: "https://www.bathandbodyworks.com/*",
        title: "Clicked Search Results",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".product-outline-block",
            event_name: "click",
          },
          {
            selector: ".product-outline-block",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "<",
            properties: [
              {
                selector: ".badge.new",
                property: "innerText",
                name: "newLable",
                type: "text",
              },
              {
                selector: ".product-name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".product-type",
                property: "innerText",
                name: "productType",
                type: "text",
              },
              {
                selector: ".product-sales-price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".promotional-message",
                property: "innerText",
                name: "promotionalMessage",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToWishlist",
        description:
          "This item collects all products in bathandbodyworks web pages that has been added by user to love list",
        url_match: "https://www.bathandbodyworks.com/*",
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
            selector: ".wish-list-link",
            event_name: "click",
          },
          {
            selector: ".add-to-wishlist",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".breadcrumb",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
          {
            selector: ".product-col-2.product-detail",
            properties: [
              {
                selector: ".bv_numReviews_text",
                property: "innerText",
                name: "numOfReviews",
                type: "text",
              },
              {
                selector: ".product-name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: "#product-content .small-title",
                property: "innerText",
                name: "size",
                type: "text",
              },
              {
                selector: ".bv_avgRating_component_container.notranslate",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector:
                  "#product-content .promotion-callout .callout-message",
                property: "innerText",
                name: "promotionalMessage",
                type: "text",
              },
              {
                selector: "#product-content .product-price .price-sales",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "#ui-id-2",
                property: "innerText",
                name: "Fragrance",
                type: "text",
              },
              {
                selector: "#ui-id-4",
                property: "innerText",
                name: "overView",
                type: "text",
              },
              {
                selector: "#ui-id-6",
                property: "innerText",
                name: "usage",
                type: "text",
              },
              {
                selector: "#ui-id-8",
                property: "innerText",
                name: "moreInfo",
                type: "text",
              },
            ],
          },
          {
            selector: "<<",
            properties: [
              {
                selector: ".product-list-item .sub-attribute",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".item-price .price-sales",
                property: "innerText",
                name: "itemPrice",
                type: "text",
              },
              {
                selector: ".price-total",
                property: "innerText",
                name: "priceTotal",
                type: "text",
              },
              {
                selector: ".item-quantity.clearfix .input-text",
                property: "value",
                name: "quantity",
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
        url_match: "https://www.bathandbodyworks.com/*",
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
            selector: ".add-to-cart",
            event_name: "click",
          },
          {
            selector: "#add-to-cart",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: ".product-col-2.product-detail",
            properties: [
              {
                selector: ".bv_numReviews_text",
                property: "innerText",
                name: "numOfReviews",
                type: "text",
              },
              {
                selector: ".product-name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: "#product-content .small-title",
                property: "innerText",
                name: "size",
                type: "text",
              },
              {
                selector: ".bv_avgRating_component_container.notranslate",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector:
                  "#product-content .promotion-callout .callout-message",
                property: "innerText",
                name: "promotionalMessage",
                type: "text",
              },
              {
                selector: "#product-content .product-price .price-sales",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: "#ui-id-2",
                property: "innerText",
                name: "Fragrance",
                type: "text",
              },
              {
                selector: "#ui-id-4",
                property: "innerText",
                name: "overView",
                type: "text",
              },
              {
                selector: "#ui-id-6",
                property: "innerText",
                name: "usage",
                type: "text",
              },
              {
                selector: "#ui-id-8",
                property: "innerText",
                name: "moreInfo",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<.product-tile",
            properties: [
              {
                selector: ".product-tile-link",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".promotional-message",
                property: "innerText",
                name: "promotionalMessage",
                type: "text",
              },
              {
                selector: ".product-type",
                property: "innerText",
                name: "productType",
                type: "text",
              },
              {
                selector: ".product-name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".product-sales-price",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".badge.new",
                property: "innerText",
                name: "newLable",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<td",
            properties: [
              {
                selector: ".item-details .product-list-item .name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".item-details .sub-attribute",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".item-price .product-pricing .price-sales",
                property: "innerText",
                name: "itemPrice",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<",
            properties: [
              {
                selector: ".product-name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".small-title",
                property: "innerText",
                name: "smallTitle",
                type: "text",
              },
              {
                selector: ".price-sales",
                property: "innerText",
                name: "itemPrice",
                type: "text",
              },
              {
                selector: ".callout-message",
                property: "innerText",
                name: "promotionalMessage",
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
        url_match: "https://www.bathandbodyworks.com/*",
        title: "checkout",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".button-fancy-large",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<.cart-row.cart-line-item",
            name: "products",
            properties: [
              {
                selector: ".sub-attribute",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".item-quantity.clearfix .input-text",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: ".price-sales",
                property: "innerText",
                name: "itemPrice",
                type: "text",
              },
              {
                selector: ".promo.first",
                property: "innerText",
                name: "promotionalMessage",
                type: "text",
              },
              {
                selector: ".price-total",
                property: "innerText",
                name: "priceTotal",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<.cart-order-totals",
            properties: [
              {
                selector: ".order-subtotal",
                property: "innerText",
                name: "merchandise subtotal",
                type: "text",
              },
              {
                selector: ".order-shipping",
                property: "innerText",
                name: "order shipping",
                type: "text",
              },
              {
                selector: ".order-sales-tax",
                property: "innerText",
                name: "tax",
                type: "text",
              },
              {
                selector: ".order-total",
                property: "innerText",
                name: "order total",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<.cart-row.cart-line-item",
            name: "products",
            properties: [
              {
                selector: ".sub-attribute",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".name",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".item-quantity.clearfix .input-text",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: ".price-sales",
                property: "innerText",
                name: "itemPrice",
                type: "text",
              },
              {
                selector: ".promo.first",
                property: "innerText",
                name: "promotionalMessage",
                type: "text",
              },
              {
                selector: ".price-total",
                property: "innerText",
                name: "priceTotal",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<.cart-order-totals",
            properties: [
              {
                selector: ".order-subtotal",
                property: "innerText",
                name: "merchandise subtotal",
                type: "text",
              },
              {
                selector: ".order-shipping",
                property: "innerText",
                name: "order shipping",
                type: "text",
              },
              {
                selector: ".order-sales-tax",
                property: "innerText",
                name: "tax",
                type: "text",
              },
              {
                selector: ".order-total",
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
