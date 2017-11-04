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
  ScrollView,
  Alert,
} from 'react-native';


import {FirebaseRef}  from './../../firebase/Firebase';

import Icon           from 'react-native-vector-icons/Ionicons';
import {CachedImage}  from 'react-native-img-cache';
import renderIf       from './../../src/utils/RenderIf';

import ImagePicker    from 'react-native-image-picker';
import RNFetchBlob    from 'react-native-fetch-blob';
import UploadImage    from './../../src/utils/UploadImage';

const  styles = require ('./../../css/global');
const storageRef = FirebaseRef.storage();






export default class RepairEvent extends Component {

  constructor(props){
    super(props);

    let user = FirebaseRef.auth().currentUser;
    let AutoID = 
    this.state = {
        Mileage:        '' ,
        Description:    '',
        ServiceDate:    '',
        TotalAmount:    '',
        GuarantyDays:   '',
        GuarantyKM:     '',
        Autouid:        '',
        isUpdate:false,
        user:user,
    }
  }

 /* Leave it as reference */  
  getImage (image) {
    let imageRef = storageRef.ref(image);
    imageRef.getDownloadURL()
    .then((url) => {
       this.setState({
         ImageURL:url,
       })
       console.log('Image URL:'+ url);
    })
    .catch ((error)=>{
      console.log('Error in getIamge: ' + error)
    })
  }

  componentDidMount(){
    let Auto = '';
    

    if (this.props.navigation.state.params.RepairEvent != 'new_RepairEvent'){
      let RepairEventID = this.props.navigation.state.params.RepairEvent;
      let AutoID = this.props.navigation.state.params.AutoID;
      return FirebaseRef.database().ref('/RepairEvents/' + RepairEventID).once('value')
      .then((snapshot) =>{
          Service = snapshot.val();
          this.setState({
            Mileage:        Servicio.Mileage,
            Description:    Servicio.Description,
            ServiceDate:    Service.ServiceDate,
            TotalAmount:    Service.TotalAmount,
            GuarantyDays:   Service.GuarantyDays,
            GuarantyKM:     Service.GuarantyKM,
            Autouid:        Service.Autouid,
          });
          console.log(Service.Description);          
      }); 
    } 
  }



  Update(){
    const miRegistro ={
        Mileage:          this.state.Mileage,
        Description:      this.state.Description,
        ServiceDate:      this.state.ServiceDate,
        TotalAmount:      this.state.TotalAmount,
        GuarantyDays:     this.state.GuarantyDays,
        GuarantyKM:       this.state.GuarantyKM,
      }
  
    FirebaseRef.database().ref('/RepairEvent/' + this.props.navigation.state.params.AutoID).set(miRegistro)
    .then(()=>{
      console.log(miRegistro);
      this.props.navigation.navigate('CarDetails');
  
    });
  }


  Delete(){
   FirebaseRef.database().ref('/RepairEvent/' + this.props.navigation.state.params.AutoID).remove();
  }

  Add(){
    var newPostKey = FirebaseRef.database().ref().child('RepairEvent').push().key;
    const miRegistro ={
      Mileage:          this.state.Mileage,
      Description:      this.state.Description,
      ServiceDate:      this.state.ServiceDate,
      TotalAmount:      this.state.TotalAmount,
      GuarantyDays:     this.state.GuarantyDays,
      GuarantyKM:       this.state.GuarantyKM,
      Autouid:          this.props.navigation.state.params.AutoID,
    }

    var updates = {};
    
    updates['/RepairEvent/' + newPostKey] = miRegistro;
    console.log(miRegistro);

    return FirebaseRef.database().ref().update(updates)
    .then(()=>{
      this.props.navigation.navigate('CarDetails');
    });
      
  }


