import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Overview from '../../components/Overview/overview';
import OpenDispute from '../../components/Disputes/OpenDispute/OpenDispute';
import DisputeDetails from '../../components/Disputes/DisputeDetails/DisputeDetails';
import Activity from '../../components/Activity/Activity';
import Arbitraton from '../../components/Arbitration/Arbitraton';
import Help from '../../components/Help/help';

class MainnetRouter extends Component {

    render () {
        return (
            <Switch>
                <Route path="/" exact component={Overview} />
                <Route path="/activity" component={Activity} /> 
                <Route path="/help" component={Help} /> 
            </Switch>
        );
    }
}

export default MainnetRouter;