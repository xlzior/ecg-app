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
    datastoreRef.on("value", (datastore) => {
      datastore.forEach(async (element) => {
        await this.storeAsync("@AsyncStorage:"+element.key, element.val())
        // TODO: this thing only works for the last key value pair in the array because of some async thing
      });
    });
  }

  async storeAsync(key, value) {
    try {
      console.log(key, value)
      await AsyncStorage.setItem("@AsyncStorage:"+key, JSON.stringify(value));
    } catch (error) {
      console.log("Error saving data", error)
    }
  }

  async fetchAsync() {
    console.log("fetching data...")
    try {
      const value = await AsyncStorage.getItem("@AsyncStorage:FAQ");
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
          <TouchableOpacity onPress={this.fetchAsync}>
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
