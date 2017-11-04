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

import {CachedImage}  from 'react-native-img-cache';
import {FirebaseRef} from './../../firebase/Firebase';

import Icon from 'react-native-vector-icons/Ionicons';

const  styles = require ('./../../css/global');
const storageRef = FirebaseRef.storage();


export default class RepairEventListing extends Component {


  constructor(props){
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    let Autouid = this.props.AutoID;
    console.log('Auto ID ' + Autouid);
    this.RepairRef = FirebaseRef.database().ref().child('/RepairEvent').orderByChild('Autouid').equalTo(Autouid);
    this.Repair = [];
    this.state={
      ds: ds,
    };
    this.renderRow = this.renderRow.bind(this);
  }


    componentDidMount(){
    
    this.RepairRef.on ('child_added', (dataSnapshot) => {
     this.Repair.push({id:dataSnapshot.key, Repair: dataSnapshot.val()})
     this.setState({

       ds: this.state.ds.cloneWithRows(this.Repair),
     });
     this.RepairRef.off();
    });

  }


  renderRow(rowData){
        return(
        <View style={styles.listContainer}>
            <Text>{rowData.Repair.Description}</Text>
        </View>
    )
  }

  render(){
    return(
      <ImageBackground 
          source={require('./../../images/background1.jpg')}
          style={[styles.backgroundImage,{alignContent:'center'}]}
          imageStyle={styles.imageStyle} >
          <View style={{flex:1, justifyContent:'center'}}>
            <Text>Hola {this.props.AutoID} ....</Text>
            <ListView 
              dataSource={this.state.ds}
              renderRow={this.renderRow}
            />
          </View>
      </ImageBackground>
    );
  }
}


RepairEventListing.navigationOptions = {
    title: "Detalles reparacion", 
  };
  