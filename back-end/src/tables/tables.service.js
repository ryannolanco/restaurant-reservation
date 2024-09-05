const knex = require('../db/connection')


function listByTable() {
  return knex('tables')
    .select("*")
    .orderBy('table_name');
}


//Create new reservation
function create(table) {
  return knex('tables')
    .insert(table)
    .returning('*')
    .then((results) => results[0]);
}

function readTable(table_id) {
  return knex('tables')
    .select("*")
    .where({ table_id })
    .first();
}

function update(updatedTable) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable)
    .returning('*')
    .then((updatedRecords) => updatedRecords[0]);
}

function deleteSeatingFromTable(table_id) {
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id: null })
    .returning('*')
    .then((updatedRecords) => updatedRecords[0]);
}

function readReservation(reservation_id) {
  return knex('reservations')
    .select("*")
    .where({ reservation_id })
    .first();
}

module.exports = {
  listByTable,
  create,
  readTable,
  readReservation,
  update,
  deleteSeatingFromTable,
}