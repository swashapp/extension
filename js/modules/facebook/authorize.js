console.log("modules/facebook/authorize.js");
import {Facebook} from './manifest.js';
import {ApiCall} from '../../functions/ApiCall.js';
Facebook.apiConfig = {
    redirect_url: "",
    client_id: "355488065290314",
    api_endpoint: "https://graph.facebook.com/v3.2",
    auth_url: 'https://www.facebook.com/v3.2/dialog/oauth',
	access_token_regex: "access_token=([^&]*)",
	scopes: ["email","user_birthday","user_hometown","user_location"]
}



Facebook.validate_token = {
    name: "validate_token",
    description: "",
    method: "GET",
    endpoint: "https://graph.facebook.com/v3.2",
    URI: "/debug_token",
    content_type: "application/x-www-form-urlencoded",
    permissions: ["email","user_birthday","user_hometown","user_location"],
    token_param_name:"input_token",
    response_type: "json",
    required_jpath:"$.data.user_id",
}

function fbBatchCall(apiInfoList)
{
	let gettingItem = retrieveData(config.name);
	gettingItem.then(item => {
		access_token = item[config.name].tokenInfo.token;
		endpoint = config.apiConfig.api_endpoint;
		var batch = [];
		for(apiInfo of apiInfoList)
		{
			switch(apiInfo.method)
			{
				case "GET":
					item = {
						method: apiInfo.method,
						relative_url: apiInfo.URI.concat("?", serialize(apiInfo.params))			
					}	
					break;
				case "POST":
					item = {
						method: apiInfo.method,
						relative_url: apiInfo.URI,
						body: serialize(apiInfo.params)
					}
					break;
				default:
			}
			batch.push(item);			
		}
		aInfo = {
			method: "POST",
			URI: "/",
			content_type: "application/x-www-form-urlencoded",
			params: {
				batch: JSON.stringify(batch)
			}
		}
		apiCall(endpoint, aInfo, access_token).then(verifyBatchResponse).then(resp => console.log(resp));				
	})	
}

function verifyBatchResponse(response) {
	return new Promise((resolve, reject) => {
		if (response.status != 200) {
			reject("Token validation error");
		}
		response.json().then((json) => {				
			resolve(json.data);
		});
	});	
}