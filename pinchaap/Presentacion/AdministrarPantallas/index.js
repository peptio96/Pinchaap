// In App.js in a new project

import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation' 

import PantallaLogin from '../MisPantallas/PantallaLogin'
import PantallaRegistro from '../MisPantallas/PantallaRegistro'
import PantallaAnadirPersona from '../MisPantallas/PantallaAnadirPersona'
import PantallaCreandoEvento from '../MisPantallas/PantallaCreandoEvento'
import PantallaPantallaPrincipal from '../MisPantallas/PantallaPantallaPrincipal'
import PantallaResumenParticipantesBote from '../MisPantallas/PantallaResumenParticipantesBote'
import PantallaVerMapa from '../MisPantallas/PantallaVerMapa'
import PantallaAnadirAmigo from '../MisPantallas/PantallaAnadirAmigo'
import PantallaAmigosPendientes from '../MisPantallas/PantallaAmigosPendientes'
import PantallaAmigos from '../MisPantallas/PantallaAmigos'
import PantallaEventosPrincipal from '../MisPantallas/PantallaEventosPrincipal'

const Stack = createStackNavigator();

function AdministrarPantallas() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Logging">
        <Stack.Screen name="Logging" component={PantallaLogin} options={{headerShown: null}}/>
        <Stack.Screen name="Registro" component={PantallaRegistro} options={{headerShown: null}}/>
        <Stack.Screen name="AnadirPersona" component={PantallaAnadirPersona} options={{headerShown: null}}/>
        <Stack.Screen name="AnadirAmigo" component={PantallaAnadirAmigo} options={{headerShown: null}}/>
        <Stack.Screen name="Amigos" component={PantallaAmigos} options={{headerShown: null}}/>
        <Stack.Screen name="EventosPrincipal" component={PantallaEventosPrincipal} options={{headerShown: null}}/>
        <Stack.Screen name="CreandoEvento" component={PantallaCreandoEvento} options={{headerShown: null}}/>
        <Stack.Screen name="PantallaPrincipal" component={PantallaPantallaPrincipal} options={{/*title: "Pinchapp",headerStyle:{backgroundColor: 'grey'},headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          }*/headerShown: null}}/>
        <Stack.Screen name="ResumenParticipantesBote" component={PantallaResumenParticipantesBote}/>
        <Stack.Screen name="AmigosPendientes" component={PantallaAmigosPendientes} options={{headerShown: null}}/>
        <Stack.Screen name="VerMapa" component={PantallaVerMapa} options={{headerShown: null}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AdministrarPantallas;