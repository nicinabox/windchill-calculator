import ReactDOM from 'react-dom'
import React from 'react'
import jsonp from 'jsonp'
import {windchill} from 'weather-tools'

const {FORECAST_API_KEY} = process.env

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      temperature: null,
      windSpeed: null,
    }
  }

  componentWillMount() {
    this._getLocation()
  }

  _handleTemperatureChange(e) {
    this.setState({ temperature: e.currentTarget.value })
  }

  _handleWindSpeedChange(e) {
    this.setState({ windSpeed: e.currentTarget.value })
  }

  _getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this._getForecast(position.coords);
      })
    } else {
      console.warn('geolocation not supported')
    }
  }

  _getForecast(coords) {
    var { latitude, longitude } = coords
    var url = `https://api.forecast.io/forecast/${FORECAST_API_KEY}/${[latitude, longitude].join(',')}`

    return jsonp(url, (err, resp) => {
      this.setState({
        temperature: resp.currently.temperature,
        windSpeed: resp.currently.windSpeed
      })
    })
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
              value={this.state.temperature}
              autoFocus />

            <input type="number"
              className="pure-input-1"
              placeholder="Wind speed (MPH)"
              value={this.state.windSpeed}
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
