import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image, ImageBackground} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaAnadirNuevaPersona extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    hayAmigos: true,
    datosAmigos: {},
    nombreEvento: "",
    dinero: "",
    comensalesEvento: "",
    datosComensales: {},
    comensalesQueYaEstan: {}
  }
  componentDidMount(){
    this.setState({nombreEvento: this.props.route.params.nombreEvento})
    this.setState({dinero: this.props.route.params.dinero})
    this.setState({comensalesQueYaEstan: this.props.route.params.comensales})
    const {email} = auth().currentUser
    this.setState({email})
    firestore().collection('usuarios').doc(email).get()
      .then(documentSnapshot => {
        console.log('nombre del usuario: ' + documentSnapshot.get('nombre'))
        this.setState({nombre: documentSnapshot.get('nombre')})
    }).then(() => {
      console.log('email del usuario:  ' + this.state.email);
    });
    console.log(this.state.comensalesQueYaEstan)
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
          console.log(datosAmigos[1])
          Object.values(this.state.comensalesQueYaEstan).map((comensal) => {
            Object.entries(datosAmigos).map((amigo) => {
              if(comensal == amigo[1]){
                delete datosAmigos[amigo[0]]
              }
            })
          })
          if(Object.values(datosAmigos).length == 0){
            this.setState({hayAmigos: false})
          }
          console.log('  datosAmigos:', true)
          this.setState({datosAmigos: datosAmigos})
          //añadir un email a peticiones que ya está creado y comprobar si ya está incluido
          
          console.log(this.state.datosAmigos)
          
        }
      }
    })
  }
  handleEnviarPeticionEvento = (amigo) => {
    console.log('fasdñlfkjañdolshfaodhfodashfñldhasñflkhaslfjaslfjañlsdfjañlshfao1 ',Object.values(this.state.datosComensales).length)
    console.log('fasdñlfkjañdolshfaodhfodashfñldhasñflkhaslfjaslfjañlsdfjañlshfao1 ',this.state.datosComensales)
    var datosComensales = this.state.datosComensales
    var numeroComensales = Object.values(this.state.datosComensales).length+1
    if(Object.values(datosComensales).length == 0){
      this.setState({comensalesEvento: numeroComensales})
      console.log('fasdñlfkjañdolshfaodhfodashfñldhasñflkhaslfjaslfjañlsdfjañlshfao ',numeroComensales)
      datosComensales = {[Math.floor(Math.random() * 10000) + 1]: amigo}
    }else{
      this.setState({comensalesEvento: numeroComensales})
      console.log('fasdñlfkjañdolshfaodhfodashfñldhasñflkhaslfjaslfjañlsdfjañlshfao ',numeroComensales)
      datosComensales = {...datosComensales, [Math.floor(Math.random() * 10000) + 1]: amigo}
    }
    this.setState({datosComensales: datosComensales})
    console.log('fasdñlfkjañdolshfaodhfodashfñldhasñflkhaslfjaslfjañlsdfjañlshfao ',this.state.datosComensales)
    console.log('fasdñlfkjañdolshfaodhfodashfñldhasñflkhaslfjaslfjañlsdfjañlshfao ',datosComensales)
    firestore().collection('usuarios').doc(amigo).get().then(documentSnapshot => {
      console.log('  usuario existe: ', documentSnapshot.exists)
      if(documentSnapshot.exists){
        console.log('  datos usuario:  ', documentSnapshot.data())
        const datosPeticionesEvento = documentSnapshot.get('peticionEventos')
        if(datosPeticionesEvento==undefined){
          console.log('  datosPeticionesEvento:', false)
          console.log('  no hay peticiones de Eventos')
          firestore().collection('usuarios').doc(amigo).update({
            peticionEventos: {
              [Math.floor(Math.random() * 10000) + 1]: {
                nombreEvento: (this.state.nombreEvento),
                dinero: this.state.dinero
              }
            }
          }).then(() => {
            console.log('peticion de envento enviada a: !'+ (this.state.nombreEvento + "_" + this.state.email));
          });
          firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({eventoActivo: false})
          firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({noConfirmados: {[Math.floor(Math.random() * 10000) + 1]: this.state.email}})
        }else{
          console.log('  datosPeticionesEvento:', true)
          var peticionesRepetidas = false

          Object.values(datosPeticionesEvento).map((peticion) => {
            //COMPROBAR SI HAY ALGUNA PETICIÓN YA ENVIADA 
            console.log(peticion)
          })
          if(!peticionesRepetidas){
            console.log('  datosPeticionesEvento dato1: ',Object.values(datosPeticionesEvento)[0])
            console.log('  peticiones: ', Object.keys(datosPeticionesEvento).length)
            const nuevaPeticion = {...datosPeticionesEvento, [Math.floor(Math.random() * 10000) + 1]: {
              nombreEvento: (this.state.nombreEvento + "_" + this.state.email),
              dinero: this.state.dinero
            }}
            console.log(nuevaPeticion)
            firestore().collection('usuarios').doc(amigo).update({peticionEventos: nuevaPeticion})
            .then(() => {
              console.log('petición añadida a las peticiones de evento!');
            })
            firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({eventoActivo: false}).then(() => console.log('llegue'))
            firestore().collection('eventos').doc(this.state.nombreEvento + "_" + this.state.email).update({noConfirmados: {...datosComensales, [Math.floor(Math.random() * 10000) + 1]: this.state.email}})
          }else {
            console.log('ya esta ese usuario')
          }
        }
      }
    })
  }
  eliminarAmigoConPeticion = (amigo) => {
    const datosAmigos = this.state.datosAmigos
    console.log('datosPETICIONES1',this.state.datosAmigos)
    console.log('datosPETICIONES2',datosAmigos)
    let idAmigoEliminar= ""
    for (const [key, value] of Object.entries(this.state.datosAmigos)) {
      if(value == amigo){
        console.log('value'+value)
        console.log('key'+key)
        idAmigoEliminar = key
      }
      console.log(key+':'+value);
    }
    console.log('datosPETICIONES3',idAmigoEliminar)
    delete datosAmigos[idAmigoEliminar]
    if(Object.values(datosAmigos).length == 0){
      this.setState({hayAmigos: false})
    }
    console.log('datosPETICIONES4',datosAmigos)
    this.setState({datosAmigos: datosAmigos})
  }
  render(){
    const navigation = this.context;
    const elimarEIrAPantallaPrincipal = () => {
      firestore().collection('usuarios').doc(this.state.email).update({datosEventoNoCreado: firestore.FieldValue.delete()})
      navigation.navigate('PantallaPrincipal')
    }
    const listaAmigos = Object.values(this.state.datosAmigos).map((amigo) => {
      {console.log('  peticion listaPeticiones: ', amigo)}
      return(
        <View key={amigo} style={{flex: 1}}>
          <View style={{height: 50, flexDirection: 'row'}}>
            <View style={{width:50,height: 50}}>
              <Image style={{width: 50, height: 50}} source={require('../imagenes/amigo.png')}></Image>
            </View>
            <View style={{height: 50,width: '80%', flexDirection: 'column'}}>
              <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 18,marginTop: 0, justifyContent: 'center' }}>{amigo}</Text>
              <View style={{height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style={{
                    alignItems: 'center', 
                    backgroundColor: '#535473', 
                    width: 120, 
                    height: 20, 
                    justifyContent: 'center', 
                    borderRadius: 5, 
                    borderColor: 'white'
                  }} 
                  onPress={() => {
                    this.handleEnviarPeticionEvento(amigo)
                    this.eliminarAmigoConPeticion(amigo)
                  }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "500" }}>Enviar peticion</Text>
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
          <View style={{flex: 0.4/*, backgroundColor: 'blue'*/}}>
            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', width: '100%', height: '100%'}}>
              <View style={{width: '20%'/*, backgroundColor: 'pink'*/}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={elimarEIrAPantallaPrincipal}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >
                    <Image style={{width: 50, height: 50}} source={require('../imagenes/logo_grande.png')} />
                </TouchableOpacity>
              </View>
              <View style={{width: '80%'/*, backgroundColor: 'green'*/}}>
                <Image style={{width: 120, height: 50, marginHorizontal: 52, marginTop: 10}}  source={require('../imagenes/fuente.png')} />
              </View>
            </View>
          </View>
          <View style={{flex: 4, left: 20}}>
            {this.state.hayAmigos
              ? <View style={{flex: 1}}>
                  <Text style={{textTransform: 'uppercase', fontSize: 20, fontWeight: 'bold', color: '#535473'}}>Amigos</Text>
                  <View style={{flex: 1,flexDirection: 'column', justifyContent: 'flex-start', marginTop: 20}}>
                    {listaAmigos}
                    <View style={{flex: 1}}>
                      <TouchableOpacity style={{
                        alignItems: 'center', 
                        backgroundColor: '#535473', 
                        width: 320, height: 30, 
                        justifyContent: 'center', 
                        borderRadius: 5, 
                        borderColor: 'white', 
                        marginTop: 20}} onPress={() => navigation.navigate('EventosActivos')} >
                        <Text style={{ color: "#FFF", fontWeight: "500" }}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              : <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
                  <View style={{flex: 2, /* backgroundColor: 'red', */ left: 20}}>
                    <Text style={{textTransform: 'uppercase', fontSize: 20, fontWeight: 'bold', color: '#535473'}}>No hay amigos</Text>
                    <View style={{flex: 2}}>
                      <TouchableOpacity style={{alignItems: 'center', backgroundColor: '#535473', width: 320, height: 30, justifyContent: 'center', borderRadius: 5, borderColor: 'white', marginTop: 20}} onPress={() => {navigation.navigate('AnadirAmigo')}}>
                        <Text style={{ color: "#FFF", fontWeight: "500" }}>Añadir amigos</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{alignItems: 'center', backgroundColor: '#535473', width: 320, height: 30, justifyContent: 'center', borderRadius: 5, borderColor: 'white', marginTop: 20}} onPress={() => navigation.navigate('EventosActivos')} >
                        <Text style={{ color: "#FFF", fontWeight: "500" }}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
            }
            
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
    width: 325,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  }
})

export default PantallaAnadirNuevaPersona