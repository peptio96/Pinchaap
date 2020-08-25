import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image, ImageBackground} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaPeticionesEventos extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    hayPeticiones: true,
    datosPeticiones: [],
    numeroAmigos: "",
    dineroEvento: ""
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
        const datosPeticiones = documentSnapshot.get('peticionEventos')
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
  /* componentWillUnmount(){
    auth().signOut().then(() => console.log('User signed out!'));
    firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
      firestore().collection('usuarios').doc(this.state.email).update({conectado: false}).then(console.log('User updated!'))
    })
  } */
  handleAceptarAmistad = (peticion) => {
    //Cambiar de pendiente a confirmado el pago
    var idEvento = ""
    var nombreEvento = ""
    var emailAdminEvento = ""
    var dineroPeticion = ""
    console.log(peticion)
    Object.entries(peticion).map((valor) => {
      if(valor[0] == 'nombreEvento'){
        idEvento = valor[1]
        emailAdminEvento = valor[1].substring(valor[1].indexOf("_")+1)
        nombreEvento = valor[1].substring(0,valor[1].indexOf("_"))
      }
      if(valor[0] == 'dinero'){
        dineroPeticion = valor[1]
      }
    })
    console.log(idEvento)
    console.log(nombreEvento)
    console.log(dineroPeticion)
    console.log(emailAdminEvento)
    firestore().collection('eventos').where('emailAdmin','==',emailAdminEvento).where('nombreEvento','==',nombreEvento).get().then(querySnapshot => {
      /* console.log(querySnapshot.size) */
      querySnapshot.forEach(documentSnapshot => {
        const evento = documentSnapshot.data()
        /* console.log(evento)
        console.log(evento['noConfirmados'])
        console.log(evento['confirmados']) */
        var nuevoNoConfirmados = evento['noConfirmados'] 
        for (const [key, value] of Object.entries(nuevoNoConfirmados)) {
          if(value == this.state.email){
            console.log('value'+value)
            console.log('key'+key)
            delete nuevoNoConfirmados[key]
          }
          console.log(key+':'+value);
        }
        if(evento['confirmados'] == undefined){
          firestore().collection('eventos').doc(idEvento).update({confirmados: {[Math.floor(Math.random() * 10000) + 1]: this.state.email}})
          firestore().collection('eventos').doc(idEvento).get().then((documentSnapshot) => {
            console.log('dinero',documentSnapshot.get('dinero'))
            firestore().collection('eventos').doc(idEvento).update({dinero: documentSnapshot.get('dinero')+parseInt(dineroPeticion)})
          })
        }else{
          firestore().collection('eventos').doc(idEvento).update({confirmados: {...evento['confirmados'],[Math.floor(Math.random() * 10000) + 1]: this.state.email} })
          
          var dieroAntesDeConfirmarPeticion = ""
          firestore().collection('eventos').doc(idEvento).get().then((documentSnapshot) => {
            console.log('dinero',documentSnapshot.get('dinero'))
            firestore().collection('eventos').doc(idEvento).update({dinero: documentSnapshot.get('dinero')+parseInt(dineroPeticion)})
          })
          console.log(dieroAntesDeConfirmarPeticion)
        }

        firestore().collection('eventos').doc(idEvento).update({noConfirmados: nuevoNoConfirmados})
        if(Object.values(nuevoNoConfirmados).length == 0){
          firestore().collection('eventos').doc(idEvento).update({noConfirmados: firestore.FieldValue.delete()})
          firestore().collection('eventos').doc(idEvento).update({eventoActivo: true})
        }
      })
    })
  }
  handleEliminarPeticion = (peticion) => {
    const datosPeticiones = this.state.datosPeticiones
    console.log('datosPETICIONES1',this.state.datosPeticiones)
    console.log('datosPETICIONES2',datosPeticiones)
    const numeroPeticiones = Object.values(datosPeticiones).length
    let idAmigoEliminar= ""
    console.log(Object.values(this.state.datosPeticiones).length)
    for (const [key, value] of Object.entries(this.state.datosPeticiones)) {
      if(value['nombreEvento'] == peticion['nombreEvento']){
        console.log('value'+value)
        console.log('key'+key)
        idAmigoEliminar = key
      }
      console.log(key+':'+value);
    }
    console.log('datosPETICIONES3',idAmigoEliminar)
    delete datosPeticiones[idAmigoEliminar]
    console.log('datosPETICIONES4',datosPeticiones)
    this.setState({datosPeticiones: datosPeticiones})
    firestore().collection('usuarios').doc(this.state.email).update({peticionEventos: datosPeticiones})
    if(numeroPeticiones == 1){
      firestore().collection('usuarios').doc(this.state.email).update({peticionEventos: firestore.FieldValue.delete()})
      this.setState({hayPeticiones: false})
    }
    
  }
  
  render(){
    const navigation = this.context;
    const listaPeticiones = Object.values(this.state.datosPeticiones).map((peticion) => {
      return(
        <View key={peticion['nombreEvento']} style={{flex: 1}}>
          <View style={{height: 50, flexDirection: 'row'}}>
            <View style={{width:50,height: 50}}>
              <Image style={{width: 50, height: 50}} source={require('../imagenes/logo_eventosnoadmin.png')}></Image>
            </View>
            <View style={{height: 50,width: '80%', flexDirection: 'column'}}>
              <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 18,marginTop: 0, justifyContent: 'center' }}>{peticion['nombreEvento']}</Text>
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
                    borderColor: 'white'
                  }} 
                  onPress={() => {
                    this.handleEliminarPeticion(peticion)
                  }}
                >
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
          <View style={{flex: 0.4/*, backgroundColor: 'blue'*/}}>
            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', width: '100%', height: '100%'}}>
              <View style={{width: '20%'/*, backgroundColor: 'pink'*/}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={() => navigation.navigate('PantallaPrincipal')}
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
          <View style={{flex: 4}}>
            <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
              <View style={{flex: 0.5, /*backgroundColor: 'green',*/ justifyContent: 'center'}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={() => navigation.goBack()}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >
                  <Image style={{width: 50, height: 350}} source={require('../imagenes/logo_flechaizda.png')} />
                </TouchableOpacity>
              </View>
              {this.state.hayPeticiones
                ? 
                  <View style={{flex: 4, left: 20}}>
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

export default PantallaPeticionesEventos