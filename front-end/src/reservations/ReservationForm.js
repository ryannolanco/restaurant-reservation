import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, getReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const initialFormState = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "",
  people: 0,
};

function ReservationForm() {

  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormState });
  const history = useHistory();
  const { reservation_id } = useParams()




  useEffect(() => {
    // Define the async function inside useEffect
    async function loadReservationData() {
      const abortController = new AbortController();

      try {
        if (reservation_id) {
          // We are on the edit page, so load the reservation data
          const reservationData = await getReservation(reservation_id, abortController.signal);

          if (reservationData.status !== "booked") {
            // Handle case where reservation is not "booked"
            // setErrors("Reservation is not in a booked status");
            return;
          }

          // Use functional update to avoid stale formData
          setFormData((currentData) => ({
            ...currentData,  // retain current form data
            ...reservationData  // spread the reservation data into form fields
          }));
        } else {
          // We are on the new reservation page, set form to initial state
          setFormData({ ...initialFormState });
        }
      } catch (error) {
        console.error("Failed to load reservation:", error);
      }

      return () => abortController.abort();  // Clean up the request
    }

    // Call the async function
    loadReservationData();
  }, [reservation_id]);
  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      //checks if reservation_id is present from params, if it is we are updating reservation,
      // if it is not we are creating a new reservation

      //update reservation
      if (reservation_id) {
        const response = await updateReservation({ data: formData }, reservation_id, signal);
        console.log(`Reservation Updated: ${response}`);
        const reservationDate = formData.reservation_date;
        setFormData({ ...initialFormState });
        setErrors(null);
        history.push(`/dashboard?date=${reservationDate}`);
      }
      // create a new reservation
      else {
        const response = await createReservation({ data: formData }, signal);
        console.log(`Reservation Created: ${response}`);
        const reservationDate = formData.reservation_date;
        setFormData({ ...initialFormState });
        setErrors(null);
        history.push(`/dashboard?date=${reservationDate}`);
      }
    } catch (error) {
      setErrors(error);
    }
  }

  function handleCancel() {
    setFormData({ ...initialFormState });
    history.goBack();
  }

  // Handle input changes
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.name === 'people' ? Number(target.value) : target.value,
    });
  }

  return (
    <div className="new-reservation-form">
      <h2>{reservation_id ? "Edit Reservation" : "New Reservation"}</h2>
      <ErrorAlert className="alert alert-danger" error={errors} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">
          First Name:
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
        <div>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;