import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet,   FlatList,
  Text, Alert } from 'react-native';
import agent from '../agent';

export default function LinksScreen() {
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
     async function fetchHistory() {
      try {
        const res = await agent.Trip.getHistory();
        setHistory(res.data.data);
      } catch (error) {
        Alert.alert("Error", "Something failed while fetching history", [{text: 'Ok'}]);
      }
    }
    fetchHistory();
  }, [])


  return (
    <ScrollView style={styles.container}>
      <View >
        <Text style={{marginBottom: 10}}>
        Your trip history
        </Text>
        <FlatList
          data={history}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
            <View style={styles.item}>
              <Text >{item.created_at}</Text>
              <Text >{item.trip_status}</Text>
              <Text >{item.start_location}</Text>
              <Text >{item.end_location}</Text>
            </View>
          }
          keyExtractor={item => item.id}
        />
    </View>
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
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
