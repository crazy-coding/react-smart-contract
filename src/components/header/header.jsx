import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
  Tabs,
  Tab,
  Card,
  Typography
} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { colors } from '../../theme';
import axios from 'axios';
import VersionToggle from '../../components/versionToggle';

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
    display: 'flex',
    padding: '24px',
  },
  firstroot: {
    verticalAlign: 'top',
    width: '100%',
  },

  title: {
    padding: '8px',
    paddingBottom: '0px',
    color: '#989898',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '12px'
    }
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
  headLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    // width: '100%',
  },
  headLinksRight: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  head: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    }
  },

});

function Header(props) {
  const {
    classes,
    setHeaderValue,
    headerValue,
    location
  } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setHeaderValue(newValue)
  };

  const nav = (screen) => {
    props.history.push('/'+screen)
  }

  return (
    <div className={ classes.firstroot }>
      <div className={ classes.root }>
          <div className={ classes.head }>
            <div className={ classes.headLinks }>
              <Link to={"/"} className={classes.link}>
                <img src={require('../../assets/logo.png')} alt='Fiscus' height='48px'/>
              </Link>
              <a href="https://fiscus-fyi.gitbook.io/fiscus-fyi/" className={classes.link}>
                <Typography className={classes.title} variant={'h6'}>Documents</Typography>
              </a>
            </div>
            <div className={classes.headLinksRight}>
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
      </div>
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default withRouter(withStyles(styles)(Header));
