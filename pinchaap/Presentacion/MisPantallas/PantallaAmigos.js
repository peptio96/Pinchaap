import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaAmigos extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    hayAmigos: true,
    datosAmigos: []
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

    firestore().collection('usuarios').doc(email).get().then(documentSnapshot => {
      console.log('  usuario existe: ', documentSnapshot.exists)
      if(documentSnapshot.exists){
        console.log('  datos usuario:  ', documentSnapshot.data())
        const datosAmigos = documentSnapshot.get('amigos')
        if(datosAmigos==undefined){
          console.log('  datosAmigos:', false)
          console.log('  no hay amigos')
          this.setState({hayAmigos: false})

          //añadir peticiones y añadir el primer email
        }else{
          console.log('  datosAmigos:', true)
          this.setState({datosAmigos: datosAmigos})
          //añadir un email a peticiones que ya está creado y comprobar si ya está incluido
          Object.values(datosAmigos).map((amigo) => {
            console.log('  amigo: ', amigo)
          })
          console.log(this.state.datosAmigos)
        }
      }
    })
  }
  
  render(){
    const navigation = this.context;
    if(this.state.hayAmigos){
      const listaAmigos = Object.values(this.state.datosAmigos).map((amigo) => {
        {console.log('  peticion listaPeticiones: ', amigo)}
        return(
          <View style={{flex: 1,flexDirection: 'row'}}>
            <Text>{amigo}</Text>
          </View>
          
        )
        
      })
      return (
        <View style={styles.container}>
          
          <Text>Peticiones</Text>
          <View style={{flex: 1,flexDirection: 'column'}}>
            {listaAmigos}
          </View>
        </View>
      )
    }else{
      return (
        <View style={styles.container}>
          <Text>No hay amigos</Text>
          <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => navigation.goBack()}>
            <Text style={{ fontWeight: "500", color:"#E9446A"}}>Go back</Text>
          </TouchableOpacity>
        </View>
      )
    }
    
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

export default PantallaAmigos