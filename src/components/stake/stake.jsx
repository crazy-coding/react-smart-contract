import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card,
  TextField,
  InputAdornment
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import Loader from '../loader'
import Snackbar from '../snackbar'

import Store from "../../stores";
import { colors } from '../../theme';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import axios from 'axios';

import {
  ERROR,
  CONFIGURE_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED,
  GET_GOVERNANCE_REQUIREMENTS,
  GET_GOVERNANCE_REQUIREMENTS_RETURNED,
  GET_BALANCES_RETURNED
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1240px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '40px'
  },
  intro: {
    width: '480px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '480px'
  },
  buttons: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  walletAddress: {
    padding: '0px 12px',
    color: '#CEDBDC'
  },
  walletTitle: {
    flex: 1,
    color: '#989898'
  },
  overview: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '28px 30px',
    alignItems: 'center',
    marginTop: '40px',
    width: '800px',
    boxShadow: 'inset -6.22302px -6.22302px 6.22302px #363E48, inset 3.73381px 3.73381px 6.22302px #000000',
    borderRadius: '12.446px',
  },
  overviewapr: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '28px 30px',
    alignItems: 'center',
    marginTop: '40px',
    width: '240px',
    border: '0.5px solid #2C2F33',
    boxSizing: 'border-box',
    boxShadow: '-12px -12px 20px #363E48, 10px 10px 24px #1B1D21',
    borderRadius: '40px',
    color:'#989898',
    textAlign: 'center',
  },
  overviewField: {
    display: 'flex',
    flexDirection: 'column'
  },
  overviewTitle: {
    color: '#989898'
  },
  overviewValue: {
    color: '#CEDBDC',
    textAlign: 'right',
  },
  actions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '28px 30px',
  },
  actionContainer: {
    minWidth: 'calc(25% - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px'
  },
  primaryButton: {
    padding: '20px 32px',
    fontWeight: 500,

    boxShadow: '-12px -12px 20px #353D48, 10px 10px 20px #15171B',
    borderRadius: '10px',
    border:'none',
    '&:hover': {
          border:'none',
        },
  },
  actionButton: {
    padding: '20px 32px',

    boxShadow: '-12px -12px 20px #353D48, 10px 10px 20px #15171B',
    borderRadius: '10px',
    border:'none',
    '&:hover': {
          border:'none',
        },
  },
  buttonText: {
    fontWeight: '700',
    color: '#CEDBDC',
  },
  stakeButtonText: {
    fontWeight: '700',
    color: '#2F80ED',
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem',
    border: 'none',

    boxShadow: 'inset -6.22302px -6.22302px 6.22302px #363E48, inset 3.73381px 3.73381px 6.22302px #000000',
    borderRadius: '12px',
    height: '46px',
  },
  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem',
    color: '#CEDBDC',
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer',
    color: '#CEDBDC',
  },
  stakeTitle: {
    width: '100%',
    color: '#989898',
    marginBottom: '20px'
  },
  stakeButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    align: 'center',
    marginTop: '20px'
  },
  stakeButton: {
    width: '100px',

    boxShadow: '-12px -12px 20px #353D48, 10px 10px 20px #15171B',
    borderRadius: '10px',
    border:'none',
    '&:hover': {
          border:'none',
        },
    color:'#CEDBDC',
  },
  requirement: {
    display: 'flex',
    alignItems: 'center'
  },
  check: {
    paddingTop: '6px'
  },
  voteLockMessage: {
    margin: '20px'
  },
  title: {
    width: '100%',
    color: colors.darkGray,
    minWidth: '100%',
    marginLeft: '20px'
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

    boxShadow: '-12px -12px 20px #343C46, 10px 10px 20px #1A1D22;',
    borderRadius: '10px',

  },
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Stake extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const pool = store.getStore('currentPool')

    if(!pool) {
      props.history.push('/')
    }

    this.state = {
      pool: pool,
      loading: !(account || pool),
      account: account,
      value: 'options',
      voteLockValid: false,
      balanceValid: false,
      voteLock: null,
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


    if(pool && ['GovernanceV2'].includes(pool.id)) {
      dispatcher.dispatch({ type: GET_GOVERNANCE_REQUIREMENTS, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(STAKE_RETURNED, this.showHash);
    emitter.on(WITHDRAW_RETURNED, this.showHash);
    emitter.on(EXIT_RETURNED, this.showHash);
    emitter.on(GET_REWARDS_RETURNED, this.showHash);
    emitter.on(GET_GOVERNANCE_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(STAKE_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_RETURNED, this.showHash);
    emitter.removeListener(EXIT_RETURNED, this.showHash);
    emitter.removeListener(GET_REWARDS_RETURNED, this.showHash);
    emitter.removeListener(GET_GOVERNANCE_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  };

  balancesReturned = () => {
    const currentPool = store.getStore('currentPool')
    const pools = store.getStore('rewardPools')
    let newPool = pools.filter((pool) => {
      return pool.id === currentPool.id
    })

    if(newPool.length > 0) {
      newPool = newPool[0]
      store.setStore({ currentPool: newPool })
    }
  }


  govRequirementsReturned = (requirements) => {
    this.setState({
      gov_voteLockValid: requirements.voteLockValid,
      gov_voteLock: requirements.voteLock
    })
  }

  showHash  = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes } = this.props;
    const {
      value,
      account,
      modalOpen,
      pool,
      loading,
      snackbarMessage,
      voteLockValid,
      balanceValid,
      gov_voteLock,
      gov_voteLockValid
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    if(!pool) {
      return null
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

    let aprpool = '';
    let aprname = 'APR';
    if (pool.id == 'GovernanceV2') {
      aprpool = this.state.prices.govapr + '%';
    }
    if (pool.id == 'DaiV2') {
      aprpool = this.state.prices.daiapr + '%';
    }
    if (pool.id == 'KncV2') {
      aprpool = this.state.prices.kncapr + '%';
    }
    if (pool.id == 'UNIFFYI') {
      aprpool = this.state.prices.uniffyiapr + '%';
    }
    if (pool.id == 'UNIuFFYI') {
      aprpool = this.state.prices.uniuffyiapr + '%';
    }
    if (pool.id == 'EthV2') {
      aprpool = this.state.prices.ethapr + '%';
    }
    if (pool.id == 'RSGovernanceV2') {
      aprname = '';
      aprpool = '$' + this.state.prices.rsam;
    }

    return (
      <div className={ classes.root }>
        
        <div className={ `${classes.intro} mobwauto` }>
          <Card className={ `${classes.backtohome} longbutton` } onClick={ () => {  this.props.history.push('/staking') } }>
              <ArrowBackIosIcon className={ `${classes.icon} icon` } />
          </Card>
          <Card className={ `${classes.addressContainer} field` } onClick={this.overlayClicked}>
            <Typography variant={ 'h3'} className={ `${classes.walletTitle} onlypcandtablet` } noWrap>Wallet</Typography>
            <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
            <div style={{ background: colors.green, opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
          </Card>
        </div>
        <div className={ classes.buttons }>
          { value === 'options' && this.renderOptions() }
          { value === 'stake' && this.renderStake() }
          { value === 'claim' && this.renderClaim() }
          { value === 'unstake' && this.renderUnstake() }
          { value === 'exit' && this.renderExit() }
        </div>
        <div className={ `${classes.overview} field nomobileflex` }>
          <div className={ classes.overviewField }>
            <Typography variant={ 'h3' } className={ classes.overviewTitle }>Your Balance</Typography>
            <Typography variant={ 'h2' } className={ classes.overviewValue }>{ pool.tokens[0].balance ? pool.tokens[0].balance.toFixed(2) : "0" }  { pool.tokens[0].symbol }</Typography>
          </div>
          <div className={ classes.overviewField }>
            <Typography variant={ 'h3' } className={ classes.overviewTitle }>Currently Staked</Typography>
            <Typography variant={ 'h2' } className={ classes.overviewValue }>{ pool.tokens[0].stakedBalance ? pool.tokens[0].stakedBalance.toFixed(2) : "0" }</Typography>
          </div>
          <div className={ classes.overviewField }>
            <Typography variant={ 'h3' } className={ classes.overviewTitle }>Rewards Available</Typography>
            <Typography variant={ 'h2' } className={ classes.overviewValue }>{ pool.tokens[0].rewardsSymbol == '$' ? pool.tokens[0].rewardsSymbol : '' } { pool.tokens[0].rewardsAvailable ? ( pool.tokens[0].rewardsSymbol == 'FFYI' ?  pool.tokens[0].rewardsAvailable.toFixed(8) :  pool.tokens[0].rewardsAvailable.toFixed(2) ) : "0" } { pool.tokens[0].rewardsSymbol != '$' ? pool.tokens[0].rewardsSymbol : '' }</Typography>
          </div>
        </div>
        <div className={ `${classes.overviewapr} longbutton` }>
        { aprname } <span style={{ color: '#11CBA6',fontSize: '2rem' }}>{ aprpool }</span>
        </div>
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  }

  renderOptions = () => {
    const { classes } = this.props;
    const {
      loading,
      pool,
      voteLockValid,
      balanceValid,
      voteLock,
      gov_voteLockValid,
      gov_voteLock,
    } = this.state

    return (
      <div className={ classes.actions }>

        <div className={ `${classes.actionContainer} mobw100` }>
          <Button
            fullWidth
            className={ `${classes.primaryButton} longbutton` }
            variant="outlined"
            color="primary"
            disabled={ !pool.depositsEnabled || (['FeeRewards'].includes(pool.id) ?  (loading || !voteLockValid || !balanceValid) : loading) }
            onClick={ () => { this.navigateInternal('stake') } }
            >
            <Typography className={ classes.stakeButtonText } variant={ 'h4'}>Stake Tokens</Typography>
          </Button>
        </div>
        <div className={ `${classes.actionContainer} mobw100` }>
          <Button
            fullWidth
            className={ `${classes.actionButton} longbutton` }
            variant="outlined"
            color="primary"
            disabled={ loading }
            onClick={ () => { this.onClaim() } }
            >
            <Typography className={ classes.buttonText } variant={ 'h4'}>Claim Rewards</Typography>
          </Button>
        </div>
        <div className={ `${classes.actionContainer} mobw100` }>
          <Button
            fullWidth
            className={ `${classes.actionButton} longbutton` }
            variant="outlined"
            color="primary"
            disabled={ loading }
            onClick={ () => { this.navigateInternal('unstake') } }
            >
            <Typography className={ classes.buttonText } variant={ 'h4'}>Unstake Tokens</Typography>
          </Button>
        </div>
        <div className={ `${classes.actionContainer} mobw100` }>
          <Button
            fullWidth
            className={ `${classes.actionButton} longbutton` }
            variant="outlined"
            color="primary"
            disabled={ loading }
            onClick={ () => { this.onExit() } }
            >
            <Typography className={ classes.buttonText } variant={ 'h4'}>Exit: Claim and Unstake</Typography>
          </Button>
        </div>

      </div>
    )
  }

  navigateInternal = (val) => {
    this.setState({ value: val })
  }

  renderStake = () => {
    const { classes } = this.props;
    const { loading, pool } = this.state

    const asset = pool.tokens[0]

    return (
      <div className={ classes.actions }>
        <Typography className={ classes.stakeTitle } variant={ 'h3'}>Stake your tokens</Typography>
        { this.renderAssetInput(asset, 'stake') }
        <div className={ classes.stakeButtons }>
          <Button
            className={ `${classes.stakeButton} smallbutton` }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.navigateInternal('options') } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>
          <Button
            className={ `${classes.stakeButton} smallbutton` }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.onStake() } }
          >
            <Typography variant={ 'h4'}>Stake</Typography>
          </Button>
        </div>

      </div>
    )
  }

  renderUnstake = () => {
    const { classes } = this.props;
    const { loading, pool, voteLockValid } = this.state

    const asset = pool.tokens[0]

    return (
      <div className={ classes.actions }>
        <Typography className={ classes.stakeTitle } variant={ 'h3'}>Unstake your tokens</Typography>
        { this.renderAssetInput(asset, 'unstake') }
        <div className={ classes.stakeButtons }>
          <Button
            className={ `${classes.stakeButton} smallbutton` }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.navigateInternal('options') } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>
          <Button
            className={ `${classes.stakeButton} smallbutton` }
            variant="outlined"
            color="secondary"
            disabled={ (pool.id === 'Governance' ? (loading || voteLockValid ) : loading  ) }
            onClick={ () => { this.onUnstake() } }
          >
            <Typography variant={ 'h4'}>Unstake</Typography>
          </Button>
        </div>

      </div>
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  onStake = () => {
    this.setState({ amountError: false })
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    const amount = this.state[selectedToken.id + '_stake']

    // if(amount > selectedToken.balance) {
    //   return false
    // }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: STAKE, content: { asset: selectedToken, amount: amount } })
  }

  onClaim = () => {
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]

    this.setState({ loading: true })
    dispatcher.dispatch({ type: GET_REWARDS, content: { asset: selectedToken } })
  }

  onUnstake = () => {
    this.setState({ amountError: false })
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    const amount = this.state[selectedToken.id + '_unstake']
    //
    // if(amount > selectedToken.balance) {
    //   return false
    // }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: WITHDRAW, content: { asset: selectedToken, amount: amount } })
  }

  onExit = () => {
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]

    this.setState({ loading: true })
    dispatcher.dispatch({ type: EXIT, content: { asset: selectedToken } })
  }

  renderAssetInput = (asset, type) => {
    const {
      classes
    } = this.props

    const {
      loading
    } = this.state

    const amount = this.state[asset.id + '_' + type]
    const amountError = this.state[asset.id + '_' + type + '_error']

    return (
      <div className={ classes.valContainer } key={asset.id + '_' + type}>
        <div className={ classes.balances }>
          { type === 'stake' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.balance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography> }
          { type === 'unstake' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.stakedBalance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.stakedBalance ? (Math.floor(asset.stakedBalance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography> }
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading }
            className={ `${classes.actionInput} field` }
            id={ '' + asset.id + '_' + type }
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3' className={ '' }>{ asset.symbol }</Typography></InputAdornment>,
              startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/'+asset.symbol+'-logo.png') }
                    height="30px"
                  />
                </div>
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  setAmount = (id, type, balance) => {
    const bal = (Math.floor((balance === '' ? '0' : balance)*10000)/10000).toFixed(4)
    let val = []
    val[id + '_' + type] = bal
    this.setState(val)
  }

}

export default withRouter(withStyles(styles)(Stake));
