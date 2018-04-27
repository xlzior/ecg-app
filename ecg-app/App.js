import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from "react-native";

// TabNavigator
import TabNavigator from "react-native-tab-navigator";
import { Feather, MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";

// Components
import MapView from "./components/Map";
import UniversityListContainer from "./components/UniversityListContainer";
import QuestionBank from "./components/QuestionBank";
import Forms from "./components/Forms";
import About from "./components/About";

// Firebase
import * as firebase from "firebase";
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
      selectedTab: "map",
      universities: []
    }
    this.datastoreRef = firebaseApp.database().ref();
    this.imagesRef = firebase.storage().ref().child('images');
  }

  listenForItems(datastoreRef) {
    datastoreRef.on("value", datastore => {
      datastore.forEach(element => {this.storeAsync(element.key, element.val())});
      AsyncStorage.setItem("last_update", JSON.stringify(new Date().toISOString()))
    });
  }

  async storeAsync(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving data", error)
    }
  }

  async fetchAsync(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error("Error retrieving data", error);
    }
  }

  async componentDidMount() {
    this.listenForItems(this.datastoreRef);

    const suni = await AsyncStorage.getItem("University");
    const uni = JSON.parse(suni);
    const sfaculty = await AsyncStorage.getItem("Faculty");
    const faculty = JSON.parse(sfaculty);

    var universities = {};
    // Populate universities
    for (let entry in uni) {
      universities[entry] = {
        name: uni[entry].Name,
        faculties: []
      }
    }

    // Fill up faculties
    for (let entry in faculty) {
      const university = faculty[entry].University
      universities[university].faculties.push({
        id: entry,
        name: faculty[entry].Name,
        details: faculty[entry]
      });
    }

    // Flatten it
    var universitiesFlat = [];
    for (let entry in universities) {
      universitiesFlat.push({
        id: entry,
        name: universities[entry].name,
        faculties: universities[entry].faculties
      });
    }

    this.setState({
      universities: universitiesFlat
    });
  }

  render() {
    return (
      <TabNavigator>
        <TabNavigator.Item
          selected={this.state.selectedTab === "map"}
          title="Map"
          renderIcon={() => <Feather name="map" size={20}/>}
          renderSelectedIcon={() => <Feather name="map" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "map" })}
        >
          <MapView
            imagesRef={this.imagesRef}
            universities={this.state.universities}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === "university-list"}
          title="Booths"
          renderIcon={() => <Entypo name="shop" size={20}/>}
          renderSelectedIcon={() => <Entypo name="shop" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "university-list" })}
        >
          <UniversityListContainer universities={this.state.universities}/>
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
});
