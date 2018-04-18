import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from "react-native";
import * as firebase from "firebase";

import TabNavigator from "react-native-tab-navigator";
import { Feather, MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";

import MapView from "./components/Map";
import UniversityList from "./components/UniversityList";
import QuestionBank from "./components/QuestionBank";
import Forms from "./components/Forms";
import About from "./components/About";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBdqilpCzlfukGGQIo4dZ7ntrrzZliTHlI",
  authDomain: "ecg-fair.firebaseapp.com",
  databaseURL: "https://ecg-fair.firebaseio.com",
  storageBucket: "ecg-fair.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "map"
    }
    this.datastoreRef = firebaseApp.database().ref();
  }

  listenForItems(datastoreRef) {
    datastoreRef.on("value", datastore => {
      datastore.forEach(element => {this.storeAsync(element.key, element.val())});
    });
  }

  async storeAsync(key, value) {
    console.log(key, value)
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Error saving data", error)
    }
  }

  async fetchAsync(key) {
    console.log("fetching data...")
    AsyncStorage.getAllKeys().then(e => console.log(e))
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) console.log(value);
    } catch (error) {
      console.log("Error retrieving data", error);
    }
  }

  componentDidMount() {
    this.listenForItems(this.datastoreRef);
  }

  render() {
    return (
      <TabNavigator sceneStyle={styles.tabNavigator}>
        <TabNavigator.Item
          selected={this.state.selectedTab === "map"}
          title="Map"
          renderIcon={() => <Feather name="map" size={20}/>}
          renderSelectedIcon={() => <Feather name="map" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "map" })}
        >
          <TouchableOpacity onPress={()=>this.fetchAsync("University")}>
            <Text>check store</Text>
          </TouchableOpacity>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === "university-list"}
          title="Booths"
          renderIcon={() => <Entypo name="shop" size={20}/>}
          renderSelectedIcon={() => <Entypo name="shop" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "university-list" })}
        >
          <UniversityList />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === "question-bank"}
          title="Questions"
          renderIcon={() => <FontAwesome name="question-circle" size={20}/>}
          renderSelectedIcon={() => <FontAwesome name="question-circle" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "question-bank" })}
        >
          <QuestionBank />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === "forms"}
          title="Forms"
          renderIcon={() => <FontAwesome name="wpforms" size={20}/>}
          renderSelectedIcon={() => <FontAwesome name="wpforms" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "forms" })}
        >
          <Forms />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === "about"}
          title="About"
          renderIcon={() => <Feather name="info" size={20}/>}
          renderSelectedIcon={() => <Feather name="info" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "about" })}
        >
          <About />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  tabNavigator: {
    margin: 10,
    marginTop: 20
  }
});
