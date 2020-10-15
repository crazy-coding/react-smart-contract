import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import {
  Link
} from "react-router-dom";
import { withNamespaces } from 'react-i18next';
import i18n from '../../i18n';
import { colors } from '../../theme'
import VersionToggle from '../../components/versionToggle';

import Store from "../../stores";
import {
  GOVERNANCE_CONTRACT_CHANGED
} from '../../constants'

const store = Store.store


const styles = theme => ({
  footer: {
    top: '0px',
    padding: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    }
  },
  footerLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '640px'
  },
  footerLinksRight: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  footerText: {
    cursor: 'pointer'
  },
  languageContainer: {
    paddingLeft: '12px',
    display: 'none'
  },
  selectInput: {
    fontSize: '14px',
    color: colors.pink
  },
  link: {
    textDecoration: 'none'
  },
  title: {
    padding: '12px',
    color: '#989898',
    paddingBottom: '0px',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '12px'
    }
  },

});

const emitter = Store.emitter


class Footer extends Component {

  constructor(props) {
    super()

    this.state = {
      languages: store.getStore('languages'),
      language: 'en',
      value: store.getStore('governanceContractVersion'),
    }
  }
  
  componentWillMount() {
    emitter.on(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);
  }

  componentWillUnmount() {
    emitter.removeListener(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);
  };

  setGovernanceContract = () => {
    this.setState({ value: store.getStore('governanceContractVersion') })
  }

  render() {
    const { classes, t, location } = this.props;
    const { value } = this.state

    return (
      <div className={classes.footer}>
        <div className={classes.footerLinks}>
          <Link to={"/"} className={ classes.link }>
            { value === 'day' && this.renderLight() }
            { value === 'night' && this.renderNight() }
          </Link>
          <a href="https://docs.fiscus.fyi" className={ `${classes.link} onlypcandtablet` }>
              <Typography className={ `${classes.title} dlink` } variant={'h6'}>Documents</Typography>
          </a>
          {/*<a href="https://forum.fiscus.fyi" className={ `${classes.link} onlypcandtablet` }>
              <Typography className={ `${classes.title} dlink` } variant={'h6'}>Forum</Typography>
          </a>*/}
          <a href="https://fiscus.fyi/icon/roadmap.png" className={ `${classes.link} onlypcandtablet` }>
              <Typography className={ `${classes.title} dlink` } variant={'h6'}>Roadmap</Typography>
          </a>

        </div>
        <div className={ `${classes.footerLinksRight} mediaicons` }>
          <VersionToggle />
          <a href="https://twitter.com/fiscusfyi" className={classes.link} target="_blank" rel="noopener noreferrer" style={{ padding: '4px' }}>
            <img src={require('../../assets/twitterlogo.png')} alt='Twitter' height='24px'/>
          </a>
          <a href="https://medium.com/@fiscus.fyi" className={classes.link} target="_blank" rel="noopener noreferrer" style={{ padding: '4px' }}>
            <img src={require('../../assets/mediumlogo.png')} alt='Medium' height='24px'/>
          </a>
          <a href="https://t.me/fiscusfyi" className={classes.link} target="_blank" rel="noopener noreferrer" style={{ padding: '4px' }}>
            <img src={require('../../assets/telegramlogo.png')} alt='Telegram' height='24px'/>
          </a>
          <a href="https://discord.gg/2a66cxX" className={classes.link} target="_blank" rel="noopener noreferrer" style={{ padding: '4px' }}>
            <img src={require('../../assets/discordlogo.png')} alt='Discord' height='24px'/>
          </a>
          
        </div>
      </div>

    )
  }

  renderLight = () => {
    const { value } = this.state
    const { classes } = this.props

    return (
      <img src={require('../../assets/logo.png')} alt='Fiscus' height='48px'/>
    )
  }

  renderNight = () => {
    const { value } = this.state
    const { classes } = this.props

    return (
      <img src={require('../../assets/logo_night.png')} alt='Fiscus' height='48px'/>
    )
  }

}

export default withNamespaces()(withRouter(withStyles(styles)(Footer)));
