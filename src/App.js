import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  Route
} from "react-router-dom";
import IpfsRouter from 'ipfs-react-router'

import './i18n';
import interestTheme from './theme';

import Account from './components/account';
import Footer from './components/footer';
import Home from './components/home';
import Stake from './components/stake';
import RewardsPools from './components/rewardPools';
import Header from './components/header';
import Claim from './components/claim';
import VersionToggle from './components/versionToggle';

import './App.css';

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED,
  GOVERNANCE_CONTRACT_CHANGED
} from './constants'

import { injected } from "./stores/connectors";

import Store from "./stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class App extends Component {
  state = {
    account: null,
    headerValue: null,
    thememode: store.getStore('governanceContractVersion')
  };

  setHeaderValue = (newValue) => {
    this.setState({ headerValue: newValue })
  };

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
    emitter.on(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);

    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
        .then((a) => {
          store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
          emitter.emit(CONNECTION_CONNECTED)
          console.log(a)
        })
        .catch((e) => {
          console.log(e)
        })
      } else {

      }
    });
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
    emitter.removeListener(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);
  };

  getBalancesReturned = () => {
    window.setTimeout(() => {
      dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
    }, 15000)
  }
  
  setGovernanceContract = () => {
    this.setState({ thememode: store.getStore('governanceContractVersion') })
  }


  configureReturned = () => {
    dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
    dispatcher.dispatch({ type: CONFIGURE, content: {} })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  render() {

    const { headerValue, account } = this.state

    return (
      <MuiThemeProvider theme={ createMuiTheme(interestTheme) }>
        <CssBaseline />
        <IpfsRouter>
          { !account &&
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              minWidth: '100vw',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: "#2C2F33",
            }} className={ this.state.thememode }>
              <Footer />
              <Account />
              
              <div style={{}}>
                <p style={{color: '#989898'}}>This project is in beta. Use at your own risk.</p>
                <ul style={{}}>
                  <li style={{display: 'inline-block', padding: '14px'}}>
                    <a href="http://kovan.fiscus.fyi/"  target="_blank" rel="noopener noreferrer" style={{color: 'black'}}>
                      Kovan testnet
                    </a>
                  </li>
                  <li style={{display: 'inline-block', padding: '14px'}}>
                    <a href="https://github.com/Fiscus-fyi"  target="_blank" rel="noopener noreferrer" style={{color: 'black'}}>
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          }
          { account &&
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: "#2C2F33",
            }} className={ this.state.thememode }>
              <Switch>
                <Route path="/stake">
                  <Footer />
                  <Stake />
                </Route>
                <Route path="/staking">
                  <Footer />
                  <RewardsPools />
                </Route>
                <Route path="/">
                  <Footer />
                  <Home />
                </Route>
              </Switch>
              <div style={{}}>
                <p style={{color: '#989898'}}>This project is in beta. Use at your own risk.</p>
                <ul style={{}}>
                  <li style={{display: 'inline-block', padding: '14px'}}>
                    <a href="http://kovan.fiscus.fyi/"  target="_blank" rel="noopener noreferrer" style={{color: 'black'}}>
                      Kovan testnet
                    </a>
                  </li>
                  <li style={{display: 'inline-block', padding: '14px'}}>
                    <a href="https://github.com/Fiscus-fyi"  target="_blank" rel="noopener noreferrer" style={{color: 'black'}}>
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          }
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
