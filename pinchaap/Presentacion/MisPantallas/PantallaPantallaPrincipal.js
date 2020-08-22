import React from 'react'
import {View, Text, TouchableNativeFeedback, Image, Platform, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native'
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
      <ImageBackground style={{width: '100%', height: '100%'}} source={require('../imagenes/backgroundinicio.png')}>
        <View style={styles.container}>
          <View style={{flex: 0.4/*, backgroundColor: 'blue'*/}}>
            <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', width: '100%', height: '100%'}}>
              <View style={{width: '20%'/*, backgroundColor: 'pink'*/}}>
                <TouchableOpacity
                  style={{alignItems: "center",justifyContent: "center"}}
                  onPress={signOutUser}
                  background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                >
                    <Image style={{width: 50, height: 50}} source={require('../imagenes/logo_exit.png')} />
                </TouchableOpacity>
              </View>
              <View style={{width: '80%'/*, backgroundColor: 'green'*/}}>
                <Text style={{marginHorizontal: 85}}>Pinchapp</Text>
              </View>
            </View>
            
          </View>
          <View style={{flex: 4}}>
            <View style={{flex: 1}} >

              <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', /*backgroundColor: 'red',*/ width: '100%', height: '120%'}}>



                <View style={{/*backgroundColor: 'green',*/ flexDirection: 'column',width:"50%"}}>
                  <View /*style={{backgroundColor: 'pink'}}*/>
                    <TouchableOpacity
                      style={{alignItems: "center",justifyContent: "center"}}
                      onPress={() => navigation.navigate('EventosPrincipal')}
                      background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                        <Image style={{width: 120, height: 120}} source={require('../imagenes/logo_eventos.png')} />
                    </TouchableOpacity>
                  </View>
                  <Text style={{textAlign: 'center'}}>Evento</Text>
                </View>



                <View style={{/*backgroundColor: 'green', */flexDirection: 'column',width:"50%"}}>
                  <View /*style={{backgroundColor: 'pink'}}*/>
                    <TouchableOpacity
                      style={{alignItems: "center",justifyContent: "center"}}
                      onPress={() => navigation.navigate('Amigos')}
                      background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                        <Image style={{width: 120, height: 120}} source={require('../imagenes/logo_amigos.png')} />
                    </TouchableOpacity>
                  </View>
                  <Text style={{textAlign: 'center'}}>Amigos</Text>
                </View>



              </View>
            </View>

            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', position: 'relative', /*backgroundColor: 'red', */width: '100%', height: '70%'}}>



                

                <View style={{/*backgroundColor: 'green', */flexDirection: 'column',width:"50%"}}>
                  <View /*style={{backgroundColor: 'pink'}}*/>
                    <TouchableOpacity
                      style={{alignItems: "center",justifyContent: "center"}}
                      onPress={() => navigation.navigate('VerMapa')}
                      background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                        <Image style={{width: 120, height: 120}} source={require('../imagenes/logo_mapa.png')} />
                    </TouchableOpacity>
                  </View>
                  <Text style={{textAlign: 'center'}}>Mapa</Text>
                </View>


                <View style={{/*backgroundColor: 'green', */flexDirection: 'column',width:"50%"}}>
                  <View /*style={{backgroundColor: 'pink'}}*/>
                    <TouchableOpacity
                      style={{alignItems: "center",justifyContent: "center"}}
                      onPress={() => navigation.navigate('AnadirAmigo')}
                      background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
                    >
                        <Image style={{width: 120, height: 120}} source={require('../imagenes/logo_puntos.png')} />
                    </TouchableOpacity>
                  </View>
                  <Text style={{textAlign: 'center'}}>Peticiones</Text>
                </View>


                
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

export default PantallaPantallaPrincipal