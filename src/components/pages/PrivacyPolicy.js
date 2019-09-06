export const PrivacyPolicy = `
###  Privacy Policy
Effective date: July 22, 2019

Surf-Streamr ("us", "we", or "our") operates the https://surf-streamr.com website (hereinafter referred to as the "Service").
This page informs you of our policies regarding the collection, use, and disclosure of browsing data when you use Surf-Streamr browser extension on Mozilla Firefox, Google Chrome, Microsoft Edge, and Brave browser. 
We use your data to provide a data union. The provided data has been put on Streamr marketplace for selling as a data product. By installing the Surf-Streamr extension, you agree to the collection and use of information in accordance with this policy.

###  Definitions
* **Streamr**:
Streamr is a crowdfunded open source project with contributors around the world. It provides a complete system to tokenize the value of real-time data to enable a new way for machines and people to trade it on a decentralised P2P network.
* **Add-on**:
Add-on is the Mozilla term for software modules that can be added to the Firefox web browser and related applications.
* **Extension**:
A browser extension is a small software module for customizing a web browser. Browsers typically allow a variety of extensions, including user interface modifications, ad blocking, and cookie management.
* **Surf-Streamr**: 
Surf-Streamr is a browser extension that collects your browsing activities and send them to a specific stream on Streamr network in order to aggregate browsing data as a data union for selling on Streamr marketplace.
* **data collector**:
A data collector is a peace of code in the Surf-Streamr extension that is responsible for collecting a specific data.
* **module**:
A Surf-Streamr module is a collection of some relevant data collectors that has been brought together to collect data regarding a specific domain and its subdomains.

###  How We Collect Information from You
Surf-Streamr is a browser extension for collecting and aggregating your browsing activities. This extension collects information about your browsing activities and gives you, ability to sell your data through Streamr Marketplace. 
There are two build for this extension, one for Firefox browser and the other for all chromium-based Browsers. The extension consists of some modules. Each module has some data collectors and each data collector is responsible for collecting a specific data regarding its module. A data collector collects data using one of these methods:
- Running a javascript code in the context of a specific page 
- Calling APIs on behalf of you
- Capturing requests sent to/responses received from a specific domain
- Reading your browser information

###  Information We Collect
Each module of Surf-Streamr collects several different type of information. For every data collector, there is a tooltip that indicate which data this collector may collect. We never ever collect a data unless we have a data collector for it and you are able to enable/disable each data collector separately.

###  What We do with the collected data
For every module we send all the collected data to a predefined stream on Streamr Network. A Community Product has been defined on Streamr marketplace to aggregate these data. We provided a pricing license for this Community Product. When we sell these aggregated data to a buyer, the revenue will be shared in this manner: 20% of the revenue will be taken by Community Product admin and 80% will be shared between the data owners.

###  Your Controls and Choices
We provide you with certain controls and choices regarding the data collected on your browser:
* **Enabling/Disabling Surf-Streamr**. You are able to enable/disable the Surf-Streamr extension. When the extension is disabled nothing will be collected by the extension.
* **Enabling/Disabling modules**. You are able to enable/disable each module of the Surf-Streamr separately. When a module is disabled none of its collectors will collect data.
* **Enabling/Disabling collectors**. You are able to enable/disable each collector of a module. When a collector is disabled it does not collect data.
* **Delay on sending data**. You are able to make custom delay on sending data. It helps you watch data before being sent to the stream and it gives you the ability to cancel any data sending action.
* **Text masking**. This feature allows you to actively mask specific text (characters, digits, single words or combination of them) within the data being captured and shared via the extension. This allows you to cover sensitive information that might be present, for example, within Facebook or Twitter posts or, less probable, search queries. One could for example add any variation of his/her own name, phone number, email, address, close people names etc. 
* **Exclude URLs**. This option allows you to specify which URLs you would like to exclude data collection for all modules. You can use different expressions to exclude exact matching URL, an entire subsection of a URL path or even more advanced rules. Rules applied for this feature will supersede any module's internal logic, so you can have peace of mind that anything applied correctly here will be followed by all modules

### Data Privacy
We provide you a privacy mechanism to ensure privacy of data getting collected by modules. The mechanism works based on the data type and the privacy level. Table below shows how the privacy mechanism transform data based on the data types.

| Data Type | No Privacy | Low Privacy | Medium Privacy | High Privacy | Very High Privacy|
|:--------:|:---------------:|:---------------:|:---------------:|:---------------:|:---------------:|
|URL|No changes|Remove params value|Global Masking path name|Per module masking path name|Remove path name|
|Time|No changes|Remove minutes|Remove hours|Remove days of month|Remove months|
|TimeString|No changes|Remove minutes|Remove hours|Remove days of month|Remove months|
|Text|No changes|Mask user info in a given text|Replace user info with star|Remove user info from the text|Remove texts that has user info|
|Id|No changes|hash|Global masking|Per module masking|Nullify|
|UserInfo|No changes|hash|Global masking|Per module masking|Nullify|
|UserAttr|No changes|hash|Global masking|Per module masking|Nullify|

The first column of the table shows different data types and the first row of the table shows the privacy levels. The privacy enforcement mechanism works as below:

###  Identity Privacy
For example, with a "High" privacy setting, your ID will be different across all modules (Amazon, Facebook, Search etc) so the data buyer cannot trace you across platforms. Additionally, within each module your ID will be changed with a new randomly generated ID every hour, so it will be hard to track user behavior for longer than 1 hour, instead of months or years of current industry practice like Google/Facebook. The reason why there are lower setting options is that from data buyer perspective, of course, the value of data will differ, so the plugin will allow users to decide whichever level they feel most comfortable with.

###  Use of Data
surf-streamr uses the collected data for various purposes:
* To provide and maintain the Service
* To notify you about changes to our Service
* To allow you to participate in interactive features of our Service when you choose to do so
* To provide customer care and support
* To provide analysis or valuable information so that we can improve the Service
* To monitor the usage of the Service
* To detect, prevent and address technical issues

###  Transfer of Data
The data has been collected by Surf-Streamr, may be transferred to - and maintained on - Streamr network nodes located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
Your consent to this Privacy Policy followed by your consent for collecting data in Surf-Streamr extension represents your agreement to that transfer.

###  Security of Data
Surf-Streamr is concerned about the security of your data. We have implemented technical security measures that are designed to help protect your information from unauthorized access, disclosure, use and modification. From time-to-time, we review our security procedures to consider appropriate new technologies and methods. 
Please be aware, though, that despite our efforts, no security measures are perfect or impenetrable. We cannot ensure, and do not warrant or guarantee, that the information you transmit to Surf-Streamr will remain secure, nor do we guarantee that this information will not be accessed, disclosed, altered, destroyed or used in an unauthorized manner. 
If we learn of a security breach, we may attempt to notify you electronically so that you can take appropriate protective steps. We may also post a notice on the Site or Surf-Streamr Services if a security breach occurs. Depending on where you live, you may have a legal right to receive a notice of a security breach in writing. 
###  Changes to This Privacy Policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

###  Contact Us
If you have any questions about this Privacy Policy, please contact us:
* By email: info@surf-streamr.com
* By visiting this page on our website: https://surf-streamr.com/contact
`