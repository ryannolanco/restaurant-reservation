import React, { useEffect, useState } from "react";
import { deleteReservationFromTable, listReservations, listTables, updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { useHistory } from "react-router-dom";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const history = useHistory();
  const query = useQuery();
  const [date, setDate] = useState(query.get("date") || today());

  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  //const [deleteReservationFromTableError, setDeleteReservationFromTableError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }


  /* ---- Button Handlers ---- */
  function handleDateChange(newDate) {
    setDate(newDate);
    history.push(`?date=${newDate}`); // Update the URL with the new date
  }

  //handle the decision to either finish table seating or cancel

  async function handleFinishButton(table_id, reservation_id, event) {
    event.preventDefault();

    const controller = new AbortController();
    const signal = controller.signal;

    if (window.confirm("Is this table ready to seat new guests? This cannot be undone")) {
      try {
         //updates the status to seated on reservation
        const reservationResponse = await updateReservationStatus(reservation_id, "finished", signal)

        //updates the table to remove reservation from table effectively making the table free
        const tableResponse = await deleteReservationFromTable(table_id, signal)
        console.log(`Reservation deleted form table. Response: ${tableResponse}`)
        console.log(`Reservation status changed to finished. Response: ${reservationResponse}`)

        loadDashboard()
      } catch (error) {
        console.log(error)
        //setDeleteReservationFromTableError(error)
      }
    } else {
      console.log("cancelled")
    }
  }

  /* ---- Reservations and Tables display ---- */

  const displayedReservations = reservations.map((reservation) => {
    
    // Skip rendering if the reservation is finished (handled is API)
    // if (reservation.status === "finished") {
    //   return null;
    // }

    return (
      <li key={reservation.reservation_id}>
        <p>{`${reservation.first_name} ${reservation.last_name} for ${reservation.people} at ${reservation.reservation_time}`}</p>
        <p data-reservation-id-status={reservation.reservation_id}>{`Status: ${reservation.status}`}</p>
        {reservation.status === "booked" ? (
          <a href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
        ) : null}
      </li>
    );
  });


  const displayedTables = tables.map((table) => (
    <li key={table.table_id}>
      <span data-table-id-status={table.table_id}>
        {table.table_name}
        {table.reservation_id ? "Occupied" : "Free"}
        {table.reservation_id ? <button onClick={(event) => handleFinishButton(table.table_id, table.reservation_id, event)} data-table-id-finish={table.table_id}> Finish </button> : null}
      </span>
    </li>
  ));

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length ? <ul>{displayedReservations}</ul> : `No reservations for ${date} `}
      <br />
      <div className="set-dates-buttons">
        <button onClick={() => handleDateChange(previous(date))}>
          Previous Day
        </button>
        <button onClick={() => handleDateChange(today())}>
          Today
        </button>
        <button onClick={() => handleDateChange(next(date))}>
          Next Day
        </button>
      </div>
      <div className="dashboard-tables">
        <h4>Tables</h4>
        <ul>
          {displayedTables}
        </ul>
        <ErrorAlert error={tablesError} />
      </div>
    </main>
  );
}

export default Dashboard;
