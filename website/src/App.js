import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import './App.css'
dayjs.extend(isSameOrAfter)

const URL = 'http://localhost:8080/api/v1'

const App = () => {
  const [orders, setOrders] = useState([])
  const [searchDateParams, setSearchDateParams] = useState({ startDate: undefined, endDate: undefined })
  const [searchWithoutDate, setSearchWithoutDate] = useState(false)
  const fetchData = async () => {
    fetch(
      searchWithoutDate
        ? `${URL}/orders`
        : `${URL}/orders?startDate=${searchDateParams.startDate}&endDate=${searchDateParams.endDate}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw res
      })
      .then((orders) => {
        setOrders(orders)
      })
      .catch((err) => console.log(err))
  }
  return (
    <div className="App">
      <img src={require('./assets/logo.png')} alt="logo" className="headerImg" />
      <div style={{ width: '90%', marginBottom: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
          <p style={{ marginRight: '5px' }}>Start Date</p>
          <input
            type="date"
            max={dayjs().format('YYYY-MM-DD')}
            style={{ marginRight: '10px' }}
            onChange={(e) =>
              setSearchDateParams({ startDate: dayjs(e.nativeEvent.target.value), endDate: searchDateParams.endDate })
            }
          />
          <p style={{ marginRight: '5px' }}>End Date</p>
          <input
            type="date"
            max={dayjs().format('YYYY-MM-DD')}
            onChange={(e) =>
              setSearchDateParams({ startDate: searchDateParams.startDate, endDate: dayjs(e.nativeEvent.target.value) })
            }
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="checkbox"
            id="noDateCheckBox"
            name="noDateCheckBox"
            value="noDate"
            onChange={() => setSearchWithoutDate(!searchWithoutDate)}
          />
          <label for="noDateCheckBox">Search without dates</label>
        </div>
        <button
          style={{ marginBottom: '10px' }}
          onClick={() => {
            if (searchWithoutDate) {
              fetchData()
            } else if (
              !isNaN(searchDateParams.startDate) &&
              !isNaN(searchDateParams.endDate) &&
              searchDateParams.endDate.isSameOrAfter(searchDateParams.startDate)
            ) {
              fetchData()
            } else {
              alert(
                'Invalid search. Either search without dates or select valid dates to search from. Start date must be before end date!'
              )
            }
          }}>
          Search
        </button>
        <br />
        <button onClick={() => setOrders([])}>Clear Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Property Name</th>
            <th>Room Name</th>
            <th>Price</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, index) => {
            return (
              <tr key={item.toString() + index.toString()}>
                <td>{item.id}</td>
                <td>{item.property.name}</td>
                <td>{item.room.name}</td>
                <td>$ {item.price}</td>
                <td>{item.created_at}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default App
