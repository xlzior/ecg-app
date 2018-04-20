import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { Header, Left, Body, Right, Title, Icon } from "native-base"
import { Container, Content, Button, Text, Card, CardItem } from "native-base"

console.disableYellowBox = true;

const titles = {
  main: "About",
  faq: "FAQ",
  debug: "Debug"
};

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
    this.setState({ title: titles[view] });
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
          <Left>
            <Button transparent>
              {this.state.view !== "main" &&
                <Icon
                  name="arrow-back"
                  onPress={()=>this.setView("main")}
                />
              }
            </Button>
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

    this.setState({
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
  constructor() {
    super();
    this.state = {
      lastupdt: "Long Long Ago"
    };
  }

  render() {
    return (
      <Content>
        <Text>Last Updated: {this.state.lastupdt}</Text>
        <Button block info onPress={()=>(function(){})()}>
          <Text>Pull Fresh Data</Text>
        </Button>
      </Content>
    )
  }
}