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

![dashboard-homepage](https://github.com/user-attachments/assets/dff4b0bd-6f4e-4631-b685-529e2048f817)


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
