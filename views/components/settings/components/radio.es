import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Col, Container, Form } from 'react-bootstrap'
import { get } from 'lodash'

const { config } = window

@connect((state, props) => ({
  value: get(state.config, props.configName, props.defaultVal),
  configName: props.configName,
  label: props.label,
  availableVal: props.availableVal,
}))
export class RadioConfig extends Component {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    configName: PropTypes.string,
    value: PropTypes.string,
    availableVal: PropTypes.array,
  }
  onSelect = (value) => {
    config.set(this.props.configName, value)
  }
  render() {
    return (
      <Container>
        {
          this.props.availableVal.map((item, index) => {
            return (
              <Col key={index} xs={3}>
                <Form.Check type="radio" checked={this.props.value === item.value}
                  onChange={this.onSelect.bind(this, item.value)} >
                  {item.name}
                </Form.Check>
              </Col>
            )
          })
        }
      </Container>
    )
  }
}
