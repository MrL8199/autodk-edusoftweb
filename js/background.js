chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "https://www.facebook.com/nguyenlinh.uet"});
	chrome.tabs.create({url: "https://nguyenlinhuet.wordpress.com"});
});