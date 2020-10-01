/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
//For navigation List-> Detail
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Library for ratings
import { Rating, AirbnbRating } from 'react-native-ratings';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



//Detail screen
class DetailScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log('The props is:',this.props.route.params);
  }

  render() {
    let {route} = this.props;
    let item = route.params;
    return (
      <View style={styles.item}> 
        <Text style={styles.sectionTitle}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.tagLine}>Purpose: {item.loan_purpose}</Text>
        <Text style={styles.tagLine}>Nationality: {item.nationality}</Text>
        <Text style={styles.tagLine}>Visa Type: {item.visa_type}</Text>
        <Text style={styles.rating}>  <Rating
                ratingCount={5}
                marginLeft={20}
                startingValue={item.rating}
                imageSize={25}/> </Text>
        <Text style={styles.sectionDescription}>Description: {item.text} </Text>
        <Text style={styles.tagLine}>City: {item.city}</Text>
        <Text style={styles.tagLine}>State: {item.state}</Text>

      </View>  
    )
  }
}

//Listscreen
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.onPress = this.onPress.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.fetchReviews();
  }


  fetchReviews() {
    let self = this;
    const url = 'https://staging.stilt.com/api/reviews';
    axios.get(url, {})
    .then(function (response) {
      let dataContent = [];
      let data = response.data;
      for(let i=0;i<data.length;i++) {
        let current = data[i];
        current.id = i+1;
        dataContent.push(current);
      }

      self.setState({
        data: dataContent
      });
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onPress(item) {
    let {navigation} = this.props;
    navigation.navigate('Detail', item)
  }


  renderItem(item) {
    let itemData =  item.item;

    return (
      <TouchableOpacity onPress={() => this.onPress(itemData)}>
        <Item
          item={itemData}
        />
      </TouchableOpacity>  
    );  
  }

  render() {
    let {data} =  this.state;
    return (
      <FlatList
        data={data}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    );
    
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }
  
  render() {
    const Stack = createStackNavigator();
    return(
      <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen name="List" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    )
  }
}

function truncateString(text) {
  let stringContent = text.split(' ');
  let output = '';
  for(let i=0;i<5;i++) {
    output+= stringContent[i]+' ';
  }
  return output.trim()+'...';
}
// List item
const Item = ({ item }) => (
  <View style={styles.item}>
    <Text style={styles.sectionTitle}>{item.first_name} {item.last_name}</Text>
    <Text style={styles.tagLine}>{item.tag_line}</Text>
    <Text style={styles.tagLine}>{item.city} {item.state}</Text>
    <Text style={styles.sectionDescription}>{truncateString(item.text)}</Text>
    <Rating
      ratingCount={5}
      startingValue={item.rating}
      imageSize={25}
    />
  </View>
);


const styles = StyleSheet.create({
  tagLine: {
    fontSize: 18,
    paddingLeft: 20,
    fontWeight: '600',
    marginTop: 10,
    color: Colors.black,
    paddingLeft: 20
  },
  rating: {
    fontSize: 18,
    paddingLeft: 40,
    fontWeight: '600',
    marginTop: 10,
    color: Colors.black,
    paddingLeft: 20
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    paddingLeft: 20,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 10,
    fontSize: 18,
    paddingLeft: 20,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  item: {
    marginTop: 20,
    marginBottom: 20
  }
});

export default App;
