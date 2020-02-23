import React from 'react';
import { Platform, AsyncStorage } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Colors from '../constants/Colors';
import TripDetailScreen from '../screens/TripDetailScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Dashboard',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
};

HomeStack.path = '';


// const TripDetailStack = createStackNavigator(
  
//   {
//   TripDetails: async (props) => { 
//     const trip = await AsyncStorage.getItem("trip");
//     <TripDetailScreen {...props} trip={JSON.parse(trip)} /> },
//   },
//   config
// );

// TripDetailStack.navigationOptions = {
//   tabBarLabel: 'Trip',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'} />
//   ),
// };

// TripDetailStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'History',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'} />
  ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'} />
  ),
};

SettingsStack.path = '';


const tabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    // TripDetailStack,
    LinksStack,
    SettingsStack
  },
  {
    tabBarOptions: {
      activeTintColor: Colors.tintColor,
      inactiveTintColor: 'gray',
    },
  }
);

tabNavigator.path = '';

export default tabNavigator;
