import React from 'react';
import {
  View,
  AsyncStorage,
  Text
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SettingsScreen(props) {

  
 const  _signOutAsync = async () => {
    await AsyncStorage.clear();
    props.navigation.navigate('Auth');
  };
  
  return (
    <View>
      <TouchableOpacity onPress={_signOutAsync}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  ) 
}

SettingsScreen.navigationOptions = {
  title: 'Profile',
};
