import React, { Component } from "react";
import { StyleSheet, AsyncStorage } from "react-native";
import { Container, Content, Text, Header, Body, Title, List, ListItem, Form, Item, Input, Icon } from "native-base";

export default class FormWithNativeBase extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      questionBank: {},
      formQuestions: [],
      inputValue: ""
    }
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title> Header of the form </Title>
          </Body>
        </Header>
        
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            
            <Textarea rowSpan={5} bordered placeholder="Textarea" />
            
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
          </Form>
          
          <Button primary><Text> Submit </Text></Button primary>
        </Content>
        
      </Container>
    );
  }
}
