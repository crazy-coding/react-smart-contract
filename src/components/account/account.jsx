import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card,
} from '@material-ui/core';
import { colors } from '../../theme'

import UnlockModal from '../unlock/unlockModal.jsx'
import RefreshIcon from '@material-ui/icons/Refresh';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import axios from 'axios';

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  connectHeading: {
    maxWidth: '300px',
    textAlign: 'center',
    color: colors.white
  },
  connectContainer: {
    padding: '20px'
  },
  actionButton: {
    color: colors.white,
    borderColor: colors.white
  },
  notConnectedRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectedRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
  rootbuy: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '300px',
    margin: 'auto',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  },
  cardbuy: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: '20px',
    transition: 'background-color 0.2s linear',
    minHeight: '58px',
    minWidth: '346px',
    background: '#2C2F33',
    boxShadow: '-12px -12px 20px #363D46, 10px 10px 20px #23272C',
    borderRadius: '10px',
    color: '#CEDBDC'
  },
  earnbuy: {
    backgroundColor: '#2C2F33',
    '&:hover': {
      backgroundColor: '#1abc9c0d',
    },
  },

  address: {
    color: colors.white,
    width: '100%',
    paddingBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  balances: {
    color: colors.white,
    width: '100%',
    padding: '12px'
  },
  balanceContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  accountHeading: {
    paddingBottom: '6px'
  },
  icon: {
    cursor: 'pointer'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: '28px 30px',
    margin: '20px',
    transition: 'background-color 0.2s linear',
    minHeight: '210px',
    minWidth: '333px',
    maxWidth: '333px',
    
    background: '#2C2F33',
    boxShadow: '-12px -12px 20px #363D47, 10px 10px 24px #1F2327',
    borderRadius: '40px',
  },
  inff: {
    backgroundColor: '#2C2F33',
    color: '#989898',
    fontSize: '0.9rem',
    padding: '15px',
    margin: '20px',
    width: '100%',
    textAlign: 'right',
    boxShadow: 'inset -6.22302px -6.22302px 6.22302px #363E48, inset 3.73381px 3.73381px 6.22302px #000000',
    borderRadius: '12px',
    fontWeight: 'bold',
  },
  inffspan: {
    color: '#fff',
  },
  earn: {
    backgroundColor: '#2C2F33',
    color: colors.green,
    '&:hover': {
      backgroundColor: '#1abc9c0d',
      cursor: 'pointer',
    },
  },
  title: {
    padding: '24px',
  },
  icon: {
    fontSize: '60px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '100px',
    }
  },
  rootcard: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  },
  poolcard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
    minHeight: '200px',
    minWidth: '346px',
    width: '850px',
  },
  poolblock: {
    minHeight: '70px',
    width: '420px',
    display: 'flex',
    flexDirection: 'row',
  },
  infblock: {
    minHeight: '70px',
    width: '420px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  smallcard: {
    padding: '10px',
    margin: '20px',
    height: '56px',
    width: '146px',
    color: colors.green,
    background: '#2C2F33',
    boxShadow: '-12px -12px 20px #363D46, 10px 10px 20px #23272C',
    borderRadius: '10px'
  },
  aprcard: {
    padding: '15px',
    margin: '20px',
    height: '56px',
    width: '194px',
    color: colors.green,
    textAlign: 'right',
    background: '#2C2F33',
    boxShadow: 'inset -6.22302px -6.22302px 6.22302px #363E48, inset 3.73381px 3.73381px 6.22302px #000000',
    borderRadius: '12px',
    fontWeight: 'bold',
  },
  poolWebsite: {
    color: '#CEDBDC',
  },

});

