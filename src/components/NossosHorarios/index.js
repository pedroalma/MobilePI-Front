import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
 
export default props => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.viewContImg}>
        <View >
          <TouchableOpacity 
          
            onPress={() => navigation.navigate('Home')}
          >
            <Image
              source={require('../../assets/icons/logo1.png')}
              style={styles.logo}
              
            />
          </TouchableOpacity>
        </View>
      </View>
 
      <View style={{ alignItems: 'center', margin: 40 }}>
        <Text variant="headlineSmall" style={styles.titulo}>
          Nossos Horários
        </Text>
 
        {/* Segunda-feira */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="titleMedium" style={styles.dia}>
              Segunda-feira
            </Text>
            <Text style={styles.atividade}>19:45 - Palestra Pública</Text>
            <Text style={styles.atividade}>Assistência Espiritual</Text>
          </Card.Content>
        </Card>
 
        {/* Terça-feira */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="titleMedium" style={styles.dia}>
              Terça-feira
            </Text>
            <Text style={styles.atividade}>
              14:45 h - Gestantes e Crianças (até 7 anos)
            </Text>
            <Text style={styles.atividade}>19:45 h - Palestra Pública</Text>
            <Text style={styles.atividade}>Assistência Espiritual</Text>
          </Card.Content>
        </Card>
 
        {/* Quarta-feira */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="titleMedium" style={styles.dia}>
              Quarta-feira
            </Text>
            <Text style={styles.atividade}>14:00 h - Escola de Aprendizes</Text>
            <Text style={styles.atividade}>19:30 h - Escola de Aprendizes</Text>
          </Card.Content>
        </Card>
 
        {/* Quinta-feira */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="titleMedium" style={styles.dia}>
              Quinta-feira
            </Text>
            <Text style={styles.atividade}>
              14:45 h - Palestra Pública Ética e Moral Cristã
            </Text>
            <Text style={styles.atividade}>
              19:15 h - Atividades da Juventude (de 8 a 18 anos)
            </Text>
            <Text style={styles.atividade}>Assistência Espiritual</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  viewContImg: {
    justifyContent:'center', 
    alignItems:'center',
  },
  logo: {
    width: 150,
    height: 50,
    marginTop: 10,
  },
  titulo: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2F3E2F',
  },
  card: {
    width: '90%',
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#215727',
    backgroundColor: '#fff',
    elevation: 2,
  },
  dia: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2F3E2F',
  },
  atividade: {
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    marginVertical: 2,
    color: '#444',
  },
});