import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Modal, TouchableOpacity, Image, AsyncStorage } from "react-native";
import { Button, Icon, Text, List, ListItem } from "native-base";
import Hyperlink from "react-native-hyperlink";

export default class UniversityInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universities: {}
    }
  }
  
  componentDidMount() {
    AsyncStorage.getItem("University")
    .then(data => JSON.parse(data))
    .then((uni)=>{
      this.setState({universities: uni});
    });
  }

  render() {
    if (Object.keys(this.props.faculty) == 0) return null;
    var {Courses, Desc, IGP, Name, Picture, University, Website} = this.props.faculty.details;

    var closeButton = (
      <Button
        small bordered dark
        onPress={()=>this.props.toggleModal(false)}
        style={styles.closeButton}
      >
        <Icon name="close"/>
      </Button>
    )

    University = this.state.universities[University].ShortName;
    var title = (
      <View>
        <Text style={styles.header}>{University}</Text>
        <Text style={[styles.header, styles.marginBottom]}>{Name}</Text>
      </View>
    )

    var image = Picture ? (
      <Image
        style={[styles.image, styles.marginBottom]}
        source={{uri: Picture}}
      />
    ) : null;

    var description = Desc ? (
      <Text style={styles.marginBottom}>{Desc}</Text>
    ) : null;

    var igp = IGP ? (
      <Text style={styles.marginBottom}>IGP: {IGP}</Text>
    ): null;

    var website = Website ? (
      <Hyperlink
        linkDefault={true}
        linkStyle={{color: "#2980b9"}}
        style={styles.marginBottom}
      >
        <Text>Website: {Website}</Text>
      </Hyperlink>
    ) : null;

    Courses = Courses.split(", ");
    var courses = Courses ? (
      <View>
        <Text>Courses</Text>
        <List>
        {
          Courses.map((c, i) => (
            <ListItem key={i}>
              <Text>{c}</Text>
            </ListItem>
          ))
        }</List>
      </View>
    ) : null;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.showModal}
      >
        <ScrollView style={styles.container}>
          {closeButton}
          {title}
          {image}
          {description}
          {igp}
          {website}
          {courses}
        </ScrollView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold"
  },
  image: {
    height: 200,
    width: undefined
  },
  closeButton: {
    alignSelf: "flex-end"
  },
  marginBottom: {
    marginBottom: 20
  }
});