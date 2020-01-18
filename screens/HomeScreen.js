import React from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  ScrollView,
  RefreshControl
} from 'react-native';
import ProfileRow from '../components/profile-row';
import { Ionicons } from '@expo/vector-icons';
import constants from '../constants';
import agent from '../agent';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export default function HomeScreen(props) {

  const [refreshing, setRefreshing] = React.useState(false);
  const [user, setUser] = React.useState({});

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    agent.Trip.active().then(x => {
      wait(2000).then(() => setRefreshing(false));
    },
    err => {
      wait(2000).then(() => setRefreshing(false));
    });
    
  }, [refreshing]);


  _signOutAsync = async () => {
    await AsyncStorage.clear();
    props.navigation.navigate('Auth');
  };

  React.useEffect(x=>{
    AsyncStorage.getItem("user").then(x=>{
      const user = JSON.parse(x);
      setUser(user);
    });
  }, []); 

  if(!user){
    return <View>
      <Text>Loading</Text>
    </View>
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
      <ProfileRow style={styles.profile} profileName={user.username} />
      <View style={styles.home}>
        <Ionicons name="ios-mail-open" size={constants.AVATER_SIZE} style={styles.emptyBox} />
        <Text>No running trips at the moments</Text>
        <Text style={styles.refreshText}>Pull down to refresh</Text>
      </View>
    </ScrollView>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  profile: {
    marginVertical: 30,
  },
  home: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyBox: {
    marginVertical: 10,
    color: constants.PRIMARY_COLOR,
  },
  refreshText: {
    marginVertical:20,
    fontStyle: "italic",
  }
});
