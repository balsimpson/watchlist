let list = [];
let lookup = {};
let genres = [];

// STATUS
let status;

const xhttpCall = (method, url, data) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // console.log(this.responseText);
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

const getGenres = (genre_array) => {

  for (let i = genre_array.length; i-- > 0;) {
    let key = genre_array[i].replace(/\s/g, '');
    // console.log('key', key)
    if (lookup[key] === key) {
      genre_array.splice(i, 1);
    }
    else {
      lookup[key] = key;
      genres.push(key);
    }
  }
  // console.log('genres', genres);
  return lookup;
}

const deleteItem = async (id) => {
  document.getElementById(id).remove();
  let url = `https://watchlist-9ebe.restdb.io/rest/saved/${id}`;
  let resp = await xhttpCall('DELETE', url);
  genres = [];
  lookup = {};
  console.log('deleted - ', resp.result[0]);
  for (let i = list.length; i-- > 0;) {
    let _id = list[i]._id;
    if (_id === id) {
      console.log('deleted - ', _id);
      list.splice(i, 1);
    } else {
      let _arr = list[i].Genre.split(',');
      getGenres(_arr);
    }
  }
  makeTags(genres);
}

const renderItem = (data) => {

  // console.log('data', data.Genre)
  let itemContainer = document.querySelector('.pop-list');

  let itemDiv = document.createElement('div');
  itemDiv.className = 'item';
  itemDiv.id = data._id;

  itemDiv.innerHTML = `
      <div class="poster">
          <img src=${data.Poster} alt="">
      </div>
      <div class="item-title">
          ${data.Title}
          <div class="item-genres">
              ${data.Genre}
          </div>
      </div>
      <button id=${data._id} class="close" aria-label="Close">×</button>
      `
  itemContainer.appendChild(itemDiv);

  // Delete Item
  itemDiv.addEventListener('click', e => {
    // console.log(e.target.id, 'deleted');
    deleteItem(e.target.id);
  })
}

// Check Status
let statusInput = document.getElementById('enabled');
statusInput.addEventListener('change', event => {
  console.log(event);
  // UPDATE STATUS
  status = statusInput.checked;

  let status_text = document.getElementById("status-txt");

  if (statusInput.checked) {
    document.addEventListener("mouseup", e => {
      console.log('removed');
    });
    status_text.textContent = 'ENABLED';
    status_text.style.color = '#B08E25';
  } else {
    document.removeEventListener("mouseup", e => {
      console.log('removed');
    });
    status_text.textContent = 'DISABLED';
    status_text.style.color = 'gray';
  }

  chrome.storage.sync.set({ data: { status: statusInput.checked } }, (result) => {
    console.log('Status: ' + statusInput.checked);
  });
});

const makeTags = (tags) => {
  let tagContainer = document.querySelector('.pop-tags');
  tags.forEach(tag => {
    let tagDiv = document.createElement('div');
    tagDiv.className = "tag";
    tagDiv.innerHTML = tag;
    tagContainer.appendChild(tagDiv);

    tagDiv.addEventListener('click', e => {
      console.log(e.target);
      console.log(list.length);
      document.querySelector('.pop-list').innerHTML = '';
      list.forEach(item => {
        console.log(item);
        let _genres = item.Genre.split(', ');
        let isShown = _genres.includes(e.target.innerText);

        if (isShown) {
          renderItem(item);
        }

      })
    })
  });
}

const getWatchlist = async () => {

  let url = "https://watchlist-9ebe.restdb.io/rest/saved";
  list = await xhttpCall('GET', url, null);
  // console.log('list', list);

  list.forEach(item => {
    // console.log('item', item);
    let _arr = item.Genre.split(',');
    getGenres(_arr);
    renderItem(item);
  })
  makeTags(genres);
}

chrome.storage.local.get(['data'], (result) => {
  console.log('status', result.data);
  let statusBtn = document.getElementById('enabled');

  if (result && result.data) {
    status = result.data.status;
    statusBtn.checked = status;
    console.log('status true', result.data.status);
  } else {
    status = true;
    statusBtn.checked = status;
    //  Save Status
    chrome.storage.local.set({ data: {status: true} }, (result) => {
			console.log('no result', result);
		});
  }
});

getWatchlist();