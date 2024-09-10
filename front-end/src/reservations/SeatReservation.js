import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateTable} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function SeatReservation() {
  const { reservation_id } = useParams();
  const initialFormState = {
    reservation_id: reservation_id,
    table_id: "",
  }
  const [formData, setFormData] = useState({...initialFormState})
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null);

  const history = useHistory()

  useEffect(() => {
    const abortController = new AbortController();
  
    const loadTables = async () => {
      setTablesError(null);
  
      try {
        const tables = await listTables(abortController.signal);
        setTables(tables);
      } catch (error) {
        setTablesError(error);
      }
    };
  
    loadTables();
  
    return () => abortController.abort();
  }, []);



  //adds reservation_id to table and changes reservation status to "seated"
  async function handleSeatingTable(event) {
    event.preventDefault();

    const controller = new AbortController();
    const signal = controller.signal;

    try {

      //updates the status to seated on reservation
     // const reservationResponse = await updateReservationStatus(reservation_id, "seated", signal)

      //updates the table to hold the reservation table effectively making the table occupied
      const tableResponse = await updateTable(formData, signal);
      console.log(`Updated Table: ${tableResponse}`)
     // console.log(`Updated Table: ${reservationResponse}`)

      setFormData({...initialFormState})
      history.push('/dashboard')
    } catch (error) {
      setTablesError(error)
    }
  }



  //display mapping

  const displayedTables = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {!table.reservation_id ? `${table.table_name} - ${table.capacity}` : null}
    </option>
  ));


  return (
    <div className="seat-reservation">
      <h1>Seat Table</h1>
      <ErrorAlert className="alert alert-danger" error={tablesError} />
      <form onSubmit={handleSeatingTable}>
        <select
          name="table_id"
          value={formData.table_id}
          onChange={(e) => setFormData({ ...formData, table_id: e.target.value })}
        >
          <option value="">Select a table</option>
          {displayedTables}
        </select>
        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  )

  
}

export default SeatReservation
