import React from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import ProfileRow from '../components/profile-row';
import { Ionicons } from '@expo/vector-icons';
import constants from '../constants';
import agent from '../agent';
import AppButton from '../components/UI/AppButton';

function wait(timeout) {
  return new Promise(resolve => {
     setInterval(resolve, timeout);
  });
}

export default function HomeScreen(props) {

  const [refreshing, setRefreshing] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [trip, setTrip] = React.useState({});
  const [interval, setInterval] = React.useState(0);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    agent.Trip.active().then(x => {
      setTrip(x.data.data);
      wait(6000).then(() => setRefreshing(false));
    },
    err => {
      console.log(err);
      wait(6000).then(() => setRefreshing(false));
    });
    
  }, [refreshing]);


  const goToTripDetail = () => {
    props.navigation.navigate('TripDetail', trip);
  }

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
      <ProfileRow style={styles.profile} profileName={user.email} />
      <View style={styles.home}>
        <Ionicons name="ios-mail-open" size={constants.AVATER_SIZE} style={styles.emptyBox} />
        {
         !trip.id ? (<Text>No running trips at the moments</Text>) : (<Text>You have a trip!</Text>)
        }
        {
          trip.id && <AppButton
          title='See Details'
          onPress={goToTripDetail} /> 
        }
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
