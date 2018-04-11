import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import MapView from './components/Map';
import UniversityList from './components/UniversityList';
import QuestionBank from './components/QuestionBank';
import Forms from './components/Forms';
import About from './components/About';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'map'
    } 
  }

  render() {
    return (
      <TabNavigator sceneStyle={styles.tabNavigator}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'map'}
          title="Map"
          renderIcon={() => <Feather name='map' size={20}/>}
          renderSelectedIcon={() => <Feather name='map' color='blue' size={20}/>}
          onPress={() => this.setState({ selectedTab: 'map' })}
        >
          <MapView />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'university-list'}
          title="Universities"
          renderIcon={() => <MaterialIcons name='school' size={20}/>}
          renderSelectedIcon={() => <MaterialIcons name='school' color='blue' size={20}/>}
          onPress={() => this.setState({ selectedTab: 'university-list' })}
        >
          <UniversityList />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'question-bank'}
          title="Questions"
          renderIcon={() => <FontAwesome name='question-circle' size={20}/>}
          renderSelectedIcon={() => <FontAwesome name='question-circle' color='blue' size={20}/>}
          onPress={() => this.setState({ selectedTab: 'question-bank' })}
        >
          <QuestionBank />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'forms'}
          title="Forms"
          renderIcon={() => <FontAwesome name='wpforms' size={20}/>}
          renderSelectedIcon={() => <FontAwesome name='wpforms' color='blue' size={20}/>}
          onPress={() => this.setState({ selectedTab: 'forms' })}
        >
          <Forms />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'about'}
          title="About"
          renderIcon={() => <Feather name='info' size={20}/>}
          renderSelectedIcon={() => <Feather name='info' color='blue' size={20}/>}
          onPress={() => this.setState({ selectedTab: 'about' })}
        >
          <About />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  tabNavigator: {
    margin: 10,
    marginTop: 20
  }
});
