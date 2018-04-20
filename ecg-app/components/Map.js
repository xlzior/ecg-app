import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Picker } from "native-base";

import ImageView from "react-native-image-view";

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
    var locations = this.state.locations;
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
  }
  
  changeLocation(location) {
    this.setState({location})
  }

  render() {
    var image = this.state.locations.find(e => e.id == this.state.location);
    var imageIndex = this.state.locations.indexOf(image);

    let imageDisplay;
    if (image.source) { // image.source.uri might not exist if the download URL has not been fetched from firebase
      imageDisplay = (
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

    let pickerItems = this.state.locations.map(e => <Picker.Item key={e.id} label={e.name} value={e.id}/>)
    return (
      <View>
        <Picker
          selectedValue={this.state.location}
          iosHeader="Select location"
          mode="dropdown"
          onValueChange={id => this.changeLocation(id)}>
          {pickerItems}
        </Picker>
        {imageDisplay}
      </View>
    )
  }
}

const styles = StyleSheet.create({});