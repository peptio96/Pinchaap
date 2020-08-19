import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaAmigosPendientes extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    hayPeticiones: true,
    datosPeticiones: [],
    numeroAmigos: ""
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
        const datosPeticiones = documentSnapshot.get('peticiones')
        if(datosPeticiones==undefined){
          console.log('  datosPeticiones:', false)
          console.log('  no hay peticiones')
          this.setState({hayPeticiones: false})

          //añadir peticiones y añadir el primer email
        }else{
          console.log('  datosPeticiones:', true)
          this.setState({datosPeticiones: datosPeticiones})
          //añadir un email a peticiones que ya está creado y comprobar si ya está incluido
          Object.values(datosPeticiones).map((peticion) => {
            console.log('  peticion: ', peticion)
          })
          console.log(this.state.datosPeticiones)
        }
      }
    })
  }
  handleAceptarAmistad = (peticion) => {
    firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
      console.log('  usuario existe: ', documentSnapshot.exists)
      if(documentSnapshot.exists){
        console.log('  datos usuario:  ', documentSnapshot.data())
        const datosAmigos = documentSnapshot.get('amigos')
        if(datosAmigos==undefined){
          console.log('  datosAmigos:', false)
          //añadir peticiones y añadir el primer email
          firestore().collection('usuarios').doc(this.state.email).update({amigos: {1: peticion}})
          .then(() => {
            console.log('usuario añadido a amigos!');
          });
        }else{
          console.log('  datosAmigos:', true)
          //añadir un email a peticiones que ya está creado y comprobar si ya está incluido
          var amigosRepetidos = false
          Object.values(datosAmigos).map((amigo) => {
            if(amigo == peticion){
              amigosRepetidos = true
            }
          })
          if(!amigosRepetidos){
            console.log('  datosAmigos dato1: ',Object.values(datosAmigos)[0])
            console.log('  amigos: ', Object.keys(datosAmigos).length)
            console.log('peticion1111111',peticion)
            this.setState({numeroAmigos: Object.keys(datosAmigos).length+1})
            const nuevoAmigo = {...datosAmigos, [Object.keys(datosAmigos).length+1]: peticion}
            console.log(nuevoAmigo)
            firestore().collection('usuarios').doc(this.state.email).update({amigos: nuevoAmigo})
            .then(() => {
              console.log('usuario añadido a amigos!');
            })
          }else {
            console.log('ya esta ese usuario')
          }
        }
      }
    })
  }

  handleEliminarPeticion = (peticion) => {

    firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
      console.log('  usuario existe: ', documentSnapshot.exists)
      if(documentSnapshot.exists){
        console.log('  datos usuario:  ', documentSnapshot.data())
        const datosPeticiones = documentSnapshot.get('peticiones')
        const numeroPeticiones = Object.values(datosPeticiones).length
        console.log(numeroPeticiones)
        for (const [key, value] of Object.entries(datosPeticiones)) {
          if(value == peticion){
            this.setState({idAmigoAnadir: key})
          }
          console.log(key+':'+value);
        }
        delete datosPeticiones[this.state.idAmigoAnadir]
        console.log('datosPETICIONES',datosPeticiones)
        firestore().collection('usuarios').doc(this.state.email).update({peticiones: datosPeticiones})
        if(numeroPeticiones == 1){
          firestore().collection('usuarios').doc(this.state.email).update({peticiones: firestore.FieldValue.delete()})
        }
      }
    })
  }
  
  render(){
    const navigation = this.context;
    if(this.state.hayPeticiones){
      const listaPeticiones = Object.values(this.state.datosPeticiones).map((peticion) => {
        {console.log('  peticion listaPeticiones: ', peticion)}
        return(
          <View style={{flex: 1,flexDirection: 'row'}}>
            <Text>{peticion}</Text>
            <Text>     </Text>
            <TouchableOpacity onPress={() => {
              this.handleAceptarAmistad(peticion)
              this.handleEliminarPeticion(peticion)
            }}>
              <Text style={{ fontWeight: "500", color:"#E9446A"}}>Aceptar peticion</Text>
            </TouchableOpacity>
            <Text>     </Text>
            <TouchableOpacity onPress={() => {
              this.handleEliminarPeticion(peticion)
            }}>
              <Text style={{ fontWeight: "500", color:"#E9446A"}}>Cancelar peticion</Text>
            </TouchableOpacity>
          </View>
          
        )
        
      })
      return (
        <View style={styles.container}>
          
          <Text>Peticiones</Text>
          <View style={{flex: 1,flexDirection: 'column'}}>
            {listaPeticiones}
          </View>
        </View>
      )
    }else{
      return (
        <View style={styles.container}>
          <Text>No hay peticiones</Text>
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

export default PantallaAmigosPendientes