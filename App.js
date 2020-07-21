import 'react-native-gesture-handler'

import React from 'react'
//import MyDrawer from './MyDrawer'
import AdministrarPantallas from './pinchaap/Presentacion/AdministrarPantallas'

export default function App(){
  return (
    //<MyDrawer/>
    <AdministrarPantallas/>
  )
}
/*
  createUser = () => {
    auth()
      .createUserWithEmailAndPassword('sarah.lane@gmail.com', 'SuperSecretPassword!')
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      })
  }
  logoff = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }*/