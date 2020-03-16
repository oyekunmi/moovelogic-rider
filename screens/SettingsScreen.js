import React from 'react';
import {
  View,
  AsyncStorage,
  Text,
  StyleSheet
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SettingsScreen(props) {

  const [user, setUser] = React.useState({});


  React.useEffect(() => {
    async function getData() {
      const res = await AsyncStorage.getItem("user");
      const user = JSON.parse(res);
      setUser(user);
    }
    getData();
  }, []); 
  
 const _signOutAsync = async () => {
    await AsyncStorage.clear();
    props.navigation.navigate('Auth');
  };
  
  return (
    <View style={styles.container}>
      <Text>Name: {user.profile?.first_name} {user.profile?.last_name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Phone Number: {user.phone_number}</Text>
      <TouchableOpacity onPress={_signOutAsync}>
        <Text style={{fontWeight: "bold"}}>Logout</Text>
      </TouchableOpacity>
    </View>
  ) 
}

SettingsScreen.navigationOptions = {
  title: 'Profile',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
});