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
      id: ""
    }
  }

  static getDerivedStateFromProps(props) {
    return {
      universities: props.FBuniversity,
      faculties: props.FBfaculty,
      id: props.id
    }
  }

  changeView(id) {
    this.setState({id});
  }

  render() {
    var {isModalShown, closeModal} = this.props;
    var {id} = this.state;
    if (id.indexOf("F") != -1) {
      var display = (
        <FacultyInfo
          universities={this.state.universities}
          faculties={this.state.faculties}
          id={id}
          closeModal={()=>closeModal()}
          changeView={id=>this.changeView(id)}
        />
      )
    } else if (id.indexOf("U") != -1) {
      var display = (
        <UniversityInfo
          universities={this.state.universities}
          faculties={this.state.faculties}
          id={id}
          closeModal={()=>closeModal()}
          changeView={id=>this.changeView(id)}
          imagesRef={this.props.imagesRef}
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
    var {id, universities} = this.props;
    var data = universities[id];

    if (data.Picture !== "") {
      var imageRef = this.props.imagesRef.child(data.Picture);
      
      imageRef.getDownloadURL()
      .then(url => {
        console.log(url);
        this.setState({Picture: url});
      })
      .catch(e => console.error(e))
    }
  }


  render() {
    var {faculties, id, universities, closeModal, changeView} = this.props;
    var data = universities[id];
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
        >
          <Text>{links[key]}</Text>
        </Hyperlink>
      )
    }

    // faculties
    var facultiesList = [];
    for (let facName in Faculties) {
      let id = Faculties[facName];
      facultiesList.push(
        <ListItem
          button onPress={()=>changeView(id)}
          key={id}>
          <Text>{facName}</Text>
        </ListItem>
      );
    }
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
    var {faculties, id, universities, closeModal} = this.props;
    var data = faculties[id];
    var {Courses, Desc, IGP, Name, Picture, University, Website} = data;

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

    // courses
    // var courses = (Courses && type == "faculty") ? (
    //   <View>
    //     <Text>Courses</Text>
    //     <List>
    //     {
    //       Courses.split(", ").map((c, i) => (
    //         <ListItem key={i}>
    //           <Text>{c}</Text>
    //         </ListItem>
    //       ))
    //     }</List>
    //   </View>
    // ) : null;

    return (
      <ScrollView style={styles.container}>
        {title}
        {website}
        <Text>Booth Location: [Placeholder]</Text>
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