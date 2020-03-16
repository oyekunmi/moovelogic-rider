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


  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "4%"
        }}
      />
    );
  };


  return (
    <ScrollView style={styles.container}>
      <View >
        <Text style={{marginBottom: 10, marginLeft: 12}}>
        Your trip history
        </Text>
        <FlatList
          data={history}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
            <View style={styles.item}>
              <Text>
                <Text>Date: </Text>
                <Text style={{fontWeight: "bold"}}>{item.created_at}</Text>
              </Text>
              <Text>
                <Text>Trip Status: </Text>
                <Text style={(item.trip_status === "ENDED") ? styles.green : styles.red}>{item.trip_status}</Text>
              </Text>
              <Text>
                <Text>Pick Up Location: </Text>
                <Text style={{fontWeight: "bold"}}>{item.start_location || 'N/A'}</Text>
              </Text>
              <Text>
                <Text>Delivery Location: </Text>
                <Text style={{fontWeight: "bold"}}>{item.end_location}</Text>
              </Text>
            </View>
          }
          keyExtractor={item => item.id}
          ItemSeparatorComponent = {renderSeparator}
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
  red: {
    color: 'red'
  },
  green: {
    color: 'green'
  }
});
