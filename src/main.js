import ReactDOM from 'react-dom'
import React from 'react'
import jsonp from 'jsonp'
import { windchill } from 'weather-tools'
import convertTemp from './convertTemp'
import convertSpeed from './convertSpeed'
import './styles/main.css'

const US_UNITS = 'US'
const SI_UNITS = 'SI'

const UNITS = {
  SI: {
    temperature: 'C',
    windSpeed: 'KPH'
  },
  US: {
    temperature: 'F',
    windSpeed: 'MPH'
  }
}

var status = {
  location: 'Getting your location...',
  forecast: 'Getting your forecast...',
  ready: ''
}

var getBounds = (units) => {
  var MAX_TEMP, MIN_SPEED, { bounds } = windchill

  if (units === US_UNITS) {
    MAX_TEMP = bounds.US_TEMP_MAX
    MIN_SPEED = bounds.US_SPEED_MIN
  } else {
    MAX_TEMP = bounds.SI_TEMP_MAX
    MIN_SPEED = bounds.SI_SPEED_MIN
  }

  return {
    MAX_TEMP, MIN_SPEED
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      temperature: null,
      windSpeed: null,
      location: null,
      unitSystem: US_UNITS,
      units: UNITS[US_UNITS],
      bounds: getBounds(US_UNITS),
      status: status.location
    }
  }

  componentWillMount() {
    this._getLocation()
  }

  _handleTemperatureChange(e) {
    var { value } = e.currentTarget

    this.setState({
      temperature: value
    })
  }

  _handleWindSpeedChange(e) {
    var { value } = e.currentTarget

    this.setState({
      windSpeed: value
    })
  }

  _handleInputFocus(e) {
    setTimeout(function() {
      e.target.select()
    }, 0)
  }

  _handleChangeUnit(newUnit, e) {
    e.preventDefault()
    if (this.state.unitSystem === newUnit) return

    this.setState({
      unitSystem: newUnit,
      units: UNITS[newUnit],
      bounds: getBounds(newUnit),
      temperature: convertTemp(this.state.temperature, this.state.unitSystem),
      windSpeed: convertSpeed(this.state.windSpeed, this.state.unitSystem),
    })
  }

  _getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ status: status.forecast })
        this._getForecast(position.coords)
      })
    } else {
      this.setState({
        status: 'Location not supported'
      })
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

  _windchill(temp, speed) {
    var system = this.state.unitSystem.toLowerCase()
    return windchill[system](+temp, +speed)
  }

  render() {
    var { temperature, windSpeed } = this.state
    var windchillTemp = this._windchill(+temperature, +windSpeed)

    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-2-3">
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

          <div className="pure-u-1-3">
            <div className="unit-toggle pull-right">
              <a href="#"
                className={this.state.unitSystem === US_UNITS ? 'active' : ''}
                onClick={this._handleChangeUnit.bind(this, US_UNITS)}>
                {US_UNITS}
              </a>
              <a href="#"
                className={this.state.unitSystem === SI_UNITS ? 'active' : ''}
                onClick={this._handleChangeUnit.bind(this, SI_UNITS)}>
                {SI_UNITS}
              </a>
            </div>
          </div>
        </div>

        <div className="pure-g">
          <form className="pure-form pure-u-1">
            <div className="pure-control-group">
              <input type="number"
                className="pure-input-1"
                placeholder="Temperature"
                onChange={this._handleTemperatureChange.bind(this)}
                onFocus={this._handleInputFocus.bind(this)}
                value={this.state.temperature}
                pattern="[0-9]*"
                max={this.state.bounds.MAX_TEMP}
                autoFocus />
              <span className="inline-label">{this.state.units.temperature}</span>
              <p className="help-block">
                {this.state.bounds.MAX_TEMP}{this.state.units.temperature} max
              </p>
            </div>

            <div className="pure-control-group">
              <input type="number"
                className="pure-input-1"
                placeholder="Wind speed"
                onChange={this._handleWindSpeedChange.bind(this)}
                onFocus={this._handleInputFocus.bind(this)}
                value={this.state.windSpeed}
                min={this.state.bounds.MIN_SPEED}
                step="any"
                pattern="[0-9]*" />
              <span className="inline-label">{this.state.units.windSpeed}</span>
              <p className="help-block">
                {this.state.bounds.MIN_SPEED}{this.state.units.windSpeed} min
              </p>
            </div>
          </form>

          {windchillTemp && !isNaN(windchillTemp) && (
            <div className="pure-u-1">
              <span style={styles.windchill}>
                Feels like {windchillTemp}{this.state.units.temperature}
              </span>
            </div>
          )}
        </div>
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
