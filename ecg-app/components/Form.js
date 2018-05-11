import React, { Component } from "react";
import { WebView, View } from "react-native";
import { Header, Left, Body, Right, Title, Icon } from "native-base"
import { Container, Content, Button, Text } from "native-base"

const titles = {
  main: "Forms",
  student: "Student",
  university: "University"
}

export default class Form extends Component {

  constructor() {
    super();
    this.state = {
      view: "main", // main, student, university
      title: "Forms"
    }

    this.setView = this.setView.bind(this);
  }

  setView(view) {
    this.setState({ view: view });
    this.setState({ title: titles[view] });
  }

  getView() {
    if (this.state.view === "main")
      return <Main
              setView={this.setView}
              style={{ flex: 1 }}
              />
    else if (this.state.view === "student")
      return <Student
              setView={this.setView}
              style={{ flex: 1 }}
              />
    else // university
      return <University
              setView={this.setView}
              style={{ flex: 1 }}
              />
  }

  render() {
    return (
      <Container style={{ flex: 1 }}>
        <Header>
        <Left>
        {this.state.view !== "main" &&
          <Button transparent>
            <Icon
              name="arrow-back"
              onPress={()=>this.setView("main")}
            />
          </Button>
        }
        </Left>
        <Body>
          <Title>{this.state.title}</Title>
        </Body>
        <Right />
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
  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{uri: "https://docs.google.com/forms/d/e/1FAIpQLSfeLZ2NMKAT7vV45q-OBasxLfpeQY3tBTq2tdktio4vCsjLjA/viewform?embedded=true"}}
          style={{ flex: 1 }}
        />
      </View>
    )
  }
}

class University extends Component {

  onMessage(data) {
    console.log(data);
  }

  render() {
    const jsCode = `
      var href = window.location.href;
      if (href.includes("formResponse")) {
        window.postMessage($("a").href);
      }
    `
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{uri: "https://docs.google.com/forms/d/e/1FAIpQLSd6cqzHKZuNCQ-gErKriYRrMpkEHbUQYq7FREAJXxJMUkQY1Q/viewform?embedded=true"}}
          onMessage={this.onMessage}
          style={{ flex: 1 }}
          injectedJavaScript={jsCode}
        />
      </View>
    )
  }
}

// https://github.com/facebook/react-native/issues/11594