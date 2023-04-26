const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      <input value={searchTerm} onChange={handleSearchChange}></input>
    </div>
  );
}

export default Filter