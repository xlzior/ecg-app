import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Modal, TouchableOpacity, Image } from "react-native";
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

  static getDerivedStateFromProps(props) {
    return {
      universities: props.FBuniversity,
      faculties: props.FBfaculty
    }
  }

  render() {
    var {showModal, toggleModal, type, info} = this.props;
    if (type == "faculty") {
      var display = (
        <FacultyInfo
          data={info.details}
          universities={this.state.universities}
          type={type}
          toggleModal={b=>toggleModal(b)}
        />
      )
    } else if (type == "university") {
      var display = (
        <UniversityInfo
          data={this.state.universities[info.id]}
          faculties={this.state.faculties}
          type={type}
          toggleModal={b=>toggleModal(b)}
        />
      )
    }
    
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
      >
        {display}
      </Modal>
    )
  }
}

class UniversityInfo extends Component {
  render() {
    var {data, faculties, type, toggleModal} = this.props;
    var {Desc, Faculties, Name, Picture, ShortName, Website, IGP, Courses, Scholarships, Admissions, Prerequisites} = data;

    // close button for faculties and unis
    var closeButton = (
      <Button
        small transparent dark
        onPress={()=>toggleModal(false)}
        style={styles.closeButton}
      >
        <Icon name="close"/>
      </Button>
    )

    // title for unis
    var title = <Text style={[styles.header, styles.marginBottom]}>{Name} ({ShortName})</Text>;

    // picture for faculties and unis
    var image = Picture ? (
      <Image
        style={[styles.image, styles.marginBottom]}
        source={{uri: Picture}}
      />
    ) : null;

    // description for faculties and unis
    var description = Desc ? (
      <Text style={[styles.marginBottom, styles.desc]}>{Desc}</Text>
    ) : null;

    // website for faculties and unis
    var website = Website ? (
      <Hyperlink
        linkDefault={true}
        linkStyle={styles.link}
        style={styles.marginBottom}
      >
        <Text>Website: {Website}</Text>
      </Hyperlink>
    ) : null;

    // faculties for unis
    if (type == "university") {
      var facultiesList = [];
      for (var id in Faculties) {
        facultiesList.push(faculties[Faculties[id]]);
      }
      var faculties = (
        <View>
          <Text>Faculties</Text>
          {facultiesList.map(fac => {
            return <ListItem><Text>{fac.Name}</Text></ListItem>
          })}
        </View>
      )
    }

    // links for unis
    if (type == "university") {
      var linksDisplay = []
      var links = {
        "IGP": IGP,
        "Courses": Courses,
        "Scholarships": Scholarships,
        "Admissions Requirements": Admissions,
        "'A'-Level Subject Pre-requisites": Prerequisites
      }

      for (let key in links) {
        if (links[key]) linksDisplay.push(
          <Hyperlink
            linkDefault={true}
            linkStyle={styles.link}
            style={styles.marginBottom}
            linkText={ url => key }
          >
            <Text>{links[key]}</Text>
          </Hyperlink>
        )
      }
    }
    return (
      <ScrollView style={styles.container}>
        {closeButton}
        {title}
        {image}
        {description}
        {linksDisplay}
        <List>{faculties}</List>
      </ScrollView>
    )
  }
}

class FacultyInfo extends Component {
  render() {
    var {data, universities, type, toggleModal} = this.props;
    var {Courses, Desc, IGP, Name, Picture, University, Website} = data;
    // close button for faculties and unis
    var closeButton = (
      <Button
        small transparent dark
        onPress={()=>toggleModal(false)}
        style={styles.closeButton}
      >
        <Icon name="close"/>
      </Button>
    )

    // title for faculties
    University = universities[University].ShortName;
    var title = (
      <View>
        <Text style={styles.header}>{University}</Text>
        <Text style={[styles.header, styles.marginBottom]}>{Name}</Text>
      </View>
    )

    // picture for faculties and unis
    var image = Picture ? (
      <Image
        style={[styles.image, styles.marginBottom]}
        source={{uri: Picture}}
      />
    ) : null;

    // description for faculties and unis
    var description = Desc ? (
      <Text style={[styles.marginBottom, styles.desc]}>{Desc}</Text>
    ) : null;

    // igp for faculties
    var igp = IGP ? (
      <Text style={styles.marginBottom}>IGP: {IGP}</Text>
    ): null;

    // website for faculties and unis
    var website = Website ? (
      <Hyperlink
        linkDefault={true}
        linkStyle={styles.link}
        style={styles.marginBottom}
      >
        <Text>Website: {Website}</Text>
      </Hyperlink>
    ) : null;

    // courses for faculties
    var courses = (Courses && type == "faculty") ? (
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
      <ScrollView style={styles.container}>
        {closeButton}
        {title}
        {image}
        {description}
        {igp}
        {website}
        {courses}
      </ScrollView>
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
  },
  desc: {
    textAlign: "justify"
  },
  link: {
    color: "#2980b9"
  }
});