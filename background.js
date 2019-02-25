console.log('background.js');
chrome.browserAction.onClicked.addListener(e => {
	console.log('button clicked');
});

chrome.contextMenus.onClicked.addListener(onClickHandler);

function onClickHandler(info, tab) {
	console.log('info', info);
	console.log('tab', tab);
	if (info.selectionText) {
		getDetails(info.selectionText);
	}
}

chrome.runtime.onInstalled.addListener(function () {
	// Create one test item for each context type.
	// var contexts = ["selection", "link"];
	// for (var i = 0; i < contexts.length; i++) {
	// 	var context = contexts[i];
	// 	var title = "Add to Watchlist";
	// 	var id = chrome.contextMenus.create({
	// 		"title": title, "contexts": [context],
	// 		"id": "context" + context
	// 	});
	// 	console.log("'" + context + "' item:" + id);
	// }var title = "Add to Watchlist";
	var id = chrome.contextMenus.create({
		"title": 'Add to Watchlist', "contexts": ['all'],
		"id": "context"
	});
	console.log("'" + 'context' + "' item:" + id);
});

const xhttpCall = (method, url, data) => {
	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4) {
				console.log(this.responseText);
				return resolve(JSON.parse(this.responseText));
			}
		});

		xhr.open(method, url);
		xhr.setRequestHeader("content-type", "application/json");
		xhr.setRequestHeader("x-apikey", "5c693ebfad19dc08b020d4dd");
		xhr.setRequestHeader("cache-control", "no-cache");

		xhr.send(JSON.stringify(data));
	});
}

chrome.storage.local.get(['data'], (result) => {
	console.log('status', result.data);

	if (result.data) {
		console.log('result', result.data);
		list = result.data.list || [];
		// listenForSelection();
	} else {
		chrome.storage.local.set({ data: { status: true } }, (result) => {
			console.log('no result', result);
			// listenForSelection();
		})
	}
});

const addToDB = async (info) => {
	console.log(info);
	list.unshift(info);
	chrome.storage.local.set(
		{
			data: {
				status: true,
				list: list
			}
		}, (result) => {
			console.log('ADDED', result);
		})
}


const getDB = () => {
	chrome.storage.local.get(['data'], (result) => {
		console.log('GOT DATA', result.data);
	})
}


const addCSS = () => {
	let myStringOfstyles = `
	:root {
		--primary-0: #E3B117;
		--primary-1: #FFDC72;
		--primary-2: #EFC646;
		--primary-3: #B2890A;
		--primary-4: #8B6900;
  
		--secondary-0: #185B92;
		--secondary-1: #5586AF;
		--secondary-2: #356C9A;
		--secondary-3: #0E4573;
		--secondary-4: #05335A;
  
		--gray: #333333;
		--light-gray: rgba(255, 255, 255, .6);
		--lighter-gray: rgba(255, 255, 255, .4);
		--dark-gray: #1B1B1B;
		--darker-gray: #1D1D1D;
	}

	@import url(//fonts.googleapis.com/css?family=Oswald);
	  
	.popcontainer {
		font-family: 'Oswald', sans-serif;
		position: fixed;
		display: grid;
		grid-template-columns: 150px 1fr;
		top: 20px;
		right: 20px;
		width: 400px;
		align-items: center;
		background: radial-gradient(566.17px at 46.67% 14%, var(--darker-gray) 0%, var(--dark-gray) 100%);
		color: beige;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.45);
		border-radius: 10px;
		// min-height: 200px;
		// max-height: 200px;

		z-index: 10000;
	}

	.poster {
		/* position: absolute; */
		right: 0;
		// height: 200px;
		/* border-radius: 10px; */
		/* box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.45); */
	}

	.poster img {
		height: 100%;
		/* border-radius: 10px; */
	}

	.add-btn {
		position: absolute;
		/* transform: translateX(-50%); */
		font-size: .8em;
		bottom: 0px;
		height: 40px;
		border: 0px;
		color: aliceblue;
		width: 150px;
		background-color: green;
		cursor: pointer;
	}

	.add-btn:hover {
		background-color: darkgreen;
	}

	.info {
		padding: 1em;
	}

	.item-title {
		text-transform: uppercase;
		font-size: 16px;
		cursor: pointer;
		color: var(--primary-3);
		font-family: 'Oswald', sans-serif;
	  }
  
	.item-year {
		color: var(--lighter-gray);
	f	ont-family: 'Oswald', sans-serif;
	}

	.item-genres {
		font-family: 'Oswald', sans-serif;
		font-size: .8em;
		font-weight: 100;
		text-transform: uppercase;
		color: var(--light-gray);
		letter-spacing: .04em;
	}

	.item-duration {
		/* display: block; */
		padding-left: 8px;
		color: var(--secondary-1);
	}

	.item-plot {
		font-family: 'Lato', sans-serif;
		padding-top: 10px;
		color: var(--light-gray);
	}

	.title {
		display: block;
		font-size: 1.1em;
		font-weight: 700;
		padding: 0 20px;
		text-transform: uppercase;
		color: var(--primary-3);
		font-family: 'Oswald', sans-serif;
	}

	.plot {
		display: block;
		padding: 0 20px;
		font-size: 1em;
		overflow-y: scroll;
		/* max-height: 100px; */
	}

	.imdb-rating {
		position: absolute;
		top: 10px;
		left: 10px;
	}
	
	.other-rating {
		position: absolute;
		top: 10px;
		left: 100px;
	}
	
	.close-btn {
		position: absolute;
		top: 6px;
		right: 10px;
		color: white;
		cursor: pointer;
	}
	
	.close-btn:hover {
		color: yellow;
	}

	info a, a:visited, a:link {
		text-decoration: none;
		color: var(--primary-0);
	}
	
	`

	let head = document.getElementsByTagName('head')[0];
	let linkElement = document.createElement('link');
	linkElement.setAttribute('rel', 'stylesheet');
	linkElement.setAttribute('type', 'text/css');
	linkElement.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(myStringOfstyles));
	head.appendChild(linkElement);
}

