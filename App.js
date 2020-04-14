import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as TaskManager from 'expo-task-manager';
import { locationService } from './service/locationService';
import { updateLocationService } from './service/updateLocationService';





import AppNavigator from './navigation/AppNavigator';

export default function App(props) {
  
  const [isLoadingComplete, setLoadingComplete] = useState(false);


  useEffect(()=>{
    StatusBar.setHidden(true);

  },[])

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    await Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

TaskManager.defineTask("my-loc", ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    console.log(error);
    return;
  }
  console.log('Received new locations', locations);
  const { latitude, longitude } = locations[0].coords;
  locationService.setLocation({
    latitude,
    longitude
  })
});


TaskManager.defineTask("update-loc", ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    console.log(error);
    return;
  }
  console.log('new updated locations', locations);
  const { latitude, longitude } = locations[0].coords;
  updateLocationService.setLocation({
    latitude,
    longitude
  })
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
