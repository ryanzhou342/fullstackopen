const CountryList = ({ countriesToShow, handleView }) => {
  if (countriesToShow.length === 1) {
    return null;
  }

  return (
    <div>
      {countriesToShow.map(c => 
        <div key={c.name.common}>
          {c.name.common}
          <button onClick={() => handleView(c)}>show</button>
        </div>
      )}
    </div>
  )
}

export default CountryList;