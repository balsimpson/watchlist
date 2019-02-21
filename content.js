console.log('content-script');
let now_showing = {};

let list = [];

chrome.storage.local.get(['data'], (result) => {
	console.log('status', result.data);

	if (result.data) {
		console.log('result', result.data);
		list = result.data.list || [];
		listenForSelection();
	} else {
		chrome.storage.local.set({ data: { status: true } }, (result) => {
			console.log('no result', result);
			listenForSelection();
		})
	}
});

const addToDB = async (info) => {
	console.log(info);
	list.push(info);
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
	.popcontainer {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		position: fixed;
		display: grid;
		grid-template-columns: 150px 1fr;
		
		top: 20px;
		right: 20px;
		width: 400px;
		align-items: center;
		background: radial-gradient(566.17px at 46.67% 14%, #1D1D1D 0%, #1B1B1B 100%);
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
		// padding: 1em 0;
	}

	.title {
		display: block;
		font-size: 1.1em;
		font-weight: 700;
		padding: 0 20px;
		text-transform: uppercase;
		// margin-top: 1.2em;
		margin-bottom: 10px;
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
	`

	let head = document.getElementsByTagName('head')[0];
	let linkElement = document.createElement('link');
	linkElement.setAttribute('rel', 'stylesheet');
	linkElement.setAttribute('type', 'text/css');
	linkElement.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(myStringOfstyles));
	head.appendChild(linkElement);
}

function showInfo(result) {

	addCSS();
	result.Poster = result.Poster.replace('300', 150);

	let popupDiv = document.createElement('div');
	popupDiv.id = 'popcontainer';
	popupDiv.classList.add('popcontainer');
	popupDiv.innerHTML = `
		<div class="poster">
			<img src="${result.Poster}"
				alt="">
			<button class="add-btn">ADD TO WATCHLIST</button>
		</div>
		<div class="info">
			<div class="title">${result.Title}</div>
			<div class="plot">${result.Plot}</div>
			<div class="imdb-rating">${result.imdbRating}</div>
			<div class="other-rating"></div>
		</div>
		<span class="close-btn" aria-label="Close">×</span>
	`

	let elementWhereSelectionStart = window.getSelection().anchorNode;
	let closestBlockElement = elementWhereSelectionStart.parentNode;
	// closestBlockElement.appendChild(popupDiv);
	document.body.appendChild(popupDiv);
	// Add non disturbing border to selected elements
	// For simplicity I've adding outline only for the start element
	// closestBlockElement.style.outline = '1px solid blue'

	// Add Event Listener
	let addButton = document.querySelector('.add-btn');

	addButton.addEventListener('click', event => {
		console.log('add button clicked');
		let addMsg = addToDB(result);
		addMsg.then(e => {
			console.log('added');
			addButton.innerHTML = 'ADDED';
		});
	});

	const timeout = setTimeout(() => {
		document.body.removeChild(popupDiv);
		now_showing = {};
	}, 5000);

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
const getDetails = (e) => {
	let url = `https://www.omdbapi.com/?apikey=ba58d588&t=${window.getSelection()}`;
	let details = xhttpCall('GET', url);

	details.then(result => {
		now_showing = result;
		console.log('showing', now_showing);
		showInfo(result);
	});
}

const handleEvent = (event) => {
	// removeHandler();
	if (now_showing.Title) {
		console.log('now showing', now_showing);
	} else {
		getDetails(event);
	}
}



function listenForSelection() {
	document.addEventListener('mouseup', handleEvent, false);
}
