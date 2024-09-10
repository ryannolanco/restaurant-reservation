import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <>
    <nav className="navigation-bar">
      <div className="main-title">
        <Link to="/">
          <p>Periodic Tables</p>
        </Link>
      </div>
      <hr className="line" />
      <div className="nav-list-container" >
        <ul className="nav-list" id="">
          <li className="nav-items nav-link-1">
            <Link className="" to="/dashboard">
              Dashboard
            </Link>
          </li>
          <li className="nav-items nav-link-2">
            <Link className="" to="/search">
              Search
            </Link>
          </li>
          <li className="nav-items nav-link-3">
            <Link className="" to="/reservations/new">
              New Reservation
            </Link>
          </li>
          <li className="nav-items nav-link-4">
            <Link className="" to="/tables/new">
              New Table
            </Link>
          </li>
        </ul>
      </div>
    </nav>
      <hr className="line" />
    </>
  );
}

export default Menu;
