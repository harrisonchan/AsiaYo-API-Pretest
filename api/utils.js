const dayjs = require('dayjs')
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter)
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

const getRandomDate = (start, end) => {
  return dayjs(start.valueOf() + Math.random() * (end.valueOf() - start.valueOf()))
}

const createRooms = (propertyId, numRooms) => {
  let rooms = []
  for (let i = 0; i < numRooms; i++) {
    rooms.push({
      id: propertyId * 100 + i,
      propertyId,
      name: `Hotel ${propertyId} Room ${i}`,
      price: parseFloat(100 + i + propertyId),
    })
  }
  return rooms
}

const createFakeData = (roomsLength, propertiesLength, ordersLength) => {
  properties = Array(propertiesLength).fill({})
  orders = Array(ordersLength).fill({})
  rooms = []
  properties = properties.map((property, index) => {
    const newRooms = createRooms(index, roomsLength)
    rooms.push(...newRooms)
    return {
      id: index,
      name: `Hotel ${index}`,
      rooms: newRooms,
    }
  })
  const ORDER_ID_PREFIX = 99999
  const PADDING = '00000'
  orders = orders.map((order, index) => {
    const seed = Math.floor(Math.random() * (properties.length - 1))
    const roomSeed = Math.floor(Math.random() * (properties[0].rooms.length - 1))
    return {
      id: parseInt(
        `${ORDER_ID_PREFIX}${PADDING.substring(0, PADDING.length - index.toString().length) + index.toString()}`
      ),
      property: {
        id: properties[seed].id,
        name: properties[seed].name,
      },
      room: {
        id: properties[seed].rooms[roomSeed].id,
        name: properties[seed].rooms[roomSeed].name,
      },
      price: properties[seed].rooms[roomSeed].price,
      createdAt: getRandomDate(dayjs('2014-01-01'), dayjs()).format('YYYY-MM-DD HH:mm:ss.SSS'),
    }
  })
  return { rooms, properties, orders }
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
    dayjs(orders[i].createdAt).isBefore(dayjs(pivot.createdAt)) ? left.push(orders[i]) : right.push(orders[i])
  }
  return quickSortOrders(left).concat(pivot, quickSortOrders(right))
}

const getOrders = (orders, { startDate, endDate }) => {
  if (startDate && endDate) {
    let startIndex = undefined
    let endIndex = undefined
    for (let i = orders.length - 1; i >= 0; i--) {
      if (isNaN(endIndex) && dayjs(orders[i].createdAt).isSameOrBefore(endDate)) {
        endIndex = i
      }
    }
    for (let i = 0; i < orders.length; i++) {
      if (isNaN(startIndex) && dayjs(orders[i].createdAt).isSameOrAfter(dayjs(startDate))) {
        startIndex = i
      }
    }
    if (!isNaN(startIndex) && !isNaN(endIndex)) {
      console.log(startIndex, endIndex)
      let returnOrders = []
      for (let i = startIndex; i <= endIndex; i++) {
        returnOrders.push(orders[i])
      }
      return returnOrders
    } else {
      return 'No orders within specified range'
    }
  } else {
    return orders
  }
}

module.exports = { createFakeData, quickSortOrders, getOrders }
