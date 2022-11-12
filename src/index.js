import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const textBox = document.querySelector('#search-box');
const DEBOUNCE_DELAY = 300;
const debounced = debounce(inputHandler, DEBOUNCE_DELAY);

textBox.addEventListener('input', debounced);

function inputHandler() {
  const searchQuery = textBox.value;  
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (searchQuery.trim() === '') {
    return;
  }

  fetchCountries(searchQuery.trim())
    .then(posts => renderPosts(posts))
    .catch(error => console.log(error));
}

function renderPosts(posts) {  
  if (posts.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  const markupList = posts
    .map(({ name, flags}) => {      
      return `<li> <img src="${flags.svg}" alt="Flag of ${name.official}"> <span>${name.official}</span>            
        </li>`;
    })
    .join('');
  countryList.innerHTML = markupList;

  if (posts.length === 1) {
    document.querySelector('img').classList.add('big--img');
    document.querySelector('span').classList.add('big--font');
    const markupInfo = posts
      .map(({ capital, population, languages }) => {   
        const langString = Object.values(languages).join(', ');

        return `<p> <b>Capital</b>: ${capital}</p>
        <p> <b>Population</b>: ${population}</p>
        <p> <b>Languages</b>: ${langString}</p>`;
      })
      .join('');
    countryInfo.innerHTML = markupInfo;
  }
}
