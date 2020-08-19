import React from 'react'
import {View,StyleSheet,Text,TextInput,TouchableOpacity} from 'react-native'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function logearteComoUsuario({email,contrasena}) {
  firestore().collection('usuarios').doc(email).get().then(documentSnapshot => {
    if (documentSnapshot.get('contrasena') === contrasena){
      firestore().collection('usuarios').doc(email).update({conectado: true}).then(console.log('User updated!'))
    }
  })
}