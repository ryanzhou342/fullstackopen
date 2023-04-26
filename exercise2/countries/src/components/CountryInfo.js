const CountryInfo = ({ country, weather }) => {
  if (country == null) {
    return null;
  }
  
  console.log(weather);
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {[country.capital]}</p>
      <p>area {country.area}</p>
      <div>
        <strong>languages:</strong>
        <ul>
          {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
      </div>
      <img src={country.flags.png} alt={country.flags.alt}/>
      <h2>Weather in {country.capital}</h2>
      <p>temperature {(weather.list[0].main.temp - 273.15).toFixed(2)} Celsius</p>
      <img src={weather.list[0].weather[0].icon} alt={weather.list[0].weather[0].description}/>
      <p>wind {weather.list[0].wind.speed} m/s</p>
    </div>
  )
}

export default CountryInfo;