import ReactDOM from 'react-dom'
import React from 'react'
import jsonp from 'jsonp'
import { windchill } from 'weather-tools'
import convertTemp from '../convertTemp'
import convertSpeed from '../convertSpeed'
import '../styles/main.css'

const US_UNITS = 'US'
const SI_UNITS = 'SI'

const UNITS = {
  SI: {
    temperature: 'C',
    speed: 'KPH'
  },
  US: {
    temperature: 'F',
    speed: 'MPH'
  }
}

var status = {
  location: 'Getting your location...',
  forecast: 'Getting your forecast...',
  ready: ''
}

var isNumber = (n) => typeof n === 'number'

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

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      temperature: null,
      speed: null,
      location: null,
      unitSystem: localStorage.getItem('unit-system') || US_UNITS,
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
      speed: value
    })
  }

  _handleChangeUnit(newUnit, e) {
    e.preventDefault()
    if (this.state.unitSystem === newUnit) return

    localStorage.setItem('unit-system', newUnit)

    this.setState({
      unitSystem: newUnit,
      units: UNITS[newUnit],
      bounds: getBounds(newUnit),
      temperature: convertTemp(this.state.temperature, this.state.unitSystem),
      speed: convertSpeed(this.state.speed, this.state.unitSystem),
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
      if (err) {
        this.setState({
          status: err
        })
        return
      }

      var currentTemp = parseInt(resp.currently.temperature)
      var currentSpeed = parseInt(resp.currently.windSpeed)

      if (this.state.unitSystem === SI_UNITS) {
        currentTemp = convertTemp(currentTemp, US_UNITS)
        currentSpeed = convertSpeed(currentSpeed, US_UNITS)
      }

      this.setState({
        temperature: this.state.temperature || currentTemp,
        speed: this.state.speed || currentSpeed,
        status: status.ready
      })
    })
  }

  _windchill(temp, speed) {
    var system = this.state.unitSystem.toLowerCase()

    if (+temp > this.state.bounds.MAX_TEMP || +speed < this.state.bounds.MIN_SPEED) {
      return temp
    } else {
      return windchill[system](+temp, +speed)
    }
  }

  render() {
    var { temperature, speed } = this.state
    var windchillTemp = this._windchill(temperature, speed)

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
                id="temperature"
                className="pure-input-1"
                placeholder="Temperature"
                onChange={this._handleTemperatureChange.bind(this)}
                value={this.state.temperature}
                pattern="[0-9]*"
                step="any"
                autoFocus />
              <label htmlFor="temperature" className="inline-label">
                {this.state.units.temperature}
              </label>

              <p className="help-block">
                {this.state.bounds.MAX_TEMP}{this.state.units.temperature} max
              </p>
            </div>

            <div className="pure-control-group">
              <input type="number"
                id="wind-speed"
                className="pure-input-1"
                placeholder="Wind speed"
                onChange={this._handleWindSpeedChange.bind(this)}
                value={this.state.speed}
                step="any"
                pattern="[0-9]*" />
              <label htmlFor="wind-speed" className="inline-label">
                {this.state.units.speed}
              </label>

              <p className="help-block">
                {this.state.bounds.MIN_SPEED}{this.state.units.speed} min
              </p>
            </div>
          </form>

          {isNumber(windchillTemp) && (
            <div className="pure-u-1">
              <span className='windchill'>
                Feels like {windchillTemp}{this.state.units.temperature}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
}
