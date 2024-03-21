import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.ulta.com/*"];

export const UltaModule: OnDiskModule = {
  description: "This module Captures a user shopping behaviour on ulta",
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
          "This item collects all pages in ulta that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in ulta web pages",
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
        description: "This item collects ulta search query",
        url_match: "https://www.ulta.com/*",
        title: "search query",
        type: "event",
        is_enabled: true,
        ready_at: "windowLoad",
        events: [
          {
            selector: ".SearchL__form input#search",
            event_name: "keydown",
            key_code: 13,
          },
          {
            selector: ".SearchL__form input[name='search']",
            event_name: "keydown",
            key_code: 13,
          },
          {
            selector: ".SearchL__form button[aria-label='Submit']",
            event_name: "click",
          },
          {
            selector: ".SearchL__form button[type='submit']",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: ".SearchL__form input#search",
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
        description: "This item collects search results in ulta web pages",
        url_match: "https://www.ulta.com/*",
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
            selector: ".DynamicTitle .Text-ds",
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
            selector: ".ProductCard",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".ProductCard__brand",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: ".ProductCard__product",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".ProductPricing",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".ReviewStarsCard .sr-only",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".ProductCard .ReviewStarsCard .Text-ds",
                property: "innerText",
                name: "reviewCount",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "searchSuggestionSelect",
        description:
          "This item collects search suggestions that has been selected by user",
        url_match: "https://www.ulta.com/*",
        title: "Search Suggestion",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: ".SearchL__form",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: ".SuggestionItem__suggestion",
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
                name: "searchQuery",
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
        url_match: "*://www.ulta.com/*",
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
            selector: ".ProductCard__image .Image",
            event_name: "click",
          },
          {
            selector: ".ProductCard__image .Image",
            event_name: "contextmenu",
          },
          {
            selector: ".ProductCard__product .Text-ds",
            event_name: "click",
          },
          {
            selector: ".ProductCard__product .Text-ds",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "<<<<",
            properties: [
              {
                selector: ".ProductCard__brand",
                property: "innerText",
                name: "brand",
                type: "text",
              },
              {
                selector: ".ProductCard__product",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".ProductPricing",
                property: "innerText",
                name: "price",
                type: "text",
              },
              {
                selector: ".ReviewStarsCard .sr-only",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".ProductCard .ReviewStarsCard .Text-ds",
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
          "This item collects all products in ulta web pages that has been added by user to love list",
        url_match: "https://www.ulta.com/*",
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
            selector: "button.ProductBookmark",
            event_name: "click",
          },
          {
            selector: ".AddToBagFavorite__Favorite",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".ProductInformation a.Link_Huge",
                property: "innerText",
                name: "brandName",
                type: "text",
              },
              {
                selector: ".ProductInformation h1 span:nth-child(2)",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".ProductInformation .ReviewStars .sr-only",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".ProductPricing span",
                property: "innerText",
                name: "price",
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
        url_match: "https://www.ulta.com/*",
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
            selector: ".AddToBagButton",
            event_name: "click",
          },
          {
            selector: "button.AddToBagButton__AddToBag",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: ".ProductInformation a.Link_Huge",
                property: "innerText",
                name: "brandName",
                type: "text",
              },
              {
                selector: ".ProductInformation h1 span:nth-child(2)",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".ProductInformation .ReviewStars .sr-only",
                property: "innerText",
                name: "rate",
                type: "text",
              },
              {
                selector: ".ProductPricing span",
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
        url_match: "https://www.ulta.com/*",
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
            selector: ".Button.Button__primary.Button--large.Button--block",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<.ProductCellList__item",
            name: "products",
            properties: [
              {
                selector: ".ProductDescriptionCard__brandName",
                property: "innerText",
                name: "brandName",
                type: "text",
              },
              {
                selector: ".ProductDescriptionCard__displayName",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".ProductCellItem__dropdown",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: ".ProductCellItem__price",
                property: "innerText",
                name: "priceTotal",
                type: "text",
              },
              {
                selector: ".ProductCellItem__unitmessage",
                property: "innerText",
                name: "itemPrice",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<.OrderSummary__container",
            properties: [
              {
                selector:
                  ".OrderSummaryRow:nth-child(1) .OrderSummaryRow__value",
                property: "innerText",
                name: "merchandise subtotal",
                type: "text",
              },
              {
                selector:
                  ".OrderSummaryRow:nth-child(2) .OrderSummaryRow__value",
                property: "innerText",
                name: "order shipping",
                type: "text",
              },
              {
                selector:
                  ".OrderSummaryRow:nth-child(3) .OrderSummaryRow__value",
                property: "innerText",
                name: "tax",
                type: "text",
              },
              {
                selector:
                  ".OrderSummaryRow:nth-child(4) .OrderSummaryRow__value",
                property: "innerText",
                name: "order total",
                type: "text",
              },
            ],
          },
          {
            selector: "<<<<<<.ProductCellList__item",
            name: "products",
            properties: [
              {
                selector: ".ProductDescriptionCard__brandName",
                property: "innerText",
                name: "brandName",
                type: "text",
              },
              {
                selector: ".ProductDescriptionCard__displayName",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".ProductCellItem__dropdown",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: ".ProductCellItem__price",
                property: "innerText",
                name: "priceTotal",
                type: "text",
              },
              {
                selector: ".ProductCellItem__unitmessage",
                property: "innerText",
                name: "itemPrice",
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
        url_match: "https://www.ulta.com/*",
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
            selector: ".ProductCellItem__saveForLater .Button.Button__link",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<<<<<.ProductCellItem",
            name: "products",
            properties: [
              {
                selector: ".ProductDescriptionCard__brandName",
                property: "innerText",
                name: "brandName",
                type: "text",
              },
              {
                selector: ".ProductDescriptionCard__displayName",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".ProductCellItem__dropdown",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: ".ProductCellItem__price",
                property: "innerText",
                name: "priceTotal",
                type: "text",
              },
              {
                selector: ".ProductCellItem__unitmessage",
                property: "innerText",
                name: "itemPrice",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
