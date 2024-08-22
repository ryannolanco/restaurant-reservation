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



module.exports = {
  listByDate,
  create,
}