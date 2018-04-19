import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { Container, Content, Text, Header, Body, Title, List, ListItem } from "native-base";

export default class UniversityList extends Component {

  constructor() {
    super();
    this.state = {
      universities: []
    };
  }

  async componentDidMount() {
    const self = this;
    const suni = await AsyncStorage.getItem("University");
    const uni = JSON.parse(suni);
    const sfaculty = await AsyncStorage.getItem("Faculty");
    const faculty = JSON.parse(sfaculty);

    var universities = {};
    // Populate universities
    for (let entry in uni) {
      universities[entry] = {
        name: uni[entry].Name,
        faculties: []
      }
    }

    // Fill up faculties
    for (let entry in faculty) {
      const university = faculty[entry].University
      universities[university].faculties.push({
        id: faculty,
        name: faculty[entry].Name
      });
    }

    // Flatten it
    var universitiesFlat = [];
    for (let entry in universities) {
      universitiesFlat.push({
        id: entry,
        name: universities[entry].name,
        faculties: universities[entry].faculties
      });
    }

    this.setState({
      universities: universitiesFlat
    });
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Booths</Title>
          </Body>
        </Header>
        <Content>
        {
          this.state.universities.map((university) => {
            return <UniversitySection
              key={university.id}
              name={university.name}
              faculties={university.faculties}
            />
          })
        }
        </Content>
      </Container>
    )
  }
}

class UniversitySection extends Component {
  render() {
    return (
      <List>
        <ListItem itemDivider>
          <Text>{this.props.name}</Text>
        </ListItem>
        {
          this.props.faculties.map((faculty) => {
            return <Faculty
              key={faculty.id}
              name={faculty.name}
            />
          })
        }
      </List>
    )
  }
}

class Faculty extends Component {
  render() {
    return (
      <ListItem>
        <Text>{this.props.name}</Text>
      </ListItem>
    )
  }
}