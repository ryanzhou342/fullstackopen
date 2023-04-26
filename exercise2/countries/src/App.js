import { useState, useEffect } from 'react';
import axios from 'axios';
import Message from "./components/Message";
import CountryInfo from "./components/CountryInfo";
import CountryList from "./components/CountryList";

const App = () => {
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState(null);
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [countryToShow, setCountryToShow] = useState(null);
  const [weatherResponse, setWeatherResponse] = useState();

  const handleCountryChange = (event) => {
    event.preventDefault();
    setCountry(event.target.value);
  }

  const handleView = (c) => {
    setCountryToShow(c);
  }

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(response => response.data.filter(c => c.name.common.toLowerCase().includes(country.toLowerCase())))
      .then(countries => {
        if (country !== "") {
          console.log(countries);
          if (countries.length > 10) {
            setCountriesToShow([]);
            setMessage("Too many matches. Please specify another filter.");
            setCountryToShow(null);
          } else if (countries.length > 1) {
            setMessage(""); 
            setCountriesToShow(countries);
            setCountryToShow(null);
          } else {
            setMessage("");
            setCountryToShow(countries[0]);
          }
        } else {
          setMessage("");
        }
      })
  }, [country]);

  useEffect(() => {
    if (countryToShow == null) {
      return;
    }

    axios
      .get(`https://api.openweathermap.org/data/2.5/forecast?q=${countryToShow.capital},${countryToShow.cioc}&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        setWeatherResponse(response.data);
      });
  }, [countryToShow]);

  return (
    <div>
      <label>find countries</label>
      <input value={country} onChange={handleCountryChange} />
      <Message message={message} />
      <CountryList countriesToShow={countriesToShow} handleView={handleView} />
      <CountryInfo country={countryToShow} weather={weatherResponse} />
    </div>
  )
}

export default App;
