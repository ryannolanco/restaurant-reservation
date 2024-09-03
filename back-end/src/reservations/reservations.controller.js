const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const moment = require('moment');

/* ---- Helper Functions ---- */
const requiredProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//Check if incoming post request has all necessary fields
function bodyDataHasFields(requiredProperties) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    for (const property of requiredProperties) {
      if (!data[property]) {
        console.log(data)
        return next({ status: 400, message: `Reservation must include ${property}.` })
      }
    }

    next()
  };
}

//check is reservation_date is a date
function reservationDateIsValid(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;

  const parsedDate = new Date(reservation_date);

  if (!(parsedDate instanceof Date) || isNaN(parsedDate)) {
    return next({ status: 400, message: "reservation_date must be a valid date" });
  }

  if (parsedDate.toLocaleString('en-US', { timeZone: "UTC", weekday: "long" }) === "Tuesday") {
    return next({ status: 400, message: "Restaurant closed on Tuesdays" });
  }

  const now = moment()
  const reservationDate = moment(reservation_date)
  if (reservationDate.isBefore(now, 'day')) {
    return next({ status: 400, message: "Date must be in the future." })
  };

  next()

}
//check is reservation_time is a time
function reservationTimeIsValid(req, res, next) {
  const { data: { reservation_time, reservation_date } = {} } = req.body;

  const timeRegex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

  if (!timeRegex.test(reservation_time)) {
    return next({ status: 400, message: "Invalid reservation_time format" })
  }

  const reservationDateTime = moment(`${reservation_date} ${reservation_time}`, 'YYYY-MM-DD HH:mm');
  const openingTime = moment(`${reservation_date} 10:30`, 'YYYY-MM-DD HH:mm');
  const closingTime = moment(`${reservation_date} 21:30`, 'YYYY-MM-DD HH:mm');

  if (!reservationDateTime.isBetween(openingTime, closingTime, null, '[]')) {
    return next({ status: 400, message: 'Restaurant reservations are only available from 10:30am - 9:30pm' });
  }

  next()
}

//check if people is a number
function peopleIsValid(req, res, next) {
  const { data: { people } = {} } = req.body;


  if (typeof people !== "number" || !Number.isFinite(people)) {
    return next({ status: 400, message: "people must be a valid number" })
  }

  next()
}

async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(req.params.reservation_id)
  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({status: 400, message: "Reservation does not exist."})
}

/* ---- CRUD Functions ---- */

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

async function readReservation(req, res) {
  const data = res.locals.reservation
  res.status(200).json({data})
}




module.exports = {
  list: asyncErrorBoundary(listByDate),
  create: [
    bodyDataHasFields(requiredProperties),
    reservationDateIsValid,
    reservationTimeIsValid,
    peopleIsValid,
    asyncErrorBoundary(createReservation),
  ],
  read: [
    asyncErrorBoundary(reservationExists), asyncErrorBoundary(readReservation)
  ],
};
