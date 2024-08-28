const searchInput = document.querySelector(".information__details__input");
const searchBtn = document.querySelector(".information__details__btn__search");
const API_KEY = import.meta.env.VITE_API_KEY;

const getWeatherInfo = () => {
  const getLocation = () => {
    const locationInput = searchInput.value.trim();

    // If user input is empty or contains numbers, show an alert and exit
    if (!locationInput || /[0-9]/.test(locationInput)) {
      return alert("Please enter a valid location.");
    }

    // General Location API URL
    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=${API_KEY}`;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok for location search");
        }
        return res.json();
      })
      .then((data) => {
        if (!data || data.length === 0) {
          return alert(`Sorry, no coordinates were found for ${locationInput}`);
        }
        const { lon, lat } = data[0];
        getWeatherDetails(lon, lat);
      })
      .catch((error) => {
        console.error(
          "There was an error while trying to fetch the coordinates:",
          error
        );
      });
  };

  const getWeatherDetails = (lon, lat) => {
    // Forecast data API URL
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok for weather details");
        }
        return res.json();
      })
      .then((data) => {
        // Getting desired weather data
        const weatherData = {
          locationName: data.name,
          date: new Date().toLocaleDateString(),
          temp: data.main.temp,
          windSpeed: data.wind.speed,
          humidity: data.main.humidity,
          icon: data.weather[0].icon,
          description: data.weather[0].description,
        };
        updateWeatherCard(weatherData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the weather details:",
          error
        );
      });
  };

  const updateWeatherCard = (data) => {
    const weatherDetails = document.querySelector(".weather__details");
    // HTML for weather details
    const weatherHTML = `
      <div class="weather__details__text">
        <h2 class="weather__details__text__title">${data.locationName} (${data.date})</h2>
        <h4 class="weather__details__text__temperature">
          <i class="fa-solid fa-temperature-three-quarters"></i>: ${Math.floor((data.temp * 9) / 5 + 32)}° F
        </h4>
        <h4 class="weather__details__text__wind">
          <i class="fa-solid fa-wind"></i>: ${data.windSpeed} M/S
        </h4>
        <h4 class="weather__details__text__humidity">
          <i class="fa-solid fa-water"></i>: ${data.humidity}%
        </h4>
      </div>
      <div class="weather__details__icon__wrapper">
        <img
          src="https://openweathermap.org/img/wn/${data.icon}@2x.png"
          alt="${data.description}"
          class="weather__details__icon"
        />
        <h4 class="weather__details__icon__title">${data.description}</h4>
      </div>
    `;

    // Checks if weather details div exists, updates weather details section
    if (weatherDetails) {
      weatherDetails.innerHTML = weatherHTML;
    }
  };

  // On-screen search button click functionality
  searchBtn.addEventListener("click", () => {
    getLocation();
    searchInput.value = "";
  });

  // Enter key functionality
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action
      getLocation(); // Call the function
      searchInput.value = "";
    }
  });
};

export default getWeatherInfo;