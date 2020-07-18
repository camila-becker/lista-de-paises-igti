let countries = null;
let favorites = null;
let countriesList = [];
let favoritesList = [];
let countCountries = 0;
let countFavorites = 0;
let totalCountryPopulation = 0;
let totalFavoritePopulation = 0;
let numberFormat = null;

window.addEventListener('load', () => {
    countries = document.querySelector('#countries');
    favorites = document.querySelector('#favorites');
    countCountries = document.querySelector('.count-countries'); 
    countFavorites = document.querySelector('.count-favorites');
    totalCountryPopulation = document.querySelector('.total-country');
    totalFavoritePopulation = document.querySelector('.total-favorites');
    numberFormat = Intl.NumberFormat('pt-BR');

    fetchCountries();
});

const fetchCountries = async () => {
    const response = await fetch('https://restcountries.eu/rest/v2/all');
    const json = await response.json();
    countriesList = json.map(country => {
        const {numericCode, translations, population, flag} = country
        return {
            id: numericCode,
            name: translations.pt,
            population,
            formattedPopulation: formatNumber(population),
            flag
        }
    });
    render();
};

const render = () => {
    renderCountryList();
    renderFavorites();
    renderSummary();

    handleCountryButtons();
};

const renderCountryList = () => {
    let countriesHTML = '<div>';
    countriesList.forEach(country => {
        const {name, flag, id, formattedPopulation} = country;
        const countryHTML = `
            <div class="container">
                <a id="${id}" class="add-button">+</a>
                <div>
                    <img class="flag" src="${flag}" alt="Bandeira do país ${name}"/>
                </div>
                <div>
                    <ul>
                        <li class="country-name">${name}</li>
                        <li class="country-population">${formattedPopulation}</li>
                    </ul>
                </div>
            </div>
        `;

        countriesHTML += countryHTML;
    });

    countriesHTML += "</div>"
    countries.innerHTML = countriesHTML
};

const renderFavorites = () => {
    let favoritesHTML = "<div>";

    favoritesList.forEach(country => {
        const {id, name, flag, formattedPopulation} = country;
        const favoriteCountryHTML = `
            <div class="container">
                <a id="${id}" class="remove-button">-</a>
                <div>
                    <img class="flag" src="${flag}" alt="Bandeira do País ${name}"/>
                </div>
                <div>
                    <ul>
                        <li class="country-name">${name}</li>
                        <li class="country-population">${formattedPopulation}</li>
                    </ul>
                </div>
            </div>
        `;
        favoritesHTML += favoriteCountryHTML;
    });

    favoritesHTML += '</div>';
    favorites.innerHTML = favoritesHTML;
};

const renderSummary = () => {
    countCountries.textContent = countriesList.length;
    countFavorites.textContent = favoritesList.length;

    const totalPopulation = countriesList.reduce((acc, curr) => {
        return acc + curr.population;
    }, 0);

    const totalFavorite = favoritesList.reduce((acc, curr) => {
        return acc + curr.population;
    }, 0);

    totalCountryPopulation.textContent = formatNumber(totalPopulation);
    totalFavoritePopulation.textContent = formatNumber(totalFavorite);
};

const handleCountryButtons = () => {
    const countryButtons = Array.from(countries.querySelectorAll('.add-button'));
    const favoriteButtons = Array.from(favorites.querySelectorAll('.remove-button'));

    countryButtons.forEach(button => {
        button.addEventListener('click', () => addToFavorites(button.id));
    });

    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => removeFromFavorites(button.id));
    });
};

const addToFavorites = (id) => {
    const countryToAdd = countriesList.find(country => country.id === id);
    favoritesList = [...favoritesList, countryToAdd];
    favoritesList.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    countriesList = countriesList.filter(country => country.id !== id);

    render();
};

const removeFromFavorites = (id) => {
    const countryToRemove = favoritesList.find(country => country.id === id);
    countriesList = [...countriesList, countryToRemove];
    countriesList.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    favoritesList = favoritesList.filter(country => country.id !== id);

    render();
};

const formatNumber = (number) => {
    return numberFormat.format(number);
}