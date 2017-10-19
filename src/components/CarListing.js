import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ListView,
  ImageBackground,
  Alert,
} from 'react-native';


import {FirebaseRef} from './../../firebase/Firebase';

import Icon from 'react-native-vector-icons/Ionicons';

const  styles = require ('./../../css/global');



export default class CarListing extends Component {


  constructor(props){
    super(props);

    let user = FirebaseRef.auth().currentUser;
    console.log('useruid = ' + user.uid);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    this.AutosRef = FirebaseRef.database().ref().child('/Autos').orderByChild('useruid').equalTo(user.uid);
    this.Autos = [];
    this.state={
      ds: ds,
    };
    this.renderRow = this.renderRow.bind(this);
  }


    componentDidMount(){
    
    this.AutosRef.on ('child_added', (dataSnapshot) => {
     this.Autos.push({id:dataSnapshot.key, Auto: dataSnapshot.val()})
     this.setState({
       ds: this.state.ds.cloneWithRows(this.Autos),
     });
     this.AutosRef.off();
    });

  }

  renderRow(rowData){
    return(


        <View style={styles.inputContainer}>
          <View style={{flexDirection:'column'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flexDirection:'column'}}>
                <Text>{rowData.Auto.Alias}</Text>
                <Text>{rowData.Auto.Maker}</Text>
              </View>
              <TouchableHighlight onPress={()=> this.props.navigation.navigate('CarDetails',{AutoID:rowData.id})}>
                <Icon style={{marginLeft:4, padding:10, fontSize:20}} 
                      name="ios-arrow-dropright" 
                      size={20} 
                      color='black' />
              </TouchableHighlight>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text>{rowData.Auto.Model} </Text>
                <Text>{rowData.Year} </Text>
                <Text>{rowData.Mileage} </Text>
                </View>
          </View>
        </View>
    )
  }

  render(){
    return(
      <ImageBackground 
          source={require('./../../images/background1.jpg')}
          style={[styles.backgroundImage,{alignContent:'center'}]}
          imageStyle={styles.imageStyle} >
          <View style={{alignContent:'flex-end', alignItems:'flex-end',height:40}}>
              <TouchableHighlight onPress={()=> this.props.navigation.navigate('CarDetails',{AutoID:'new_Auto'})}>
                    <Icon style={{marginLeft:4, padding:10, fontSize:20}} 
                          name="ios-add-circle-outline" 
                          size={20} 
                          color='black' />
              </TouchableHighlight>
          </View>
          <View style={{flex:1, justifyContent:'center'}}>
            <ListView 
              dataSource={this.state.ds}
              renderRow={this.renderRow}
            />
          </View>
      </ImageBackground>
    );
  }
}

CarListing.navigationOptions = {
    title: "Autos", 
};
