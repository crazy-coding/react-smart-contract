import * as moment from 'moment';
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import UnlockModal from '../unlock/unlockModal.jsx'
import Store from "../../stores";
import { colors } from '../../theme'
import axios from 'axios';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import {
  ERROR,
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '1240px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  rootcard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'initial',
    flex: 1,
    padding: '28px 30px',
    margin: '20px',
    minWidth: '346px',
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px 64px',
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',

    alignItems: 'center',
    height: '72px',
    boxShadow: 'inset -6.22302px -6.22302px 6.22302px #363E48, inset 3.73381px 3.73381px 6.22302px #000000',
    borderRadius: '12px',

    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  backtohome: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    color: '#5886FF',
    alignItems: 'center',
    width: '80px',
    height: '72px',
    boxShadow: '-12px -12px 20px #343C46, 10px 10px 20px #1A1D22',
    borderRadius: '10px',

  },
  stakebutton: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '6px',
    color: '#CEDBDC',
    width: '100%',
    boxShadow: '-12px -12px 20px #343C46, 10px 10px 20px #1A1D22',
    borderRadius: '10px',
    textAlign: 'center',
  },
  walletAddress: {
    padding: '0px 12px',
    color: '#CEDBDC'
  },
  walletTitle: {
    flex: 1,
    color: '#989898'
  },
  rewardPools: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '20px',
    flexWrap: 'wrap'
  },
  banners: {
    maxWidth: '300px',
    display: 'flex',
    justifyContent: 'space-around',
    position: 'absolute',
    flexWrap: 'wrap',
    right: '10px'
  },
  rewardPoolContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: '28px 30px',
    margin: '20px',
    minHeight: '300px',
    minWidth: '200px',
    boxShadow: '-12px -12px 20px #363D47, 10px 10px 24px #1F2327',
    borderRadius: '20px',
  },
  title: {
    width: '100%',
    color: '#989898',
    minWidth: '100%',
    textAlign: 'center',
  },
  poolName: {
    color: 'black',
    textAlign: 'center',
    width: '100%',
  },
  arpName: {
    padding: '8px',
    margin: '4px',
    color: colors.text,
    textAlign: 'center',
    width: '100%',
    boxShadow: 'inset -6.22302px -6.22302px 6.22302px #363E48, inset 3.73381px 3.73381px 6.22302px #000000',
    borderRadius: '10px',
    height: '34px',
  },
  tokensList: {
    color: colors.darkGray,
    paddingBottom: '20px',
  },
  poolWebsite: {
    color: colors.darkGray,
    paddingBottom: '20px',
    textDecoration: 'none'
  },
  imageicon: {
    width: '125px',
    height: '125px',
    padding: '20px',
    boxShadow: 'inset -12.446px -12.446px 31.1151px #353C46, inset 12.446px 12.446px 31.1151px #22262A',
    borderRadius: '50%',
  },
  imageiconsmall: {
    width: '100px',
    height: '100px',
    padding: '20px',
    boxShadow: 'inset -12.446px -12.446px 31.1151px #353C46, inset 12.446px 12.446px 31.1151px #22262A',
    borderRadius: '50%',
  },
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class RewardPools extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const rewardPools = store.getStore('rewardPools')

    this.state = {
      rewardPools: rewardPools,
      loading: !(account && rewardPools),
      account: account,
      prices: {
              govstaked:0,
              daistaked:0,
              kncstaked:0,
              uniffyistaked:0,
              uniuffyistaked:0,
              ethstaked:0,
              rsstaked:0,
              govapr:0,
              daiapr:0,
              kncapr:0,
              uniffyiapr:0,
              uniuffyiapr:0,
              ethapr:0,
              rsam:0

      }
    }

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
  }

  componentWillMount() {
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  };


  balancesReturned = () => {
    const rewardPools = store.getStore('rewardPools')
    this.setState({ rewardPools: rewardPools })
  }

  configureReturned = () => {
    this.setState({ loading: false })
  }

  render() {
    const { classes } = this.props;
    const {
      value,
      account,
      loading,
      modalOpen,
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }
    
    axios.get('/api/v1/aprs')
      .then( (response) => {

        console.log("response", this.state.prices);
        this.setState({prices: response.data});
        console.log("response", this.state.prices);
      })
      .catch( (error) => {
        console.log(error);
      });  

    return (
      <div className={ classes.root }>
      
          <div className={ classes.intro }>
            <div style={{ flex:1 }}>
            </div>
            <div style={{ display:'flex', flex:1 }}>
              <Card className={ `${classes.backtohome} longbutton` } onClick={ () => {  this.props.history.push('/') } }>
                <ArrowBackIosIcon className={ `${classes.icon} icon` } />
              </Card>
              <Card className={ `${classes.addressContainer} field` } onClick={this.overlayClicked}>
                <Typography variant={ 'h3'} className={ `${classes.walletTitle} onlypcandtablet`} noWrap>Wallet</Typography>
                <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
                <div style={{ background: colors.green, opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
              </Card>
            </div>
          </div>
      
        <div className={ classes.rootcard }>
          <div className={ classes.rewardPools }>
            <Typography variant={ 'h4'} className={ classes.title } noWrap>Uniswap LP</Typography>
            {
              this.renderUniRewards()
            }
          </div>
          <div className={ `${classes.rewardPools} onlypc` }>
              <Typography variant={ 'h4'} className={ classes.title } noWrap>Wrapped ETH Pools</Typography>
              <div className={ `${classes.rewardPoolContainer} longbutton` } style={{marginTop: '30px' }}>

                <Typography variant='h5' className={ classes.poolWebsite }><a href="" target="_blank">
                  <img alt="" src={ require('../../assets/KNC-logo.png') } height="64px"  className={ `${classes.imageiconsmall} imageicon` } />
                  <img alt="" src={ require('../../assets/LEND-logo.png') } height="64px"  className={ `${classes.imageiconsmall} imageicon` } />
                  <img alt="" src={ require('../../assets/MANA-logo.png') } height="64px"  className={ `${classes.imageiconsmall} imageicon` } />
                  <img alt="" src={ require('../../assets/SNX-logo.png') } height="64px"  className={ `${classes.imageiconsmall} imageicon` } />
                </a></Typography>
               <Card className={ `${classes.stakebutton} smallbutton` }>
                  <Typography variant={'h4'}>Opening Soon</Typography>
                </Card>
              </div>

              <Typography variant={ 'h4'} className={ classes.title } noWrap>Blockchain Interoperability</Typography>
              <div className={ `${classes.rewardPoolContainer} longbutton` } style={{marginTop: '30px' }}>

                <Typography variant='h5' className={ classes.poolWebsite }><a href="" target="_blank">
                  <img alt="" src={ require('../../assets/BTC-logo.png') } height="64px"  className={ `${classes.imageicon} imageicon` } /></a></Typography>
               <Card className={ `${classes.stakebutton} smallbutton` }>
                  <Typography variant={'h4'}>Opening Soon</Typography>
                </Card>
              </div>

              <div className={ `${classes.rewardPoolContainer} longbutton` } >

                <Typography variant='h5' className={ classes.poolWebsite }><a href="" target="_blank">
                  <img alt="" src={ require('../../assets/LTC-logo.png') } height="64px" className={ `${classes.imageicon} imageicon` }  /></a></Typography>
                <Card className={ `${classes.stakebutton} smallbutton` }>
                  <Typography variant={'h4'}>Opening Soon</Typography>
                </Card>
              </div>

              <div className={ `${classes.rewardPoolContainer} longbutton` } >

                <Typography variant='h5' className={ classes.poolWebsite }><a href="" target="_blank">
                  <img alt="" src={ require('../../assets/DASH-logo.png') } height="64px"  className={ `${classes.imageicon} imageicon` } /></a></Typography>
                <Card className={ `${classes.stakebutton} smallbutton` }>
                  <Typography variant={'h4'}>Opening Soon</Typography>
                </Card>
              </div>
          </div>
        </div>
        
        <div className={ classes.rootcard }>
          <div className={ classes.rewardPools }>
            <Typography variant={ 'h4'} className={ classes.title } noWrap>Which tokens would you like to stake?</Typography>
            {
              this.renderRewards()
            }
          </div>
        </div>
        { modalOpen && this.renderModal() }
      </div>
    )
  }

  renderUniRewards = () => {
    const { rewardPools } = this.state

    return rewardPools.filter((rewardPool) => {
      if(rewardPool.id.includes('UNI')) {
        return true
      } else {
        return false
      }
    }).map((rewardPool) => {
      return this.renderRewardPool(rewardPool)
    })
  }

  renderRewards = () => {
    const { rewardPools } = this.state

    return rewardPools.filter((rewardPool) => {
      if(rewardPool.id.includes('V2')) {
        return true
      } else {
        return false
      }
    }).map((rewardPool) => {
      return this.renderRewardPool(rewardPool)
    })
  }

  renderRewardPool = (rewardPool) => {

    const { classes } = this.props

    var address = null;
    let addy = ''
    let staked = ''
    let aprpool = ''
    let token = 'uFFYI'
    let rewardtoken = 'FFYI'
    if (rewardPool.tokens && rewardPool.tokens[0]) {
      addy = rewardPool.tokens[0].rewardsAddress
      token = rewardPool.tokens[0].symbol
      rewardtoken = rewardPool.tokens[0].rewardsSymbol
      address = addy.substring(0,6)+'...'+addy.substring(addy.length-4,addy.length)
    }
    if (rewardPool.id == 'GovernanceV2') {
      aprpool = this.state.prices.govapr + '%';
      staked = 'TVL $' + this.state.prices.govstaked;
    }
    if (rewardPool.id == 'DaiV2') {
      aprpool = this.state.prices.daiapr + '%';
      staked = 'TVL $' + this.state.prices.daistaked;
    }
    if (rewardPool.id == 'KncV2') {
      aprpool = this.state.prices.kncapr + '%';
      staked = 'TVL $' + this.state.prices.kncstaked;
    }
    if (rewardPool.id == 'UNIFFYI') {
      aprpool = this.state.prices.uniffyiapr + '%';
      staked = 'TVL $' + this.state.prices.uniffyistaked;
    }
    if (rewardPool.id == 'UNIuFFYI') {
      aprpool = this.state.prices.uniuffyiapr + '%';
      staked = 'TVL $' + this.state.prices.uniuffyistaked;
    }
    if (rewardPool.id == 'EthV2') {
      aprpool = this.state.prices.ethapr + '%';
      staked = 'TVL $' + this.state.prices.ethstaked;
    }
    if (rewardPool.id == 'RSGovernanceV2') {
      aprpool = 'Revenue Share';
      staked = 'TVL $' + this.state.prices.rsstaked;
    }

    const now = moment()
    const openingSoon = rewardPool.startDate?.isAfter(now)
    return (<div className={ `${classes.rewardPoolContainer} longbutton` } key={ rewardPool.id } >
      
      <Typography variant='h5' className={ classes.poolWebsite }><a href={ rewardPool.link } target="_blank">
        <img alt="" src={ require('../../assets/'+token+'-logo.png') } height="64px" className={ `${classes.imageicon} imageicon` }  /></a></Typography>
        <Card className={ `${classes.stakebutton} smallbutton` } onClick={ () => { if(rewardPool.tokens.length > 0 && !openingSoon) { this.navigateStake(rewardPool) } } }>
          <Typography variant={'h4'}>{
            rewardPool.depositsEnabled === false ? 'Rewards exhausted' :
                openingSoon ? 'Opening Soon' :
                    rewardPool.id.startsWith('gov') ? 'Stake' :
                        rewardPool.name
          }</Typography>
        </Card>
      
      <Typography variant='h5' className={ `${classes.arpName} field` }  style={{ color: colors.green }}>{ aprpool }</Typography>
      <Typography variant='h5' className={ classes.poolName }>{ staked }</Typography>
    </div>)
  }

  navigateStake = (rewardPool) => {
    store.setStore({ currentPool: rewardPool })

    this.props.history.push('/stake')
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

}

export default withRouter(withStyles(styles)(RewardPools));