class Account extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      loading: false,
      account: account,
      assets: store.getStore('assets'),
      modalOpen: false,
      prices: {
              ffyieth:0,
              ffyiusd:0,
              uffyieth:0,
              uffyiusd:0,
              govapr:0,
              daiapr:0,
              kncapr:0,
              uniffyiapr:0,
              uniuffyiapr:0,
              ethapr:0

      }
    }
  }
  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
  };

  connectionConnected = () => {
    // this.setState({ account: store.getStore('account') })
  };

  configureReturned = () => {
    // this.props.history.push('/')
  }

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account'), loading: false })
  }

  errorReturned = (error) => {
    //TODO: handle errors
  };

  render() {
    const { classes } = this.props;
    const {
      account,
      modalOpen,
    } = this.state
    
    axios.get('/api/v1/prices')
      .then( (response) => {

        console.log("response", this.state.prices);
        this.setState({prices: response.data});
        console.log("response", this.state.prices);
      })
      .catch( (error) => {
        console.log(error);
      });  

    return (
      <div className={ classes.firstroot }>
        <div className={ classes.root }>
          { this.renderNotConnected() }
          { modalOpen && this.renderModal() }
        </div>

        <div className={ classes.rootbuy }>
          <Card className={ `${classes.cardbuy} ${classes.earnbuy} longbutton` } >
            <Typography variant={'h3'} className={ `${classes.title} title` }>Trade FFYI
              <a href="https://uniswap.exchange/swap?inputCurrency=ETH&outputCurrency=0xca76baa777d749de63ca044853d22d56bc70bb47" target="_blank" rel="noopener noreferrer"  >
                <img alt="" src={ require('../../assets/UNI-logo.png') } height="36px" style={{ verticalAlign: 'bottom' }} />
              </a>
              <a href="https://www.probit.com/r/77218181" target="_blank" rel="noopener noreferrer"  >
                <img alt="" src={ require('../../assets/PROBIT-logo.png') } height="30px" style={{ verticalAlign: 'sub' }} />
              </a>
            </Typography>

          </Card>
          <Card className={ `${classes.cardbuy} ${classes.earnbuy} longbutton` }>
            <Typography variant={'h3'} className={ `${classes.title} title` }>Trade uFFYI
              <a href="https://uniswap.exchange/swap?inputCurrency=ETH&outputCurrency=0x021576770cb3729716ccfb687afdb4c6bf720cb6" target="_blank" rel="noopener noreferrer"  >
                <img alt="" src={ require('../../assets/UNI-logo.png') } height="36px" style={{ verticalAlign: 'bottom' }} />
              </a>
              <a href="https://www.probit.com/r/77218181" target="_blank" rel="noopener noreferrer"  >
                <img alt="" src={ require('../../assets/PROBIT-logo.png') } height="30px" style={{ verticalAlign: 'sub' }} />
              </a>
            </Typography>

          </Card>
        </div>
        <div className={ classes.rootbuy }>
          <Card className={ `${classes.cardbuy} longbutton` }>
            <Typography variant={'h3'} className={ `${classes.title} title` }>{ this.state.prices.ffyiusd }</Typography>
            
          </Card>
          <Card className={ `${classes.cardbuy} longbutton` }>
            <Typography variant={'h3'} className={ `${classes.title} title` }>{ this.state.prices.uffyiusd }</Typography>
            
          </Card>
        </div>
      </div>
    )
  };

  renderNotConnected = () => {
    const { classes } = this.props
    const { loading } = this.state

    return (
      <div className={ classes.notConnectedRoot }>
        <div className={ classes.rootcard }>
          <div className={ `${classes.inffblock}` }>
            <Card className={ `${classes.inff} field` }>
              <p><span className={ classes.inffspan }>FFYI</span> - Fiscus.fyi Governance Token, Max supply 60000. This is used to vote on motions and receives a potion of the platforms revenue.</p>
            </Card>
            <Card className={ `${classes.inff} field` }>
              <p><span className={ classes.inffspan }>FFYI</span>  - Fiscus.fyi Governance Token, Max supply 60000. This is used to vote on motions and receives a potion of the platforms revenue.</p>
            </Card>
            <Card className={ `${classes.inff} field` }>
              <p><span className={ classes.inffspan }>uFFYI</span>  - Yields are paid out in uFFYI. uFFYI has an unlimited supply and features a token burn.</p>
            </Card>
            <Card className={ `${classes.inff} field` }>
              <p><span className={ classes.inffspan }>Burn</span>  - All interest from the staking pools is used to buy back and burn uFFYI. Decreasing the total supply. </p>
            </Card>
            <Card className={ `${classes.inff} field` }>
              <p><span className={ classes.inffspan }>FFYI Revenue Share pool</span>  - Rewards FFYI RS pool stakers by charging a claim fee of 0.5% in other pools.</p>
            </Card>
            <Card className={ `${classes.inff} field` }>
              <p><span className={ classes.inffspan }>Locked liquidity</span>  - Team's locked liquidty for one year.</p>
            </Card>
            <Card className={ `${classes.inff} field` }>
              <p><span className={ classes.inffspan }>Liquidity lock proof</span>  - <a href="https://www.unicrypt.network/uniswap-browser/pair/0x233904dA250E2Eb4dDFEA71e117b634b03E7634a">FFYI</a> <a href="https://www.unicrypt.network/uniswap-browser/pair/0xe3E15B09e1a8cB96032690448a18173b170A8d5C">uFFYI</a></p>
            </Card>
          </div>
          <Card className={ `${classes.card} ${classes.earn} longbutton` } onClick={ this.unlockClicked }>
            <LockOpenIcon className={ `${classes.icon} icon` } />
            <Typography variant={'h3'} className={ `${classes.title} title` }>Enter</Typography>
          </Card>
        </div>
        <div className={ `${classes.poolcard}` }>
          <div className={ `${classes.poolblock}` }>
            <Card className={ `${classes.smallcard} smallbutton` }>
              <Typography variant='h4' className={ classes.poolWebsite }>
                <img alt="" src={ require('../../assets/uFFYI-logo.png') } height="36px" style={{ verticalAlign: 'middle' }} /> uFFYI</Typography>
            </Card>
            <Card className={ `${classes.aprcard} field mob145` }>
              { this.state.prices.govapr }%
            </Card>
          </div>
          <div className={ `${classes.poolblock}` }>
            <Card className={ `${classes.smallcard} smallbutton` }>
              <Typography variant='h4' className={ classes.poolWebsite }>
                <img alt="" src={ require('../../assets/UNI-logo.png') } height="36px" style={{ verticalAlign: 'middle' }} /> FFYI LP</Typography>
            </Card>
            <Card className={ `${classes.aprcard} field mob145` }>
              { this.state.prices.uniffyiapr }%
            </Card>
          </div>
          <div className={ `${classes.poolblock}` }>
            <Card className={ `${classes.smallcard} smallbutton` }>
              <Typography variant='h4' className={ classes.poolWebsite }>
                <img alt="" src={ require('../../assets/UNI-logo.png') } height="36px" style={{ verticalAlign: 'middle' }} /> uFFYI LP</Typography>
            </Card>
            <Card className={ `${classes.aprcard} field mob145` }>
              { this.state.prices.uniuffyiapr }%
            </Card>
          </div>
          <div className={ `${classes.poolblock}` }>
            <Card className={ `${classes.smallcard} smallbutton` }>
              <Typography variant='h4' className={ classes.poolWebsite }>
                <img alt="" src={ require('../../assets/ETH-logo.png') } height="36px" style={{ verticalAlign: 'middle' }} /> ETH</Typography>
            </Card>
            <Card className={ `${classes.aprcard} field mob145` }>
              { this.state.prices.ethapr }%
            </Card>
          </div>
          <div className={ `${classes.poolblock}` }>
            <Card className={ `${classes.smallcard} smallbutton` }>
              <Typography variant='h4' className={ classes.poolWebsite }>
                <img alt="" src={ require('../../assets/DAI-logo.png') } height="36px" style={{ verticalAlign: 'middle' }} /> DAI</Typography>
            </Card>
            <Card className={ `${classes.aprcard} field mob145` }>
              { this.state.prices.daiapr }%
            </Card>
          </div>
          <div className={ `${classes.poolblock}` }>
            <Card className={ `${classes.smallcard} smallbutton` }>
              <Typography variant='h4' className={ classes.poolWebsite }>
                <img alt="" src={ require('../../assets/KNC-logo.png') } height="36px" style={{ verticalAlign: 'middle' }} /> KNC</Typography>
            </Card>
            <Card className={ `${classes.aprcard} field mob145` }>
              { this.state.prices.kncapr }%
            </Card>
          </div>
        </div>
        
      </div>
    )
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  unlockClicked = () => {
    this.setState({ modalOpen: true, loading: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false, loading: false })
  }
}

export default withRouter(withStyles(styles)(Account));
