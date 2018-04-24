import React from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Text, Header, Body, Title, List, ListItem} from "native-base";

export default class QuestionBank extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Question Bank</Title>
          </Body>
        </Header>
        <Content>
          <List>
            <ListItem>
              <Text>placeholder question</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({});