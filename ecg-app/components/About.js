import React, { Component } from "react";
import { Platform, Linking, StyleSheet } from "react-native";
import { Header, Body, Title, Icon, Container, Content, Button, Text, Card, CardItem, View } from "native-base"
import Hyperlink from "react-native-hyperlink";
import { AppInstalledChecker } from 'react-native-check-app-install';
import Moment from "react-moment"
import { FontAwesome } from "@expo/vector-icons";

console.disableYellowBox = true;

export default class About extends Component {

  render() {

    return (
      <Container>
        <Header>
          <Body>
            <Title>FAQ</Title>
          </Body>
        </Header>
        <Content>
          <FAQ
            setView={(view) => this.setView(view)}
            {...this.props}
          />
          <UpdateButton
            last_update={this.props.last_update}
            pullData={()=>this.props.pullData()}
          />
        </Content>
      </Container>
    )
  }
}

class FAQ extends Component {
  constructor() {
    super();
    this.state = {
      studentFAQs: [],
      uniRepFAQs: [],
      showSection: {
        student: true,
        university: true,
      }
    };
  }

  static getDerivedStateFromProps(props) {
    const FAQs = props.FBfaqs;
    let studentFAQs = [], uniRepFAQs = [];
    for (let entryId in FAQs) {
      let question = {
        id: entryId,
        question: FAQs[entryId].Question,
        answer: FAQs[entryId].Answer
      };
      if (entryId.indexOf("FAQ-U") != -1) uniRepFAQs.push(question);
      else studentFAQs.push(question);
    }

    return {studentFAQs, uniRepFAQs};
  }

  hideSection(section) {
    let showSection = this.state.showSection;
    showSection[section] = false;
    this.setState({showSection});
  }

  showSection(section) {
    let showSection = this.state.showSection;
    for (let key in showSection) showSection[key] = false; // hide all other sections
    showSection[section] = true;
    this.setState({showSection});
  }

  generateDisplay(type, FAQs, show) {
    let display = [], iconName, fn, header;
    if (show) {
      iconName = "ios-arrow-down";
      fn = () => this.hideSection(type);
    } else {
      iconName = "ios-arrow-back";
      fn = () => this.showSection(type);
    }

    if (type == "student") header = "Student FAQs";
    else if (type == "university") header = "University Representative FAQs";

    display.push(
      <CardItem header bordered
        style={styles.rightIcon}
        button onPress={fn}
        key={display.length}
      >
        <Text>{header}</Text>
        <Icon name={iconName} style={styles.icon}/>
      </CardItem>
    )
    let questionsDisplay = FAQs.map(entry => {
      let answerDisplay = (
        <Hyperlink
          linkDefault
          linkStyle={{color: "#2980b9"}}
          linkText={ url => url == "https://sites.google.com/hci.edu.sg/hciecg/home" ? "the ECG Google Site" : url}
        >
          <Text>A: {entry.answer}</Text>
        </Hyperlink>
      );
      if (entry.answer == "instagram") answerDisplay = <InstagramButton />
      return (
        <CardItem bordered key={entry.id}>
          <Body>
            <Text style={{fontWeight: "bold"}}>Q: {entry.question}</Text>
            {answerDisplay}
          </Body>
        </CardItem>
      )
    })

    if (show) display.push(questionsDisplay)
    return display;
  }

  render() {
    let {studentFAQs, uniRepFAQs, showSection} = this.state;
    let studentFAQDisplay = this.generateDisplay("student", studentFAQs, showSection.student);
    let uniRepFAQDisplay = this.generateDisplay("university", uniRepFAQs, showSection.university);

    return (
      <View style={styles.sectionMargin}>
        <Card>{studentFAQDisplay}</Card>
        <Card>{uniRepFAQDisplay}</Card>
      </View>
    )
  }
}

class InstagramButton extends Component {

  constructor() {
    super();
    this.state = {
      instagram_url: "https://www.instagram.com/hciecg/"
    };
  }

  async componentDidMount() {
    isInstalled = await AppInstalledChecker.checkURLScheme("instagram");
    if (isInstalled) {
      let url = "";

      if (Platform.OS === "ios")
        url = "instagram://user?username=hciecg";
      else if (Platform.OS === "android")
        url = "intent://instagram.com/_u/hciecg/#Intent;package=com.instagram.android;scheme=https;end";

      supported = await Linking.canOpenURL(url);
      if (supported) {
        this.setState("instagram_url", url);
      } else console.log("Deeplinking not supported.");
    } else console.log("Instagram not installed.")
  }

  render() {
    return (
      <Button block info onPress={()=>Linking.openURL(this.state.instagram_url)}
        style={styles.margins}
      >
        <FontAwesome name="instagram" color="white" size={20}/>
        <Text>Instagram</Text>
      </Button>
    )
  }
}

class UpdateButton extends Component {

  constructor() {
    super();
    this.state = {
      last_update: "",
    };
  }

  static getDerivedStateFromProps(props) {
    let last_update = props.last_update;
    if (last_update) last_update = JSON.parse(last_update)
    return { last_update: last_update };
  }

  render() {
    return (
      <View style={styles.lastItem}>
        <Text style={styles.margins}>App glitching or data outdated? Click to download the data again.</Text>
        <Button block info onPress={()=>this.props.pullData()}
          style={styles.margins}
        >
          <FontAwesome name="download" color="white" size={20}/>
          <Text>Refresh</Text>
        </Button>
        <Text style={styles.margins}>
          Last updated: <Moment element={Text} fromNow>{this.state.last_update}</Moment>
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rightIcon: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  icon: {
    color: "grey"
  },
  margins: {
    margin: 10,
    marginBottom: 0
  },
  sectionMargin: {
    marginBottom: 20
  },
  lastItem: {
    marginBottom: 100
  }
});