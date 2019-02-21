console.log("modules/amazon/manifest.js");
import {AllModules} from '../../modules.js';
var Amazon = (function() {
    'use strict';
    
    return {
        name: "amazon",
        description: "This module look through all the user activities on amazon and capture those activities that user have permitted",
        path: "/amazon",
        functions: ["browsing", "content"],
        URL: ["https://www.amazon.com/"],
        privacy_level: 3,
        status: "enabled",
        icons: ["","",""],
        version: 1,
        changelog: []
    };
}());
AllModules.push(Amazon);
export {Amazon};