import ReactDOM from 'react-dom'
import React from 'react'
import {windchill} from 'weather-tools'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      temperature: null,
      windSpeed: null,
    }
  }

  _handleTemperatureChange(e) {
    this.setState({ temperature: e.currentTarget.value })
  }

  _handleWindSpeedChange(e) {
    this.setState({ windSpeed: e.currentTarget.value })
  }

  render() {
    var windchillTemp;
    var { temperature, windSpeed } = this.state
    if (temperature != null && windSpeed != null) {
      windchillTemp = windchill(temperature, windSpeed)
    }

    return (
      <div className="pure-g">
        <form className="pure-form pure-u-1">
          <div className="pure-group">
            <input type="number"
              className="pure-input-1"
              placeholder="Temperature (F)"
              onChange={this._handleTemperatureChange.bind(this)}
              autoFocus />

            <input type="number"
              className="pure-input-1"
              placeholder="Wind speed (MPH)"
              onChange={this._handleWindSpeedChange.bind(this)} />
          </div>
        </form>

        {!isNaN(windchillTemp) && (
          <div className="pure-u-1">
            <span style={styles.windchill}>
              Feels like {windchillTemp}F
            </span>
          </div>
        )}
      </div>
    )
  }
}

var styles = {
  windchill: {
    fontSize: 26,
    fontWeight: 300,
    textAlign: 'center',
    display: 'block',
    margin: '30px 0',
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
