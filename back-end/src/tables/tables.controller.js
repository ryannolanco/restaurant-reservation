const service = require('./tables.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')

/* ---- Helper Functions ---- */

const requiredProperties = [
  "table_name",
  "capacity",
]

function bodyDataHasFields(requiredProperties) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    for (const property of requiredProperties) {
      if (!data[property]) {
        return next({ status: 400, message: `Table must include ${property}.` })
      }
    }

    next()
  };
}

//check that capacity is greater than 0
function capacityIsValid(req, res, next) {
  const { data: { capacity } = {} } = req.body
  if (capacity < 1 || typeof (capacity) !== "number") {
    return next({ status: 400, message: "Table capacity must be 1 or greater." })
  }
  next()
}


//check that table name length is greater than 2 
function tableNameIsValid(req, res, next) {
  const { data: { table_name } = {} } = req.body;

  if (table_name.length < 2) {
    return next({ status: 400, message: "table_name must have a length of 2 or greater." })
  }
  next()
}


//check that the table exists and if it does add table info to res.locals

async function tableExistsAndNotOccupied(req, res, next) {
  const table = await service.readTable(req.params.table_id)
  
  //if table contains a reservation_id it is currently occupied
  if(table.reservation_id) {
    return next({status:400, message: "Table is currently occupied"})
  }
  
  if (table) {
    res.locals.table = table
    return next()
  }
  
  next({ status: 404, message: `Table with id ${req.params.table_id} does not exist` })
}

//check if reservation size is less than or equal to table capacity
function sufficientCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;

  if (people > capacity) {
    return next({status:400, message: "Reservation people is too large for table capacity"})
  }

  next()
}

// check if provided reservation id exists in the reservations table
async function reservationExistsAndIdIsValid(req, res, next) {
  const {reservation_id} = req.body.data
  if (!reservation_id) {
    return next({status: 400, message: "reservation_id is missing"})
  }
  const reservation = await service.readReservation(reservation_id)
  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({status: 404, message: `Reservation with id ${reservation_id} does not exist.`})
}

// check that body contains data
function dataExists(req, res, next) {
if (!req.body.data) {
  return next({status: 400, message: "Data is missing"})
}
next()
}


/* ---- CRUD Functions ---- */

///list all tables 
async function listTables(req, res) {
  const data = await service.listByTable()
  res.status(200).json({ data })
}

//create new table
async function createTable(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data })
}

async function updateTable(req, res, next) {
 // const { reservation_id } = req.body.data
  const updatedTable = {
    table_id: res.locals.table.table_id,
    table_name: res.locals.table.table_name,
    reservation_id: res.locals.reservation.reservation_id
  }
  const data = service.update(updatedTable);
  res.status(200).json({ data })
}

module.exports = {
  list: asyncErrorBoundary(listTables),
  create: [bodyDataHasFields(requiredProperties), tableNameIsValid, capacityIsValid, asyncErrorBoundary(createTable)],
  update: [dataExists, asyncErrorBoundary(reservationExistsAndIdIsValid), asyncErrorBoundary(tableExistsAndNotOccupied), sufficientCapacity, asyncErrorBoundary(updateTable)]
}