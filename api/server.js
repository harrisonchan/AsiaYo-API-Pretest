const express = require('express')
const cors = require('cors')
const db = require('./db.js')
const { createFakeData } = require('./utils.js')
// const { createFakeData, quickSortOrders, getOrders } = require('./utils.js')

const app = express()
app.use(cors())
const PORT = 8080

app.use(express.json())

const API_V1 = '/api/v1'

//This is for testing
app.get('/test', async (req, res) => {
  try {
    res.json('Test working')
  } catch (err) {
    res.json('err')
  }
})

//Get Orders
app.get(`${API_V1}/orders`, async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    // let { orders } = createFakeData(10, 100, 1000)
    // orders = quickSortOrders(orders)
    // res.json(getOrders(orders, { startDate, endDate }))
    if (startDate && endDate) {
      db.all(
        // `SELECT * FROM orders
        //   WHERE created_at BETWEEN date('${startDate}') AND date('${endDate}')
        //   INNER JOIN rooms ON rooms.id = orders.room_id`,
        `SELECT 
          orders.id, 
          orders.price, 
          orders.created_at AS createdAt, 
          rooms.name AS roomName, 
          properties.name AS propertyName 
          FROM orders 
          INNER JOIN rooms ON rooms.id = orders.room_id 
          INNER JOIN properties ON properties.id = rooms.properties_id
          WHERE orders.created_at BETWEEN date('${startDate}') AND date('${endDate}')
          ORDER BY date(created_at)`,
        (err, rows) => {
          if (err) {
            throw err
          } else {
            res.json(rows)
          }
        }
      )
    } else {
      db.all(
        `SELECT 
          orders.id, 
          orders.price, 
          orders.created_at AS createdAt, 
          rooms.name AS roomName, 
          properties.name AS propertyName 
          FROM orders 
          INNER JOIN rooms ON rooms.id = orders.room_id 
          INNER JOIN properties ON properties.id = rooms.properties_id
          ORDER BY date(created_at)`,
        // 'select * from orders',
        (err, rows) => {
          if (err) {
            throw err
          } else {
            res.json(rows)
          }
        }
      )
    }
  } catch (err) {
    res.json('err')
  }
})

app.listen(PORT)
