console.log("modules/surfing/manifest.js");
import {AllModules} from '../../modules.js';
var Surfing = (function() {
    'use strict';
    
    return {
        name: "surfing",
        description: "This module configure general surfing configuration of surf-streamr",
        path: "/surfing",
        URL: ["https://authsaz"],
        functions: ["browsing"],
		viewGroups: [
			{
				name: "UX",
				title: "User Experience"
			}
		],
        is_enabled: false,
        privacy_level: 3,
        status: "enabled",
        icons: ["data:image/png;base64,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","",""],
        version: 1,
        changelog: [],
		style: {mainColor:"4285F4", fontColor:"fff"},
		type: "builtin",
		is_verified: false		

    };
}());
AllModules.push(Surfing);
export {Surfing};