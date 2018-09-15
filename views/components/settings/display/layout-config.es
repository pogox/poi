import { Container, Col, Button, ButtonGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import i18next from 'views/env-parts/i18next'

const { config, toggleModal } = window

@connect((state, props) => ({
  layout: get(state.config, 'poi.layout.mode', 'horizontal'),
  enableDoubleTabbed: get(state.config, 'poi.tabarea.double', false),
  verticalDoubleTabbed: get(state.config, 'poi.tabarea.vertical', false),
  reversed: get(state.config, 'poi.layout.reverse', false),
  isolateGameWindow: get(state.config, 'poi.layout.isolate', false),
  overlayPanel: get(state.config, 'poi.layout.overlay', false),
}))
export class LayoutConfig extends Component {
  static propTypes = {
    enableDoubleTabbed: PropTypes.bool,
    layout: PropTypes.string,
    reversed: PropTypes.bool,
    isolateGameWindow: PropTypes.bool,
  }
  createConfirmModal = callback => {
    const title = i18next.t('setting:Apply changes')
    // react-remarkable uses remarkable as parser，
    // remarkable disables HTML by default，
    // react-remarkable's default option dose not enable HTML，
    // it could be considered safe
    const content = i18next.t('setting:Game page will be refreshed')
    const footer = [
      {
        name: i18next.t('others:Confirm'),
        func: callback,
        style: 'warning',
      },
    ]
    toggleModal(title, content, footer)
  }
  handleSetLayout = (layout, rev) => {
    if (this.props.isolateGameWindow) {
      this.createConfirmModal(() => this.setLayout(layout, rev))
    } else {
      this.setLayout(layout, rev)
    }
  }
  setLayout = (layout, rev) => {
    if (this.props.isolateGameWindow) {
      this.setIsolateGameWindow(false)
    }
    if (this.props.overlayPanel) {
      this.setOverlayPanel(false)
    }
    config.set('poi.layout.mode', layout)
    config.set('poi.layout.reverse', rev)
  }
  handleSetIsolateGameWindow = () => {
    if (!this.props.isolateGameWindow) {
      this.createConfirmModal(e => {
        if (this.props.overlayPanel) {
          this.setLayout('horizontal', false)
        }
        this.setIsolateGameWindow(true)
      })
    }
  }
  handleSetOverlayPanel = () => {
    if (this.props.isolateGameWindow) {
      this.createConfirmModal(() => {
        this.setLayout('horizontal', false)
        this.setOverlayPanel(true)
      })
      return
    }
    this.setOverlayPanel(!this.props.overlayPanel)
  }

  setIsolateGameWindow = flag => {
    config.set('poi.layout.isolate', flag)
  }
  setOverlayPanel = flag => {
    config.set('poi.layout.overlay', flag)
  }
  handleSetDoubleTabbed = (doubleTabbed, vertical) => {
    config.set('poi.tabarea.double', doubleTabbed)
    if (doubleTabbed) {
      config.set('poi.tabarea.vertical', vertical)
    }
  }
  render() {
    const { layout, reversed, isolateGameWindow, enableDoubleTabbed, verticalDoubleTabbed, overlayPanel } = this.props
    const leftActive = !overlayPanel && !isolateGameWindow && layout === 'horizontal' && reversed
    const downActive = !overlayPanel && !isolateGameWindow && layout !== 'horizontal' && !reversed
    const upActive = !overlayPanel && !isolateGameWindow && layout !== 'horizontal' && reversed
    const rightActive = !overlayPanel && !isolateGameWindow && layout === 'horizontal' && !reversed && ! overlayPanel
    return (
      <Container>
        <Col xs={12}>
          <ButtonGroup>
            <Button variant={rightActive ? 'success' : 'danger'}
              onClick={e => this.handleSetLayout('horizontal', false)}>
              <a className="layout-button layout-side" />
            </Button>
            <Button variant={downActive ? 'success' : 'danger'}
              onClick={e => this.handleSetLayout('vertical', false)}>
              <a className="layout-button layout-land" />
            </Button>
            <Button variant={upActive ? 'success' : 'danger'}
              onClick={e => this.handleSetLayout('vertical', true)}>
              <a className="layout-button layout-land" style={{ transform: 'scaleY(-1)' }} />
            </Button>
            <Button variant={leftActive ? 'success' : 'danger'}
              onClick={e => this.handleSetLayout('horizontal', true)}>
              <a className="layout-button layout-side" style={{ transform: 'scaleX(-1)' }} />
            </Button>

          </ButtonGroup>
          <ButtonGroup style={{ marginLeft: 25 }}>
            <Button variant={isolateGameWindow ? 'success' : 'danger'}
              onClick={this.handleSetIsolateGameWindow}>
              <a className="layout-button layout-separate" />
            </Button>
            <Button variant={overlayPanel && !isolateGameWindow ? 'success' : 'danger'}
              onClick={e => this.handleSetOverlayPanel()}>
              <a className="layout-button overlay-panel" />
            </Button>
          </ButtonGroup>
        </Col>
        <Col xs={12} style={{ marginTop: 10 }}>
          <ButtonGroup>
            <Button variant={!enableDoubleTabbed ? 'success' : 'danger'}
              onClick={e => this.handleSetDoubleTabbed(false)}>
              <a className="layout-button doubletabbed-disable" style={{ transform: 'scaleX(-1)' }} />
            </Button>
            <Button variant={enableDoubleTabbed && !verticalDoubleTabbed ? 'success' : 'danger'}
              onClick={e => this.handleSetDoubleTabbed(true, false)}>
              <a className="layout-button doubletabbed-horizontal" />
            </Button>
            <Button variant={enableDoubleTabbed && verticalDoubleTabbed ? 'success' : 'danger'}
              onClick={e => this.handleSetDoubleTabbed(true, true)}>
              <a className="layout-button doubletabbed-vertical" style={{ transform: 'scaleY(-1)' }} />
            </Button>
          </ButtonGroup>
        </Col>
      </Container>
    )
  }
}
