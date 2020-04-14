import React, { useState, useCallback, useEffect } from 'react';
import {StyleSheet, ScrollView, Alert, View , Text } from 'react-native';
import AppButton from '../components/UI/AppButton';
import agent from "../agent";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { locationService } from './../service/locationService';




const TripDetailScreen = props => {
    const [tripStarted, setTripStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const {params} = props.navigation.state;

    useEffect(() => {
       locationService.subscribe(onLocationUpdate);
       return () => locationService.unsubscribe(onLocationUpdate);      
    }, [])


    const onLocationUpdate = async ({ latitude, longitude }) => {
      setLatitude(latitude);
      setLongitude(longitude);
      await saveMyLocation(latitude, longitude);
      console.log("called saved");
    }

    const _getLocationAsync = async () => {
       Location.startLocationUpdatesAsync("my-loc", {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        foregroundService: {
          notificationTitle: 'Your current location',
          notificationBody: 'App running in the background'
          },
        }); 
    };  

  //   const _getLocationAsync = async () => {
  //     // const { status } = await Permissions.askAsync(Permissions.LOCATION);
  //     // if (status !== 'granted') {
  //     //   Alert.alert("info", "Permission to access location was denied", [{text: 'Ok'}])
  //     // }

  //     const location = await Location.getCurrentPositionAsync();
  //     console.log("mylocation", location);
  //     setLatitude(location.coords.latitude);
  //     setLongitude(location.coords.longitude);
  //     console.log("ltlng", latitude, longitude);
  //     await saveMyLocation(location.coords.latitude, location.coords.longitude);
  // };  


    const saveMyLocation = async (lat, lng) => {
      const data = {
        trip_id: params.id,
        latitude: lat,
        longitude: lng
      }
      try {
        const response = await agent.Trip.saveMyLocation(data);
        console.log("res", response);
      } catch (error) {
        console.log("error", error);
      }
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
    
    const startTrip = async () => {
      const { status } = await Permissions.getAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        Alert.alert("Message", "Hey! seems like you have not allowed access to your location, you need to do that before starting this trip.", [
          {
            text: 'OK',
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
        return;
      }
      setLoading(true);
      try {
        const started = await agent.Trip.startTrip(params.id);
        console.log(started);
        if(started.data.success === true) {
          setTripStarted(true);
          setLoading(false);
          Alert.alert("Success", started.data.message, [{text: 'OK'}]);
          await _getLocationAsync();
        }

      } catch (error) {
        setLoading(false);
        console.log("tripstarterror", error);
        Alert.alert("Error", "Unable to start trip, kindly contact support for help on info@app.com", [{text: 'OK'}])
      }
    }

    const endTrip = async () => {
      setLoading(true);
      try {
        const ended = await agent.Trip.endTrip(params.id);
        console.log("ended", ended);
        if(ended.data.success === true) {
          setLoading(false);
          Alert.alert(
            'Was the package delivered ?',
            ended.data.message,
            [
              {
                text: 'Yes', 
                onPress: async () => {
                  try {
                    const res = await packageDelivered();
                    if(res) {
                      console.log("del", res);
                      props.navigation.navigate('App');
                    }
                  } catch (error) {
                    Alert.alert("Error", "Unable to process your request, kindly contact support for help on info@app.com", [{text: 'OK'}])
                  }
                  console.log('OK Pressed')
                }
              },
              {
                text: 'No',
                onPress: async () => {
                  try {
                    const res = await packageNotDelivered();
                    if(res) {
                      console.log("notdel", res);
                      props.navigation.navigate('App');
                    }
                    console.log('Cancel Pressed')
                  } catch (error) {
                    Alert.alert("Error", "Unable to process your request, kindly contact support for help on info@app.com", [{text: 'OK'}])
                  }
                 
                },
                style: 'cancel',
              }
            ],
            {cancelable: false},
          );
          Location.stopLocationUpdatesAsync("my-loc");
        }
      } catch (error) {
        setLoading(false);
        console.log("tripstarterror", error);
        Alert.alert("Error", "Unable to end trip, kindly contact support for help on info@app.com", [{text: 'OK'}])
      }
    }

    const packageDelivered = async () => {
      return await agent.Package.delivered(params.package_id);
    }

    const packageNotDelivered = async () => {
      return await agent.Package.notDelivered(params.package_id);
    }

    // const backToHome = () => {
    //   props.navigation.navigate('App');
    // }

    return (
      <ScrollView style={styles.container}>
        {/* <AppButton
          title='Home'
          onPress={backToHome} /> */}
        <View>
          <Text>
            <Text style={{fontSize: 20}}>User Address: </Text>
            <Text style={{fontWeight: "bold"}}>{params.start_location || 'N/A'} </Text>
          </Text>
          <View
              style={{
                height: 1,
                width: "86%",
                backgroundColor: "#CED0CE",
                marginTop: "5%",
                marginBottom: "5%"
              }}
            />
          <Text>
            <Text style={{fontSize: 20}}>Destination: </Text>
            <Text style={{fontWeight: "bold"}}>{params.end_location} </Text>
          </Text>
          <View
              style={{
                height: 1,
                width: "86%",
                backgroundColor: "#CED0CE",
                marginTop: "5%",
                marginBottom: "5%"
              }}
            />
          <Text>
            <Text style={{fontSize: 20}}>Payment Method: </Text>
            <Text style={{fontWeight: "bold"}}>{params.payment_method}</Text>
          </Text>
          <View
              style={{
                height: 1,
                width: "86%",
                backgroundColor: "#CED0CE",
                marginTop: "5%",
                marginBottom: "5%"
              }}
            />
          <Text>
            <Text style={{fontSize: 20}}>Trip Cost: </Text>
            <Text style={{fontWeight: "bold"}}>{`NGN ${params.cost_of_trip}`}</Text>
          </Text>
          <View
              style={{
                height: 1,
                width: "86%",
                backgroundColor: "#CED0CE",
                marginTop: "5%",
                marginBottom: "5%"
              }}
            />
          <Text>
            <Text style={{fontSize: 20}}>Recipient Name: </Text>
            <Text style={{fontWeight: "bold"}}>{params.recipient_name}</Text>
          </Text>
          <View
              style={{
                height: 1,
                width: "86%",
                backgroundColor: "#CED0CE",
                marginTop: "5%",
                marginBottom: "5%"
              }}
            />
          <Text>
            <Text style={{fontSize: 20}}>Recipient No: </Text>
            <Text style={{fontWeight: "bold"}}>{params.recipient_phone_number}</Text>
          </Text>
          <View
              style={{
                height: 1,
                width: "86%",
                backgroundColor: "#CED0CE",
                marginTop: "5%",
                marginBottom: "5%"
              }}
            />
          <Text>
            <Text style={{fontSize: 20}}>Who Pays: </Text>
            <Text style={{fontWeight: "bold"}}>{params.who_pays}</Text>
          </Text>

          <View style={styles.button}>
            { !tripStarted &&
            <AppButton  
                isLoading={loading}
                onPress={startTrip} 
                title="Start Trip" />
            }
            { tripStarted &&
            <AppButton 
                isLoading={loading}
                onPress={endTrip} 
                title="End Trip" />
            }
          </View>
         
        </View>
      </ScrollView>
    )
}

TripDetailScreen.navigationOptions = {
    title: 'Trip Details',
  };
  

const styles = StyleSheet.create({
      container: {
        flex: 1,
        paddingTop: 15,
        paddingLeft: 15,
        backgroundColor: '#fff',
      },
      button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between"
      }
  });

export default TripDetailScreen;