import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { deleteReservationFromTable, listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import ListReservations from "../reservations/ListReservations";

function Dashboard() {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [date, setDate] = useState(query.get("date") || today());
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  // Memoize loadDashboard
  const loadDashboard = useCallback(async () => {
    const abortController = new AbortController();
    setReservationsError(null);

    try {
      const reservations = await listReservations({ date }, abortController.signal);
      setReservations(reservations);
    } catch (error) {
      setReservationsError(error);
    }

    return () => abortController.abort();
  }, [date]);

  // Memoize loadTables
  const loadTables = useCallback(async () => {
    const abortController = new AbortController();
    setTablesError(null);

    try {
      const tables = await listTables(abortController.signal);
      setTables(tables);
    } catch (error) {
      setTablesError(error);
    }

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    console.log("Loading dashboard data for date:", date);
    loadDashboard();
  }, [date, loadDashboard]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  // useEffect(() => {
  //   const queryParams = new URLSearchParams(location.search);
  //   const newDate = queryParams.get("date") || today();
  //   setDate(newDate);
  // }, [location.search]);

  function handleDateChange(newDate) {
    setDate(newDate);
    history.push(`?date=${newDate}`); // Update the URL with the new date
  }

  async function handleFinishButton(table_id, event) {
    event.preventDefault();

    const controller = new AbortController();
    const signal = controller.signal;

    if (window.confirm("Is this table ready to seat new guests? This cannot be undone")) {
      try {
        await deleteReservationFromTable(table_id, signal);
        console.log(`Reservation deleted from table. Table ID: ${table_id}`);
        await loadTables();  // Reload tables after deletion
        await loadDashboard();  // Reload reservations after deletion
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Cancelled");
    }
  }

  const displayedTables = tables.map((table) => (
    <li key={table.table_id}>
      <span data-table-id-status={table.table_id}>
        {table.table_name} {table.reservation_id ? "Occupied" : "Free"}
        {table.reservation_id && (
          <button
            onClick={(event) => handleFinishButton(table.table_id, event)}
            data-table-id-finish={table.table_id}
          >
            Finish
          </button>
        )}
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
      <ListReservations loadDashboard={loadDashboard} allReservations={reservations} dashboardDate={date} />
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