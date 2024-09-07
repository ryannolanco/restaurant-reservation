const knex = require('../db/connection')



// list all reservations 
function listByDate(date) {
  return knex('reservations')
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: 'finished' })
    .orderBy('reservation_time', 'asc');
}


//Create new reservation
function create(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((results) => results[0]);
}

function readReservation(reservation_id) {
  return knex('reservations')
    .select("*")
    .where({ reservation_id })
    .first();
}

function updateStatus({ reservation_id, status }) {
  return knex('reservations')
    .where({ reservation_id })
    .update({ status })
    .returning('*')
    .then((updatedRecords) => updatedRecords[0]);
}

function updateReservation(reservation) {
  return knex('reservations')
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation)
    .returning('*')
    .then((updatedRecords) => updatedRecords[0]);
}

function listByNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  listByDate,
  listByNumber,
  create,
  readReservation,
  updateStatus,
  updateReservation,
}