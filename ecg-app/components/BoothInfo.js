import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Modal, Image, Dimensions } from "react-native";
import { Button, Icon, Text, List, ListItem } from "native-base";
import Hyperlink from "react-native-hyperlink";

const screenWidth = Dimensions.get("window").width;

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
    let {isModalShown, closeModal, openMap, imagesRef} = this.props;
    let universitiesFlat = this.props.universities;

    let {id, map, universities, faculties} = this.state;
    let display;
    if (id.indexOf("F") != -1) {
      display = (
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
      facultiesFlat = universitiesFlat.find(e => e.id == id).faculties;
      display = (
        <UniversityInfo
          map={map}
          id={id}
          data={universities[id]}
          faculties={facultiesFlat}
          changeView={id=>this.changeView(id)}
          closeModal={()=>closeModal()}
          openMap={l=>openMap(l)}
          imagesRef={imagesRef}
        />
      )
    }

    let closeButton = (
      <Button
        transparent dark
        onPress={()=>closeModal()}
        style={styles.closeButton}
      >
        <Icon name="close" style={{fontSize: 35}}/>
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
    let {imagesRef, data} = this.props;
    if (data.Picture !== "") {
      let imageRef = imagesRef.child(data.Picture);
      imageRef.getDownloadURL()
      .then(url => {
        Image.getSize(url, (width, height) => {this.setState({width, height})});
        this.setState({Picture: url});
      })
      .catch(e => console.log("Error retrieving download URL from Firebase", e))
    }
  }


  render() {
    let {faculties, changeView, data, openMap, map, id, closeModal} = this.props;
    let {Name, ShortName, Website, IGP, Courses, Scholarships, Admissions, Prerequisites} = data;
    let {Picture} = this.state;

    // title
    let title = <Text style={[styles.header, styles.marginBottom]}>{Name} ({ShortName})</Text>;

    // picture
    let image;
    let imageSize = {
      width: screenWidth - 40,
      height: 1080 / 1920 * (screenWidth - 40)
    }
    
    if (Picture) {
      image = (
        <View style={styles.row}>
          <Image
            style={[styles.marginBottom, imageSize]}
            resizeMode="cover"
            source={{uri: Picture}}
          />
        </View>
      );
    } 

    // website
    let website = Website ? (
      <Hyperlink
        linkDefault={true}
        linkStyle={styles.link}
        style={styles.marginBottom}
      >
        <Text>Website: {Website}</Text>
      </Hyperlink>
    ) : null;

    // location
    let boothLocation = "-";
    for (let location in map) {
      for (let uni in map[location]) {
        if (map[location][uni].indexOf(id) != -1) {
          boothLocation = location;
        }
      }
    }

    let locationDisplay = (
      <View>
        <Text style={styles.marginBottom}>
          Booth Location: {boothLocation}
        </Text>
        {boothLocation != "-" && <Button
          onPress={()=>{
            openMap(boothLocation);
            closeModal();
          }}
          style={styles.marginBottom}
        >
          <Text>Go to map</Text>
        </Button>}
      </View>
    )

    // links
    let linksDisplay = []
    let links = IGP ? {
      "IGP": IGP,
      "Courses": Courses,
      "Scholarships": Scholarships,
      "Admissions Requirements": Admissions,
      "'A'-Level Subject Pre-requisites": Prerequisites
    } : null;

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
    let facultiesList = faculties.map(({name, id}) => {
        return (<ListItem
          button onPress={()=>changeView(id)}
          key={id}>
          <Text>{name}</Text>
        </ListItem>)
    })
    let facultiesDisplay = (
      <View>
        <Text>Faculties</Text>
        {facultiesList}
      </View>
    )

    return (
      <ScrollView style={styles.container}>
        {title}
        {image}
        {website}
        {locationDisplay}
        {linksDisplay}
        {faculties.length > 0 && <List>{facultiesDisplay}</List>}
      </ScrollView>
    )
  }
}

class FacultyInfo extends Component {
  render() {
    let {map, id, data, universities, closeModal, openMap} = this.props;
    let {Name, University, Website, Courses} = data;

    // title
    let title = (
      <View>
        <Text style={styles.header}>{universities[University].ShortName}</Text>
        <Text style={[styles.header, styles.marginBottom]}>{Name}</Text>
      </View>
    )

    // website
    let website = Website ? (
      <Hyperlink
        linkDefault={true}
        linkStyle={styles.link}
        style={styles.marginBottom}
      >
        <Text>Website: {Website}</Text>
      </Hyperlink>
    ) : null;

    // location
    let boothLocation = "-", uniBoothLocation = "-";
    for (let location in map) {
      if (University in map[location]) {
        if (map[location][University].indexOf(id) != -1) {
          boothLocation = location;
        }
        if (map[location][University].indexOf(University) != -1) {
          uniBoothLocation = location;
        }
      }
    }

    let boothLocationText = (
      <Text style={styles.marginBottom}>
        Booth Location: {boothLocation}
      </Text>
    )
    let uniBoothText = (boothLocation == "-" && uniBoothLocation != "-") ? (
      <Text style={styles.marginBottom}>
        If you wish to find out more about this faculty, please visit their admissions booth located at {uniBoothLocation}.
      </Text>
    ) : null;
    let buttonLocation = boothLocation != "-" ? boothLocation : uniBoothLocation
    let goToMapButton = buttonLocation != "-" ? (
      <Button
        onPress={()=>{
          openMap(buttonLocation);
          closeModal();
        }}
        style={styles.marginBottom}
      >
        <Text>Go to map</Text>
      </Button>
    ) : null;

    let locationDisplay = (
      <View>
        {boothLocationText}
        {uniBoothText}
        {goToMapButton}
      </View>
    )

    // courses for faculties which have interesting programmes
    let coursesList = []
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

    let courses = Courses ? (
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
  row: {
    flex: 1,
    flexDirection: "row"
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

// old image styles
// minHeight: 100,
// maxHeight: 500,
// minWidth: 300,
// maxWidth: screenWidth