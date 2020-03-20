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
        <FlatList
          data={history}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
            <View style={styles.item}>
              <Text style={{marginBottom: 10}}>
                <Text style={{fontSize: 20}}>Date: </Text>
                <Text style={{fontWeight: "bold", fontSize: 20}}>{item.created_at}</Text>
              </Text>
              <Text style={{marginBottom: 10}}>
                <Text style={{fontSize: 20}}>Trip Status: </Text>
                <Text style={(item.trip_status === "ENDED") ? styles.green : styles.red}>{item.trip_status}</Text>
              </Text>
              <Text style={{marginBottom: 10}}>
                <Text style={{fontSize: 20}}>Pick Up Location: </Text>
                <Text style={{fontWeight: "bold", fontSize: 20}}>{item.start_location || 'N/A'}</Text>
              </Text>
              <Text style={{marginBottom: 10}}>
                <Text style={{fontSize: 20}}>Delivery Location: </Text>
                <Text style={{fontWeight: "bold", fontSize: 20}}>{item.end_location}</Text>
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
    color: 'red',
    fontWeight: 'bold',
    fontSize: 20
  },
  green: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 20
  }
});
