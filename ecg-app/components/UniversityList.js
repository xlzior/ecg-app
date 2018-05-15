import React, { Component } from "react";
import { View } from "react-native";
import { Text, Title, List, ListItem } from "native-base";

import BoothInfo from "./BoothInfo";

export default class UniversityList extends Component {

  constructor() {
    super();
    this.state = {
      isModalShown: false,
      university: "",
      id: "",
      type: ""
    };
  }

  openModal(type, id) {
    this.setState({
      isModalShown: true,
      type,
      id
    })
  }

  closeModal() {
    this.setState({ isModalShown: false })
  }

  render() {
    return (
        <View>
        {
          this.props.universities.map((university) => {
            return <UniversitySection
              key={university.id}
              university={university}
              openModal={(t, i)=>this.openModal(t, i)}
            />
          })
        }
          <BoothInfo
            isModalShown={this.state.isModalShown}
            closeModal={s=>this.closeModal(s)}
            type={this.state.type}
            id={this.state.id}
            imagesRef={this.props.imagesRef}
            {...this.props}
          />
        </View>
    )
  }
}

class UniversitySection extends Component {
  render() {
    var {id, name, faculties} = this.props.university;
    return (
      <List>
        <ListItem
          itemDivider button
          onPress={()=>this.props.openModal("university", id)}
        >
          <Text>{name}</Text>
        </ListItem>
        {
          faculties.map((faculty) => {
            return <Faculty
              key={faculty.id}
              name={faculty.name}
              openModal={()=>this.props.openModal("faculty", faculty.id)}
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