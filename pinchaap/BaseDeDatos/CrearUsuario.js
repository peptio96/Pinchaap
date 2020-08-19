import React from 'react'
import {View,StyleSheet,Text,TextInput,TouchableOpacity} from 'react-native'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function crearUsuario({email,nombre,contrasena}) {
  firestore().collection('usuarios').doc(email).set({nombre: nombre, email: email, contrasena: contrasena, conectado: false})
        .then(() => {
          console.log('User added!');
        });
}