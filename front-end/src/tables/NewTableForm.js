import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createNewTable } from '../utils/api';


const initialFormState = {
  table_name: "",
  capacity: ""
}



function NewTableForm() {

  const [tableErrors, setTableErrors] = useState(null)
  const [tableFormData, setTableFormData] = useState({ ...initialFormState })
  const history = useHistory();


  async function handleSubmit(event) {
    event.preventDefault();

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await createNewTable({ data: tableFormData }, signal);
      console.log(`New table created: ${response}`)
      setTableFormData({ ...initialFormState });
      setTableErrors(null)
      history.push('/dashboard')
    } catch (error) {
      console.error(error)
      setTableErrors(error)
    }
  }

  function handleCancel() {
    setTableFormData({ ...initialFormState })
    history.goBack()
  }

  //handle change function to keep inputs controlled
  function handleChange({ target }) {
    setTableFormData({
      ...tableFormData,
      [target.name]: target.name === 'capacity' ? Number(target.value) : target.value,
    })

  }


  return (
    <div className='new-table-form'>
      <h2>New Table</h2>
      <ErrorAlert className="alert alert-danger" error={tableErrors} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">
          Table Name:
          <input
            id="table_name"
            type="text"
            name="table_name"
            onChange={handleChange}
            value={tableFormData.table_name}
          />
        </label>
        <br />
        <label htmlFor='capacity'>
          Capacity:
          <input
            id="capacity"
            type="number"
            name="capacity"
            onChange={handleChange}
            value={tableFormData.capacity}
          />
        </label>
        <div className="table-form-buttons">
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewTableForm
