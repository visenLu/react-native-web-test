// import { StackNavigator } from 'react-navigation';
import * as React from 'react';
import { Platform } from 'react-native';
import HomeScreen from './Home';
import DetailsScreen from './Detail';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const RootStack = () => {
  if (Platform.OS === 'web') {
    return (
      <Router>
        <div>
          <Route exact path="/" component={HomeScreen}/>
          <Route path="/detail" component={DetailsScreen}/>
        </div>
      </Router>
    )
  } else {
    // const RootNavi = StackNavigator(
    //   {
    //     Home: {
    //       screen: HomeScreen,
    //     },
    //     Detail: {
    //       screen: DetailsScreen,
    //     },
    //   },
    //   {
    //     initialRouteName: 'Home',
    //   }
    // );
    // return <RootNavi />
  }
}

export default RootStack;