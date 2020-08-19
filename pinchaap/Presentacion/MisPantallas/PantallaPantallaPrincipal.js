import React from 'react'
import {View, Text, TouchableNativeFeedback, Image, Platform, StyleSheet, TouchableOpacity} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaPantallaPrincipal extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: ""
  }
  componentDidMount(){
    const {email} = auth().currentUser

    this.setState({email})
    firestore().collection('usuarios').doc(email).get().then(documentSnapshot => {
      console.log(documentSnapshot.get('nombre'))
      this.setState({nombre: documentSnapshot.get('nombre')})
    })
  }
  render(){
    const navigation = this.context;
    const signOutUser = () => {
      auth().signOut().then(() => console.log('User signed out!'));
      firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
        firestore().collection('usuarios').doc(this.state.email).update({conectado: false}).then(console.log('User updated!'))
      })
      navigation.navigate('Logging')
    };
    return (
      <View style={styles.container}>
        <Text style={styles.greeting}>{'Hola de nuevo. \nBienvenido.'}</Text>
        <Text style={styles.greeting}>{this.state.nombre}</Text>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => navigation.navigate('CreandoEvento')}>
          <Text style={{ fontWeight: "500", color:"#E9446A"}}>Crear Evento</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => navigation.navigate('AnadirAmigo')}>
          <Text style={{ fontWeight: "500", color:"#E9446A"}}>Peticiones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => navigation.navigate('Amigos')}>
          <Text style={{ fontWeight: "500", color:"#E9446A"}}>Amigos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginHorizontal: 30,height: 52,alignItems: "center",justifyContent: "center", marginTop: 32}}
          onPress={() => navigation.navigate('VerMapa')}
          background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
        >
            <Image style={{width: 100, height: 100}} source={require('../imagenes/googlemaps.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={signOutUser}>
          <Text style={{ color: "#FFF", fontWeight: "500" }}>Salir</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center"
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 10,
    textTransform: "uppercase"
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D"
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  }
})

export default PantallaPantallaPrincipal