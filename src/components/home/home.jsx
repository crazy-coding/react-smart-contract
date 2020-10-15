import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import DetailsIcon from '@material-ui/icons/Details';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import axios from 'axios';

import {
  Link
} from "react-router-dom";

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  },
  rootcard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minWidth: '346px',
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
    boxShadow: '-12px -12px 20px #363D47, 10px 10px 24px #1F2327',
    borderRadius: '40px',
  },
  poolcard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minHeight: '200px',
    minWidth: '346px',
  },
  poolblock: {
    minHeight: '70px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  smallcard: {
    padding: '10px',
    margin: '20px',
    height: '56px',
    width: '146px',
    color: colors.green,
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
    boxShadow: 'inset -6.22302px -6.22302px 6.22302px #363E48, inset 3.73381px 3.73381px 6.22302px #000000',
    borderRadius: '12px',
    fontWeight: 'bold',
  },
  earn: {
    color: colors.green,
    '&:hover': {
      backgroundColor: '#1abc9c0d',
      cursor: 'pointer',
    },
  },

  poolWebsite: {
    color: '#CEDBDC',
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
  link: {
    textDecoration: 'none'
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
    boxShadow: '-12px -12px 20px #363D46, 10px 10px 20px #23272C',
    borderRadius: '10px',
    color: '#CEDBDC'
  },
  earnbuy: {
    '&:hover': {
      backgroundColor: '#1abc9c0d',
      
    },
  },


});

class Home extends Component {

  constructor(props) {
    super()

    this.state = {
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

  render() {
    const { classes, t, location } = this.props;
    
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
      
        <div className={ `${classes.rootcard}` }>
          <Card className={ `${classes.card} ${classes.earn} longbutton` } onClick={ () => { this.nav(location.pathname+'staking') } }>
            
            <Typography variant={'h1'} className={ `${classes.title} title` }>STAKE</Typography>
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
        <Card className={ `${classes.cardbuy} ${classes.earnbuy} longbutton` } >
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

  nav = (screen) => {
    this.props.history.push(screen)
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Home)));
