import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { Header, Left, Body, Right, Title, Icon } from "native-base"
import { Container, Content, Button, Text, Card, CardItem } from "native-base"
import Moment from "react-moment"

console.disableYellowBox = true;

const titles = {
  main: "About",
  faq: "FAQ"
};

export default class About extends Component {

  constructor() {
    super();
    this.state = {
      view: "main", // faq, main
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
                last_update={this.props.last_update}
              />
    else if (this.state.view === "faq")
      return <FAQ
                setView={this.setView}
                {...this.props}
              />
  }

  render() {
    return (
      <Container>
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

  constructor() {
    super();
    this.state = {
      last_update: ""
    };
  }

  static getDerivedStateFromProps(props) {
    var last_update = props.last_update;
    if (last_update)
        last_update = JSON.parse(last_update)
    return { last_update: last_update };
  }

  render() {
    return (
      <Content>
        <Button block info onPress={()=>this.props.setView("faq")}>
          <Text>FAQ</Text>
        </Button>
        <Text>
          Last Updated: <Moment element={Text} fromNow>{this.state.last_update}</Moment>
        </Text>
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
    const FAQs = this.props.FBfaqs;
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