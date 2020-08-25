import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image, ImageBackground} from 'react-native'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaEventosActivos extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    hayEventosAdminActivos: false,
    hayEventosComensalActivos: false,
    eventosAdmin: {},
    eventosComen: {}
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
    /* this.setState({hayEventosComensalActivos: false}) */
    firestore().collection('eventos').where('eventoActivo','==', true).get().then(querySnapshot => {
      console.log(querySnapshot.size)
      if(querySnapshot.size == 0){
        this.setState({hayEventosAdminActivos: false})
        this.setState({hayEventosComensalActivos: false})
      }else{
        querySnapshot.forEach(documentSnapshot => {
          const evento = documentSnapshot.data()
          console.log(documentSnapshot.id)
          console.log(evento['confirmados'])
          for (const [key, value] of Object.entries(evento)) {
            if(key == 'emailAdmin'){
              if(value == this.state.email){
                this.setState({hayEventosAdminActivos: true})
                console.log('dlfkjañslfkj',Object.values(this.state.eventosAdmin).length)
                if(Object.values(this.state.eventosAdmin).length == 0){
                  this.setState({eventosAdmin: {[Math.floor(Math.random() * 10000) + 1]: documentSnapshot.id}})
                }else{
                  this.setState({eventosAdmin: {...this.state.eventosAdmin,[Math.floor(Math.random() * 10000) + 1]: documentSnapshot.id}})
                }
              }
            }
          }
          Object.values(evento['confirmados']).map((comensal) => {
            if(comensal == this.state.email){
              this.setState({hayEventosComensalActivos: true})
              console.log('he llegado')
              console.log('dlfkjañslfkj',Object.values(this.state.eventosComen).length)
              if(Object.values(this.state.eventosComen).length == 0){
                this.setState({eventosComen: {[Math.floor(Math.random() * 10000) + 1]: documentSnapshot.id}})
              }else{
                this.setState({eventosComen: {...this.state.eventosComen,[Math.floor(Math.random() * 10000) + 1]: documentSnapshot.id}})
              }
            }
          })
          console.log(this.state.eventosComen)
        })
      }
    })
    
  }
  /* componentWillUnmount(){
    auth().signOut().then(() => console.log('User signed out!'));
    firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
      firestore().collection('usuarios').doc(this.state.email).update({conectado: false}).then(console.log('User updated!'))
    })
  } */
  
  render(){
    const navigation = this.context;
    const listaEventosAdmin = Object.values(this.state.eventosAdmin).map((evento) => {
      return (
        <View key={evento} style={{flex: 1, marginTop: 5, marginLeft: 8}}>
          <TouchableOpacity onPress={() => {navigation.navigate('ResumenParticipantesBote',{idEvento: evento,admin: true})}}>
            <View style={{height: 50, flexDirection: 'row'}}>
              <View style={{width:50,height: 50}}>
                <Image style={{width: 45, height: 45}} source={require('../imagenes/logo_eventosactivos.png')}></Image>
              </View>
              <View style={{height: 50,width: '80%', flexDirection: 'column'}}>
                <Text style={{textAlign: 'left', fontWeight: 'bold',fontSize: 18,justifyContent: 'center' }}>{evento.substring(0,evento.indexOf("_"))}</Text>
                <Text style={{textAlign: 'left', fontWeight: 'bold',fontSize: 18,justifyContent: 'center' }}>{evento.substring(evento.indexOf("_")+1)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )
    })
    const listaEventosComen = Object.values(this.state.eventosComen).map((evento) => {
      return (
        <View key={evento} style={{flex: 1, marginTop: 5, marginLeft: 8}}>
          <TouchableOpacity onPress={() => {navigation.navigate('ResumenParticipantesBote',{idEvento: evento,admin: false})}}>
            <View style={{height: 50, flexDirection: 'row'}}>
              <View style={{width:50,height: 50}}>
                <Image style={{width: 45, height: 45}} source={require('../imagenes/logo_eventosnoadmin.png')}></Image>
              </View>
              <View style={{height: 50,width: '80%', flexDirection: 'column'}}>
                <Text style={{textAlign: 'left', fontWeight: 'bold',fontSize: 18,marginTop: 0, justifyContent: 'center' }}>{evento.substring(0,evento.indexOf("_"))}</Text>
                <Text style={{textAlign: 'left', fontWeight: 'bold',fontSize: 18,marginTop: 0, justifyContent: 'center' }}>{evento.substring(evento.indexOf("_")+1)}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
              <View style={{flex: 2/* , backgroundColor: 'red' */}}>
                <View style={{flex: 0.2, justifyContent: 'center'}}>
                  <Text style={{textAlign: 'left', marginLeft: 15, textTransform: 'uppercase', fontSize: 20, fontWeight: 'bold', color: '#535473'}}>Eventos administrador</Text>
                </View>
                <View style={{flex: 1, backgroundColor: '#979BD6', marginLeft: 15, marginRight: 15, borderRadius: 5, opacity: 0.5}}>
                  {this.state.hayEventosAdminActivos
                    ? <View style={{flex: 1}}>
                        {listaEventosAdmin}
                      </View>
                    : <Text style={{textAlign: 'left', marginTop: 5, marginLeft: 10, textTransform: 'uppercase', }}>No tienes eventos activos</Text>
                  }
                </View>
              </View>
              <View style={{flex: 2, /* backgroundColor: 'green' */}}>
                <View style={{flex: 0.2, justifyContent: 'center'}}>
                  <Text style={{textAlign: 'left', marginLeft: 15, textTransform: 'uppercase', fontSize: 20, fontWeight: 'bold', color: '#535473'}}>Eventos participante</Text>
                </View>
                <View style={{flex: 1, backgroundColor: '#979BD6', marginLeft: 15, marginRight: 15, borderRadius: 5, opacity: 0.5}}>
                  {this.state.hayEventosComensalActivos
                    ? <View style={{flex: 1}}>
                        {listaEventosComen}
                      </View>
                    : <Text style={{textAlign: 'left', marginTop: 5, marginLeft: 10, textTransform: 'uppercase', }}>No tienes eventos activos</Text>
                  }
                </View>
              </View>
              <View style={{flex: 0.5, alignItems: 'center'}}>
                <TouchableOpacity style={{alignItems: 'center', backgroundColor: '#979BD6', width: 355, height: 30, justifyContent: 'center', borderRadius: 5, borderColor: 'white', marginTop: 10}} onPress={() => navigation.goBack()}>
                  <Text style={{ color: "#FFF", fontWeight: "500" }}>Atras</Text>
                </TouchableOpacity>
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

export default PantallaEventosActivos