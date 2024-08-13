const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')


/* ---- Helper Functions ---- */
const requiredProperties = [
  'first_name', 
  'last_name', 
  'mobile_number', 
  'reservation_date', 
  'reservation_time', 
  'party_size',
];
//Check if incoming post request has all necessary fields

function bodyDataHasFields(requiredProperties) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    for (const property of requiredProperties) {
      if (!data[property]) {
        let propertyName = property.split('_').join(" ")
        return next({ status: 400, message: `Reservation must include ${propertyName}` })
      }
    }
    next()
  };
}



// List handler for reservation resources

async function list(req, res) {
  const data = await service.list()
  res.json({ data });
}

//Create new reservation handler 

module.exports = {
  list: asyncErrorBoundary(list),
  create: [bodyDataHasFields(requiredProperties), ]
};
