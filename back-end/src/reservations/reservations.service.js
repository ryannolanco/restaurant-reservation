const knex = require('../db/connection')



// list all reservations 
function listByDate(date) {
  return knex('reservations')
  .select("*")
  .where({reservation_date: date})
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

module.exports = {
  listByDate,
  create,
  readReservation,
}