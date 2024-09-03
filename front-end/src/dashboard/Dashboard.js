import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";



/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {

  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
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



  const displayedReservations = reservations.map(({ first_name, last_name, reservation_time, reservation_id, people }) => (
    <li key={reservation_id}>
      {`${first_name} ${last_name} for ${people} at ${reservation_time} `}
      <a href={`/reservations/${reservation_id}/seat`}>Seat</a>
    </li>
  ));

  const displayedTables = tables.map((table) => (
    <li key={table.table_id}>
      <span data-table-id-status={table.table_id}>
        {table.table_name}
      {table.reservation_id ? "Occupied" : "Free"}
    </span>
    </li>
  ))


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
        <button onClick={() => setDate(previous(date))}>
          Previous Day
        </button>
        <button onClick={() => setDate(today())}>
          Today
        </button>
        <button onClick={() => setDate(next(date))}>
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
