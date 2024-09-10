import React, { useState } from 'react'
import ListReservations from './ListReservations'
import { listReservations } from '../utils/api'





function SearchNumber() {
  const [searchedReservations, setSearchedReservations] = useState([])
  const [mobileNumber, setMobileNumber] = useState("")



  async function handleSubmitSearch(event) {
    event.preventDefault();

    const controller = new AbortController();
    const signal = controller.signal;

    try {

      const params = { mobile_number: mobileNumber };
      const reservations = await listReservations(params, signal);
      setSearchedReservations(reservations);
    } catch (error) {
      console.log(error);
    }

    return () => controller.abort();
  }

  function handleChange({ target }) {
    setMobileNumber(target.value);

  }

  return (
    <div className="search-container">
      <h3>Search For Reservation Number</h3>
      <form onSubmit={handleSubmitSearch}>
        <label htmlFor='mobile_number'>
          Search:
          <input
            placeholder="Enter a customer's phone number"
            id='mobile_number'
            type='tel'
            name="mobile_number"
            onChange={handleChange}
            value={mobileNumber}
          />
        </label>
        <button type='submit'>
          Find
        </button>
      </form>
      <ListReservations searchedReservations={searchedReservations} />
    </div>


  )
}

export default SearchNumber
