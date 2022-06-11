const dayjs = require('dayjs')
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter)
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
const express = require('express')

const app = express()
const PORT = 8080

app.use(express.json())

let PROPERTIES = Array(100).fill({})
let ORDERS = Array(1000).fill({})

const getRandomDate = (start, end) => {
  return dayjs(start.valueOf() + Math.random() * (end.valueOf() - start.valueOf()))
}

const createRooms = (propertyId, numRooms) => {
  let rooms = []
  for (let i = 0; i < numRooms; i++) {
    rooms.push({
      id: propertyId * 100 + i,
      name: `Room ${i}`,
      price: 100 + i + propertyId,
    })
  }
  return rooms
}

const createFakeData = () => {
  PROPERTIES = PROPERTIES.map((property, index) => {
    return {
      id: index,
      name: `Hotel ${index}`,
      rooms: createRooms(index, 10),
    }
  })
  const ORDER_ID_PREFIX = 99999
  const PADDING = '00000'
  ORDERS = ORDERS.map((order, index) => {
    const seed = Math.floor(Math.random() * (PROPERTIES.length - 1))
    const roomSeed = Math.floor(Math.random() * (PROPERTIES[0].rooms.length - 1))
    return {
      id: parseInt(
        `${ORDER_ID_PREFIX}${PADDING.substring(0, PADDING.length - index.toString().length) + index.toString()}`
      ),
      property: {
        id: PROPERTIES[seed].id,
        name: PROPERTIES[seed].name,
      },
      room: {
        id: PROPERTIES[seed].rooms[roomSeed].id,
        name: PROPERTIES[seed].rooms[roomSeed].name,
      },
      price: PROPERTIES[seed].rooms[roomSeed].price,
      created_at: getRandomDate(dayjs('2020-06-01'), dayjs('2023-06-07')).format('YYYY-MM-DD'),
    }
  })
}

const quickSortOrders = (orders) => {
  //No more recursion!
  if (orders.length <= 1) {
    return orders
  }
  let pivot = orders[0]
  let left = []
  let right = []
  for (let i = 1; i < orders.length; i++) {
    dayjs(orders[i].created_at).isBefore(dayjs(pivot.created_at)) ? left.push(orders[i]) : right.push(orders[i])
  }
  return quickSortOrders(left).concat(pivot, quickSortOrders(right))
}

createFakeData()
ORDERS = quickSortOrders(ORDERS)

const API_V1 = '/api/v1/'

//This is for testing
app.get('/test', async (req, res) => {
  try {
    res.json('Test working')
  } catch (err) {
    res.json('err')
  }
})

//Get Orders
app.get(`${API_V1}orders`, async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    if (startDate && endDate) {
      let startIndex = undefined
      let endIndex = undefined
      for (let i = ORDERS.length - 1; i >= 0; i--) {
        if (isNaN(endIndex) && dayjs(ORDERS[i].created_at).isSameOrBefore(endDate)) {
          endIndex = i
        }
      }
      for (let i = 0; i < ORDERS.length; i++) {
        if (isNaN(startIndex) && dayjs(ORDERS[i].created_at).isSameOrAfter(dayjs(startDate))) {
          startIndex = i
        }
      }
      if (!isNaN(startIndex) && !isNaN(endIndex)) {
        console.log(startIndex, endIndex)
        let orders = []
        for (let i = startIndex; i <= endIndex; i++) {
          orders.push(ORDERS[i])
        }
        res.json(orders)
      } else {
        res.json('No orders within specified range')
      }
    } else {
      res.json(ORDERS)
    }
  } catch (err) {
    res.json('err')
  }
})

app.listen(PORT, () => console.log(`Running on https://localhost:${PORT}`))
