import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image, ImageBackground} from 'react-native'
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
    firestore().collection('usuarios').doc(email).get().then(documentSnapshot => {
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
          this.setState({hayPeticiones: false})
        }else{
          this.setState({datosPeticiones: datosPeticiones})
          this.setState({hayPeticiones: true})
        }
      }
    })
  }
  handleAceptarAmistad = (peticion) => {
    firestore().collection('usuarios').doc(peticion).get().then(documentSnapshot => {
      console.log('  usuario existe: ', documentSnapshot.exists)
      if(documentSnapshot.exists){
        console.log('  datos usuario:  ', documentSnapshot.data())
        const datosAmigos = documentSnapshot.get('amigos')
        if(datosAmigos==undefined){
          console.log('  datosAmigos:', false)
          //añadir peticiones y añadir el primer email
          firestore().collection('usuarios').doc(peticion).update({amigos: {1: peticion}})
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
            firestore().collection('usuarios').doc(peticion).update({amigos: nuevoAmigo})
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
          this.setState({hayPeticiones: false})
        }
        this.setState({datosPeticiones: datosPeticiones})
      }
    })
  }
  
  render(){
    const navigation = this.context;
    const listaPeticiones = Object.values(this.state.datosPeticiones).map((peticion) => {
      return(
        <View key={peticion} style={{flex: 1}}>
          <View style={{height: 50, flexDirection: 'row'}}>
            <View style={{width:50,height: 50}}>
              <Image style={{width: 50, height: 50}} source={require('../imagenes/logo_persona.png')}></Image>
            </View>
            <View style={{height: 50,width: '80%', flexDirection: 'column'}}>
              <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 18,marginTop: 0, justifyContent: 'center' }}>{peticion}</Text>
              <View style={{height: 50, flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity style={{
                    alignItems: 'center', 
                    backgroundColor: '#535473', 
                    width: 80, 
                    height: 20, 
                    justifyContent: 'center', 
                    borderRadius: 5, 
                    borderColor: 'white'
                  }} 
                  onPress={() => {
                    this.handleAceptarAmistad(peticion)
                    this.handleEliminarPeticion(peticion)
                  }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "500" }}>Aceptar</Text>
                </TouchableOpacity>
                <Text>     </Text>
                <TouchableOpacity style={{
                  alignItems: 'center', 
                  backgroundColor: '#535473', 
                  width: 80, 
                  height: 20, 
                  justifyContent: 'center', 
                  borderRadius: 5, 
                  borderColor: 'white'}} onPress={() => {
                  this.handleEliminarPeticion(peticion)
                }}>
                  <Text style={{ color: "#FFF", fontWeight: "500" }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    })
    return (
      <ImageBackground style={{width: '100%', height: '100%'}} source={require('../imagenes/background1.png')}>
        <View style={styles.container}>
          <View style={{flex: 0.4}}>
            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', width: '100%', height: '100%'}}>
              <View style={{width: '20%'}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={() => navigation.navigate('PantallaPrincipal')}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >
                    <Image style={{width: 50, height: 50}} source={require('../imagenes/logo_grande.png')} />
                </TouchableOpacity>
              </View>
              <View style={{width: '80%'}}>
                <Image style={{width: 120, height: 50, marginHorizontal: 52, marginTop: 10}}  source={require('../imagenes/fuente.png')} />
              </View>
            </View>
          </View>
          <View style={{flex: 4}}>
            <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
              {this.state.hayPeticiones 
                ? <View style={{flex: 4, left: 20}}>
                    <Text style={{textTransform: 'uppercase', fontSize: 20, fontWeight: 'bold', color: '#535473'}}>Peticiones</Text>
                    <View style={{flex: 1,flexDirection: 'column', justifyContent: 'flex-start', marginTop: 20}}>
                      {listaPeticiones}
                      <View style={{flex: 2}}></View>
                    </View>
                  </View>
                : <View style={{flex: 4, left: 20}}>
                    <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
                      <View style={{flex: 2, left: 20}}>
                        <Text style={{textTransform: 'uppercase', fontSize: 20, fontWeight: 'bold', color: '#535473'}}>No hay peticiones</Text>
                      </View>
                    </View>
                  </View>
              }
              
              <View style={{flex: 0.5, justifyContent: 'center'}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={() => navigation.goBack()}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >
                  <Image style={{width: 50, height: 350}} source={require('../imagenes/logo_flechadcha.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
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

export default PantallaAmigosPendientes