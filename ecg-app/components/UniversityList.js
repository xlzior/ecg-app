import React, { Component } from "react";
import { AsyncStorage, View } from "react-native";
import { Text, Title, List, ListItem } from "native-base";

import UniversityInfo from "./UniversityInfo";

export default class UniversityList extends Component {

  constructor() {
    super();
    this.state = {
      showModal: false,
      university: "",
      faculty: {},
    };
  }

  toggleModal(show) {
    this.setState({ showModal: show })
  }

  openModal(faculty) {
    this.setState({
      showModal: true,
      faculty
    })
  }

  render() {
    return (
        <View>
        {
          this.props.universities.map((university) => {
            return <UniversitySection
              key={university.id}
              name={university.name}
              faculties={university.faculties}
              openModal={(f)=>this.openModal(f)}
            />
          })
        }
          <UniversityInfo
            showModal={this.state.showModal}
            toggleModal={s=>this.toggleModal(s)}
            faculty={this.state.faculty}
            universities={this.props.universities}
          />
        </View>
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
              openModal={()=>this.props.openModal(faculty)}
            />
          })
        }
      </List>
    )
  }
}

class Faculty extends Component {
  render() {
    var {name, openModal} = this.props;
    
    return (
      <ListItem button onPress={()=>openModal()}>
        <Text>{name}</Text>
      </ListItem>
    )
  }
}