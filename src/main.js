import ReactDOM from 'react-dom'
import React from 'react'
import jsonp from 'jsonp'
import {windchill} from 'weather-tools'

var status = {
  location: 'Getting your location...',
  forecast: 'Getting your forecast...',
  ready: ''
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      temperature: null,
      windSpeed: null,
      location: null,
      status: status.location
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

  _handleInputFocus(e) {
    setTimeout(function() {
      e.target.select()
    }, 0)
  }

  _getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ status: status.forecast })
        this._getForecast(position.coords)
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
        temperature: parseInt(resp.currently.temperature),
        windSpeed: parseInt(resp.currently.windSpeed),
        status: status.ready
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
        <div className="pure-u-1">
          <p>
            <small style={styles.textMuted}>
              {this.state.status || ' '}
            </small>
          </p>
        </div>

        <form className="pure-form pure-u-1">
          <div className="pure-group">
            <input type="number"
              className="pure-input-1"
              placeholder="Temperature (F)"
              onChange={this._handleTemperatureChange.bind(this)}
              onFocus={this._handleInputFocus.bind(this)}
              value={this.state.temperature}
              pattern="[0-9]*"
              autoFocus />

            <input type="number"
              className="pure-input-1"
              placeholder="Wind speed (MPH)"
              onChange={this._handleWindSpeedChange.bind(this)}
              onFocus={this._handleInputFocus.bind(this)}
              value={this.state.windSpeed}
              pattern="[0-9]*" />
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
  },
  textMuted: {
    color: '#aaa'
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
