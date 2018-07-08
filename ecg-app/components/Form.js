import React, { Component } from "react";
import { AsyncStorage, WebView, View, BackHandler } from "react-native";
import { Header, Left, Body, Right, Title, Icon } from "native-base"
import { Container, Content, Button, Text } from "native-base"

const titles = {
  main: "Forms",
  student: "Student",
  university: "University"
}

const jsCode = `
  function whenRNPostMessageReady(cb) {
      if (postMessage.length === 1) cb();
      else setTimeout(function() { whenRNPostMessageReady(cb) }, 1000);
  }

  var href = window.location.href;

  if (~ href.indexOf("formResponse")) {
    whenRNPostMessageReady(function() {
      postMessage(document.getElementsByTagName("a")[0].href);
    });
  }
`;

export default class Form extends Component {

  constructor() {
    super();
    this.state = {
      view: "main", // main, student, university
      title: "Forms"
    };
  }

  setView(view) {
    this.setState({ view: view, title: titles[view] });
  }

  getView() {
    if (this.state.view === "main")
      return <Main
              setView={(view)=>this.setView(view)}
              style={{ flex: 1 }}
              />
    else if (this.state.view === "student")
      return <Student
              setView={(view)=>this.setView(view)}
              style={{ flex: 1 }}
              />
    else // university
      return <University
              setView={(view)=>this.setView(view)}
              style={{ flex: 1 }}
              />
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.setView("main")
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return (
      <Container style={{ flex: 1 }}>
        <Header>
        {this.state.view !== "main" &&
          <Left>
            <Button transparent onPress={()=>this.setView("main")}>
              <Icon
                name="arrow-back"
              />
            </Button>
          </Left>
        }
        <Body>
          <Title>{this.state.title}</Title>
        </Body>
        {this.state.view !== "main" && <Right />}
        </Header>
        {this.getView()}
      </Container>
    )
  }
}

class Main extends Component {

  render() {
    return (
      <Content>
        <Button info block large onPress={()=>this.props.setView("student")}>
          <Text>Student Form</Text>
        </Button>
        <Button info block large onPress={()=>this.props.setView("university")}>
          <Text>University Form</Text>
        </Button>
      </Content>
    )
  }
}

class Student extends Component {

  constructor() {
    super();
    this.state = {
      uri: "https://docs.google.com/forms/d/e/1FAIpQLSfeLZ2NMKAT7vV45q-OBasxLfpeQY3tBTq2tdktio4vCsjLjA/viewform?embedded=true"
    };
  }

  onMessage(event) {
    var editUrl = event.nativeEvent.data;
    AsyncStorage.setItem("Forms/Student", editUrl);
    this.setState({ uri: editUrl });
  }

  async componentDidMount() {
    const uri = await AsyncStorage.getItem("Forms/Student")
    if (uri) this.setState({ uri });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: this.state.uri }}
          onMessage={(e)=>this.onMessage(e)}
          style={{ flex: 1 }}
          injectedJavaScript={jsCode}
        />
      </View>
    )
  }
}

class University extends Component {

  constructor() {
    super();
    this.state = {
      uri: "https://docs.google.com/forms/d/e/1FAIpQLSd6cqzHKZuNCQ-gErKriYRrMpkEHbUQYq7FREAJXxJMUkQY1Q/viewform?embedded=true"
    };
  }

  onMessage(event) {
    var editUrl = event.nativeEvent.data;
    AsyncStorage.setItem("Forms/University", editUrl);
    this.setState({ uri: editUrl });
  }

  async componentDidMount() {
    const uri = await AsyncStorage.getItem("Forms/University")
    if (uri) this.setState({ uri });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: this.state.uri }}
          onMessage={(e)=>this.onMessage(e)}
          style={{ flex: 1 }}
          injectedJavaScript={jsCode}
        />
      </View>
    )
  }
}