console.log("Browsing.js");
import {StorageHelper} from './StorageHelper.js';
import {Utils} from './Utils.js';
import {DataHandler} from './DataHandler.js';

var Browsing = (function() {
    'use strict';
    
    var callbacks = {};
    
    
    function inspectReferrer(moduleName,requestDetails) {
        //console.log(`inspectRequest: ${config.name} `, requestDetails);
        if(requestDetails.type != "main_frame" || !requestDetails.originUrl)
            return;
        console.log(requestDetails.url, requestDetails.originUrl);
        let message = {
			header:{
				function: "browsing",
				module: moduleName,
				collector: "inspectReferrer"
			},
			data: {
				out: {
					url: requestDetails.url,
					originUrl: requestDetails.originUrl		                                                
				},
				schems: [
					{jpath:"$.url",type:"url"},
					{jpath:"$.originUrl",type:"url"}
				]                    
			}  
		}			
		return message; 
	}

    function inspectVisit(moduleName,requestDetails) {
        //console.log(`inspectRequest: ${config.name} `, requestDetails);
        if(requestDetails.type != "main_frame" || !requestDetails.originUrl)
            return;		
        let message = {
			header:{
				function: "browsing",
				module: moduleName,
				collector: "inspectVisit"
			},			
			data:{
				out: {
					url: requestDetails.url,
				},
				schems: [
					{jpath:"$.url",type:"url"},
				]
			}				
		}
        return message;
    }
    
	function inspectRequest_patterns(moduleName, data, requestDetails) {
        for(var patt of data.patterns){
            var d = inspectRequest_pattern(moduleName, data.name, patt, requestDetails)
            if(d!=null && Object.keys(d) >0 ){
                // we suppose one of the methods will return a value
                return d
            }
        }
    }
    
    function inspectRequest_pattern(moduleName, data_name, patt, requestDetails) {
        if(requestDetails.method != patt.method){
            return null;
        }
        var failed = true;
        if(patt.pattern_type === "regex"){
            var res = requestDetails.url.match(patt.url_pattern);
            if(res!= null) 
                failed = false;
        }
        if(patt.pattern_type === "wildcard"){
            var res = Utils.wildcard(requestDetails.url, patt.url_pattern);
            if(res != null) 
                failed = false;
        }
        if(patt.pattern_type === "exact"){
            if(requestDetails.url == patt.url_pattern){
                failed = false;
            }
        }
        if(!failed){
            var retval = {};
            patt.param.forEach(p => {
                var val = null;
                if(p.type === "regex"){
                    val = res[p.group]
                }
                if(p.type === "form"){
                    val = requestDetails.requestBody.formData[p.key]
                }
                if(p.type === "query"){
                    val = (new URL(requestDetails.url)).searchParams.get(p.key)
                }
                if(val){
                    retval[p.name] = val
                }else{
                    if(p.default){
                        retval[p.name] = p.default
                    }
                }
            });
            if(Object.keys(retval).length == 0)
                return;
            let message = {
				header:{
					function: "browsing",
					module: moduleName,
					collector: "inspectRequest_pattern"
				},							
				data: {					
                        out: retval,
                        schems: [
                            {jpath:"$.query",type:"text"},
                            {jpath:"$.category",type:"text"},
                        ]
				}
            }
            return message;
        }
        return null;
    }
    
    
    function unload(){        
        StorageHelper.retrieveModules().then(modules => {for(var module in modules){
            unload_module(modules[module]);
        }});
    }

    function load(){
        StorageHelper.retrieveModules().then(modules => {for(var module in modules) {
            load_module(modules[module]);
        }});
    }
    
    function unload_module(module){
        if(module.functions.includes("browsing")){
            module.browsing.forEach(data=>{    
                if(browser.webRequest.onBeforeRequest.hasListener(callbacks[module.name+ "_" + data.name])){
                    browser.webRequest.onBeforeRequest.removeListener(callbacks[module.name+ "_" + data.name]);
                }
            });
        }
    }

	function hook_webrequest(module,data){
        callbacks[module.name + "_" + data.name] = function(x){
            let local_data = data;
            let retval = null;
            if(!local_data.target_listener || local_data.target_listener == "inspectRequest")
                retval = inspectRequest_patterns(module.name, local_data, x)
            if(local_data.target_listener == "inspectReferrer")
                retval = inspectReferrer(module.name,x)
            if(local_data.target_listener == "inspectVisit")
                retval = inspectVisit(module.name,x)
            if(retval != null)
                DataHandler.handle(retval);
        };
        if(!browser.webRequest.onBeforeRequest.hasListener(callbacks[module.name+ "_" + data.name])){
            // default for filter and extraInfo
            let filter = data.filter?data.filter:module.browsing_filter
            let extraInfoSpec = data.extraInfoSpec?data.extraInfoSpec:module.browsing_extraInfoSpec
            browser.webRequest.onBeforeRequest.addListener(callbacks[module.name+ "_" + data.name], filter, extraInfoSpec);
        }
    }
    
    function hook_bookmarks(module,data){
        var inspectBookmark = function(id, bookmark){
            DataHandler.handle({
                    header:{
                        function: "browsing",
                        module: module.name,
                        collector: "bookmark_create"                                
                    },
                    data: {
						out: {
							bookmark: bookmark
						},
						schems: [
							{jpath: "$.bookmark", type: "text"}
						]
                        
                    }
                });
        }
        if(!browser.bookmarks.onCreated.hasListener(inspectBookmark)){
            browser.bookmarks.onCreated.addListener(inspectBookmark);
        }
    }
    

	
    function load_module(module){
       if(module.functions.includes("browsing")){
            module.browsing.forEach(data=>{
                if(data.is_enabled)
                {
                    if(!data.hook || data.hook == "webrequest"){
                        hook_webrequest(module,data)
                    }
                    if(data.hook && data.hook == "bookmarks"){
                        hook_bookmarks(module,data)
                    }
                }                
            });
        }
    }
    
    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module
    };
}());
export {Browsing};