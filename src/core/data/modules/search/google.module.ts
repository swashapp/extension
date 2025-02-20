import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const ads = [
  "*://www.google.com/",
  "*://www.google.com/?*",
  "*://www.google.com/search?*",
];

const urls = [
  "*://www.google.com/search?*",
  "*://www.google.ad/search?*",
  "*://www.google.ae/search?*",
  "*://www.google.com.af/search?*",
  "*://www.google.com.ag/search?*",
  "*://www.google.com.ai/search?*",
  "*://www.google.al/search?*",
  "*://www.google.am/search?*",
  "*://www.google.co.ao/search?*",
  "*://www.google.com.ar/search?*",
  "*://www.google.as/search?*",
  "*://www.google.at/search?*",
  "*://www.google.com.au/search?*",
  "*://www.google.az/search?*",
  "*://www.google.ba/search?*",
  "*://www.google.com.bd/search?*",
  "*://www.google.be/search?*",
  "*://www.google.bf/search?*",
  "*://www.google.bg/search?*",
  "*://www.google.com.bh/search?*",
  "*://www.google.bi/search?*",
  "*://www.google.bj/search?*",
  "*://www.google.com.bn/search?*",
  "*://www.google.com.bo/search?*",
  "*://www.google.com.br/search?*",
  "*://www.google.bs/search?*",
  "*://www.google.bt/search?*",
  "*://www.google.co.bw/search?*",
  "*://www.google.by/search?*",
  "*://www.google.com.bz/search?*",
  "*://www.google.ca/search?*",
  "*://www.google.cd/search?*",
  "*://www.google.cf/search?*",
  "*://www.google.cg/search?*",
  "*://www.google.ch/search?*",
  "*://www.google.ci/search?*",
  "*://www.google.co.ck/search?*",
  "*://www.google.cl/search?*",
  "*://www.google.cm/search?*",
  "*://www.google.cn/search?*",
  "*://www.google.com.co/search?*",
  "*://www.google.co.cr/search?*",
  "*://www.google.com.cu/search?*",
  "*://www.google.cv/search?*",
  "*://www.google.com.cy/search?*",
  "*://www.google.cz/search?*",
  "*://www.google.de/search?*",
  "*://www.google.dj/search?*",
  "*://www.google.dk/search?*",
  "*://www.google.dm/search?*",
  "*://www.google.com.do/search?*",
  "*://www.google.dz/search?*",
  "*://www.google.com.ec/search?*",
  "*://www.google.ee/search?*",
  "*://www.google.com.eg/search?*",
  "*://www.google.es/search?*",
  "*://www.google.com.et/search?*",
  "*://www.google.fi/search?*",
  "*://www.google.com.fj/search?*",
  "*://www.google.fm/search?*",
  "*://www.google.fr/search?*",
  "*://www.google.ga/search?*",
  "*://www.google.ge/search?*",
  "*://www.google.gg/search?*",
  "*://www.google.com.gh/search?*",
  "*://www.google.com.gi/search?*",
  "*://www.google.gl/search?*",
  "*://www.google.gm/search?*",
  "*://www.google.gr/search?*",
  "*://www.google.com.gt/search?*",
  "*://www.google.gy/search?*",
  "*://www.google.com.hk/search?*",
  "*://www.google.hn/search?*",
  "*://www.google.hr/search?*",
  "*://www.google.ht/search?*",
  "*://www.google.hu/search?*",
  "*://www.google.co.id/search?*",
  "*://www.google.ie/search?*",
  "*://www.google.co.il/search?*",
  "*://www.google.im/search?*",
  "*://www.google.co.in/search?*",
  "*://www.google.iq/search?*",
  "*://www.google.is/search?*",
  "*://www.google.it/search?*",
  "*://www.google.je/search?*",
  "*://www.google.com.jm/search?*",
  "*://www.google.jo/search?*",
  "*://www.google.co.jp/search?*",
  "*://www.google.co.ke/search?*",
  "*://www.google.com.kh/search?*",
  "*://www.google.ki/search?*",
  "*://www.google.kg/search?*",
  "*://www.google.co.kr/search?*",
  "*://www.google.com.kw/search?*",
  "*://www.google.kz/search?*",
  "*://www.google.la/search?*",
  "*://www.google.com.lb/search?*",
  "*://www.google.li/search?*",
  "*://www.google.lk/search?*",
  "*://www.google.co.ls/search?*",
  "*://www.google.lt/search?*",
  "*://www.google.lu/search?*",
  "*://www.google.lv/search?*",
  "*://www.google.com.ly/search?*",
  "*://www.google.co.ma/search?*",
  "*://www.google.md/search?*",
  "*://www.google.me/search?*",
  "*://www.google.mg/search?*",
  "*://www.google.mk/search?*",
  "*://www.google.ml/search?*",
  "*://www.google.com.mm/search?*",
  "*://www.google.mn/search?*",
  "*://www.google.ms/search?*",
  "*://www.google.com.mt/search?*",
  "*://www.google.mu/search?*",
  "*://www.google.mv/search?*",
  "*://www.google.mw/search?*",
  "*://www.google.com.mx/search?*",
  "*://www.google.com.my/search?*",
  "*://www.google.co.mz/search?*",
  "*://www.google.com.na/search?*",
  "*://www.google.com.ng/search?*",
  "*://www.google.com.ni/search?*",
  "*://www.google.ne/search?*",
  "*://www.google.nl/search?*",
  "*://www.google.no/search?*",
  "*://www.google.com.np/search?*",
  "*://www.google.nr/search?*",
  "*://www.google.nu/search?*",
  "*://www.google.co.nz/search?*",
  "*://www.google.com.om/search?*",
  "*://www.google.com.pa/search?*",
  "*://www.google.com.pe/search?*",
  "*://www.google.com.pg/search?*",
  "*://www.google.com.ph/search?*",
  "*://www.google.com.pk/search?*",
  "*://www.google.pl/search?*",
  "*://www.google.pn/search?*",
  "*://www.google.com.pr/search?*",
  "*://www.google.ps/search?*",
  "*://www.google.pt/search?*",
  "*://www.google.com.py/search?*",
  "*://www.google.com.qa/search?*",
  "*://www.google.ro/search?*",
  "*://www.google.ru/search?*",
  "*://www.google.rw/search?*",
  "*://www.google.com.sa/search?*",
  "*://www.google.com.sb/search?*",
  "*://www.google.sc/search?*",
  "*://www.google.se/search?*",
  "*://www.google.com.sg/search?*",
  "*://www.google.sh/search?*",
  "*://www.google.si/search?*",
  "*://www.google.sk/search?*",
  "*://www.google.com.sl/search?*",
  "*://www.google.sn/search?*",
  "*://www.google.so/search?*",
  "*://www.google.sm/search?*",
  "*://www.google.sr/search?*",
  "*://www.google.st/search?*",
  "*://www.google.com.sv/search?*",
  "*://www.google.td/search?*",
  "*://www.google.tg/search?*",
  "*://www.google.co.th/search?*",
  "*://www.google.com.tj/search?*",
  "*://www.google.tl/search?*",
  "*://www.google.tm/search?*",
  "*://www.google.tn/search?*",
  "*://www.google.to/search?*",
  "*://www.google.com.tr/search?*",
  "*://www.google.tt/search?*",
  "*://www.google.com.tw/search?*",
  "*://www.google.co.tz/search?*",
  "*://www.google.com.ua/search?*",
  "*://www.google.co.ug/search?*",
  "*://www.google.co.uk/search?*",
  "*://www.google.com.uy/search?*",
  "*://www.google.co.uz/search?*",
  "*://www.google.com.vc/search?*",
  "*://www.google.co.ve/search?*",
  "*://www.google.vg/search?*",
  "*://www.google.co.vi/search?*",
  "*://www.google.com.vn/search?*",
  "*://www.google.vu/search?*",
  "*://www.google.ws/search?*",
  "*://www.google.rs/search?*",
  "*://www.google.co.za/search?*",
  "*://www.google.co.zm/search?*",
  "*://www.google.co.zw/search?*",
  "*://www.google.cat/search?*",
];

