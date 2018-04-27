import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Modal, TouchableOpacity, Image, AsyncStorage } from "react-native";
import { Button, Icon, Text, List, ListItem } from "native-base";
import Hyperlink from "react-native-hyperlink";

import UniversityList from "./UniversityList";

export default class BoothInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universities: {},
      faculties: {}
    }
  }
  
  componentDidMount() {
    AsyncStorage.getItem("University")
    .then(data => JSON.parse(data))
    .then((uni)=>{
      this.setState({universities: uni});
    });

    AsyncStorage.getItem("Faculty")
    .then(data => JSON.parse(data))
    .then((fac)=>{
      this.setState({faculties: fac});
    });
  }

  render() {
    var {showModal, toggleModal, type, info} = this.props;
    if (type == "faculty") {
      var {Courses, Desc, IGP, Name, Picture, University, Website} = info.details;
    } else if (type == "university") {
      var {Desc, Faculties, Name, Picture, ShortName, Website} = this.state.universities[info.id];
    }
    
    // close button for faculties and unis
    var closeButton = (
      <Button
        small bordered dark
        onPress={()=>toggleModal(false)}
        style={styles.closeButton}
      >
        <Icon name="close"/>
      </Button>
    )

    var title = <Text>Title</Text>
    // title for faculties
    if (type == "faculty") {
      University = this.state.universities[University].ShortName;
      var title = (
        <View>
          <Text style={styles.header}>{University}</Text>
          <Text style={[styles.header, styles.marginBottom]}>{Name}</Text>
        </View>
      )
    }

    // title for unis
    else if (type == "university") {
      var title = <Text style={[styles.header, styles.marginBottom]}>{Name} ({ShortName})</Text>;
    }

    // picture for faculties and unis
    var image = Picture ? (
      <Image
        style={[styles.image, styles.marginBottom]}
        source={{uri: Picture}}
      />
    ) : null;

    // description for faculties and unis
    var description = Desc ? (
      <Text style={styles.marginBottom}>{Desc}</Text>
    ) : null;

    // igp for faculties
    var igp = IGP ? (
      <Text style={styles.marginBottom}>IGP: {IGP}</Text>
    ): null;

    // website for faculties and unis
    var website = Website ? (
      <Hyperlink
        linkDefault={true}
        linkStyle={{color: "#2980b9"}}
        style={styles.marginBottom}
      >
        <Text>Website: {Website}</Text>
      </Hyperlink>
    ) : null;

    // faculties for unis
    if (type == "university") {
      var facultiesList = [];
      for (var id in Faculties) {
        facultiesList.push(this.state.faculties[Faculties[id]]);
      }
      var faculties = (
        <View>
          <Text>Faculties</Text>
          {facultiesList.map(fac => {
            console.log(fac);
            return <ListItem><Text>{fac.Name}</Text></ListItem>
          })}
        </View>
      )
    }

    // courses for faculties
    var courses = Courses? (
      <View>
        <Text>Courses</Text>
        <List>
        {
          Courses.split(", ").map((c, i) => (
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
        visible={showModal}
      >
        <ScrollView style={styles.container}>
          {closeButton}
          {title}
          {image}
          {description}
          {igp}
          {website}
          {courses}
          <List>{faculties}</List>
        </ScrollView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
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