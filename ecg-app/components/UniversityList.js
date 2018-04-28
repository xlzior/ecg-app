import React, { Component } from "react";
import { View } from "react-native";
import { Text, Title, List, ListItem } from "native-base";

import BoothInfo from "./BoothInfo";

export default class UniversityList extends Component {

  constructor() {
    super();
    this.state = {
      showModal: false,
      university: "",
      info: {},
      type: ""
    };
  }

  toggleModal(show) {
    this.setState({ showModal: show })
  }

  openModal(type, info) {
    this.setState({
      showModal: true,
      type,
      info
    })
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
            showModal={this.state.showModal}
            toggleModal={s=>this.toggleModal(s)}
            type={this.state.type}
            info={this.state.info}
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
          onPress={()=>this.props.openModal("university", this.props.university)}
        >
          <Text>{name}</Text>
        </ListItem>
        {
          faculties.map((faculty) => {
            return <Faculty
              key={faculty.id}
              name={faculty.name}
              openModal={()=>this.props.openModal("faculty", faculty)}
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