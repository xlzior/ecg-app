import React, { Component } from "react";
import { StyleSheet, AsyncStorage } from "react-native";
import { Container, Content, Text, Header, Body, Title, List, ListItem, Form, Item, Input, Icon } from "native-base";

export default class QuestionBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionBank: {},
      ownQuestions: [],
      inputValue: ""
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("QuestionBank")
    .then(data => JSON.parse(data))
    .then((qns)=>{
      this.setState({questionBank: qns});
    });
    
    AsyncStorage.getAllKeys()
    .then(keys => {
      if (keys.indexOf("QuestionBank/Questions") == -1) {
        AsyncStorage.setItem("QuestionBank/Questions", "")
      }
    })
    .then(()=>this.addNewQuestion());

  }

  handleKeypress(inputValue) {
    this.setState({inputValue});
  }

  addNewQuestion() {
    AsyncStorage.getItem("QuestionBank/Questions")
    .then((ownQuestions)=> {
      if (!ownQuestions) ownQuestions = [];
      else ownQuestions = ownQuestions.split("\n");

      if (this.state.inputValue != "") {
        ownQuestions.push(this.state.inputValue);
        AsyncStorage.setItem("QuestionBank/Questions", ownQuestions.join("\n"))
      }
      this.setState({
        inputValue: "",
        ownQuestions
      });
    })
    .catch(e => console.error("Error retrieving data", e));
  }

  removeQuestion(deletedQn) {
    AsyncStorage.getItem("QuestionBank/Questions")
    .then((ownQuestions)=> {
      if (!ownQuestions) ownQuestions = [];
      else ownQuestions = ownQuestions.split("\n");

      ownQuestions = ownQuestions.filter(q => q !== deletedQn);
      AsyncStorage.setItem("QuestionBank/Questions", ownQuestions.join("\n"))
      this.setState({ownQuestions});
    })
    .catch(e => console.error("Error retrieving data", e));
  }

  render() {
    var questionBank = [];
    for (var key in this.state.questionBank) {
      questionBank.push({
        id: key,
        question: this.state.questionBank[key]
      });
    }
    
    var questionsList = questionBank.map(q => (
      <ListItem key={q.id}>
        <Text>{q.question}</Text>
      </ListItem>
    ))

    var ownQuestionsList = this.state.ownQuestions.map((q, i) => (
      <ListItem
        key={i}
        style={styles.listItem}
      >
        <Text>{q}</Text>
        <Icon
          name="close"
          onPress={()=>this.removeQuestion(q)}
        />
      </ListItem>
    ))

    return (
      <Container>
        <Header>
          <Body>
            <Title>Question Bank</Title>
          </Body>
        </Header>
        <Content>
          <List>{questionsList}{ownQuestionsList}</List>
          <Form>
            <Item>
              <Input
                placeholder="Enter your own question"
                onChangeText={v => this.handleKeypress(v)}
                value={this.state.inputValue}
                onSubmitEditing={() => this.addNewQuestion()}
                returnKeyType="done"
              />
            </Item>
          </Form>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});