import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from "react-native";
import { Font } from "expo";

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

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "map",
      universities: [],
      asyncStorage: {},
      fontLoaded: false,
      last_update: ""
    }
    this.datastoreRef = firebaseApp.database().ref();
    this.imagesRef = firebase.storage().ref().child('images');
  }

  listenForItems(datastoreRef) {
    datastoreRef.once("value", datastore => {
      datastore.forEach(element => {
        this.storeAsync(element.key, element.val())
      });

      var last_update = JSON.stringify(new Date().toISOString());
      this.setState({last_update})
      AsyncStorage.setItem("last_update", last_update);
    });
  }

  async storeAsync(key, value) {
    let faculty = this.state.asyncStorage["Faculty"];
    let uni = this.state.asyncStorage["University"];
    let universities;

    if (key == "University" && faculty) {
      universities = this.flattenUnis(value, faculty)
    } else if (key == "Faculty" && uni) {
      universities = this.flattenUnis(uni, value);
    }

    let asyncStorage = this.state.asyncStorage;
    asyncStorage[key] = value;
    this.setState({
      asyncStorage,
      universities
    });

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

  flattenUnis(uni, faculty) {
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
    return universitiesFlat;
  }

  async componentDidMount() {
    Font.loadAsync({
      'Roboto_medium': require('./components/assets/Roboto_medium.ttf'),
    })
    .then(() => {
      this.setState({ fontLoaded: true });
      // console.log("font loaded")
    });

    this.listenForItems(this.datastoreRef);
  }

  render() {
    if (!this.state.fontLoaded) return <View><Text>Loading...</Text></View>
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
            FBmap={this.state.asyncStorage["Map"]}
            FBuniversity={this.state.asyncStorage["University"]}
            FBfaculty={this.state.asyncStorage["Faculty"]}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === "university-list"}
          title="Booths"
          renderIcon={() => <Entypo name="shop" size={20}/>}
          renderSelectedIcon={() => <Entypo name="shop" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "university-list" })}
        >
          <UniversityListContainer
            universities={this.state.universities}
            FBuniversity={this.state.asyncStorage["University"]}
            FBfaculty={this.state.asyncStorage["Faculty"]}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === "question-bank"}
          title="Questions"
          renderIcon={() => <FontAwesome name="question-circle" size={20}/>}
          renderSelectedIcon={() => <FontAwesome name="question-circle" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "question-bank" })}
        >
          <QuestionBank
            FBquestionBank={this.state.asyncStorage["QuestionBank"]}
          />
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
          <About
            FBfaqs={this.state.asyncStorage["FAQ"]}
            last_update={this.state.last_update}
          />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
});
