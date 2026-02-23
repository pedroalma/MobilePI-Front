import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import estilo from '../../assets/estilo';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
export default () => {
  const navigation = useNavigation();
  return (

    <View style={styles.container}>
      <View style={styles.viewContImg}>
        <View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              
            }}
          >
            <Image
              source={require('../../assets/icons/logo1.png')}
              style={styles.img}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
        
          onPress={() => navigation.navigate('Login')}
        >
          <Icon name="user" size={40} color={'black'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.textH}></Text>
      <View>
        <View style={styles.viewCont}>
          <TouchableOpacity
            style={styles.BotaoN}
            onPress={() => navigation.navigate('Atividades')}
          >
            <Icon3 name="tasks" color={'black'} size={40} />
            <Text style={styles.textB}>Atividades</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.BotaoN}
            onPress={() => navigation.navigate('NossosHorarios')}
          >
            <Icon name="heartbeat" color={'black'} size={40} />
            <Text style={styles.textB}>Horários</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewCont}>
          <TouchableOpacity
            style={styles.BotaoN}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Icon1 name="bar-graph" color={'black'} size={40} />

            <Text style={styles.textB}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.BotaoN}
            onPress={() => navigation.navigate('QuemSomos')}
          >
            <Icon2 name="people-roof" color={'black'} size={40} />
            <Text style={styles.textB}>Quem Somos</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.viewCont}>
          <TouchableOpacity
            style={styles.BotaoN1}
            onPress={() => Linking.openURL('https://www.gfranciscodeassis.org.br/')}
          >
            <Text style={styles.textB}>Nossa localização</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: { 
    width: 150 * 1.4,
    height: 60 * 1.4,
    marginTop: 10,
    marginLeft: "25%",
    resizeMode: 'contain',
  },
  img2: {
    width: '100%',
    height: 200,
    marginTop: 10,
    resizeMode: 'cover',
  },
  textH: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  textH2: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 30,
    fontFamily: 'Roboto-Bold',
  },
  textB: {
    fontSize: 25,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  viewContImg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  viewCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BotaoN: {
    height: 160,
    width: '39%',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  BotaoN1: {
    height: 160,
    width: '81%',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 8,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
  
  },
  BotaoD: {
    height: 100,
    width: '81%',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
});
