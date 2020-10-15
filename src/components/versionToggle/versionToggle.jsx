import React, { Component } from "react";
import {
  Typography,
  Tooltip
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { colors } from "../../theme";
import { withNamespaces } from 'react-i18next';

import {
  GOVERNANCE_CONTRACT_CHANGED
} from '../../constants'

import config from '../../config'
import Store from "../../stores";
const store = Store.store
const emitter = Store.emitter

const styles = theme => ({
  versionToggleContainer: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 999
  }
})

class VersionToggle extends Component {

  state = {
    value: store.getStore('governanceContractVersion'),
  };

  render() {

    const { value } = this.state
    const { classes } = this.props


    return (
      <div>
        { value === 'day' && this.renderLight() }
        { value === 'night' && this.renderNight() }
      </div>
    );
  }

  
  clickedLight = () => {
    const { value } = this.state
    if (value === 'day') {
      this.setState({ value : 'night' })
      store.setStore({ governanceContractVersion: 'night' })
      emitter.emit(GOVERNANCE_CONTRACT_CHANGED)
    } else {
      this.setState({ value : 'day' })
      store.setStore({ governanceContractVersion: 'day' })
      emitter.emit(GOVERNANCE_CONTRACT_CHANGED)
    }
  }

  renderLight = () => {
    const { value } = this.state
    const { classes } = this.props

    return (
      <div>
        <div style={{ position: 'relative', width: '66px', height: '33px' }}  onClick={this.clickedLight}>
        <div style={{ position: 'absolute', width: '33.34px', height: '33.34px', left: '0', top:'0', background:'#E5F6F4', borderRadius: '40px', transform: 'rotate(-90deg)' }}></div>
        <div style={{ width: '52.1px', height: '22.92px', left: '10px', top: '5px', background: '#F8FAFA', boxShadow: 'inset -1px -1px 10px #F8FAFA, inset 2px 2px 2px #C8D1DD', borderRadius: '40px', position: 'absolute' }}></div>
        <div style={{ position: 'absolute', width: '33.34px', height: '33.34px', left: '0', top: '0', background: '#E5F6F4', boxShadow: '-10px -10px 18px rgba(255, 255, 255, 0.8), 10px 10px 18px rgba(166, 180, 200, 0.65)', borderRadius: '40px', transform: 'rotate(-90deg)' }}></div>
        </div>
      </div>
    )
  }

  renderNight = () => {
    const { value } = this.state
    const { classes } = this.props

    return (
      <div>
        <div style={{ position: 'relative', width: '66px', height: '33px' }}  onClick={this.clickedLight}>
        <div style={{ position: 'absolute', width: '33.34px', height: '33.34px', left: '33px', top:'0', background:'#2C2F33', borderRadius: '40px', transform: 'rotate(-90deg)' }}></div>
        <div style={{ width: '52.1px', height: '22.92px', left: '10px', top: '5px', background: '#5886FF', boxShadow: 'inset 5px 4px 6px #354B86', borderRadius: '40px', position: 'absolute' }}></div>
        <div style={{ position: 'absolute', width: '33.34px', height: '33.34px', left: '33px', top: '0', background: '#2C2F33', boxShadow: '-10px -10px 18px #343B44, 10px 10px 18px #0A0B0B', borderRadius: '40px', transform: 'rotate(-90deg)' }}></div>
        </div>
      </div>
    )
  }

}

export default withNamespaces()(withStyles(styles)(VersionToggle));
