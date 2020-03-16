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
      <Text>
        <Text>Name: </Text>
        <Text style={{fontWeight: 'bold'}}>{user.profile?.first_name} {user.profile?.last_name}</Text>
      </Text>
      <Text>
        <Text>Email: </Text>
        <Text style={{fontWeight: 'bold'}}>{user.email}</Text>
      </Text>
      <Text>
        <Text>Phone Number: </Text>
        <Text style={{fontWeight: 'bold'}}>{user.phone_number}</Text>
      </Text>
      <TouchableOpacity onPress={_signOutAsync}>
        <Text style={{fontWeight: "bold", color: 'red'}}>Logout</Text>
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