const KEY = "bc0619ae4e30462f89ddcb7c6b9498d2";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${KEY}&page=1`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
let currPage = 1;


const getClassByRate = (vote) => {
  if (vote >= 7.5) return "green";
  else if (vote >= 7) return "orange";
  else return "red";
};

const showMovies = (movies) => {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview,release_date } = movie;
    const releaseYear = release_date ? new Date(movie.release_date).getFullYear() : "";

    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.innerHTML = `
    <img
      src="${IMG_PATH + poster_path}"
      alt="${title}"
    />

    <div class="movieInfo">
      <h3>${title} (${releaseYear})</h3>
      <span class="${getClassByRate(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
      <h3>Overview</h3>
      ${overview}
    </div>
  `;
    main.appendChild(movieElement);
  });
};

const getMovies = async (url) => {
  try {
    const res = await fetch(`${url}&page=${currPage}`);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    showMovies(data.results);
    currPage++;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Initial fetch
getMovies(API_URL);

// Event listener for form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (searchTerm !== "") {
    await getMovies(SEARCH_API + searchTerm);
    search.value = "";
  } else {
    // Reload the page if the search term is empty
    history.go(0);
  }
});

const loadMore = document.getElementById('loadMore');
loadMore.onclick=()=>{
  getMovies(API_URL)
}

// ** Reload the page
document.querySelector('header h1').onclick=()=>{
  location.reload();
};
// fetch(API_URL)
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Error fetching data:', error));
