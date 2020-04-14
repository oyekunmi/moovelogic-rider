import React from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import ProfileRow from '../components/profile-row';
import { Ionicons } from '@expo/vector-icons';
import constants from '../constants';
import agent from '../agent';
import AppButton from '../components/UI/AppButton';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { updateLocationService } from './../service/updateLocationService';


function wait(timeout) {
  return new Promise(resolve => {
     setInterval(resolve, timeout);
  });
}

export default function HomeScreen(props) {

  const [refreshing, setRefreshing] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [trip, setTrip] = React.useState({});



  const onRefresh = React.useEffect(() => {
    setRefreshing(true);
    agent.Trip.active().then(x => {
      setTrip(x.data.data);
      playSound();
      setRefreshing(false);
      wait(60000).then(() => setRefreshing(false));
    },
    err => {
      console.log(err);
      setRefreshing(false);
      wait(60000).then(() => setRefreshing(false));
    });   
  }, [refreshing]);

  React.useEffect(() => {
      updateLocationService.subscribe(onLocationUpdate);
      getUpdatedLocationAsync();
      return () => updateLocationService.unsubscribe(onLocationUpdate);
  }, [])

  const playSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../assets/sounds/sharp.mp3'));
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  const onLocationUpdate = async ({ latitude, longitude }) => {
    await updateLocation(latitude, longitude);
    console.log("updated called saved");
  }

  const updateLocation = async (lat, lng) => {
    const data = {
      latitude: lat,
      longitude: lng
    }
    try {
      const response = await agent.Trip.updateMyLocation(data);
      console.log("resup", response);
    } catch (error) {
      console.log("errorup", error);
    }
  }

  const getUpdatedLocationAsync = async () => {
    Location.startLocationUpdatesAsync("update-loc", {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      foregroundService: {
        notificationTitle: 'Updating current location',
        notificationBody: 'App running in the background'
        },
      }); 
  }

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if(result.status !== 'granted') {
      Alert.alert('Insufficient permission', 'You need to grant location permissions to use this app', [
        {
          text: 'Ok', 
          onPress: async () => {
            await verifyPermissions();
          }
        },
        {
          text: 'No',
          onPress: async () => {
             console.log("cancelled pressed");
          },
          style: 'cancel',
        }
      ]);
      return false;
    }
    return true;
  }

  const goToTripDetail = () => {
    props.navigation.navigate('TripDetail', trip);
  }

  React.useEffect( () => {
     async function verifyPer() {
        await verifyPermissions();
     }
     verifyPer();
  }, [])

  React.useEffect(x=> {
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
         !trip.id ? (<Text style={{fontSize: 15}}>No running trips at the moments</Text>) : (<Text style={{fontSize: 15}}>You have a trip!</Text>)
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
    fontSize: 15
  }
});
