import React from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image} from 'react-native'
import BotonPersonal from '../AdministrarPantallas/BotonPersonal'
import { NavigationContext } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class PantallaAnadirPersona extends React.Component {
  static contextType = NavigationContext;
  state = {
    email: "",
    nombre: "",
    hayAmigos: true,
    datosAmigos: [],
    nombreEvento: "",
    dinero: ""
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
          const datosEvento = documentSnapshot.get('datosEventoNoCreado')
          Object.entries(datosEvento).map((valor) => {
            if(valor[0] == 'nombre'){
              console.log('valorNombre-----  ',valor[0])
              console.log('idNombre--------  ',valor[1])
              this.setState({nombreEvento: valor[1]})
              console.log('NombreEvento----  ',this.state.nombreEvento)
            }
            if(valor[0] == 'dinero'){
              console.log('valorDinero-----  ',valor[0])
              console.log('idDinero--------  ',valor[1])
              this.setState({dinero: valor[1]})
              console.log('DineroEvento----  ',this.state.dinero)
            }
          })
        }
      }
    })
  }
  handleEnviarPeticionEvento = () => {
    
  }
  handleCrearEvento = () => {
    firestore().collection('eventos')
  }
  render(){
    const navigation = this.context;
    const elimarEIrAEventosPrincipal = () => {
      firestore().collection('usuarios').doc(this.state.email).update({datosEventoNoCreado: firestore.FieldValue.delete()})
      navigation.navigate('EventosPrincipal')
    }
    const elimarEIrAPantallaPrincipal = () => {
      firestore().collection('usuarios').doc(this.state.email).update({datosEventoNoCreado: firestore.FieldValue.delete()})
      navigation.navigate('PantallaPrincipal')
    }
    if(this.state.hayAmigos){
      const listaAmigos = Object.values(this.state.datosAmigos).map((amigo) => {
        {console.log('  peticion listaPeticiones: ', amigo)}
        return(
          <View key={amigo} style={{/* backgroundColor: 'red',  */flex: 1, height: 50, flexDirection: 'row'}}>
            <View style={{/* backgroundColor: 'red', */ width:50,height: 50}}>
              <Image style={{width: 50, height: 50}} source={require('../imagenes/amigo.png')}></Image>
            </View>
            <View style={{/* backgroundColor: 'pink', */ height: 50,width: '80%', flexDirection: 'column'}}>
              <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize: 18,marginTop: 0, justifyContent: 'center' }}>{amigo}</Text>
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                firestore().collection('usuarios').doc(amigo).update({
                  peticionEventos: {
                    [Math.floor(Math.random() * 10000) + 1]: {
                      nombreEvento: (this.state.nombreEvento + "_" + this.state.email),
                      dinero: this.state.dinero
                    }
                  }
                }).then(() => {
                  console.log('peticion de envento enviada a: !'+ (this.state.nombreEvento + "_" + this.state.email));
                });
              }}>
                <Text style={{fontWeight: "500", color:"#E9446A"}}>Enviar peticion</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
        
      })
      return (
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
                <Text style={{marginHorizontal: 85}}>Pinchapp</Text>
              </View>
            </View>
          </View>
          <View style={{flex: 4, left: 20}}>
            <Text>Amigos</Text>
            <View style={{flex: 1,flexDirection: 'column', justifyContent: 'flex-start', marginTop: 20}}>
              {listaAmigos}
              <View style={{flex: 2}}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AnadirPersona')}>
                  <Text style={{ color: "#FFF", fontWeight: "500" }}>Crear evento</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={elimarEIrAEventosPrincipal} >
                  <Text style={{ color: "#FFF", fontWeight: "500" }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
        </View>
      )
    }else{
      return (
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
              <Text style={{marginHorizontal: 85}}>Pinchapp</Text>
            </View>
          </View>
        </View>
        <View style={{flex: 4, left: 20}}>
          <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
            <View style={{flex: 2, /* backgroundColor: 'red', */ left: 20}}>
              <Text>No hay amigos</Text>
            </View>
          </View>
        </View>
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
    width: 325,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  }
})

export default PantallaAnadirPersona