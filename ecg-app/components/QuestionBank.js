import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Share, Platform, Keyboard, Dimensions } from "react-native";
import { Container, Content, Text, Header, Body, Title, List, ListItem, Form, Item, Input, Icon, Button, Left, Right } from "native-base";
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';

const screenHeight = Dimensions.get("window").height;

export default class QuestionBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionBank: {},
      ownQuestions: [],
      question: "",
      notes: "",
      allNotes: {},
      showSection: {
        "My Questions": true,
        "General": true,
        "Science": true,
        "Arts": true,
      },
      selectedQn: {}
    }
  }

  componentDidMount() {
    AsyncStorage.getAllKeys()
    .then(keys => {
      // make sure AsyncStorage contains the key "QuestionBank/Questions" and "QuestionBank/Notes"
      if (keys.indexOf("QuestionBank/Questions") == -1) {
        AsyncStorage.setItem("QuestionBank/Questions", "[]")
      }
      if (keys.indexOf("QuestionBank/Notes") == -1) {
        AsyncStorage.setItem("QuestionBank/Notes", "{}")
      } else {
        // load the notes from async storage into state
        AsyncStorage.getItem("QuestionBank/Notes")
        .then(data => JSON.parse(data))
        .then(allNotes => {
          if (!allNotes) allNotes = {}
          this.setState({ allNotes })
        })
        .catch(e => this.setState({ allNotes: {} }))
      }
    })
    .then(()=>this.addNewQuestion())
    .catch(e => console.log("Error rendering question bank", e));
  }

  static getDerivedStateFromProps(props) {
    return { questionBank: props.FBquestionBank };
  }

  handleTyping(question) {
    this.setState({question});
  }

  handleEditNotes(notes) {
    this.setState({notes});
  }

  addNewQuestion() {
    AsyncStorage.getItem("QuestionBank/Questions")
    .then((ownQuestions)=> {
      if (!ownQuestions) ownQuestions = "[]"
      ownQuestions = JSON.parse(ownQuestions)

      if (this.state.question != "") {
        let id = (new Date()).getTime()
        ownQuestions.push({
          id,
          question: this.state.question
        })
        AsyncStorage.setItem("QuestionBank/Questions", JSON.stringify(ownQuestions))
      }
      this.setState({
        question: "",
        ownQuestions
      });
    })
    .catch(e => console.log("Error retrieving data when adding question", e));
  }

  removeQuestion(deletedQnId) {
    AsyncStorage.getItem("QuestionBank/Questions")
    .then((ownQuestions)=> {
      ownQuestions = JSON.parse(ownQuestions)
      ownQuestions = ownQuestions.filter(({id}) => id != deletedQnId)
      AsyncStorage.setItem("QuestionBank/Questions", JSON.stringify(ownQuestions))
      this.setState({ownQuestions});
    })
    .catch(e => console.log("Error retrieving data when removing question", e));
  }

  openNotes(id, question) {
    let notes = id in this.state.allNotes ? this.state.allNotes[id] : "";

    this.setState({
      selectedQn: {id, question},
      notes
    })
    this.popupDialog.show();
  }

  saveNotes() {
    let {notes, selectedQn} = this.state;
    // get notes from async storage and add to the store
    AsyncStorage.getItem("QuestionBank/Notes")
    .then(data => {
      try { return JSON.parse(data) }
      catch (error) { return {} }
    })
    .then((allNotes)=> {
      if (!allNotes) allNotes = {}
      if (notes != "") {
        allNotes[selectedQn.id] = notes;
        this.setState({
          notes: "",
          allNotes
        });
        AsyncStorage.setItem("QuestionBank/Notes", JSON.stringify(allNotes))
        .catch(e => console.log("Error saving data", e))
      }
    })
    .catch(e => console.log("Error retrieving data", e));
  }

  setRef(ref) {
    this.popupDialog = ref;
  }

  toggleSection(section) {
    var showSection = this.state.showSection;
    showSection[section] = !showSection[section];
    this.setState({showSection});
  }

  handleShare() {
    var toShare = [];
    var {questionBank, ownQuestions, allNotes} = this.state;
    
    // export question bank questions and notes
    for (var section in questionBank) {
      for (var qnKey in questionBank[section]) {
        toShare.push("\n"+questionBank[section][qnKey]+"\n");
        if (allNotes[qnKey]) toShare.push(allNotes[qnKey]+"\n");
      }
    }

    // export own questions and notes
    ownQuestions.forEach(({id, question}) => {
      toShare.push("\n"+question+"\n");
      if (allNotes[id]) toShare.push(allNotes[id]+"\n")
    })

    Share.share({
      title: 'Question Bank & Notes',
      message: toShare.join("")
    })
  }

  render() {
    var {questionBank, ownQuestions, question, showSection, selectedQn, notes} = this.state;
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
    var ownQuestionsList = ownQuestions.map(({id, question}) => (
      <ListItem
        key={id}
        style={styles.rightIcon}
        button onPress={()=>this.openNotes(id, question)}
      >
        <Text>{question}</Text>
        <Icon
          name="close"
          style={styles.icon}
          onPress={()=>this.removeQuestion(id)}
        />
      </ListItem>
    ));
    // prompt that appears if no questions have been added
    if (ownQuestionsList.length == 0) {
      ownQuestionsList = (
        <ListItem key={0}>
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
      var iconName = showSection[section] ? "ios-arrow-down" : "ios-arrow-back";
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
          {Platform.OS === "ios" && <Left/>}
          <Body>
            <Title>Question Bank</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="share" onPress={()=>this.handleShare()} />
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item>
              <Input
                placeholder="Enter your own question"
                onChangeText={term => this.handleTyping(term)}
                value={question}
                onSubmitEditing={() => this.addNewQuestion()}
                returnKeyType="done"
              />
            </Item>
          </Form>
          <List>{listDisplay}</List>
        </Content>
        <QuestionNotes
          title={selectedQn.question}
          notes={notes}
          setRef={ref=>this.setRef(ref)}
          handleEditNotes={n=>this.handleEditNotes(n)}
          saveNotes={()=>this.saveNotes()}
        />
      </Container>
    )
  }
}

class QuestionNotes extends Component {
  render() {
    var {title, notes, setRef, handleEditNotes, saveNotes} = this.props;
    return (
      <PopupDialog
        ref={setRef}
        dialogTitle={<DialogTitle title={title} />}
        height={0.7}
        onDismissed={()=>{
          saveNotes();
          Keyboard.dismiss();
        }}
      >
        <Content>
          <Input
            placeholder="Write notes here"
            style={{height: screenHeight*0.55, textAlignVertical: "top"}}
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