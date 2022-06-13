var sqlite3 = require('sqlite3').verbose()
const { createFakeData, quickSortOrders, getOrders } = require('./utils.js')

const DATABASE = 'db.sqlite'

const db = new sqlite3.Database(DATABASE, (err) => {
  // db.run(`DROP TABLE IF EXISTS properties`)
  // db.run(`DROP TABLE IF EXISTS rooms`)
  // db.run(`DROP TABLE IF EXISTS orders`)
  if (err) {
    console.log(err)
    throw err
  } else {
    console.log('connected to db')
    db.serialize(() => {
      let { rooms, properties, orders } = createFakeData(20, 1000, 10000)
      db.run(`CREATE TABLE IF NOT EXISTS  properties(
          id INTEGER PRIMARY KEY,
          name TEXT
      )`)
      properties.forEach((elem) => {
        const { id, name } = elem
        db.run(`INSERT OR IGNORE INTO properties VALUES (${id}, '${name}')`)
      })
      db.run(`CREATE TABLE IF NOT EXISTS rooms(
              id INTEGER PRIMARY KEY,
              name TEXT,
              properties_id INTEGER NOT NULL,
              price INTEGER,
              CONSTRAINT fk_properties FOREIGN KEY (properties_id) REFERENCES properties (id)
          )`)
      rooms.forEach((elem) => {
        const { id, name, propertyId, price } = elem
        db.run(`INSERT OR IGNORE INTO rooms VALUES (${id}, '${name}',${propertyId}, ${price})`)
      })
      db.run(`CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY,
          room_id INTEGER NOT NULL,
          price DOUBLE,
          created_at TEXT,
          CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES rooms (room_id)
      )`)
      orders.forEach((elem) => {
        const { id, room, price, createdAt } = elem
        db.run(`INSERT OR IGNORE INTO orders VALUES (${id}, ${room.id}, ${price}, datetime('${createdAt}'))`)
      })
    })
  }
})

module.exports = db
