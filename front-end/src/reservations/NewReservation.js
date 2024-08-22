import { useState } from "react"


const initialFormState = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "",
  party_size: "",
}




function NewReservation() {

  // a function that handles when the form is submitted
async function handleSubmit(event) {
  event.preventDefault();

  const response = await fetch('/')
  //api functionaility

  setFormData({ ...initialFormState })

}

function handleCancel() {

}


//handle change function to keep inputs controlled
function handleChange({ target }) {
  setFormData({
    ...formData,
    [target.name]: [target.value]
  })
}

  const [formData, setFormData] = useState({ ...initialFormState })

  // a function that handles when the form is submitted
function handleSubmit(event) {
  event.preventDefault();
  //api functionaility

  setFormData({ ...initialFormState })

}

//handle change function to keep inputs controlled
function handleChange({ target }) {
  setFormData({
    ...formData,
    [target.name]: [target.value]
  })
}


  return (
    <div className="new-reservation-form">
      <h2>New Reservation</h2>
      <form  onSubmit={handleSubmit}>
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
        <input
          id="last_name"
          type="text"
          name="last_name"
          onChange={handleChange}
          value={formData.last_name}
          />
        </label>
        <label htmlFor="mobile_number">
        <input
          id="mobile_number"
          type="tel"
          name="mobile_number"
          onChange={handleChange}
          value={formData.mobile_number}
          />
        </label>
        <label htmlFor="reservation_date">
        <input
          id="reservation_date"
          type="date"
          name="reservation_date"
          onChange={handleChange}
          value={formData.reservation_date}
          />
        </label>
        <label htmlFor="reservation_time">
        <input
          id="reservation_time"
          type="time"
          name="reservation_time"
          onChange={handleChange}
          value={formData.reservation_time}
          />
        </label>
        <label htmlFor="party_size">
        <input
          id="party_size"
          type="number"
          name="party_size"
          onChange={handleChange}
          value={formData.party_size}
          />
          <button onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit">
            Submit
          </button>
        </label>
      </form>
    </div>
  )
}

export default NewReservation