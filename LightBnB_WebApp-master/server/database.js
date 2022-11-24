const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})


 
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
  .query(`
    SELECT *
    FROM users
    WHERE email = $1;
  `,
  [email]
  )
  .then(res => {
    console.log(res.rows[0]);
    return res.rows[0];
  })
  .catch(err => {
    console.log(err.message);
  });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
  .query(`
    SELECT * 
    FROM users
    WHERE id = $1;
  `,
  [id]
  )
  .then(res => {
    console.log(res.rows[0]);
    return res.rows[0];
  })
  .catch(err => {
    console.log(err.message);
  });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
  .query(`
    INSERT into USERS (name, password, email)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
  [user.name, user.password, user.email]
  )
  .then(res => {
    // console.log(res.rows[0]);
    return res.rows[0];
  })
  .catch(err => {
    console.log(err.message);
  });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
  .query(`
    SELECT reservations.id AS id, properties.*, reservations.start_date AS start_date, reservations.end_date AS end_date, AVG(property_reviews.rating) AS rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2
  `, 
  [guest_id, limit]
  )
  .then(res => {
    console.log(res.rows);
    return res.rows;
  })
  .catch(err => {
    console.log(err.message);
  });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return pool 
  .query(`
    SELECT * 
    FROM properties
    LIMIT $1;
  `,
  [limit]
  )
  .then(res => {
    console.log(res.rows);
    return res.rows;
  })
  .catch(err => {
    console.log(err.message);
  });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
