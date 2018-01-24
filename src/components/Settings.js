import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ListView,
  Image,
  ImageBackground,
  Platform,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import ApiUtils from './../utils/ApiUtils';
import MakerSelector from './MakerSelector';

const  styles = require ('./../../css/global');



export default class Settings extends Component {


  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    this.state = {
      Marca:'Seleccione Marca',
      menuVisible:false,
    }
    this.MakerSelected = this.MakerSelected.bind(this);
  }


  componentWillUpdate(){
    console.log('Entre a componentsWillUpdate');
  }


  
  MakerSelected(maker){
    this.setState({
        menuVisible:false,
        Marca:maker,
    });
    console.log(maker);
  }
  render(){
    
    return(
      <ImageBackground 
          source={require('./../../images/background1.jpg')}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle} >

          <Text>Seleccione una marca</Text>
          <TouchableHighlight onPress={()=>{this.setState({menuVisible:true});}}>
              <View style={{flexDirection:'column', alignItems:'center', alignSelf:'flex-end'}}>
                  <Text>{this.state.Marca}</Text>
              </View>
            </TouchableHighlight>
            <MakerSelector onPress={this.MakerSelected} visible={this.state.menuVisible}  title={'Seleccione Marca'} />
      </ImageBackground>
    );
  }
}


