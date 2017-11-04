import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  Button,
  Component,
  Platform
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';

import { StackNavigator }   from 'react-navigation';

import Login                from './src/components/Login';
import MainScreen           from './src/components/MainScreen';
import CarCenterListing     from './src/components/CarCenterListing';
import CarCenterDetails     from './src/components/CarCenterDetails';
import CarListing           from './src/components/CarListing';
import CarDetails           from './src/components/CarDetails';
import TomaFoto             from './src/utils/TomaFoto';
import RepairEvent          from './src/components/RepairEvent';
import RepairEventListing   from './src/components/RepairEventListing';
import Settings             from './src/components/Settings';


const carshop2 = StackNavigator({
  Login:              { screen: Login,                title: 'Login' },
  MainScreen:         { screen: MainScreen,           title: 'Menu Principal'} ,
  CarCenterDetails:   { screen: CarCenterDetails,     title: 'Detalles del Taller'} ,
  CarCenterListing:   { screen: CarCenterListing,     title: 'Listado de Talleres'} ,
  CarListing:         { screen: CarListing,           title: 'Listado de Autos'} ,
  CarDetails:         { screen: CarDetails,           title: 'Detalles del Auto'} ,
  TomaFoto:           { screen: TomaFoto,             title: 'TomaFoto'},
  RepairEvent:        { screen: RepairEvent,          tittle:'RepairEvent'},
  RepairEventListing: { screen: RepairEventListing,   tittle:'RepairEventListing'},
  
  Settings:           { screen: Settings,             title: 'Ajustes'}
});




setTimeout = BackgroundTimer.setTimeout.bind(BackgroundTimer);
setInterval = BackgroundTimer.setInterval.bind(BackgroundTimer);
clearTimeout = BackgroundTimer.clearTimeout.bind(BackgroundTimer);
clearInterval = BackgroundTimer.clearInterval.bind(BackgroundTimer);



AppRegistry.registerComponent('carshop2', () => carshop2);
