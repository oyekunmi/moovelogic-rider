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
      <Text style={{marginBottom: 10}}>
        <Text style={{fontSize: 20}}>Name: </Text>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>{user.profile?.first_name} {user.profile?.last_name}</Text>
      </Text>
      <Text style={{marginBottom: 10}}>
        <Text style={{fontSize: 20}}>Email: </Text>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>{user.email}</Text>
      </Text>
      <Text style={{marginBottom: 10}}>
        <Text style={{fontSize: 20}}>Phone Number: </Text>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>{user.phone_number}</Text>
      </Text>
      <TouchableOpacity onPress={_signOutAsync}>
        <Text style={{fontWeight: "bold", fontSize: 20, color: 'red'}}>Logout</Text>
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