const Filter = ({ searchQuery, setSearchQuery }) => {
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value)
    }
  
    return (
      <div>
        Search: <input type="text" value={searchQuery} onChange={handleSearchChange} />
      </div>
    )
  }
export default Filter