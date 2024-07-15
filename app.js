'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Let's go der Hase!
    console.info('%cmade with ♥ Mike Pridik', 'background: rgb(43,84,124); color:#fff;padding: 3px');

    // All needed DOM elements
    const weatherLocation = document.querySelector('#ort');
    const weatherCurrentTime = document.querySelector('#zeit');
    const weatherIcon = document.querySelector('#main > i');
    const weatherText = document.querySelector('#main > strong');
    const weatherCurrentTemp = document.querySelector('#temp');
    const weatherTempHighLow = document.querySelector('#temp-highlow');
    const weatherWindToday = document.querySelector('#wind strong');
    const weatherRainToday = document.querySelector('#regen strong');
    const weatherHumidityToday = document.querySelector('#feuchte strong');
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=52.3193&longitude=10.2352&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1&models=best_match';

    async function fetchWeatherData() {
        try {
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            return data;

        } catch (error) {
            console.error('Fehler beim Abrufen der Wetterdaten:', error);
        }
    }

    fetchWeatherData()
        .then(data => {
            renderCurrentWeather(data);
        })
        .catch(error => {
            console.error('Fehler beim Abrufen der Wetterdaten:', error);
        });
    
    function returnCurrentWeatherCode(data) {
        const wmo = data.current.weather_code;
    
        // 0 Clear sky
        if (wmo === 0) {
            weatherText.textContent = `Sonnig`;
            weatherIcon.className = 'icon txt-shadow climacon sun';
        }
    
        // 1, 2, 3 Mainly clear, partly cloudy, and overcast
        if (wmo === 1 || wmo === 2 || wmo === 3) {
            weatherText.textContent = `Eventuell leicht Bewölkt`;
            weatherIcon.className = 'icon txt-shadow climacon cloud sun';
        }
    
        // 45, 48 Fog and depositing rime fog
        if (wmo === 45 || wmo === 48) {
            weatherText.textContent = `Nebel`;
            weatherIcon.className = 'icon txt-shadow climacon fog';
        }
    
        // 51, 53, 55 Drizzle: Light, moderate, and dense intensity
        if (wmo === 51 || wmo === 53 || wmo === 55) {
            weatherText.textContent = `Nieselregen`;
            weatherIcon.className = 'icon txt-shadow climacon drizzle';
        }
    
        // 56, 57 Freezing Drizzle: Light and dense intensity
        if (wmo === 56 || wmo === 57) {
            weatherText.textContent = `Gefrierender Nieselregen`;
            weatherIcon.className = 'icon txt-shadow climacon drizzle';
        }
    
        // 61, 63, 65 Rain: Slight, moderate and heavy intensity
        if (wmo === 61 || wmo === 63 || wmo === 65) {
            weatherText.textContent = `Regen`;
            weatherIcon.className = 'icon txt-shadow climacon rain';
        }
    
        // 66, 67 Freezing Rain: Light and heavy intensity
        if (wmo === 66 || wmo === 67) {
            weatherText.textContent = `Gefrierender Nieselregen`;
            weatherIcon.className = 'icon txt-shadow climacon rain';
        }
    
        // 71, 73, 75 Snow fall: Slight, moderate, and heavy intensity
        if (wmo === 71 || wmo === 73 || wmo === 75) {
            weatherText.textContent = `Schneefall`;
            weatherIcon.className = 'icon txt-shadow climacon snow';
        }
    
        // 77 Snow grains
        if (wmo === 77) {
            weatherText.textContent = `Starker Schneefall`;
            weatherIcon.className = 'icon txt-shadow climacon snowflake';
        }
    
        // 80, 81, 82 Rain showers: Slight, moderate, and violent
        if (wmo === 80 || wmo === 81 || wmo === 82) {
            weatherText.textContent = `Regenschauer`;
            weatherIcon.className = 'icon txt-shadow climacon rain';
        }
    
        // 85, 86 Snow showers slight and heavy
        if (wmo === 85 || wmo === 86) {
            weatherText.textContent = `Schneefall`;
            weatherIcon.className = 'icon txt-shadow climacon snowflake';
        }
    
        // 95 * Thunderstorm: Slight or moderate
        if (wmo === 95) {
            weatherText.textContent = `Sturm`;
            weatherIcon.className = 'icon txt-shadow climacon tornado';
        }
    
        // 96, 99 * Thunderstorm with slight and heavy hail
        if (wmo === 96 || wmo === 99) {
            weatherText.textContent = `Gewitter mit leichtem und schwerem Hagel`;
            weatherIcon.className = 'icon txt-shadow climacon tornado';
        }
    
    }

    function sanitazeDateTime(data) {

        const renderTime = data.current.time;
        const date = new Date(renderTime);

        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        // Formatiere das Datum und die Zeit
        const formattedDate = date.toLocaleDateString('de-DE', options);

        // Ausgabe des formatierten Datums und der formatierten Zeit
        return formattedDate;
    }
    
    function renderCurrentWeather(data) {

        const LocationUrl = `https://nominatim.openstreetmap.org/reverse?lat=${data.latitude}&lon=${data.longitude}&format=json`;

        fetch(LocationUrl)
            .then(response => response.json())
            .then(dataLocation => {
                weatherLocation.textContent = `${ dataLocation.address.town }` ;
            // Hier kannst du data.display_name verwenden, um den Ort anzuzeigen
            // Zum Beispiel: document.getElementById('ort').innerHTML = data.display_name;
            })
            .catch(error => {
                console.error('Fehler beim Abrufen der Daten:', error);
            });

        weatherCurrentTime.textContent = sanitazeDateTime(data);
        returnCurrentWeatherCode(data);
        weatherCurrentTemp.textContent = data.current.temperature_2m;
        weatherTempHighLow.innerHTML = `
            <span>L: ${data.daily.temperature_2m_min}°C</span>
            <span>H: ${data.daily.temperature_2m_max}°C</span>
            `;
        weatherWindToday.textContent = `${data.current.wind_speed_10m} km/h`;
        weatherRainToday.textContent = `${data.current.precipitation} %`;
        weatherHumidityToday.textContent = `${data.current.relative_humidity_2m} %`;

        
    }

});