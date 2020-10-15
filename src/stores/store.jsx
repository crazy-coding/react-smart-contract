import config from "../config";
import async from 'async';
import * as moment from 'moment';
import {
  ERROR,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED,
  PROPOSE,
  PROPOSE_RETURNED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  VOTE_FOR,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST,
  VOTE_AGAINST_RETURNED,
  GET_CLAIMABLE_ASSET,
  GET_CLAIMABLE_ASSET_RETURNED,
  CLAIM,
  CLAIM_RETURNED,
  GET_CLAIMABLE,
  GET_CLAIMABLE_RETURNED,
  GET_GOVERNANCE_REQUIREMENTS,
  GET_GOVERNANCE_REQUIREMENTS_RETURNED,
  REGISTER_VOTE,
  REGISTER_VOTE_RETURNED,
  GET_VOTE_STATUS,
  GET_VOTE_STATUS_RETURNED
} from '../constants';
import Web3 from 'web3';

import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum
} from "./connectors";

const rp = require('request-promise');
const ethers = require('ethers');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      votingStatus: false,
      governanceContractVersion: "night",
      currentBlock: 0,
      universalGasPrice: '70',
      account: {},
      web3: null,
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Ledger: ledger,
        Trezor: trezor,
        Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum
      },
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        },
        {
          language: 'Japanese',
          code: 'ja'
        },
        {
          language: 'Chinese',
          code: 'zh'
        }
      ],
      proposals: [
      ],
      claimableAsset: {
        id: 'ffyi',
        name: 'FiscusFYI',
        address: config.uFFYIAddress,
        abi: config.uFFYIABI,
        symbol: 'FFYI',
        balance: 0,
        decimals: 18,
        rewardAddress: config.rFFYIAddress,
        rewardSymbol: 'FFYI',
        rewardDecimals: 18,
        claimableBalance: 0
      },
      rewardPools: [
        {
          id: 'RSGovernanceV2',
          title: 'FFYI RS Pool',
          name: 'FFYI RS Pool',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.ethStartDate,
          tokens: [
            {
              id: 'ffyi',
              address: config.rFFYIAddress,
              symbol: 'FFYI',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.pGovV2Address,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: 'uFFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'GovernanceV2',
          title: 'Governance pool',
          name: 'Mine FFYI',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.govV2StartDate,
          tokens: [
            {
              id: 'ffyi',
              address: config.uFFYIAddress,
              symbol: 'uFFYI',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.govV2Address,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: 'FFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'EthV2',
          title: 'ETH pool',
          name: 'ETH pool',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.ethStartDate,
          tokens: [
            {
              id: 'eth',
              address: config.ethAddress,
              symbol: 'ETH',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.pETHV2Address,
              rewardsABI: config.ethPoolABI,
              rewardsSymbol: 'uFFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'DaiV2',
          title: 'DAI pool',
          name: 'DAI pool',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.daiV2StartDate,
          tokens: [
            {
              id: 'dai',
              address: config.daiAddress,
              symbol: 'DAI',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.daiV2Address,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: 'uFFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'KncV2',
          title: 'KNC pool',
          name: 'KNC pool',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.daiV2StartDate,
          tokens: [
            {
              id: 'knc',
              address: config.kncAddress,
              symbol: 'KNC',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.kncV2Address,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: 'uFFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'UsdcV2',
          title: 'USDC pool',
          name: 'USDC pool',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.governanceV2StartDate,
          tokens: [
            {
              id: 'usdc',
              address: config.uFFYIAddress,
              symbol: 'USDC',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.governanceV2Address,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: 'uFFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'UsdtV2',
          title: 'USDT pool',
          name: 'USDT pool',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.governanceV2StartDate,
          tokens: [
            {
              id: 'usdt',
              address: config.uFFYIAddress,
              symbol: 'USDT',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.governanceV2Address,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: 'uFFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'TusdV2',
          title: 'TUSD pool',
          name: 'TUSD pool',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.governanceV2StartDate,
          tokens: [
            {
              id: 'tusd',
              address: config.uFFYIAddress,
              symbol: 'TUSD',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.governanceV2Address,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: 'uFFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'UNIFFYI',
          title: 'FFYI-ETH LP pool',
          name: 'FFYI-ETH LP',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.uniStartDate,
          tokens: [
            {
              id: 'uniffyi',
              address: config.u2ffyiAddress,
              symbol: 'UNI-V2',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.pu2ffyiAddress,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: 'uFFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        },
        {
          id: 'UNIuFFYI',
          title: 'uFFYI-ETH LP pool',
          name: 'uFFYI-ETH LP',
          website: 'fiscus.fyi',
          link: 'https://fiscus.fyi/',
          depositsEnabled: true,
          startDate: config.uniStartDate,
          tokens: [
            {
              id: 'uniuffyi',
              address: config.u2uffyiAddress,
              symbol: 'UNI-V2',
              abi: config.uFFYIABI,
              decimals: 18,
              rewardsAddress: config.pu2uffyiAddress,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: 'uFFYI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
          ]
        }
      ]
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          case GET_BALANCES:
            this.getBalances(payload);
            break;
          case GET_BALANCES_PERPETUAL:
            this.getBalancesPerpetual(payload);
            break;
          case STAKE:
            this.stake(payload);
            break;
          case WITHDRAW:
            this.withdraw(payload);
            break;
          case GET_REWARDS:
            this.getReward(payload);
            break;
          case EXIT:
            this.exit(payload);
            break;
          case PROPOSE:
            this.propose(payload)
            break;
          case GET_PROPOSALS:
            this.getProposals(payload)
            break;
          case REGISTER_VOTE:
            this.registerVote(payload)
            break;
          case GET_VOTE_STATUS:
            this.getVoteStatus(payload)
            break;
          case VOTE_FOR:
            this.voteFor(payload)
            break;
          case VOTE_AGAINST:
            this.voteAgainst(payload)
            break;
          case GET_CLAIMABLE_ASSET:
            this.getClaimableAsset(payload)
            break;
          case CLAIM:
            this.claim(payload)
            break;
          case GET_CLAIMABLE:
            this.getClaimable(payload)
            break;
          case GET_GOVERNANCE_REQUIREMENTS:
            this.getGovernanceV2Requirements(payload)
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  configure = async () => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const currentBlock = await web3.eth.getBlockNumber()

    store.setStore({ currentBlock: currentBlock })

    window.setTimeout(() => {
      emitter.emit(CONFIGURE_RETURNED)
    }, 100)
  }

  getBalancesPerpetual = async () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    const currentBlock = await web3.eth.getBlockNumber()
    store.setStore({ currentBlock: currentBlock })

    async.map(pools, (pool, callback) => {

      async.map(pool.tokens, (token, callbackInner) => {

        async.parallel([
          (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) }
        ], (err, data) => {
          if(err) {
            console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_PERPETUAL_RETURNED)
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }

  getBalances = () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(pools, (pool, callback) => {

      async.map(pool.tokens, (token, callbackInner) => {

        async.parallel([
          (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) }
        ], (err, data) => {
          if(err) {
            console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const erc20Contract = new web3.eth.Contract(asset.abi, asset.address)
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      console.log(error)
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _checkApprovalWaitForConfirmation = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")

    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        .on('transactionHash', function(hash){
          callback()
        })
        .on('error', function(error) {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
    } else {
      callback()
    }
  }

  _getERC20Balance = async (web3, asset, account, callback) => {
    if (asset.id == 'eth') {
      try {
        var balance = await web3.eth.getBalance(account.address);
        balance = parseFloat(balance)/10**asset.decimals
        callback(null, parseFloat(balance))
      } catch(ex) {
        return callback(ex)
      }
    } else {
      let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)

      try {
        var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
        balance = parseFloat(balance)/10**asset.decimals
        callback(null, parseFloat(balance))
      } catch(ex) {
        return callback(ex)
      }
    }
  }

  _getstakedBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getRewardsAvailable = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var earned = await erc20Contract.methods.earned(account.address).call({ from: account.address });
      earned = parseFloat(earned)/10**asset.decimals
      callback(null, parseFloat(earned))
    } catch(ex) {
      return callback(ex)
    }
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")
    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      asset.amount = amount
      callback(null, asset)
    } else {
      callback(null, false)
    }
  }

  _callApproval = async (asset, account, amount, contract, last, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    try {
      if(last) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  stake = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content
    if (asset.id == 'eth') {
        this._callStakeETH(asset, account, amount, (err, res) => {
          if(err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(STAKE_RETURNED, res)
        })      
    } else {

      this._checkApproval(asset, account, amount, asset.rewardsAddress, (err) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        this._callStake(asset, account, amount, (err, res) => {
          if(err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(STAKE_RETURNED, res)
        })
      })
    }
  }

  _callStakeETH = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }
    
    yCurveFiContract.methods.stake(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'), value: amountToSend })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  _callStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods.stake(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  withdraw = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callWithdraw(asset, account, amount, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(WITHDRAW_RETURNED, res)
    })
  }

  _callWithdraw = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods.withdraw(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getReward = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callGetReward(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(GET_REWARDS_RETURNED, res)
    })
  }

  _callGetReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    yCurveFiContract.methods.getReward().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  exit = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callExit(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(EXIT_RETURNED, res)
    })
  }

  _callExit = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    yCurveFiContract.methods.exit().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  propose = (payload) => {
    const account = store.getStore('account')
    const { executor, hash } = payload.content

    this._callPropose(account, executor, hash, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(PROPOSE_RETURNED, res)
    })
  }

  _callPropose = async (account, executor, hash, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const abi = config.governanceV2ABI
    const address = config.governanceV2Address

    const governanceContract = new web3.eth.Contract(abi,address)

    let call = governanceContract.methods.propose(executor, hash)

    call.send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getProposals = (payload) => {
    // emitter.emit(GET_PROPOSALS_RETURNED)
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    this._getProposalCount(web3, account, (err, proposalCount) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      let arr = Array.from(Array(parseInt(proposalCount)).keys())

      if(proposalCount == 0) {
        arr = []
      }

      async.map(arr, (proposal, callback) => {
        this._getProposals(web3, account, proposal, callback)
      }, (err, proposalsData) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        store.setStore({ proposals: proposalsData })
        emitter.emit(GET_PROPOSALS_RETURNED)
      })

    })
  }

  _getProposalCount = async (web3, account, callback) => {
    try {

      const abi = config.governanceV2ABI
      const address = config.governanceV2Address

      const governanceContract = new web3.eth.Contract(abi, address)
      var proposals = await governanceContract.methods.proposalCount().call({ from: account.address });
      callback(null, proposals)
    } catch(ex) {
      return callback(ex)
    }
  }

  _getProposals = async (web3, account, number, callback) => {
    try {

      const abi = config.governanceV2ABI
      const address = config.governanceV2Address

      const governanceContract = new web3.eth.Contract(abi, address)
      var proposal = await governanceContract.methods.proposals(number).call({ from: account.address });

      proposal.executor = proposal.executor
      proposal.hash = proposal.hash
      proposal.quorum = proposal.quorum
      proposal.quorumRequired = proposal.quorumRequired

      callback(null, proposal)
    } catch(ex) {
      return callback(ex)
    }
  }

  getVoteStatus = async (payload) => {
    try {
      const account = store.getStore('account')
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const governanceContract = new web3.eth.Contract(config.governanceV2ABI,config.governanceV2Address)

      const status = await governanceContract.methods.voters(account.address).call({ from: account.address })

      store.setStore({votingStatus: status})
      emitter.emit(GET_VOTE_STATUS_RETURNED, status)

    } catch(ex) {
      return emitter.emit(ERROR, ex);
    }
  }

  registerVote = (payload) => {
    const account = store.getStore('account')

    this._callRegisterVote(account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(REGISTER_VOTE_RETURNED, res)
    })
  }

  _callRegisterVote = async (account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const governanceContract = new web3.eth.Contract(config.governanceV2ABI, config.governanceV2Address)
    governanceContract.methods.register().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_VOTE_STATUS, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  voteFor = (payload) => {
    const account = store.getStore('account')
    const { proposal } = payload.content

    this._callVoteFor(proposal, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_FOR_RETURNED, res)
    })
  }

  _callVoteFor = async (proposal, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const abi = config.governanceV2ABI
    const address = config.governanceV2Address

    const governanceContract = new web3.eth.Contract(abi,address)

    governanceContract.methods.voteFor(proposal.id).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  voteAgainst = (payload) => {
    const account = store.getStore('account')
    const { proposal } = payload.content

    this._callVoteAgainst(proposal, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_AGAINST_RETURNED, res)
    })
  }

  _callVoteAgainst = async (proposal, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const abi = config.governanceV2ABI
    const address = config.governanceV2Address

    const governanceContract = new web3.eth.Contract(abi,address)

    governanceContract.methods.voteAgainst(proposal.id).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimableAsset = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_ASSET_RETURNED)
    })
  }

  _getClaimableBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.abi, asset.address)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getClaimable = async (web3, asset, account, callback) => {
    let claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)

    try {
      var balance = await claimContract.methods.claimable(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  claim = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')
    const { amount } = payload.content

    this._checkApproval(asset, account, amount, config.claimAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callClaim(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(CLAIM_RETURNED, res)
      })
    })
  }

  _callClaim = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    claimContract.methods.claim(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_CLAIMABLE_ASSET, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimable = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_RETURNED)
    })
  }



  getGovernanceV2Requirements = async (payload) => {
    try {
      const account = store.getStore('account')
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const governanceContract = new web3.eth.Contract(config.governanceV2ABI,config.governanceV2Address)

      const voteLock = await governanceContract.methods.voteLock(account.address).call({ from: account.address })
      const currentBlock = await web3.eth.getBlockNumber()

      const returnOBJ = {
        voteLockValid: voteLock > currentBlock,
        voteLock: voteLock
      }

      emitter.emit(GET_GOVERNANCE_REQUIREMENTS_RETURNED, returnOBJ)

    } catch(ex) {
      return emitter.emit(ERROR, ex);
    }
  }

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if(priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return store.getStore('universalGasPrice')
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
