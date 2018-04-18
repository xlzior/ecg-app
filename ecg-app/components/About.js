import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { Container, Header, Content, Button, Text, Card, CardItem, Body, Title } from "native-base"

export default class About extends Component {

  constructor() {
    super();
    this.state = {
      view: "main", // faq, main, debug
      title: "About"
    };

    this.setView = this.setView.bind(this);
  }

  setView(view) {
    this.setState({ view: view });
    if (view === "main")
      this.setState({ title: "About" })
    else if (view === "faq")
      this.setState({ title: "Frequently Asked Questions"})
    else
      this.setState({ title: "Debug"})
  }

  getView() {
    if (this.state.view === "main")
      return <Main
                setView={this.setView}
              />
    else if (this.state.view === "faq")
      return <FAQ
                setView={this.setView}
              />
    else if (this.state.view === "debug")
      return <Debug
                setView={this.setView}
              />
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>{this.state.title}</Title>
          </Body>
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
        <Button block info onPress={()=>this.props.setView("faq")}>
          <Text>FAQ</Text>
        </Button>
        <Button block info onPress={()=>this.props.setView("debug")}>
          <Text>Debug</Text>
        </Button>
      </Content>
    )
  }
}

class FAQ extends Component {
  constructor() {
    super();
    this.state = {
      questions: []
    };
  }

  async componentDidMount() {
    const self = this;
    const sFAQs = await AsyncStorage.getItem("FAQ");
    const FAQs = JSON.parse(sFAQs);
    var questions = [];
    for (let entry in FAQs) {
      questions.push({
        id: entry,
        question: FAQs[entry].Question,
        answer: FAQs[entry].Answer
      });
    }
    self.setState({
      questions: questions
    });
  }

  render() {
    return (
      <Content>
        {
          this.state.questions.map((entry) => {
            return <FAQrow
              key={entry.id}
              question={entry.question}
              answer={entry.answer}
            />
          })
        }
        <Button block info onPress={()=>this.props.setView("main")}>
          <Text>Back</Text>
        </Button>
      </Content>
    )
  }
}

class FAQrow extends Component {
  render() {
    return (
      <Card>
        <CardItem>
          <Body>
            <Text>Q: {this.props.question}</Text>
            <Text>A: {this.props.answer}</Text>
          </Body>
        </CardItem>
      </Card>
    )
  }
}

class Debug extends Component {
  render() {
    return (
      <Content>
        <Button block info onPress={()=>this.props.setView("main")}>
          <Text>Back</Text>
        </Button>
      </Content>
    )
  }
}