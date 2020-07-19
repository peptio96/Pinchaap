// In App.js in a new project

import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation' 

import PantallaLogging from '../MisPantallas/PantallaLogging'
import PantallaRegistro from '../MisPantallas/PantallaRegistro'
import PantallaAnadirPersona from '../MisPantallas/PantallaAnadirPersona'
import PantallaCreandoEvento from '../MisPantallas/PantallaCreandoEvento'
import PantallaPantallaPrincipal from '../MisPantallas/PantallaPantallaPrincipal'
import PantallaResumenParticipantesBote from '../MisPantallas/PantallaResumenParticipantesBote'
import PantallaVerMapa from '../MisPantallas/PantallaVerMapa'

const Stack = createStackNavigator();

function AdministrarPantallas() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator >
        <Stack.Screen name="Logging" component={PantallaLogging}/>
        <Stack.Screen name="Registro" component={PantallaRegistro}/>
        <Stack.Screen name="AnadirPersona" component={PantallaAnadirPersona}/>
        <Stack.Screen name="CreandoEvento" component={PantallaCreandoEvento}/>
        <Stack.Screen name="PantallaPrincipal" component={PantallaPantallaPrincipal}/>
        <Stack.Screen name="ResumenParticipantesBote" component={PantallaResumenParticipantesBote}/>
        <Stack.Screen name="VerMapa" component={PantallaVerMapa}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AdministrarPantallas;