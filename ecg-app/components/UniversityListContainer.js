import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { Container, Content, Text, Header, Body, Title, List, ListItem } from "native-base";

import UniversityList from "./UniversityList";

export default class UniversityListContainer extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Booths</Title>
          </Body>
        </Header>
        <Content>
          <UniversityList universities={this.props.universities}/>
        </Content>
      </Container>
    )
  }
}