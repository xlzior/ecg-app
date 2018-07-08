import React, { Component } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Container, Content, Text, Header, Body, Title, Picker, Icon } from "native-base";

import ImageView from "react-native-image-view";
import UniversityList from "./UniversityList";

const screenWidth = Dimensions.get("window").width;

export default class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      location: "Hall",
      isImageOpen: false,
      universities: [],
    }
  }

  static getDerivedStateFromProps(props) {
    let locations = [];
    for (let locationName in props.FBmap) {
      let index = locations.length;
      let location = {
        Name: locationName,
        ...props.FBmap[locationName]
      }
      
      locations.push(location)

      // compile a list of boothIds in the location
      let boothIds = [];
      for (let uni in props.FBmap[locationName]) {
        if (uni.indexOf('U') !== -1) {
          let faculties = props.FBmap[locationName][uni].split(", ");
          if (faculties[0].indexOf('U') !== -1) faculties[0] += '-A'; // admissions booths get a '-A' suffix
          let uniSection = [uni, ...faculties]
          boothIds.push(...uniSection);
        }
      }

      locations[index].boothIds = boothIds;
    }
    let state = {
      universities: props.universities,
      locations
    };
    if (props.location) state.location = props.location;
    return state;
  }

  changeLocation(location) {
    this.setState({location})
  }

  getURL(location, index) {
    // get image download URLs from firebase and store inside location
    let imageRef = this.props.imagesRef.child(location.FileName);
    let locations = this.state.locations.slice();

    imageRef.getDownloadURL()
    .then(url => {
      locations[index].source = {
        uri: url,
        cache: "force-cache"
      };
      locations[index].width = 1920;
      locations[index].height = 1080;
      this.setState({locations})
    })
    .catch(e => console.log("Error getting map URLs", e));
  }

  componentDidUpdate() {
    let {locations} = this.state;
    // fetch image download URLs only if locations have been loaded but the images have not been downloaded
    if (locations.length > 0 && !locations[0].source) {
      locations.forEach((location, index) => this.getURL(location, index))
    }
  }

  render() {
    let {universities, locations = [{}], location, isImageOpen} = this.state;
    let {FBmap, FBuniversity, FBfaculty, imagesRef, openMap} = this.props;

    // generate map
    let locationDetails = locations.find(e => e.Name == location) || {};
    let imageIndex = locations.indexOf(locationDetails);
    
    var imageDisplay = <View style={{height: 1080 / 1920 * screenWidth, width: screenWidth}}></View>
    if (locationDetails && locationDetails.source) { // image.source.uri might not exist if the download URL has not been fetched from firebase
      imageDisplay = (
        <View>
          <TouchableOpacity onPress={()=>this.setState({isImageOpen: true})}>
            <Image
              source={locationDetails.source}
              style={{height: 1080 / 1920 * screenWidth, width: screenWidth}}
            />
          </TouchableOpacity>
        <ImageView
          images={locations}
          imageIndex={imageIndex}
          isVisible={isImageOpen}
          onClose={()=>this.setState({isImageOpen: false})}
          renderFooter={()=><Text>{locationDetails.Name}</Text>}
          />
        </View>
      )
    }
    
    // generate items for the dropdown menu
    let pickerItems = locations.map(e => <Picker.Item key={e.Name} label={e.Name} value={e.Name}/>)
    
    // generate university list by filtering for unis in the selected location
    let filteredUnis = [];
    if (universities && universities.length > 0 && 'boothIds' in locationDetails) {
      let {boothIds = []} = locationDetails;
      universities.forEach(uni => {
        var filteredFacs = uni.faculties.filter(fac => {
          return boothIds.indexOf(fac.id) != -1;
        });

        if (boothIds.indexOf(uni.id+'-A') != -1) filteredFacs = [uni.id, ...filteredFacs];

        // faculties which are in this location
        if (filteredFacs.length > 0) {
          filteredUnis.push({
            id: uni.id,
            name: uni.name,
            faculties: filteredFacs
          })
        }
        // else if (boothIds.indexOf(uni.id) != -1) {
        //   filteredUnis.push({
        //     id: uni.id,
        //     name: uni.name
        //   })
        // }
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
            selectedValue={location}
            iosHeader="Select location"
            mode="dropdown"
            iosIcon={<Icon name="ios-arrow-down-outline" />}
            onValueChange={name => this.changeLocation(name)}>
            {pickerItems}
          </Picker>
          {imageDisplay}
          <UniversityList
            universities={universities}
            filteredUnis={filteredUnis}
            FBmap={FBmap}
            FBuniversity={FBuniversity}
            FBfaculty={FBfaculty}
            imagesRef={imagesRef}
            openMap={l=>openMap(l)}
            show={true}
          />
        </Content>
      </Container>
    )
  }
}