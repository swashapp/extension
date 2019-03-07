export const ManualResource = [`
###  What is Surf-Streamr
Surf-Streamr is a browser extension that can capture user browsing activities and listen to events on the web pages. Actually, Surf-Streamr is not just a browser extension and It can call APIs on behalf of the user and send this data to streamr to monetize it.
`,`###  Surf-Streamr modules
Surf-Streamr is a modular extension and currently, it provides 5 important modules: Search engine module, Facebook, Amazon, Twitter, and youtube modules.

----
#### Search Engines
search engine module supports 6 top search engines: Google, Bing, Yahoo, AOL, Ask, Baidu. In this module, the user can choose whether his searching queries could be streams to Streamr or not.
![](./images/search.png)

----
#### Facebook
The Facebook module is more complicated. This module can capture the user's data in three ways. firstly through a web request listener, secondly an injected javascript to facebook pages and thirdly through Facebook APIs. This module can capture the user's visited facebook pages. the user searches on Facebook. User books, videos, televisions, pages, and Other his interests can be captured using Facebook APIs. 
![](./images/facebook.png)

----
#### Amazon
Amazon is another interesting module that captures the user's visited pages and searches on Amazon. Moreover, all user's link clicks items added to cart, items ready to buy and items added to wishlist can be captured by this module.
![](./images/amazon.png)

----
#### Twitter
User's post tweet and searches, follow and unfollow actions, mute and unmute actions, likes, and retweets can be captured by twitter module.
![](./images/twitter.png)

----
#### Youtube
The last module we've implemented for Surf-Streamr is youtube module. In this module, the user can choose to sell his information about watched videoes, subscriptions, channels, playlists and his activities.
![](./images/youtube.png)

`,`###  Design Challenges
implementing such a product was not as simple as we thought at the beginning of the development. There were some challenges that we faced during the design phase.

the most important challenge was about user privacy. Along with user concert about privacy, complying with standards like GDPR is a challenge for our product.

Another challenge was about information disclosure. As you know some web applications put their security parameters in URL parameters or URL path-name. So if the user chooses to send such a URL to Streamr it would be a security breach and some malicious data buyers may use this information to compromise user. 

As we would like to provide user's privacy, we shouldn't send any identity-related data to Streamr. some data buyers may like to communicate to the user after performing an analysis on the user's data. Creating a communication channel in which provide user's privacy is another challenge we faced during the design phase.

most of the data capturing mechanism in our product depend on the way that the target web site has been designed and any changes in their site will affect our product. So by considering the limitation of browser extensions, designing the product in a way that it would update itself automatically, was another challenge. 

One other most important challenges for this project were data authenticity and integrity. distinguishing a fake generated data from real user's data is very difficult and in some scenarios, it may be impossible.

To tackle these challenges, we came up with some mechanisms that can be improved with the help of Streamr team and community.
`,`###  Privacy model
We designed a simple privacy model as you see in the table shown below.

| | No Privacy | Low Privacy | Medium Privacy | High Privacy | Very High Privacy|
|:--------:|:---------------:|:---------------:|:---------------:|:---------------:|:---------------:|
|URL|No changes|Remove params value|Mask path name|x|Remove path name|
|Time|No changes|Remove minutes|Remove hours|Remove days|x|
|TimeString|No changes|Remove minutes|Remove hours|Remove days|x|
|Text|No changes|Mask user info in a given text|Remove user info from the text|Remove texts that has user info|x|
|Id|No changes|Global masking|Per module masking|x|Nullify|
|UserInfo|No changes|Global masking|Per module masking|x|Nullify|
|UserAttr|No changes|Global masking|Per module masking|x|Nullify|

The first column of the table shows types that we identified so far and the first row of the table shows privacy levels that we have defined for our product. 
At the lowest level, we assuring no privacy. 
In Low Privacy Level we nullify all parameters in URLs, reduce time precision by removing minutes from time and mask user info in all texts. 
In Medium Privacy Level, we Mask URL path names, reduce time precision by removing hours from time and for texts we remove user information from texts.
In Medium High Level, we remove URL path names, remove days from the time and remove all texts that have user's information.
`,`###  Information Disclosure
to prevent information disclosure we designed a filtering mechanism that uses a regular expression, wildcard, and exact matching method to filter all data that contain blacklist patterns.
`,`###  Two way Communication
as we said before, data buyer may like to have a way to communicate with data owner without user privacy violation. we provide two mechanisms for this purpose. a simple mechanism is using an email address that does not reveal user identity. 
The second mechanism that we have implemented is a push mechanism. In this mechanism, we generate a push-id for every user of community product and the user can share its push-id with data buyers by enabling push mechanism. We created a separate stream for push mechanism. data buyers can push data to this stream. Every instance of our community product that its push mechanism is enabled can receive its corresponding messages. 
`,`###  Surf-Streamr engine
The picture shown in this slide, summarize our idea about Surf-Streamr engine. 

![](./images/engin.png)

At the lowest layer, each module gathers a specific type of data and pass it to the User Consent Policy layer. The second layer checks whether this data comply with user consent policy. if data complies forward it to the upper layer. In third layer data filters refine data and pass only data that are not in blacklist filters. In the upper layer User, Privacy Level applies to data and based on the privacy level that has been chosen by the user, the only data that comply with the policy level will be passed to the Streamr.
`,`###  What makes us different?
If we want to compare the way we collect data and the way giant data collectors, collect data, we can mention these cases:
Firstly, unlike giant data collectors, we ask the user to approve every data we would send to Streamr.
then, By using Surf-Streamr, the user gets paid for every data he provides to sell, but giant data collector never shares revenue of selling data.
next, Surf-Streamr never reveals user identity unless he gives permission for this, but user identity is known for the giant data collector.
also, we are not limited to data regarding a specific business and we can collect a combination of user's data that none of these companies have all these data together.
As we are on the user side, we can collect some other interesting data that giant data collectors have not to access.

| Giant data collectors | Surf-Streamr |
| --------------------------------- | --------------------------------- |
|User is not asked to provide a consent|We ask user to approve every data we want to send|
|User will not get paid for his own data|User get paid for  every data he provides to sell|
|User identity is known for giant data collectors|We never reveal user identity unless he gives permission for this|
|Every data collector has user data regarding their business|We collect a combination of user data|
|Data collectors can just collect user data that has been sent to them|We are in the user side and we can collect more data|

`]
 