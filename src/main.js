import ReactDOM from 'react-dom'
import React from 'react'
import jsonp from 'jsonp'
import {windchill} from 'weather-tools'
import './styles/main.css'

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
    var { value } = e.currentTarget

    this.setState({
      temperature: value,
      error: (value && value > 50) ? 'Temperature must be at most 50F' : ''
    })
  }

  _handleWindSpeedChange(e) {
    var { value } = e.currentTarget

    this.setState({
      windSpeed: value,
      error: (value && value < 3) ? 'Wind speed must be at least 3MPH' : ''
    })
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
        temperature: this.state.temperature || parseInt(resp.currently.temperature),
        windSpeed: this.state.windSpeed || parseInt(resp.currently.windSpeed),
        status: status.ready
      })
    })
  }

  _isValid(state) {
    if (+state.temperature <= 50 && +state.windSpeed >= 3) {
      return true
    }

    return false
  }

  render() {
    var { temperature, windSpeed } = this.state

    if (this._isValid(this.state)) {
      var windchillTemp = windchill(+temperature, +windSpeed)
    }

    return (
      <div className="pure-g">
        <div className="pure-u-1">
          <p className="app-status">
            {this.state.status && (
              <small className="text-muted">
                {this.state.status}
              </small>
            )}

            {this.state.error && (
              <small className="text-danger">
                {this.state.error}
              </small>
            )}
          </p>
        </div>

        <form className="pure-form pure-u-1">
          <div className="pure-control-group">
            <input type="number"
              className="pure-input-1"
              placeholder="Temperature"
              onChange={this._handleTemperatureChange.bind(this)}
              onFocus={this._handleInputFocus.bind(this)}
              value={this.state.temperature}
              pattern="[0-9]*"
              max="50"
              autoFocus />
            <span className="inline-label">F</span>
            <p className="help-block">
              50F max
            </p>
          </div>

          <div className="pure-control-group">
            <input type="number"
              className="pure-input-1"
              placeholder="Wind speed"
              onChange={this._handleWindSpeedChange.bind(this)}
              onFocus={this._handleInputFocus.bind(this)}
              value={this.state.windSpeed}
              min="3"
              pattern="[0-9]*" />
            <span className="inline-label">MPH</span>
            <p className="help-block">
              3MPH min
            </p>
          </div>
        </form>

        {windchillTemp && !isNaN(windchillTemp) && (
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
}

ReactDOM.render(<App />, document.getElementById('app'))