export const GoogleModule: OnDiskModule = {
  description:
    "This module Captures a user search queries, search results, and links clicked by the user for Google",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 0,

  ads: {
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
    url_matches: ads,
    url_excludes: [],
    desktop: [
      {
        name: "displayFirstPageAd",
        title: "Display advertisement on Google first page",
        description: "This item add an advertisement to home page of Google",
        url_match: "*://www.google.com/",
        type: "embedded",
        is_enabled: true,
        size: {
          width: 980,
          height: 120,
        },
        selector: ".o3j99.qarstb",
      },
      {
        name: "displayFirstPageAd",
        title: "Display advertisement on Google first page",
        description: "This item add an advertisement to home page of Google",
        url_match: "*://www.google.com/?*",
        type: "embedded",
        is_enabled: true,
        size: {
          width: 980,
          height: 120,
        },
        selector: ".o3j99.qarstb",
      },
      {
        name: "displayResultPageAd",
        title: "Display advertisement on Google result page",
        description: "This item add an advertisement to result page of Google",
        url_match: "*://www.google.com/search?*",
        type: "embedded",
        is_enabled: true,
        size: {
          width: 300,
          height: 600,
        },
        selector: "#rhs",
      },
    ],
  },
  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "googleQuery",
        title: "Search Query",
        description:
          "This item collects all search queries that a user enter in Google search bar",
        is_enabled: true,
        hook: "webRequest",
        filter: {
          urls,
        },
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern: "*://www.google.*/search?*",
            pattern_type: MatchType.Wildcard,
            param: [
              {
                type: "query",
                key: "q",
                name: "query",
              },
              {
                type: "query",
                key: "tbm",
                name: "category",
                default: "web",
              },
              {
                type: "referrer",
                name: "link",
                default: "about:blank",
              },
            ],
            schems: [
              {
                jpath: "$.query",
                type: "text",
              },
              {
                jpath: "$.category",
                type: "text",
              },
              {
                jpath: "$.link",
                type: "url",
              },
            ],
          },
        ],
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
        name: "googleSearchResult",
        url_match: "*://www.google.*/search?*",
        description:
          "This item collects Google search results, search category, page number and corresponding search query",
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
            selector: ".g",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".yuRUbf a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".yuRUbf a h3",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".uEierd",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".v5yQqb a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".v5yQqb a .CCgQ5.vCa9Yd.QfkTvb.MUxGbd.v0nnCb",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".MUxGbd.yDYNvb.lyLwlc",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "input.gLFyf",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "td.YyVfkd",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".hdtb-mitem.hdtb-msel",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "googleClickedLink",
        url_match: "*://www.google.*/search?*",
        description:
          "This item collects links clicked by user from Google search result",
        title: "Clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".g",
            conditions: [
              [
                {
                  type: "ancestor",
                  contain: true,
                  val: ".g",
                },
              ],
            ],
            event_name: "click",
          },
          {
            selector: ".yuRUbf",
            conditions: [
              [
                {
                  type: "ancestor",
                  contain: true,
                  val: ".g",
                },
              ],
            ],
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
                selector: ".yuRUbf a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".yuRUbf a h3",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".g",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".yuRUbf a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".yuRUbf a h3",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".uEierd",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".v5yQqb a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".v5yQqb a .CCgQ5.vCa9Yd.QfkTvb.MUxGbd.v0nnCb",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".MUxGbd.yDYNvb.lyLwlc",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "input.gLFyf",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "td.YyVfkd",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".hdtb-mitem.hdtb-msel",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "googleAdsClickedLink",
        url_match: "*://www.google.*/search?*",
        description:
          "This item collects advertising links clicked by user from Google search result",
        title: "Ads clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".v5yQqb a",
            event_name: "mousedown",
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
                selector: ".v5yQqb a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".v5yQqb a .CCgQ5.vCa9Yd.QfkTvb.MUxGbd.v0nnCb",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".MUxGbd.yDYNvb.lyLwlc",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".g",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".yuRUbf a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".yuRUbf a h3",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".uEierd",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".v5yQqb a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".v5yQqb a .CCgQ5.vCa9Yd.QfkTvb.MUxGbd.v0nnCb",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".MUxGbd.yDYNvb.lyLwlc",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "input.gLFyf",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "td.YyVfkd",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".hdtb-mitem.hdtb-msel",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
    mobile: [
      {
        name: "googleSearchResult",
        url_match: "*://www.google.*/search?*",
        description:
          "This item collects Google search results, search category, page number and corresponding search query",
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
            selector: ".mnr-c.xpd.O9g5cc.uUPGi",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".KJDcUb a.C8nzq.BmP5tf",
                property: "href",
                name: "link",
                type: "text",
              },
              {
                selector: ".KJDcUb div .V7Sr0.p5AXld.PpBGzd.YcUVQe",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".BmP5tf div.MUxGbd.yDYNvb",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".mnr-c.O9g5cc.uUPGi",
            name: "adsResult",
            conditions: [
              [
                {
                  type: "child",
                  contain: true,
                  val: ".BUybKe",
                },
              ],
            ],
            index_name: "rank",
            properties: [
              {
                selector: "a.C8nzq.d5oMvf.BmP5tf",
                property: "href",
                name: "link",
                type: "text",
              },
              {
                selector: "a .MUxGbd.v0nnCb",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".BmP5tf .MUxGbd.yDYNvb",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "input.noHIxc",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".ZINbbc.xpd.O9g5cc.uUPGi.BmP5tf .SAez4c",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".Pg70bf span",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "googleClickedLink",
        url_match: "*://www.google.*/search?*",
        description:
          "This item collects links clicked by user from Google search result",
        title: "Clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".mnr-c.xpd.O9g5cc.uUPGi",
            event_name: "click",
          },
          {
            selector: ".mnr-c.xpd.O9g5cc.uUPGi",
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
                selector: ".KJDcUb a.C8nzq.BmP5tf",
                property: "href",
                name: "link",
                type: "text",
              },
              {
                selector: ".KJDcUb div .V7Sr0.p5AXld.PpBGzd.YcUVQe",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".mnr-c.xpd.O9g5cc.uUPGi",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".KJDcUb a.C8nzq.BmP5tf",
                property: "href",
                name: "link",
                type: "text",
              },
              {
                selector: ".KJDcUb div .V7Sr0.p5AXld.PpBGzd.YcUVQe",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".BmP5tf div.MUxGbd.yDYNvb",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".mnr-c.O9g5cc.uUPGi",
            name: "adsResult",
            conditions: [
              [
                {
                  type: "child",
                  contain: true,
                  val: ".BUybKe",
                },
              ],
            ],
            index_name: "rank",
            properties: [
              {
                selector: "a.C8nzq.d5oMvf.BmP5tf",
                property: "href",
                name: "link",
                type: "text",
              },
              {
                selector: "a .MUxGbd.v0nnCb",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".BmP5tf .MUxGbd.yDYNvb",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "input.noHIxc",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".ZINbbc.xpd.O9g5cc.uUPGi.BmP5tf .SAez4c",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".Pg70bf span",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "googleAdsClickedLink",
        url_match: "*://www.google.*/search?*",
        description:
          "This item collects advertising links clicked by user from Google search result",
        title: "Ads clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".mnr-c.O9g5cc.uUPGi",
            conditions: [
              [
                {
                  type: "child",
                  contain: true,
                  val: ".BUybKe",
                },
              ],
            ],
            event_name: "click",
          },
          {
            selector: ".mnr-c.O9g5cc.uUPGi",
            conditions: [
              [
                {
                  type: "child",
                  contain: true,
                  val: ".BUybKe",
                },
              ],
            ],
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
                selector: ".KJDcUb a.C8nzq.BmP5tf",
                property: "href",
                name: "link",
                type: "text",
              },
              {
                selector: ".KJDcUb div .V7Sr0.p5AXld.PpBGzd.YcUVQe",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".mnr-c.xpd.O9g5cc.uUPGi",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".KJDcUb a.C8nzq.BmP5tf",
                property: "href",
                name: "link",
                type: "text",
              },
              {
                selector: ".KJDcUb div .V7Sr0.p5AXld.PpBGzd.YcUVQe",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".BmP5tf div.MUxGbd.yDYNvb",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".mnr-c.O9g5cc.uUPGi",
            name: "adsResult",
            conditions: [
              [
                {
                  type: "child",
                  contain: true,
                  val: ".BUybKe",
                },
              ],
            ],
            index_name: "rank",
            properties: [
              {
                selector: "a.C8nzq.d5oMvf.BmP5tf",
                property: "href",
                name: "link",
                type: "text",
              },
              {
                selector: "a .MUxGbd.v0nnCb",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".BmP5tf .MUxGbd.yDYNvb",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "input.noHIxc",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".ZINbbc.xpd.O9g5cc.uUPGi.BmP5tf .SAez4c",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".Pg70bf span",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
