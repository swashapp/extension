import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://faberlic.com/*"];

export const FaberlicModule: OnDiskModule = {
  description: "This module Captures a user shopping behaviour on faberlic",
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
          "This item collects all pages in faberlic that user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in faberlic web pages",
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
        description: "This item collects faberlic search query",
        url_match: "*://faberlic.com/*",
        title: "search query box1",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "#collapsesearch .btn.btn-default.buttontopsearch",
            event_name: "click",
          },
          {
            selector:
              "#collapsesearch .form-control.inputbox.inputboxtopsearch",
            event_name: "keydown",
            key_code: 13,
          },
          {
            selector: ".button.flbutton.but_submit",
            event_name: "click",
          },
          {
            selector: "#search_searchword",
            event_name: "keydown",
            key_code: 13,
          },
        ],
        objects: [
          {
            selector: "#collapsesearch",
            properties: [
              {
                selector: ".form-control.inputbox.inputboxtopsearch",
                property: "value",
                name: "query",
                type: "text",
              },
            ],
          },
          {
            selector: "#search_searchword",
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
        name: "searchResult",
        description: "This item collects search results in faberlic web pages",
        url_match: "*://faberlic.com/*",
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
            selector: "#search_searchword",
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
            selector: ".page-header h1",
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
            selector: ".cardWrapper",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".cardTitle",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".cardPrice.cardPriceDeleted",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".cardPrice.cardPriceSale",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".cardPrice.cardPriceSale",
                property: "innerText",
                name: "price",
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
        url_match: "*://faberlic.com/*",
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
            selector: ".card",
            event_name: "click",
          },
          {
            selector: ".card",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "#search_searchword",
                property: "value",
                name: "searchQuery",
                type: "text",
              },
            ],
          },
          {
            selector: ".page-header h1",
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
            selector: "",
            properties: [
              {
                selector: ".cardTitle",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".cardPrice.cardPriceDeleted",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".cardPrice.cardPriceSale",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".cardPrice.cardPriceSale",
                property: "innerText",
                name: "price",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "addToWishlist",
        description:
          "This item collects all products in faberlic web pages that has been added by user to love list",
        url_match: "*://faberlic.com/*",
        title: "Add to Wish list",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".addButtonHost .setfavorite",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: ".goodInfoWrapper",
            properties: [
              {
                selector: ".popupCatalogTitle",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".popup_old_price",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".popup_price_itself",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".popup_price_itself",
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
        url_match: "*://faberlic.com/*",
        title: "Add to Basket",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".addButtonHost button.addcart",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: ".goodInfoWrapper",
            properties: [
              {
                selector: ".popupCatalogTitle",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: ".popup_old_price",
                property: "innerText",
                name: "regularPrice",
                type: "text",
              },
              {
                selector: ".popup_price_itself",
                property: "innerText",
                name: "discountPrice",
                type: "text",
              },
              {
                selector: ".popup_price_itself",
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
        url_match: "*://faberlic.com/*",
        title: "checkout",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector:
              ".pull-right.but.addneworderbut.btn.btn-primary.flbutton.but_submit",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "<<.itms",
            name: "products",
            index_name: "rank",
            properties: [
              {
                selector: ".goodDescriptionText",
                property: "innerText",
                name: "productName",
                type: "text",
              },
              {
                selector: "#cg_1",
                property: "value",
                name: "quantity",
                type: "text",
              },
              {
                selector: ".goodPriceYours",
                property: "innerText",
                name: "priceYours",
                type: "text",
              },
              {
                selector: ".goodPriceCatalog span",
                property: "innerText",
                name: "cataloguePrice",
                type: "text",
              },
            ],
          },
          {
            selector: "<<",
            properties: [
              {
                selector: ".colorRed",
                property: "innerText",
                name: "cataloguePriceTotal",
                type: "text",
              },
              {
                selector: ".goodsReportRow:nth-child(2) .goodsReportCol.col2",
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
