import { AdsApi } from "@/core/data/apis/ads.api";
import { EarnApi } from "@/core/data/apis/earn.api";
import { PaymentApi } from "@/core/data/apis/payment.api";
import { StreamApi } from "@/core/data/apis/stream.api";
import { UserApi } from "@/core/data/apis/user.api";
import { StreamCategory } from "@/enums/stream.enum";
import { ConfigurationStorage } from "@/types/storage/configuration.type";

import { BathAndBodyWorksModule } from "./modules/beauty/bath-and-body-works.module";
import { FaberlicModule } from "./modules/beauty/faberlic.module";
import { OriflameModule } from "./modules/beauty/oriflame.module";
import { SephoraModule } from "./modules/beauty/sephora.module";
import { UltaModule } from "./modules/beauty/ulta.module";
import { SurfingModule } from "./modules/general/surfing.module";
import { YoutubeModule } from "./modules/music/youtube.module";
import { BbcModule } from "./modules/news/bbc.module";
import { CnnModule } from "./modules/news/cnn.module";
import { DailyMailModule } from "./modules/news/daily-mail.module";
import { GloboModule } from "./modules/news/globo.module";
import { MsnModule } from "./modules/news/msn.module";
import { UolModule } from "./modules/news/uol.module";
import { YahooNewsModule } from "./modules/news/yahoo-news.module";
import { YahooModule as YahooModule_News } from "./modules/news/yahoo.module";
import { AolModule } from "./modules/search/aol.module";
import { AskModule } from "./modules/search/ask.module";
import { BaiduModule } from "./modules/search/baidu.module";
import { BingModule } from "./modules/search/bing.module";
import { DuckDuckGoModule } from "./modules/search/duckduckgo.module";
import { GoogleModule } from "./modules/search/google.module";
import { YahooModule as YahooModule_Search } from "./modules/search/yahoo.module";
import { AmazonModule } from "./modules/shopping/amazon.module";
import { EbayModule } from "./modules/shopping/ebay.module";
import { EtsyModule } from "./modules/shopping/etsy.module";
import { FlipkartModule } from "./modules/shopping/flipkart.module";
import { TargetModule } from "./modules/shopping/target.module";
import { WalmartModule } from "./modules/shopping/walmart.module";
import { FacebookModule } from "./modules/social/facebook.module";
import { TwitterModule } from "./modules/social/twitter.module";

export const InitialConfiguration: ConfigurationStorage = {
  version: "6",

  apis: {
    ads: AdsApi,
    earn: EarnApi,
    payment: PaymentApi,
    streams: StreamApi,
    user: UserApi,
  },
  cloud_storages: {
    dropbox_client_key: "whddvse2klqvglx",
    google_drive_client_key:
      "1008037433533-fk4mar25609d75s1jv3pvohgfldtl8rj.apps.googleusercontent.com",
    timeout: 30000,
    token_ttl: 86400000,
  },
  modules: {
    [StreamCategory.BEAUTY]: {
      bathandbodyworks: BathAndBodyWorksModule,
      faberlic: FaberlicModule,
      oriflame: OriflameModule,
      sephora: SephoraModule,
      ulta: UltaModule,
    },
    [StreamCategory.GENERAL]: {
      surfing: SurfingModule,
    },
    [StreamCategory.MUSIC]: {
      youtube: YoutubeModule,
    },
    [StreamCategory.NEWS]: {
      bbc: BbcModule,
      cnn: CnnModule,
      dailymail: DailyMailModule,
      globo: GloboModule,
      msn: MsnModule,
      uol: UolModule,
      yahoo: YahooModule_News,
      yahooNews: YahooNewsModule,
    },
    [StreamCategory.SEARCH]: {
      aol: AolModule,
      ask: AskModule,
      baidu: BaiduModule,
      bing: BingModule,
      duckduckgo: DuckDuckGoModule,
      google: GoogleModule,
      yahoo: YahooModule_Search,
    },
    [StreamCategory.SHOPPING]: {
      amazon: AmazonModule,
      ebay: EbayModule,
      etsy: EtsyModule,
      flipkart: FlipkartModule,
      target: TargetModule,
      walmart: WalmartModule,
    },
    [StreamCategory.SOCIAL]: {
      facebook: FacebookModule,
      twitter: TwitterModule,
    },
  },
  unsplash: {
    endpoint:
      "https://d34s39bh8oxiy5.cloudfront.net/photos/random?count=20&orientation=landscape",
    threshold: 5,
    image: {
      q: "60",
      w: "1920",
      fm: "webp",
    },
  },
  update: {
    interval: 300000,
    last_revision: "0",
  },
};
