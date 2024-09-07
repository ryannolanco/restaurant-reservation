import React, { useEffect, useState, useCallback } from 'react';
import { updateReservationStatus } from '../utils/api';

function ListReservations({ allReservations, searchedReservations, dashboardDate, loadDashboard }) {
  const [displayedReservations, setDisplayedReservations] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("");

  const handleCancelReservation = useCallback(async (reservation_id) => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      try {
        const data = await updateReservationStatus(reservation_id, "cancelled", signal);
        console.log(`Reservation Cancelled: ${data}`);
        loadDashboard();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Cancelled");
    }
  }, [loadDashboard]);

  useEffect(() => {
    function loadReservations() {
      if (allReservations) {
        setDisplayMessage(`No reservations for ${dashboardDate}`);

        const displayAllReservations = allReservations.map((reservation) => {
          if (reservation.status === "finished" || reservation.status === "cancelled") {
            return null;
          }

          return (
            <li key={reservation.reservation_id}>
              <p>{`${reservation.first_name} ${reservation.last_name} for ${reservation.people} at ${reservation.reservation_time} on ${reservation.reservation_date}`}</p>
              <p data-reservation-id-status={reservation.reservation_id}>{`Status: ${reservation.status}`}</p>
              <div className='reservations-a-tag-buttons'>
                {reservation.status === "booked" ? (
                  <a href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
                ) : null}
                <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
                <button data-reservation-id-cancel={reservation.reservation_id} onClick={() => handleCancelReservation(reservation.reservation_id)}>Cancel</button>
              </div>
            </li>
          );
        });
        setDisplayedReservations(displayAllReservations);
      } else {
        setDisplayMessage("No reservations found");
        const displaySearchedReservation = searchedReservations.map((reservation) => {
          return (
            <li key={reservation.reservation_id}>
              <p>{`${reservation.first_name} ${reservation.last_name} for ${reservation.people} at ${reservation.reservation_time}`}</p>
              <div className='reservations-a-tag-buttons'>
                <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
                <button data-reservation-id-cancel={reservation.reservation_id} onClick={() => handleCancelReservation(reservation.reservation_id)}>Cancel</button>
              </div>
            </li>
          );
        });
        setDisplayedReservations(displaySearchedReservation);
      }
    }

    loadReservations();
  }, [dashboardDate, allReservations, searchedReservations, handleCancelReservation]);

  return (
    <div className='list-reservations-display'>
      {displayedReservations.length ? <ul>{displayedReservations}</ul> : <p>{displayMessage}</p>}
    </div>
  );
}

export default ListReservations;