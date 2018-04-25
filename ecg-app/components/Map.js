import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, AsyncStorage } from "react-native";
import { Container, Content, Text, Header, Body, Title, Picker, List, ListItem } from "native-base";

import ImageView from "react-native-image-view";
import UniversityList from "./UniversityList";

const {width} = Dimensions.get("window");

export default class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [
        {
          id: "hall",
          name: "Hall",
          fileName: "hall.jpg"
        },
        {
          id: "dl2",
          name: "Block D Level 2",
          fileName: "dl2.jpg"
        },
        {
          id: "dl3",
          name: "Block D Level 3",
          fileName: "dl3.jpg"
        },
      ],
      location: "hall",
      isImageOpen: false
    }
  }

  getURL(e) {
    // get image download URLs from firebase and store inside this.images
    var imageRef = this.props.imagesRef.child(e.fileName);
    var locations = this.state.locations.slice();
    var index = locations.indexOf(e);

    imageRef.getDownloadURL()
    .then(url => {
      locations[index].source = {uri: url};
      locations[index].width = 1920;
      locations[index].height = 1080;
      this.setState({locations})
    })
    .catch(e => console.error(e));
  }

  componentDidMount() {
    // get URLs for all the locations
    this.state.locations.forEach(e => this.getURL(e));

    AsyncStorage.getItem("Map")
    .then(data => JSON.parse(data))
    .then(booths => {
      var locations = this.state.locations.slice();
      for (let name in booths) {
        // for each location in the map
        var location = this.state.locations.find(l => l.name == name);
        var index = locations.indexOf(location);

        // compile a list of boothIds in the location
        var boothIds = []
        for (let booth in booths[name]) {
          boothIds.push(booths[name][booth].Link)
        }

        // add the info to the existing object called locations
        locations[index].boothIds = boothIds;
      }
      this.setState({locations});
    })
    .catch(e => console.error(e));
  }

  static getDerivedStateFromProps(props) {
    return { universities: props.universities }
  }

  changeLocation(location) {
    this.setState({location})
  }

  render() {
    // generate map
    var image = this.state.locations.find(e => e.id == this.state.location);
    var imageIndex = this.state.locations.indexOf(image);
    
    if (image.source) { // image.source.uri might not exist if the download URL has not been fetched from firebase
      var imageDisplay = (
        <View>
          <TouchableOpacity onPress={()=>this.setState({isImageOpen: true})}>
            <Image
              source={{uri: image.source.uri}}
              style={{height: 200, width}}
            />
          </TouchableOpacity>
          <ImageView
            images={this.state.locations}
            imageIndex={imageIndex}
            isVisible={this.state.isImageOpen}
            onClose={()=>this.setState({isImageOpen: false})}
            renderFooter={()=><Text>{image.name}</Text>}
          />
        </View>
      )
    }

    // generate items for the dropdown menu
    let pickerItems = this.state.locations.map(e => <Picker.Item key={e.id} label={e.name} value={e.id}/>)

    // generate university list by filtering for unis in the selected location
    var filteredUnis = [];
    if (this.state.universities.length > 0) {
      var {universities} = this.state;
      universities.forEach(uni => {
        var filteredFacs = uni.faculties.filter(fac => {
          var boothIds = this.state.locations.find(l => l.id == this.state.location).boothIds;
          if (boothIds) return boothIds.indexOf(fac.id) != -1;
        });
        if (filteredFacs.length > 0) {
          filteredUnis.push({
            id: uni.id,
            name: uni.name,
            faculties: filteredFacs
          })
        }
      })
    }

    return (
      <Container>
        <Header>
          <Body>
            <Title>Map</Title>
          </Body>
        </Header>
        <Content>
          <Picker
            selectedValue={this.state.location}
            iosHeader="Select location"
            mode="dropdown"
            onValueChange={id => this.changeLocation(id)}>
            {pickerItems}
          </Picker>
          {imageDisplay}
          <UniversityList universities={filteredUnis}/>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({});