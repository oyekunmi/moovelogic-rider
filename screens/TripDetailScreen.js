import React, { useState } from 'react';
import {StyleSheet, ScrollView, Alert, View , Text } from 'react-native';
import AppButton from '../components/UI/AppButton';
import agent from "../agent";

const TripDetailScreen = props => {
    const [tripStarted, setTripStarted] = useState(false);
    const [loading, setLoading] = useState(false);

    const {params} = props.navigation.state;
    console.log(params);

    const startTrip = async () => {
      setLoading(true);
      try {
        const started = await agent.Trip.startTrip(params.id);
        console.log(started);
        if(started.data.success === true) {
          setTripStarted(true);
          setLoading(false);
          Alert.alert("Success", started.data.message, [{text: 'OK'}])
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        Alert.alert("Error", "Unable to start trip, kindly contact support for help on info@app.com", [{text: 'OK'}])
      }
    }

    const endTrip = async () => {
      setLoading(true);
      try {
        const ended = await agent.Trip.endTrip(params.id);
        console.log(ended);
        if(ended.data.success === true) {
          setLoading(false);
          Alert.alert(
            'Was the package delivered ?',
            ended.data.message,
            [
              {
                text: 'YES', 
                onPress: async () => {
                  const res = await packageDelivered();
                  if(res) {
                    props.navigation.navigate('App');
                  }
                  console.log('OK Pressed')
                }
              },
              {
                text: 'No',
                onPress: async () => {
                  const res = await packageNotDelivered();
                  if(res) {
                    props.navigation.navigate('App');
                  }
                  console.log('Cancel Pressed')
                },
                style: 'cancel',
              }
            ],
            {cancelable: false},
          );
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        Alert.alert("Error", "Unable to end trip, kindly contact support for help on info@app.com", [{text: 'OK'}])
      }
    }

    const packageDelivered = async () => {
      return await agent.Package.delivered(params.package_id);
    }

    const packageNotDelivered = async () => {
      return await agent.Package.notDelivered(params.package_id);
    }

    return (
      <ScrollView style={styles.container}>
        <View>
          <Text> User Address: {params.start_location || 'N/A'} </Text>
          <Text> Destination: {params.end_location} </Text>
          <Text> Payment Method: {params.payment_method} </Text>
          <Text> Trip Cost: {params.cost_of_trip} </Text>
          <Text> Recipient Name: {params.recipient_name} </Text>
          <Text> Recipient No: {params.recipient_phone_number} </Text>
          <Text> Who Pays: {params.who_pays} </Text>

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
        backgroundColor: '#fff',
      },
      button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between"
      }
  });

export default TripDetailScreen;