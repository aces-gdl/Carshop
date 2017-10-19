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



export default class CarCenterListing extends Component {


  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.TalleresRef = FirebaseRef.database().ref().child('/Talleres');
    this.Talleres = [];
    this.state={
      ds: ds,
    };
    this.renderRow = this.renderRow.bind(this);
    this.AddTaller = this.AddTaller.bind(this);
  }



  componentDidMount(){
    
    this.TalleresRef.on ('child_added', (dataSnapshot) => {
     this.Talleres.push({id:dataSnapshot.key, Taller: dataSnapshot.val()})
     this.setState({
       ds: this.state.ds.cloneWithRows(this.Talleres),
     });
     this.TalleresRef.off();
    });

  }

AddTaller(){
  console.log('Ya entre');
}



  renderRow(rowData){
    return(


        <View style={styles.inputContainer}>
          <View style={{flexDirection:'column'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flexDirection:'column'}}>
                <Text>{rowData.Taller.NombreNegocio}</Text>
                <Text>{rowData.Taller.Direccion}</Text>
              </View>
              <TouchableHighlight onPress={()=> this.props.navigation.navigate('CarCenterDetails',{TallerID:rowData.id})}>
                <Icon style={{marginLeft:4, padding:10, fontSize:20}} 
                      name="ios-arrow-dropright" 
                      size={20} 
                      color='black' />
              </TouchableHighlight>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text>{rowData.Taller.Contacto} </Text>
                <Text>Tel: {rowData.Taller.Telefono} </Text>
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
              <TouchableHighlight onPress={()=> this.props.navigation.navigate('CarCenterDetails',{TallerID:'new_Taller'})}>
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

CarCenterListing.navigationOptions = {
    title: "Talleres", 
};