// var newStyle = document.createElement('style');
// newStyle.appendChild(document.createTextNode("\
// @font-face {\
//     font-family: " + yourFontName + ";\
//     src: url('" + yourFontURL + "') format('yourFontFormat');\
// }\
// "));

// document.head.appendChild(newStyle);

function showInfo(result) {

	addCSS();
	result.Poster = result.Poster.replace('300', 150);

	let popupDiv = document.createElement('div');
	popupDiv.id = 'popcontainer';
	popupDiv.classList.add('popcontainer');
	popupDiv.innerHTML = `
	<div class="poster">
		<img src="${result.Poster}" alt="">
		<button class="add-btn">ADD TO WATCHLIST</button>
	</div>
	<div class="info">
		<div class="item-title">
			<a href="https://imdb.com/title/${result.imdbID}">${result.Title} </a>
			<span class="item-year">${result.Year}</span>
		</div>
		<div class="item-genres">
			${result.Genre}
			<span class="item-duration">
			<i class="fa fa-clock-o" aria-hidden="true"></i> ${result.Runtime}
			</span>
		</div>
		<div class="item-plot">
			${result.Plot}
		</div>
		<div class="imdb-rating">${result.imdbRating}</div>
		<div class="other-rating"></div>
	</div>
	<span class="close-btn" aria-label="Close">×</span>
	`

	// let elementWhereSelectionStart = window.getSelection().anchorNode;
	// let closestBlockElement = elementWhereSelectionStart.parentNode;
	// closestBlockElement.appendChild(popupDiv);
	document.body.appendChild(popupDiv);
	// Add non disturbing border to selected elements
	// For simplicity I've adding outline only for the start element
	// closestBlockElement.style.outline = '1px solid blue'

	// const timeout = setTimeout(() => {
	// 	document.body.removeChild(popupDiv);
	// 	now_showing = {};
	// }, 5000);

	// Add Event Listener
	let addButton = document.querySelector('.add-btn');

	addButton.addEventListener('click', event => {
		console.log('add button clicked');
		let addMsg = addToDB(result);
		addMsg.then(e => {
			console.log('added');
			addButton.innerHTML = 'ADDED';
			setTimeout(() => {
				document.body.removeChild(popupDiv);
				now_showing = {};
			}, 2000);
		});
	});


	document.querySelector('.popcontainer').addEventListener('mouseover', event => {
		console.log(event.target.classList);
		clearTimeout(timeout);
		// removeHandler();
	});
	// Close Modal
	document.querySelector('.close-btn').addEventListener('click', event => {
		console.log('e', event);
		now_showing = {};
		document.querySelector('.popcontainer').remove();
	});
}

// function removeHandler() {
// 	document.removeEventListener("mouseup", e => {
// 		console.log('removed');
// 	});
// }

// get data from OMDb
// http://www.omdbapi.com/?apikey=ba58d588&t=maisel
const getDetails = (selectedText) => {

	// let selectedText = window.getSelection();
	console.log('selectedText', selectedText);

	// if (selectedText.type == 'Range') {
		let url = `https://www.omdbapi.com/?apikey=ba58d588&t=${selectedText}`;

		let details = xhttpCall('GET', url);

		details.then(result => {
			now_showing = result;
			console.log('showing', now_showing);
			showInfo(result);
		});
	// }
}

// const handleEvent = (event) => {
// 	// removeHandler();
// 	if (now_showing.Title) {
// 		console.log('now showing', now_showing);
// 	} else {
// 		getDetails(event);
// 	}
// }