const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')


/* ---- Helper Functions ---- */
const requiredProperties = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
];

//Check if incoming post request has all necessary fields
function bodyDataHasFields(requiredProperties) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    for (const property of requiredProperties) {
      if (!data[property]) {
        return next({ status: 400, message: `Reservation must include ${property}` })
      }
    }
    next()
  };
}

//check is reservation_date is a date
function reservationDateIsValid(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;

  const parsedDate = new Date(reservation_date);

  // Validate that the date is an actual date and not an "Invalid Date"
  if (!(parsedDate instanceof Date) || isNaN(parsedDate)) {
    return next({ status: 400, message: 'reservation_date must be a valid date' });
  }

  next()

}
//check is reservation_time is a time
function reservationTimeIsValid(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;

  const timeRegex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

  if (!timeRegex.test(reservation_time)) {
    return next({ status: 400, message: 'Invalid reservation_time format' })
  }

  next()
}

//check if people is a number
function peopleIsValid(req, res, next) {
  const { data: { people } = {} } = req.body;


  if (typeof people !== 'number' || !Number.isFinite(people)) {
    return next({ status: 400, message: 'people must be a valid number' })
  }

  next()
}



// List handler for reservation resources

async function listByDate(req, res) {
  const date = req.query.date
  const data = await service.listByDate(date)
  res.status(200).json({ data });
}

//Create new reservation handler 
async function createReservation(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data })
}


module.exports = {
  list: asyncErrorBoundary(listByDate),
  create: [
    bodyDataHasFields(requiredProperties),
    reservationDateIsValid,
    reservationTimeIsValid,
    peopleIsValid,
    asyncErrorBoundary(createReservation),
  ]
};
