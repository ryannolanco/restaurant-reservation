# Periodic Tables Reservation System

[Live Application](<INSERT_DEPLOYMENT_LINK_HERE>)

## API Documentation

### Reservations API
- `GET /reservations`: Retrieve a list of reservations. You can filter by date using `?date=YYYY-MM-DD` or by phone number with `?mobile_number=<number>`.
- `POST /reservations`: Create a new reservation. Requires the following fields:
  - `first_name`, `last_name`, `mobile_number`, `reservation_date`, `reservation_time`, `people`
- `PUT /reservations/:reservation_id/status`: Update the status of a reservation. Status can be `booked`, `seated`, `finished`, or `cancelled`.
- `PUT /reservations/:reservation_id`: Update an existing reservation.
- `DELETE /reservations/:reservation_id`: Cancel a reservation.

### Tables API
- `GET /tables`: Retrieve a list of tables.
- `POST /tables`: Create a new table with a `table_name` and `capacity`.
- `PUT /tables/:table_id/seat`: Assign a reservation to a table. Requires a body `{ data: { reservation_id: <reservation_id> } }`.
- `DELETE /tables/:table_id/seat`: Free up an occupied table.

## Screenshots
The Dashboard homepage allows users to view reservations for the current day, as well as seat, edit, and cancel reservations.

![dashboard-homepage](https://github.com/user-attachments/assets/dff4b0bd-6f4e-4631-b685-529e2048f817)

New Reservation form allows user to create a new reservation.

![new-reservation-form](https://github.com/user-attachments/assets/ae5ad960-7d0c-49f8-867d-7f494c060ae1)

Provides feed back if form is filled out incorrectly or if restaurant is closed 

![restaraunt-closed](https://github.com/user-attachments/assets/70b520df-e866-4238-a389-dcf017a0bfc6)

Search page allows user to search up any reservation by number as well as cancel found reservations

![search-number](https://github.com/user-attachments/assets/94939712-8c25-4d93-9d3f-8a6868128dc8)

Create a new table with new table page

![new-table-form](https://github.com/user-attachments/assets/928e7de8-978b-487d-b213-16be0090560f)

## Summary

The Periodic Tables Reservation System is designed to help restaurant managers create, manage, and track customer reservations. The system allows managers to:
- Create new reservations and assign them to tables.
- View upcoming reservations by date.
- Search reservations by customer phone number.
- Edit or cancel reservations as needed.
- Manage table assignments, ensuring seating capacity is respected.
- Track the status of reservations (booked, seated, finished, or cancelled) to manage the restaurant's flow of customers.

## Technology Used

- **Frontend**: React, React Router
- **Backend**: Node.js, Express, Knex.js
- **Database**: PostgreSQL
- **Styling**: Bootstrap, CSS
- **Deployment**: Render

## Installation Instructions

1. Clone the repository:
1. Clone the repository:

    ```bash
    git clone <REPO_URL>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables:

    ```bash
    cp .env.example .env
    # Edit the .env file with your database credentials and API settings
    # For now (the tester at thinkful/chegg skills) please create a .env file in the backend folder and use this env variable.
    DATABASE_URL_DEVELOPMENT=postgresql://restaurant_reservation_database_user:q7J1X1RuwcoBusHSXfQzRcb8NM5AAxWG@dpg-cqt4pt2j1k6c73btiltg-a.oregon-postgres.render.com/restaurant_reservation_database?ssl=true
    #for the frontend .env folder the variable in the .env.sample should work but if needed please create a .env in the frontend folder with this variable:
    REACT_APP_API_BASE_URL=http://localhost:5001
    ```

4. Set up the database:

    ```bash
    npm run knex migrate:latest
    npm run knex seed:run
    ```

5. Start the application:

    ```bash
    npm run start
    ```

6. Access the application at `http://localhost:3000`.
