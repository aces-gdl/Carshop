import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ListView,
  ImageBackground,
  Alert,
} from 'react-native';


import { FirebaseRef } from './../../firebase/Firebase';

import Icon from 'react-native-vector-icons/Ionicons';

const styles = require('./../../css/global');



export default class CarCenterListing extends Component {


  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.Talleres = [];
    this.state = {
      ds: ds,
    };
    this.renderRow = this.renderRow.bind(this);
    this.AddTaller = this.AddTaller.bind(this);
    this.loadData = this.loadData.bind(this);
    this.gotData = this.gotData.bind(this);
    this.errData = this.errData.bind(this);
  }


  loadData() {
    this.Talleres = [];

    this.TalleresRef = FirebaseRef.database();
    this.TalleresRef.ref('/Talleres').once('value', this.gotData, this.errData)
  }

  gotData(data) {
    var myTalleres = data.val();
    var keys = Object.keys(myTalleres)

    this.Talleres = [];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      this.Talleres.push({ id: k, Taller: myTalleres[k] })
    }
    this.setState({
      ds: this.state.ds.cloneWithRows(this.Talleres),
    });
  }

  errData(err) {
    console.log('Error !');
    console.log(err);

  }

  componentDidMount() {
    this.loadData();
  }


  AddTaller() {
    console.log('Ya entre');
  }



  renderRow(rowData) {
    return (


      <View style={styles.inputContainer}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column' }}>
              <Text>{rowData.Taller.NombreNegocio}</Text>
              <Text>{rowData.Taller.Direccion}</Text>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CarCenterDetails', { TallerID: rowData.id })}>
              <Icon style={{ marginLeft: 4, padding: 10, fontSize: 20 }}
                name="ios-arrow-dropright"
                size={20}
                color='black' />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{rowData.Taller.Contacto} </Text>
            <Text>Tel: {rowData.Taller.Telefono} </Text>
          </View>
        </View>
      </View>
    )
  }


  render() {
    return (
      <ImageBackground
        source={require('./../../images/background1.jpg')}
        style={[styles.backgroundImage, { alignContent: 'center' }]}
        imageStyle={styles.imageStyle} >

        <View style={{ flex: 1, justifyContent: 'center', borderWidth: 1 }}>
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
