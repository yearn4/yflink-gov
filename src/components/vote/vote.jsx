import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Card,
  TextField,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import Loader from '../loader'
import Snackbar from '../snackbar'
import UnlockModal from '../unlock/unlockModal.jsx'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Proposal from './proposal'

import Store from "../../stores";
import { colors } from '../../theme'

import {
  ERROR,
  CONFIGURE_RETURNED,
  PROPOSE,
  PROPOSE_RETURNED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST_RETURNED,
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '40px'
  },
  between: {
    width: '40px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '32px'
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
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  proposalContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  field: {
    minWidth: '100%',
    paddingBottom: '20px'
  },
  fieldTitle: {
    paddingLeft: '20px'
  },
  titleInput: {
    borderRadius: '25px'
  },
  headingName: {
    paddingTop: '5px',
    flex: 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: 'auto',
    }
  },
  heading: {
    display: 'none',
    paddingTop: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '5px',
      display: 'block'
    }
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap'
    }
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
      marginRight: '24px',
    }
  },
  grey: {
    color: colors.darkGray
  },
  expansionPanel: {
    maxWidth: 'calc(100vw - 24px)',
    width: '100%'
  },
  stakeTitle: {
    width: '100%',
    color: colors.darkGray,
  },
  claimContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    margin: '20px',
    background: colors.white,
    width: '100%'
  },
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Vote extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const proposals = store.getStore('proposals')

    this.state = {
      loading: false,
      account: account,
      proposals: proposals
    }

    dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned)
    emitter.on(PROPOSE_RETURNED, this.showHash)
    emitter.on(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.on(VOTE_FOR_RETURNED, this.showHash);
    emitter.on(VOTE_AGAINST_RETURNED, this.showHash);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned)
    emitter.removeListener(PROPOSE_RETURNED, this.showHash)
    emitter.removeListener(GET_PROPOSALS_RETURNED, this.proposalsReturned)
    emitter.removeListener(VOTE_FOR_RETURNED, this.showHash);
    emitter.removeListener(VOTE_AGAINST_RETURNED, this.showHash);
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  proposalsReturned = () => {
    const proposals = store.getStore('proposals')
    this.setState({ proposals: proposals })
  }

  showHash = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

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
      snackbarMessage,
      title,
      titleError,
      description,
      descriptionError
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
        <div className={ classes.intro }>
          <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
            <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>Wallet</Typography>
            <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
            <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
          </Card>
          <div className={ classes.between }>
          </div>
          <div className={ classes.proposalContainer }>
            <Button
              className={ classes.stakeButton }
              variant="outlined"
              color="secondary"
              disabled={ loading }
              onClick={ () => { this.onPropose() } }
            >
              <Typography variant={ 'h4'}>Generate a new proposal</Typography>
            </Button>
          </div>
        </div>
        { this.renderProposals() }
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
        { modalOpen && this.renderModal() }
      </div>
    )
  }

  renderProposals = () => {
    const { proposals, expanded } = this.state
    const { classes, t } = this.props
    const width = window.innerWidth

    if(proposals.length === 0) {
      return (
        <div className={ classes.claimContainer }>
          <Typography className={ classes.stakeTitle } variant={ 'h3'}>No proposals</Typography>
        </div>
      )
    }

    return proposals.map((proposal) => {

      var address = null;
      if (proposal.proposer) {
        address = proposal.proposer.substring(0,8)+'...'+proposal.proposer.substring(proposal.proposer.length-6,proposal.proposer.length)
      }

      return (
        <ExpansionPanel className={ classes.expansionPanel } square key={ proposal.id+"_expand" } expanded={ expanded === proposal.id} onChange={ () => { this.handleChange(proposal.id) } }>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={ classes.assetSummary }>
              <div className={classes.headingName}>
                <div className={ classes.assetIcon }>
                  <Typography variant={ 'h3' }>{ proposal.id }</Typography>
                </div>
                <div>
                  <Typography variant={ 'h3' }>{ address }</Typography>
                  <Typography variant={ 'h5' } className={ classes.grey }>Proposer</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ proposal.totalForVotes ? (parseFloat(proposal.totalForVotes)/10**18).toFixed(4) : 0 }</Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>Votes For</Typography>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ proposal.totalAgainstVotes ? (parseFloat(proposal.totalAgainstVotes)/10**18).toFixed(4) : 0 }</Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>Votes Against</Typography>
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Proposal proposal={ proposal } startLoading={ this.startLoading } />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onPropose = () => {
    this.setState({ loading: true })
    dispatcher.dispatch({ type: PROPOSE, content: {  } })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

}

export default withRouter(withStyles(styles)(Vote));