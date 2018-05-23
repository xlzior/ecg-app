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
import Form from "./components/Form";
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
      last_update: "",
      mapLocation: ""
    }
    this.datastoreRef = firebaseApp.database().ref();
    this.imagesRef = firebase.storage().ref().child("images");
  }

  listenForItems(datastoreRef) {
    datastoreRef.once("value", datastore => {
      datastore.forEach(element => {
        this.storeAsync(element.key, element.val());
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
      universities = this.flattenUnis(value, faculty);
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

  fetchAsync() {
    AsyncStorage.getItem("last_update")
    .then(last_update => {
      var oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      oneWeekAgo = JSON.stringify(oneWeekAgo.toISOString())

      // update database only if last update was more than a week ago
      if (last_update == null || last_update < oneWeekAgo) this.listenForItems(this.datastoreRef);
      else {
        console.log("retrieving from AsyncStorage...")
        // if the async storage is still up to date, retrieve data and set it to state
        let asyncStorage = this.state.asyncStorage;
        let universities;

        AsyncStorage.getAllKeys()
        .then(keys => {
          for (let key of keys) {
            AsyncStorage.getItem(key)
            .then(value => {
              if (value != " ") asyncStorage[key] = JSON.parse(value);

              // if both faculty and uni are defined, flatten unis 
              let faculty = asyncStorage["Faculty"];
              let uni = asyncStorage["University"];
              if (faculty && uni) universities = this.flattenUnis(uni, faculty);

              this.setState({asyncStorage, universities});
            })
            .catch(e => {
              console.error(`Error retrieving ${key} from AsyncStorage`, e);
              this.listenForItems(this.datastoreRef);
            })
          }
        })
        .catch(e => {
          console.error("Error getting keys from AsyncStorage", e);
          this.listenForItems(this.datastoreRef);
        })
      }
    })
    .catch(e => {
      console.error("Error retrieving last_update from AsyncStorage", e);
      this.listenForItems(this.datastoreRef);
    })
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
      const university = faculty[entry].University;
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
    Font.loadAsync({"Roboto_medium": require("./components/assets/Roboto_medium.ttf")})
    .then(() => this.setState({ fontLoaded: true }))
    .catch(() => this.setState({ fontLoaded: true }));
    
    this.fetchAsync();
  }

  openMap(location) {
    this.setState({
      selectedTab: "map",
      mapLocation: location
    })
  }

  render() {
    if (!this.state.fontLoaded) return <View style={styles.center}><Text>Loading...</Text></View>
    var {universities, mapLocation, asyncStorage, selectedTab, fontLoaded, last_update} = this.state;
    return (
      <TabNavigator>
        <TabNavigator.Item
          selected={selectedTab === "map"}
          title="Map"
          renderIcon={() => <Feather name="map" size={20}/>}
          renderSelectedIcon={() => <Feather name="map" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "map" })}
        >
          <MapView
            imagesRef={this.imagesRef}
            universities={universities}
            location={mapLocation}
            FBmap={asyncStorage["Map"]}
            FBuniversity={asyncStorage["University"]}
            FBfaculty={asyncStorage["Faculty"]}
            openMap={l=>this.openMap(l)}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={selectedTab === "university-list"}
          title="Booths"
          renderIcon={() => <Entypo name="shop" size={20}/>}
          renderSelectedIcon={() => <Entypo name="shop" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "university-list" })}
        >
          <UniversityListContainer
            universities={universities}
            FBmap={asyncStorage["Map"]}
            FBuniversity={asyncStorage["University"]}
            FBfaculty={asyncStorage["Faculty"]}
            imagesRef={this.imagesRef}
            openMap={l=>this.openMap(l)}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={selectedTab === "question-bank"}
          title="Questions"
          renderIcon={() => <FontAwesome name="question-circle" size={20}/>}
          renderSelectedIcon={() => <FontAwesome name="question-circle" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "question-bank" })}
        >
          <QuestionBank
            FBquestionBank={asyncStorage["QuestionBank"]}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={selectedTab === "forms"}
          title="Forms"
          renderIcon={() => <FontAwesome name="wpforms" size={20}/>}
          renderSelectedIcon={() => <FontAwesome name="wpforms" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "forms" })}
        >
          <Form />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={selectedTab === "about"}
          title="About"
          renderIcon={() => <Feather name="info" size={20}/>}
          renderSelectedIcon={() => <Feather name="info" color="blue" size={20}/>}
          onPress={() => this.setState({ selectedTab: "about" })}
        >
          <About
            FBfaqs={asyncStorage["FAQ"]}
            last_update={last_update}
          />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  }
});
