import React from 'react'
import {View, Text, TouchableNativeFeedback, Image, Platform, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaPagar extends React.Component {
  static contextType = NavigationContext;
  state = {
    idEvento: "",
    email: "",
    dinero: "",
    datosConfirmados: {},
    admin: false,
    nombreEvento: ""
  }
  componentDidMount(){
    const {email} = auth().currentUser
    this.setState({email})
    const idEvento = this.props.route.params.idEvento
    this.setState({idEvento: idEvento})
    firestore().collection('eventos').doc(idEvento).get().then(documentSnapshot => {
      this.setState({dinero: documentSnapshot.get('dinero')})
      this.setState({datosConfirmados: documentSnapshot.get('confirmados')})
      this.setState({nombreEvento: documentSnapshot.get('nombreEvento')})
    })
    this.setState({admin: this.props.route.params.admin})
  }
  /* componentWillUnmount(){
    auth().signOut().then(() => console.log('User signed out!'));
    firestore().collection('usuarios').doc(this.state.email).get().then(documentSnapshot => {
      firestore().collection('usuarios').doc(this.state.email).update({conectado: false}).then(console.log('User updated!'))
    })
  } */
  render(){
    const navigation = this.context;
    const salirDeEvento = () => {
      this.handleEliminarComensal()
      navigation.navigate('EventosActivos')
    }
    const eliminarEvento = () => {
      this.handleEliminarEvento()
      navigation.navigate('EventosActivos')
    }
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
            <View style={{flex: 8}}>
              <View style={{flex: 1}}>
                <Text 
                  style={{marginLeft: 10, 
                    color: '#000', 
                    fontSize: 20, 
                    textTransform: 'uppercase', 
                    marginTop: 10,
                    backgroundColor: '#979BD6', 
                    marginRight: 10, 
                    borderRadius: 5, 
                    color: '#000', 
                    opacity: 0.6
                  }}
                >{this.state.nombreEvento}</Text>
              </View>
              <View style={{flex: 3}}>
                <View 
                  style={{flex: 1, 
                  backgroundColor: '#979BD6',
                  borderRadius: 200,
                  marginLeft:'10%', 
                  marginRight:'10%',
                  justifyContent: 'center', 
                  opacity: 0.8}}
                >
                  <Text style={{textAlign: 'center', color: '#535473', fontSize: 60}}>{this.state.dinero}€</Text>
                </View>
              </View>
                <View style={{flex: 1, alignItems: 'center', marginTop: 5}}>
                  <TouchableOpacity style={{
                    alignItems: 'center', 
                    backgroundColor: '#535473', 
                    width: 180, 
                    height: 50, 
                    justifyContent: 'center', 
                    borderRadius: 5, 
                    borderColor: 'white', 
                    marginTop: 20}} onPress={() => navigation.goBack()}>
                    <Text style={{ color: "#FFF", fontWeight: "500" }}>Atras</Text>
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

export default PantallaPagar