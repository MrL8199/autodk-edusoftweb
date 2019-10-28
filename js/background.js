chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "https://www.facebook.com/kenny.nguyen.153"});
	chrome.tabs.create({url: "https://nguyenlinhuet.wordpress.com"});
});