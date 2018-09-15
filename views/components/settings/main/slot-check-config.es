import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, FormControl, FormGroup, InputGroup, Form, Collapse, Card } from 'react-bootstrap'
import { get } from 'lodash'
import { translate } from 'react-i18next'

const { config } = window

@translate(['setting'])
@connect((state, props) => ({
  type: props.type,
  enable: get(state.config, `poi.mapStartCheck.${props.type}.enable`, false),
  minFreeSlots: get(state.config, `poi.mapStartCheck.${props.type}.minFreeSlots`, ''),
}))
export class SlotCheckConfig extends Component {
  static propTypes = {
    minFreeSlots: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    type: PropTypes.string,
    enable: PropTypes.bool,
  }
  constructor(props) {
    super(props)
    this.state = {
      showInput: false,
      value: props.minFreeSlots,
    }
  }
  CheckValid = (v) =>
    (!isNaN(parseInt(v)) && parseInt(v) >= 0)
  handleToggleInput = () => {
    if (this.state.showInput) {
      this.handleDisable()
    } else {
      const num = this.state.value
      this.setState({
        showInput: true,
        value: this.CheckValid(num) ? parseInt(num) : '',
      })
    }
  }
  handleChange = (e) => {
    this.setState({value: e.target.value})
  }
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.CheckValid(this.state.value)) {
      const n = parseInt(this.state.value)
      config.set(`poi.mapStartCheck.${this.props.type}`, {
        enable: true,
        minFreeSlots: n,
      })
      this.setState({
        showInput: false,
        value: n,
      })
    } else {
      this.handleDisable()
    }
  }
  handleDisable = () => {
    config.set(`poi.mapStartCheck.${this.props.type}.enable`, false)
    this.setState({showInput: false})
  }
  render() {
    const { t, enable } = this.props
    let toggleBtnStyle = enable ? 'success' : 'default'
    if (this.state.showInput) {
      toggleBtnStyle = 'danger'
    }
    let toggleBtnTxt = enable ? 'ON' : 'OFF'
    if (this.state.showInput) {
      toggleBtnTxt = t('setting:Disable')
    }
    const toggleBtn = <Button onClick={this.handleToggleInput} size='xs'
      variant={toggleBtnStyle} style={{verticalAlign: 'text-bottom'}}>
      {toggleBtnTxt}
    </Button>
    const inputValid = this.CheckValid(this.state.value)
    const submitBtn = <Button type='submit'
      variant={inputValid ? 'success' : 'danger'}>
      {inputValid ? t('setting:Save') : t('setting:Disable')}
    </Button>
    return (
      <div style={{margin: '5px 15px'}}>
        <form onSubmit={this.handleSubmit}>
          <div>
            {t(`setting:${this.props.type} slots`)} {toggleBtn}
          </div>
          <Collapse in={this.state.showInput}>
            <Card>
              <FormGroup>
                <Form.Label>{t(`setting:Warn if the number of free ${this.props.type} slots is less than`)}</Form.Label>
                <InputGroup size='small'>
                  <FormControl type="text"
                    variant={inputValid ? 'success' : 'error'}
                    value={this.state.value}
                    onChange={this.handleChange}/>
                  <InputGroup.Append>
                    {submitBtn}
                  </InputGroup.Append>
                </InputGroup>
              </FormGroup>
            </Card>
          </Collapse>
        </form>
      </div>
    )
  }
}
