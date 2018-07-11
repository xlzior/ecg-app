import React, { Component } from "react";
import { Container, Content, Header, Body, Title, Form, Item, Input } from "native-base";

import UniversityList from "./UniversityList";

export default class UniversityListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      universities: []
    }
  }

  static getDerivedStateFromProps(props) {
    if (props.universities) return { universities: props.universities.slice() }
    return {}
  }

  handleKeypress(searchTerm) {
    searchTerm = searchTerm.toLowerCase()
    if (searchTerm == "") {
      this.setState({
        searchTerm,
        universities: this.props.universities.slice()
      })
      return true;
    }
    // update university list by filtering for unis that match the search term
    var filteredUnis = [];
    if (this.props.universities.length > 0) {
      var {universities} = this.props;
      universities.forEach(uni => {
        var filteredFacs = uni.faculties.filter(({details}) => {
          for (var key in details) {
            var searchArea = JSON.stringify(details[key]).toLowerCase();
            if (searchArea.indexOf(searchTerm) != -1) {
              return true;
            }
          }
        });

        // add the admissions booth if it fits the searchTerm
        var adminBooths = uni.name.toLowerCase().indexOf(searchTerm) != -1;
        
        if (filteredFacs.length > 0) {
          filteredUnis.push({
            id: uni.id,
            name: uni.name,
            faculties: filteredFacs,
            adminBooths: adminBooths
          })
        } else if (adminBooths) {
          // in the case where the faculties don't match but the uni does
          filteredUnis.push({
            id: uni.id,
            name: uni.name,
            faculties: [],
            adminBooths: adminBooths
          })
        }
      })
    }

    this.setState({
      searchTerm,
      universities: filteredUnis
    });
  }

  render() {
    var {universities, searchTerm, filteredUnis} = this.state;
    var {FBuniversity, FBmap, FBfaculty, imagesRef, openMap} = this.props
    return (
      <Container>
        <Header>
          <Body>
            <Title>Booths</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item>
              <Input
                placeholder="Search"
                onChangeText={t => this.handleKeypress(t)}
                value={searchTerm}
                returnKeyType="search"
                clearButtonMode="always"
              />
            </Item>
          </Form>
          <UniversityList
            universities={universities}
            filteredUnis={filteredUnis}
            FBuniversity={FBuniversity}
            FBfaculty={FBfaculty}
            FBmap={FBmap}
            imagesRef={imagesRef}
            openMap={l=>openMap(l)}
            isSearching={this.state.searchTerm != ""}
            adminBooths={this.state.searchTerm == ""}
          />
        </Content>
      </Container>
    )
  }
}