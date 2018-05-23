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
      faculties: {},
      map: {},
      id: ""
    }
  }

  static getDerivedStateFromProps(props) {
    return {
      universities: props.FBuniversity,
      faculties: props.FBfaculty,
      map: props.FBmap,
      id: props.id
    }
  }

  changeView(id) {
    this.setState({id});
  }

  render() {
    var {isModalShown, closeModal, openMap, imagesRef} = this.props;
    var universitiesFlat = this.props.universities;

    var {id, map, universities, faculties} = this.state;
    if (id.indexOf("F") != -1) {
      var display = (
        <FacultyInfo
          map={map}
          universities={universities}
          id={id}
          data={faculties[id]}
          closeModal={()=>closeModal()}
          changeView={id=>this.changeView(id)}
          openMap={l=>openMap(l)}
        />
      )
    } else if (id.indexOf("U") != -1) {
      var facultiesFlat = universitiesFlat.find(e => e.id == id).faculties;
      var display = (
        <UniversityInfo
          map={map}
          data={universities[id]}
          faculties={facultiesFlat}
          changeView={id=>this.changeView(id)}
          imagesRef={imagesRef}
        />
      )
    }

    var closeButton = (
      <Button
        small transparent dark
        onPress={()=>closeModal()}
        style={styles.closeButton}
      >
        <Icon name="close"/>
      </Button>
    )
    
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalShown}
        onRequestClose={()=>closeModal()}
      >
        {closeButton}
        {display}
      </Modal>
    )
  }
}

class UniversityInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Picture: ""
    }
  }

  componentDidMount() {
    var {id, universities, imagesRef, data} = this.props;
    if (data.Picture !== "") {
      var imageRef = imagesRef.child(data.Picture);
      
      imageRef.getDownloadURL()
      .then(url => this.setState({Picture: url}))
      .catch(e => console.error(e))
    }
  }


  render() {
    var {faculties, closeModal, changeView, data} = this.props;
    var {Desc, Faculties, Name, ShortName, Website, IGP, Courses, Scholarships, Admissions, Prerequisites} = data;

    // title
    var title = <Text style={[styles.header, styles.marginBottom]}>{Name} ({ShortName})</Text>;

    // picture
    var image = this.state.Picture ? (
      <Image
        style={[styles.image, styles.marginBottom]}
        source={{uri: this.state.Picture}}
      />
    ) : null;

    // website
    var website = Website ? (
      <Hyperlink
        linkDefault={true}
        linkStyle={styles.link}
        style={styles.marginBottom}
      >
        <Text>Website: {Website}</Text>
      </Hyperlink>
    ) : null;

    // links
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
          key={key}
        >
          <Text>{links[key]}</Text>
        </Hyperlink>
      )
    }

    // faculties
    var facultiesList = faculties.map(({name, id}) => {
        return (<ListItem
          button onPress={()=>changeView(id)}
          key={id}>
          <Text>{name}</Text>
        </ListItem>)
    })
    var faculties = (
      <View>
        <Text>Faculties</Text>
        {facultiesList}
      </View>
    )

    return (
      <ScrollView style={styles.container}>
        {title}
        {image}
        {linksDisplay}
        <List>{faculties}</List>
      </ScrollView>
    )
  }
}

class FacultyInfo extends Component {
  render() {
    var {map, id, data, universities, closeModal, openMap} = this.props;
    var {Name, University, Website, Courses} = data;

    // title
    University = universities[University].ShortName;
    var title = (
      <View>
        <Text style={styles.header}>{University}</Text>
        <Text style={[styles.header, styles.marginBottom]}>{Name}</Text>
      </View>
    )

    // website
    var website = Website ? (
      <Hyperlink
        linkDefault={true}
        linkStyle={styles.link}
        style={styles.marginBottom}
      >
        <Text>Website: {Website}</Text>
      </Hyperlink>
    ) : null;

    // location
    for (let location in map) {
      for (let uni in map[location]) {
        if (map[location][uni].indexOf(id) != -1) {
          var locationDisplay = (
            <View>
              <Text style={styles.marginBottom}>
                Booth Location: {location}
              </Text>
              <Button
                onPress={()=>{
                  openMap(location);
                  closeModal();
                }}
                style={styles.marginBottom}
              >
                <Text>Go to map</Text>
              </Button>
            </View>
          )
        }
      }
    }

    // courses for faculties which have interesting programmes
    var coursesList = []
    for (let key in Courses) {
      coursesList.push(
        <Hyperlink
          linkDefault={true}
          linkStyle={styles.link}
          style={styles.marginBottom}
          linkText={ url => key }
          key={key}
        >
          <Text>{Courses[key]}</Text>
        </Hyperlink>
      )
    }

    var courses = Courses ? (
      <View>
        <Text style={styles.marginBottom}>Programmes</Text>
        <List>{coursesList}</List>
      </View>
    ) : null;

    return (
      <ScrollView style={styles.container}>
        {title}
        {website}
        {locationDisplay}
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
    height: 100,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginTop: 15
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