  render(){
    return(
      <ImageBackground 
      source={require('./../../images/background1.jpg')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle} >
      <ScrollView style={{flex:1}}
              directionalLockEnabled={false}
              horizontal={false} >
      <View style={[styles.container,{flexDirection:'column',borderWidth:2}]}>
       <View style={styles.inputContainer}>
           <Text>Auto ID{this.props.navigation.state.params.AutoID}</Text>
        <TextInput
        style={styles.input}
        placeholder={'Descripción'}
        onChangeText={(Description) => this.setState({Description})}
        value={this.state.Description}
        />
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <TextInput
              style={[styles.input, {width:150}]}
              placeholder={'Fecha del Servicio'}
              onChangeText={(ServiceDate) => this.setState({ServiceDate})}
              value={this.state.ServiceDate}
            />
            <TextInput
            style={[styles.input, {width:150}]}
            placeholder={'Precio del servicio'}
              onChangeText={(TotalAmount) => this.setState({TotalAmount})}
              value={this.state.TotalAmount}
              />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <TextInput
              style={[styles.input, {width:150}]}
              placeholder={'Garantia Dias'}
              onChangeText={(GuarantyDays) => this.setState({GuarantyDays})}
              value={this.state.GuarantyDays}
              />
              <TextInput
              style={[styles.input, {width:150}]}
              placeholder={'Garantia KM'}
              onChangeText={(GuarantyKM) => this.setState({GuarantyKM})}
              value={this.state.GuarantyKM}
              />
          </View>
          <TextInput
            style={styles.input}
            placeholder={'Kilometraje'}
            onChangeText={(Mileage) => this.setState({Mileage})}
            value={this.state.Mileage}
          />
          {renderIf(this.state.isUpdate,
          <View style={[styles.buttonContainer, {flexDirection:'row', justifyContent:'space-between',}]}>
            <TouchableHighlight style={styles.button} onPress={()=> Alert.alert('Servicios')} >
              <View style={{alignItems:'center'}}>
                <Text>Servicios</Text>
                <Icon style={{fontSize:40}} 
                        name="ios-folder-open-outline" 
                        size={40} 
                        color='black' />
              </View>
            </TouchableHighlight> 
            <TouchableHighlight style={styles.button} onPress={() => Alert.alert('Notificaciones')} >
              <View style={{alignItems:'center'}}>
                <Text>Notificaciones</Text>
                <Icon style={{fontSize:40}} 
                        name="ios-pulse-outline" 
                        size={40} 
                        color='black' />
              </View>
            </TouchableHighlight> 
          </View>
          )}
          <View style={[styles.buttonContainer, {flexDirection:'row', justifyContent:'space-between',}]}>
              {renderIf(this.state.isUpdate, 
                <TouchableHighlight style={styles.button} onPress={this.Update.bind(this)} >
                  <View style={{alignItems:'center'}}>
                    <Text>Actualizar</Text>
                    <Icon style={{fontSize:40}} 
                            name="ios-checkmark" 
                            size={40} 
                            color='black' />
                  </View>
                </TouchableHighlight> 
              )}
              {renderIf(this.state.isUpdate, 
                <TouchableHighlight style={styles.button} onPress={this.Delete.bind(this)} >
                  <View style={{alignItems:'center'}}>
                      <Text>Eliminar</Text>
                      <Icon style={{fontSize:40}} 
                            name="ios-remove" 
                            size={40} 
                            color='black' />
                  </View>
                </TouchableHighlight>
              )} 
              {renderIf(!this.state.isUpdate, 
                <TouchableHighlight style={styles.button} onPress={this.Add.bind(this)} >
                  <View style={{alignItems:'center'}}>
                    <Text>Agregar</Text>
                    <Icon style={{fontSize:40}} 
                      name="ios-add" 
                      size={40} 
                      color='black'  />
                    </View>
                </TouchableHighlight> 
              )}
              <TouchableHighlight style={styles.button}  onPress={() => this.props.navigation.navigate('CarDetails')} >
                <View style={{alignItems:'center'}}>
                  <Text>Cancelar</Text>
                  <Icon style={{fontSize:40}} 
                          name="ios-close" 
                          size={40} 
                          color='black' />
                </View>
              </TouchableHighlight> 
          </View>
          </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}


RepairEvent.navigationOptions = {
  title: "Detalles del Servicio", 
};
