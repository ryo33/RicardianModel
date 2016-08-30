import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ ranking }) => {
  ranking.sort(({money: p1}, {money: p2}) => p1 - p2)
  return { ranking }
}

const Result = ({ ranking }) => (
  <div>
    <table>
      <thead>
        <tr><th>順位</th><th>利得</th></tr>
      </thead>
      <tbody>
        {
          ranking.map(({ money, own }, i) => (
            <tr
              key={i}
              style={own
                ? {
                  backgroundColor: "#bbb"
                }
                : {}
              }
            >
              <td>{i+1}</td><td>{money}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
)

export default connect(mapStateToProps)(Result)
