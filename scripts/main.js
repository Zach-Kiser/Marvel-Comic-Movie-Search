/* Marvel API Keys */
let privateKey = 'e2fbabcaf814a17939684c5c1bd37e0c1f659d4f';
let apiKey = 'd049928c32c64d309cf820f13f00d460';
let hash = '144c6297fc0785c2663aaf453be58ed7';
// let comicKey = '17d414164e376d5633cafd377b40de236ede54d4';
let movieKey = '7b5e30851a9285340e78c201c4e4ab99'

const searchForm = document.getElementById("top-search");
searchForm.onsubmit = (ev) => {
  console.log("submitted top-search with", ev);
  ev.preventDefault();
  const formData = new FormData(ev.target);

  const queryText = formData.get("query");
  console.log("queryText", queryText);

  let associatedComics = '';
  const characterResultsPromise = getCharacter(queryText);
  characterResultsPromise.then((characterResults) => {
    console.log(characterResults);
    console.log(characterResults.data.results[0]);
    const charListItemsArray = charObj2DOMObj(characterResults.data.results[0]);
    const charResultsUL = document.getElementById("rhyme-results");
    const newDiv = document.createElement("div");
    newDiv.innerText = "Comics They Were In:";
    charResultsUL.appendChild(newDiv);
    characterResults.data.results[0].events.items.forEach((comic) => {
      associatedComics = comic;
      let newDiv = document.createElement("button");
      newDiv.innerText = comic.name;
      newDiv.style.color = "white";
      newDiv.style.backgroundColor = "red";
      newDiv.onclick = () => getMovie(comic.name).then((movieResults) => {
        console.log(movieResults)
        const charResultsUL = document.getElementById("rhyme-results");
        charResultsUL.appendChild(document.createElement('div'));
        const img = document.createElement('img');
        img.src = `${movieResults.Poster}`;
        charResultsUL.appendChild(img);
        for(var i in movieResults){
          if (i !== 'Response' && i !== 'Poster' && i !== 'Ratings') {
          const span = document.createElement('div');
          span.innerHTML = i + ": " + movieResults[i];
          charResultsUL.appendChild(span);
          }
        };

      });
      charResultsUL.appendChild(newDiv);
      console.log(comic.name);
    });
    const newDiv2 = document.createElement("div");
    charResultsUL.appendChild(newDiv2);

    const newInput = document.createElement("input");
    newInput.id = 'filter';
    newInput.placeholder = 'Filter results by entering \'series\' or \'movie\''
    newInput.style.width = '40vw';
    charResultsUL.appendChild(newInput);
    console.log("charListItemsArray", charListItemsArray);
  });
};

const getCharacter = (character) => {
  console.log("attempting to get Character: ", character);
  return fetch(
    `https://gateway.marvel.com:443/v1/public/characters?name=${character}&ts=1&apikey=${apiKey}&hash=${hash}`
  ).then((resp) => resp.json());
};



const getMovie = (name) => {
  // fetch(`https://api.tvmaze.com/search/shows?q=:${name}`
  const filter = document.getElementById('filter').value;
  console.log(filter);
  return fetch(`https://www.omdbapi.com/?t=${name}&apikey=a98aa172&type=${filter}&r=json`
  ).then((resp) => resp.json())
    /*.then((result) => {
      console.log(result);
    });*/
}

const charObj2DOMObj = (charObj) => {
  const charListItem = document.createElement("li");
  const charDesc = document.createElement("div");
  let charImage = document.createElement("img");
  charImage.src = `${charObj.thumbnail.path}.jpg`;
  charDesc.textContent = charObj.description;
  charListItem.appendChild(charDesc);
  charListItem.appendChild(charImage);
  charListItem.display = 'flex';
  charListItem.flexDirection = "row";
  const charResultsUL = document.getElementById("rhyme-results");
  charResultsUL.appendChild(charListItem);
  return charListItem;
};
