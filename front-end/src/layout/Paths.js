import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservationForm from "../reservations/NewReservationForm";
import EditReservations from "../reservations/EditReservations";
import SeatReservation from "../reservations/SeatReservation";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Paths() {
  return (
    <Routes>
      <Route exact={true} path="/">
        <Navigate to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Navigate to={"/dashboard"} />
      </Route>
   
      <Route path="/reservations/:reservation_id/edit">
        <EditReservations />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Routes>
  );
}

export default Paths;
