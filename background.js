console.log('background.js');

const onClickHandler  = (info, tab) => {
	console.log('info', info);
	console.log('tab', tab);
	if (info.selectionText) {
		// getDetails(info.selectionText);
		console.log('do something. selected text is ', info.selectionText);
		chrome.tabs.sendMessage(tab.id, {text: info.selectionText}, e => {
			console.log('sending message', info.selectionText);
			return Promise.resolve("Dummy response to keep the console quiet");
		});
	}
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		"title": 'Add to Watchlist', "contexts": ['all'],
		"id": "context"
	});
	console.log("Added context menu");
});