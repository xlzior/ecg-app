import React, { Component } from "react";
import { StyleSheet, AsyncStorage } from "react-native";
import { Container, Content, Text, Header, Body, Title, List, ListItem, Form, Item, Input, Icon, Button } from "native-base";
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';

export default class QuestionBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionBank: {},
      ownQuestions: [],
      searchTerm: "",
      notes: "",
      showModal: false,
      showSection: {
        "My Questions": true,
        "General": true,
        "Science": true,
        "Arts": true,
      },
      selectedQn: ""
    }
  }

  componentDidMount() {
    AsyncStorage.getAllKeys()
    .then(keys => {
      // make sure AsyncStorage contains the key "QuestionBank/Questions"
      if (keys.indexOf("QuestionBank/Questions") == -1) {
        AsyncStorage.setItem("QuestionBank/Questions", "")
      }
    })
    .then(()=>this.addNewQuestion());
  }

  static getDerivedStateFromProps(props) {
    return { questionBank: props.FBquestionBank };
  }

  handleSearch(searchTerm) {
    this.setState({searchTerm});
  }

  handleEditNotes(notes) {
    this.setState({notes});
  }

  addNewQuestion() {
    AsyncStorage.getItem("QuestionBank/Questions")
    .then((ownQuestions)=> {
      if (!ownQuestions) ownQuestions = [];
      else ownQuestions = ownQuestions.split("\n");

      if (this.state.searchTerm != "") {
        ownQuestions.push(this.state.searchTerm);
        AsyncStorage.setItem("QuestionBank/Questions", ownQuestions.join("\n"))
      }
      this.setState({
        searchTerm: "",
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

  openNotes(id, question) {
    console.log(id, question);
    this.setState({ selectedQn: question })
    this.popupDialog.show();
  }

  closeNotes() {
    this.popupDialog.hide();
  }

  setRef(ref) {
    this.popupDialog = ref;
  }

  toggleSection(section) {
    var showSection = this.state.showSection;
    showSection[section] = !showSection[section];
    this.setState({showSection});
  }

  render() {
    var {questionBank, ownQuestions, searchTerm, showModal, showSection, selectedQn, notes} = this.state;
    // generate sections from question bank
    var questionsList = Object.create(null);
    for (var section in questionBank) {
      var sectionQuestions = [];
      for (var qnKey in questionBank[section]) {
        sectionQuestions.push({
          id: qnKey,
          question: questionBank[section][qnKey]
        })
      }
      questionsList[section] = sectionQuestions.map(q => (
        <ListItem
          key={q.id}
          button onPress={()=>this.openNotes(q.id, q.question)}
        >
          <Text>{q.question}</Text>
        </ListItem>
      ));
    }
    // generate own questions list
    var ownQuestionsList = ownQuestions.map((q, i) => (
      <ListItem
        key={i}
        style={styles.rightIcon}
        button onPress={()=>this.openNotes(i, q)}
      >
        <Text>{q}</Text>
        <Icon
          name="close"
          onPress={()=>this.removeQuestion(q)}
        />
      </ListItem>
    ))
    // prompt that appears if no questions have been added
    if (ownQuestionsList.length == 0) {
      ownQuestionsList = (
        <ListItem>
          <Text>Add your own questions to ask university representatives here!</Text>
        </ListItem>
      )
    }
    // organise the above components into the final order and layout
    var questionsList = {
      "My Questions": ownQuestionsList,
      "General": questionsList.General,
      "Science": questionsList.Science,
      "Arts": questionsList.Arts,
    }
    var listDisplay = [];
    for (let section in questionsList) {
      var iconName = showSection[section] ? "ios-arrow-up" : "ios-arrow-down"
      // section header
      listDisplay.push(
        <ListItem
          key={section}
          itemDivider
          style={styles.rightIcon}
          button onPress={()=>this.toggleSection(section)}
        >
          <Text>{section}</Text>
          <Icon name={iconName} style={styles.icon}/>
        </ListItem>
      );
      // section questions
      if (showSection[section]) listDisplay.push(questionsList[section]);
    }

    return (
      <Container>
        <Header>
          <Body>
            <Title>Question Bank</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item>
              <Input
                placeholder="Enter your own question"
                onChangeText={term => this.handleSearch(term)}
                value={searchTerm}
                onSubmitEditing={() => this.addNewQuestion()}
                returnKeyType="done"
              />
            </Item>
          </Form>
          <List>{listDisplay}</List>
        </Content>
        <QuestionNotes
          title={selectedQn}
          notes={notes}
          setRef={ref=>this.setRef(ref)}
          handleEditNotes={n=>this.handleEditNotes(n)}
        />
      </Container>
    )
  }
}

class QuestionNotes extends Component {
  componentDidMount() {
    if (this.props.showModal) this.popupDialog.show();
  }
  render() {
    var {title, notes, setRef, handleEditNotes} = this.props;
    return (
      <PopupDialog
        ref={setRef}
        dialogTitle={<DialogTitle title={title} />}
        height="80%"
      >
        <Content>
          <Input
            placeholder="Write notes here"
            multiline
            onChangeText={notes=>handleEditNotes(notes)}
            value={notes}
          />
        </Content>
      </PopupDialog>
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
  }
});