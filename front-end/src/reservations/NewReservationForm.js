import { useState, React } from "react"
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
// const apiUrl = process.env.REACT_APP_API_BASE_URL;

const initialFormState = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "",
  people: 0,
}


function NewReservation({date, setDate}) {
 
  
  const [formData, setFormData] = useState({ ...initialFormState })
  const history = useHistory();

  // a function that handles when the form is submitted
  async function handleSubmit(event) {
    event.preventDefault();

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      console.log(formData)
      const response = await createReservation({data: formData}, signal);
      console.log('Reservation created:', response);
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
    setDate(formData.reservation_date)
    setFormData({ ...initialFormState })
    history.push(`/reservations?date=${date}`)
    
  }

  function handleCancel() {

  }


  //handle change function to keep inputs controlled
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.name === 'people' ? Number(target.value) : target.value,
    })
  }


  return (
    <div className="new-reservation-form">
      <h2>New Reservation</h2>
      <form onSubmit={handleSubmit}>
        Name:
        <label htmlFor="first_name">
          <input
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
          />
        </label>
        <label htmlFor="last_name">
          Last Name:
          <input
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
          />
        </label>
        <br />
        <label htmlFor="mobile_number">
          Number:
          <input
            id="mobile_number"
            type="tel"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
          />
        </label>
        <label htmlFor="people">
          Party Size:
          <input
            id="people"
            type="number"
            name="people"
            onChange={handleChange}
            value={formData.people}
          />
        </label>
        <br />
        <label htmlFor="reservation_date">
          Date:
          <input
            id="reservation_date"
            type="date"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
          />
        </label>
        <label htmlFor="reservation_time">
          Time:
          <input
            id="reservation_time"
            type="time"
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
          />
        </label>
        <br />
        <button onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}

export default NewReservation