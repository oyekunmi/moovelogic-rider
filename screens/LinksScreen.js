import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function LinksScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text>History</Text>
    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: 'History',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
