import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ListView,
  TouchableHighlight,
  Alert,
  Image,
} from 'react-native';
import ApiUtils     from './../utils/ApiUtils';
import Icon         from 'react-native-vector-icons/Ionicons';
import {FirebaseRef} from './../../firebase/Firebase';
const  styles = require ('./../../css/global');

const storageRef = FirebaseRef.storage();



class ServiceType extends Component {


    constructor(props){
        super(props);
    
        let user = FirebaseRef.auth().currentUser;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        
        this.Services = [];
        this.state={
          ds: ds,
        };
        this.renderRow = this.renderRow.bind(this);
    }
       
    
    componentDidMount(){
        FirebaseRef.database().ref('/ServicesCatalog').once('value')
        .then((snapshot) => {
            var myData = snapshot.val();
            var keys = Object.keys(myData);
            var myArreglo= [];
            for (var i = 0; i< keys.length; i++){
                
                var key = keys[i];
                myArreglo.push({'id':key,'Name':myData[i].Name,'Duration':myData[i].Duration});

            }
            this.setState({
                ds: this.state.ds.cloneWithRows(myArreglo),
            });
        });  
    }

    
    
    renderRow(rowData){
        return(
        <View  style={[styles.listContainer,{justifyContent:'center', alignContent:'center', }]}>
            <TouchableHighlight style={{flex:1,}} onPress = {()=> this.props.onPress(rowData.id)}>
                <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
                    <Image 
                                    source={{uri:rowData.key}}
                                    onError={()=> console.log('Error al cargar')}
                                    style={{ resizeMode:'cover', width:50, height:50,}}/>

                    <Text style={{color:'rgba(52,109,241,1)',
                                    fontSize:30,
                                    fontWeight:'bold',
                                    textAlign:'center',
                                    paddingLeft:10}}
                    >{rowData.Name}</Text>
                </View>
            </TouchableHighlight>
        </View>
        )
    }
    
   render() {
      if(this.props.visible){
      return (
             <Modal
                animationType={'none'}
                transparent={false}
                style={{backgroundColor:'black', flex:1 }} 
                onRequestClose={()=> null}>
                <View style={{flex:1,flexDirection:'column' ,alignItems:'center', justifyContent:'center', alignSelf:'stretch', backgroundColor:'rgba(83, 137, 187,0.7)'}}>
                    <View style={{
                                height:40,
                                alignSelf:'stretch', 
                                backgroundColor:'rgba(28, 59, 136,1)',
                                
                                alignItems:'center', 
                                }} >
                        <Text style={{color:'white', fontSize:30, padding:2}} >Seleccione Servicio</Text>
                    </View>
                    <ListView
                        style={{alignSelf:'stretch', padding:10}}
                        dataSource={this.state.ds}
                        renderRow={this.renderRow}
                    />    
                    <TouchableOpacity
                      style = {{backgroundColor:'#851219', alignSelf:'center',width:'50%',borderRadius:5, margin:10, marginLeft:30, marginRight:30}}
                      onPress = {() => this.props.onPress('Cancelando')}>
                                     
                      <View style={{flexDirection:'row', justifyContent:'center', padding:5 }}>
                        <Text style={{color:'white', fontSize:20, fontWeight:'bold', alignSelf:'center'}} >Cancelar</Text>
                        <Icon style={{marginLeft:4, padding:10, fontSize:30}} name="ios-close" size={20} color='white' />
  
                      </View>
                    </TouchableOpacity>

                  </View>
             </Modal>
      )}else{
         return null;
      }
   }
}
export default ServiceType

