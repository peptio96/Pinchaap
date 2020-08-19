import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaAnadirAmigo extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    emailPeticion: "",
    numeroPeticion: ""
  }
  componentDidMount(){
    const {email} = auth().currentUser
    this.setState({email})
    firestore()
      .collection('usuarios')
      .doc(email)
      .get()
      .then(documentSnapshot => {
        console.log('nombre del usuario: ' + documentSnapshot.get('nombre'))
        this.setState({nombre: documentSnapshot.get('nombre')})
    }).then(() => {
      console.log('email del usuario:  ' + this.state.email);
    });
  }
  handleEnviarInvitacion = () => {
    console.log('clicadoEnviarInvitación')
    console.log('  emailPeticion:   ' + this.state.emailPeticion)
    firestore().collection('usuarios').doc(this.state.emailPeticion).get().then(documentSnapshot => {
      console.log('  usuario existe: ', documentSnapshot.exists)
      if(documentSnapshot.exists){
        console.log('  datos usuario:  ', documentSnapshot.data())
        const datosPeticiones = documentSnapshot.get('peticiones')
        if(datosPeticiones==undefined){
          console.log('  datosPeticiones:', false)
          //añadir peticiones y añadir el primer email
          firestore().collection('usuarios').doc(this.state.emailPeticion).update({peticiones: {[Math.floor(Math.random() * 10000) + 1]: this.state.email}})
          .then(() => {
            console.log('usuario añadido a las peticiones de amistad!');
          });
        }else{
          console.log('  datosPeticiones:', true)
          //añadir un email a peticiones que ya está creado y comprobar si ya está incluido
          var peticionesRepetidas = false
          Object.values(datosPeticiones).map((peticion) => {
            if(peticion == this.state.email){
              peticionesRepetidas = true
            }
          })
          if(!peticionesRepetidas){
            console.log('  datosPeticiones dato1: ',Object.values(datosPeticiones)[0])
            console.log('  peticiones: ', Object.keys(datosPeticiones).length)
            this.setState({numeroPeticion: Object.keys(datosPeticiones).length+1})
            const nuevaPeticion = {...datosPeticiones, [Math.floor(Math.random() * 10000) + 1]: this.state.email}
            console.log(nuevaPeticion)
            firestore().collection('usuarios').doc(this.state.emailPeticion).update({peticiones: nuevaPeticion})
            .then(() => {
              console.log('usuario añadido a las peticiones de amistad!');
            })
          }else {
            console.log('ya esta ese usuario')
          }
          
        }
      }
    })
  }
  render(){
    const navigation = this.context;
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>{this.state.nombre}</Text>
            <Text style={styles.inputTitle}>{this.state.email}</Text>
            <Text style={styles.inputTitle}>Dirección email</Text>
            <TextInput 
              style={styles.input} 
              autoCapitalize="none" 
              onChangeText={emailPeticion => this.setState({ emailPeticion })}
            ></TextInput>
          </View>
        </View>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={this.handleEnviarInvitacion}>
          <Text style={{ fontWeight: "500", color:"#E9446A"}}>Enviar peticion</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => navigation.navigate('AmigosPendientes')}>
          <Text style={{ fontWeight: "500", color:"#E9446A"}}>Pendientes amigos</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => navigation.goBack()}>
          <Text style={{ fontWeight: "500", color:"#E9446A"}}>Go back</Text>
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

export default PantallaAnadirAmigo