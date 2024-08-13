const knex = require('../db/connection')



// list all reservations 
function list() {
  return knex('reservations')
  .select("*");
}


//Create new reservation
function create(reservation) {
  return knex('reservations')
  .insert(reservation)
  .returning('*')
  .then((results) => results[0]);
}



module.exports = {
  list,
  create,
}