// Jokes 🤍💜

const API = `https://api.chucknorris.io/jokes`;

const getFile = url => fetch(url).then(response => response.ok ? response.json() : Promise.reject(response.status));

const jokeForm = document.querySelector(`#jokeForm`);
const jokesContainer = document.querySelector(`#jokesContainer`);
const jokesContainerFavourite = document.querySelector(`#jokesContainerFavourite`);

jokeForm.addEventListener(`submit`, e=>{
    e.preventDefault();

    let type = e.target.querySelector(`input[name="jokeType"]:checked`).value;

    let url = API;

    switch(type){
        case `random`:
            url += `/random`;
            break;
        case `categories`:
            let checkedCategory = document.querySelector(`input[name="jokeCategory"]:checked`).value;
            url += `/random?category=${checkedCategory}`;
            break;
        case `search`:
            let jokeSearch = document.querySelector(`#jokeSearch`).value;
            if(jokeSearch.length<3 || jokeSearch.length>120){
                alert(`размер должен быть между 3 и 120`);
                return;
            }
            url += `/search?query=${jokeSearch}`;
            break;
    }

    getFile(url)
        .then(data => data.result ? data.result.forEach(joke => renderJoke(joke)) : renderJoke(data))
        // .then(() => !jokesContainer.classList.contains(`full`) && jokesContainer.classList.add(`full`))
        .catch(err => console.log(err));
});

// renderJoke

const renderJoke = (joke, container=jokesContainer) => {
    let jokeBlock = document.createElement(`div`);
    jokeBlock.className = `joke`;
    jokeBlock.dataset.id = joke.id;

    let category = ``;
    if(joke.categories.length){
        category = `<p>Category: ${joke.categories.map(item => `<strong>${item}</strong>`).join(`, `)}</p>`;
    }
    
    jokeBlock.innerHTML = `<h3>${joke.value}</h3>
    ${category}`;

    let favBtn = document.createElement(`button`);
    favBtn.innerHTML = joke.favourite ? `💜` : `🤍`;
    favBtn.dataset.id = joke.id;
    favBtn.dataset.favourite = joke.favourite ? `true` : `false`;
    
    favBtn.addEventListener(`click`, () => {
        let storageJokes = localStorage.getItem(`jokes`) ? JSON.parse(localStorage.getItem(`jokes`)) : [];

        if(favBtn.dataset.favourite === `false`){
            // add to fav
            favBtn.dataset.favourite = `true`;
            favBtn.innerHTML = `💜`;

            joke.favourite = true;
            storageJokes.push(joke);
            renderJoke(joke, jokesContainerFavourite);
        } else{
            // remove from fav
            let storageJokeIndex = storageJokes.findIndex(item => item.id === joke.id);
            storageJokes.splice(storageJokeIndex, 1);

            

            jokesContainerFavourite.querySelector(`.joke[data-id="${joke.id}"]`).remove();

            let jokeFavBtn = jokesContainer.querySelector(`button[data-id="${joke.id}"]`);
            if(jokeFavBtn){
                jokeFavBtn.dataset.favourite = `false`;
                jokeFavBtn.innerHTML = `🤍`;
            }
        }

        localStorage.setItem(`jokes`, JSON.stringify(storageJokes));
    })
    
    jokeBlock.prepend(favBtn);

    container.append(jokeBlock);
}
// renderJoke

// jokeCategories
const jokeCategories = document.querySelector(`#jokeCategories`);

getFile(API+`/categories`)
    .then(categories => {
        jokeCategories.innerHTML = categories
            .map((category, index) => `<li>
                <label>
                    ${category} <input type="radio" name="jokeCategory" value="${category}" ${!index ? `checked` : ``}>
                </label>
            </li>`)
            .join(``);
    })
    .catch(err => console.log(err));

// jokeCategories

// renderFavJokes
const renderFavJokes = () => {
    let storageJokes = localStorage.getItem(`jokes`) ? JSON.parse(localStorage.getItem(`jokes`)) : [];
    storageJokes.forEach(joke => renderJoke(joke, jokesContainerFavourite));
}
renderFavJokes();
// renderFavJokes