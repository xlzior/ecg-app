import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, List, ListItem, Icon } from "native-base";

import BoothInfo from "./BoothInfo";

const screenWidth = Dimensions.get("window").width;

export default class UniversityList extends Component {

  constructor() {
    super();
    this.state = {
      isModalShown: false,
      university: "",
      id: "",
    };
  }

  openModal(id) {
    this.setState({ isModalShown: true, id })
  }

  closeModal() {
    this.setState({ isModalShown: false })
  }

  render() {
    let {universities, filteredUnis, isSearching, imagesRef, show, adminBooths} = this.props;
    let unisToDisplay = universities;
    if (filteredUnis) unisToDisplay = filteredUnis;

    return (
        <View>
        {
          unisToDisplay.map((university) => {
            return <UniversitySection
              key={university.id}
              university={university}
              openModal={(i)=>this.openModal(i)}
              isSearching={isSearching}
              show={show}
              adminBooths={adminBooths}
            />
          })
        }
          <BoothInfo
            isModalShown={this.state.isModalShown}
            closeModal={s=>this.closeModal(s)}
            id={this.state.id}
            imagesRef={imagesRef}
            {...this.props}
          />
        </View>
    )
  }
}

class UniversitySection extends Component {
  constructor(props) {
    super(props);
    this.state = { showUni: false }
  }

  componentDidMount() {
    this.setState({ showUni: this.props.show })
  }

  static getDerivedStateFromProps(props) {
    if (props.isSearching) return { showUni: true }
  }

  toggleShow() {
    this.setState({showUni: !this.state.showUni})
  }

  render() {
    let {id, name, faculties=[]} = this.props.university;
    let iconName = this.state.showUni ? "ios-arrow-down" : "ios-arrow-back";

    // general uni display (for admissions booths)
    let uniDisplay;
    if (faculties[0] == id || this.props.adminBooths) {
      uniDisplay = (<ListItem button onPress={()=>this.props.openModal(id)} key='unibooth'>
        <Text>{name}</Text>
      </ListItem>)
      faculties = faculties.slice(1)
    }

    // university section faculties
    let facultiesDisplay = faculties.map((faculty) => {
      return <Faculty
        key={faculty.id}
        name={faculty.name}
        openModal={()=>this.props.openModal(faculty.id)}
      />
    })

    return (
      <List>
        <ListItem
          itemDivider
          key='header'
          style={styles.rightIcon}
          button onPress={()=>this.toggleShow()}
        >
          <Text style={{maxWidth: screenWidth - 40}}>{name}</Text>
          <Icon
            name={iconName}
            style={styles.icon}
          />
        </ListItem>
        {this.state.showUni && [uniDisplay, facultiesDisplay]}
      </List>
    )
  }
}

class Faculty extends Component {
  render() {
    let {name, openModal} = this.props;
    
    return (
      <ListItem button onPress={()=>openModal()}>
        <Text>{name}</Text>
      </ListItem>
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