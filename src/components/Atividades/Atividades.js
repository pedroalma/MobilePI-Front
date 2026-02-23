import React, { useState, useMemo } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const atividadesData = [
  {
    id: '1',
    titulo: 'ODE AOS MORTOS (VIVOS)',
    texto:
      'Ode àqueles que se foram Ode àqueles que dizemos ter perdido A quem, por quê? Não há nenhuma resposta. Ode àqueles que se foram Ode àqueles que dizemos nos deixaram[…]',
    imagem: require('../../assets/icons/Atividades1.jpg'),
  },
  {
    id: '2',
    titulo: 'NOSSO CAMINHO',
    texto:
      'Segundo a Metafísica, cada sintoma traz uma mensagem para que a pessoa sinta, perceba e tome consciência de sua maneira de agir para que este sintoma melhore o seu corpo, isto porque, o nosso organismo possui um sistema de autorregularão que sabe o que é bom para nós em termos de atitudes e posturas mentais.…',
    imagem: require('../../assets/icons/Atividades2.jpg'),
  },
  {
    id: '3',
    titulo: 'PENSAMENTOS',
    texto:
      '“Cuidado com as voltas que o mundo dá. Hoje você lança as palavras, amanhã sente o efeito delas”. “O tempo deixa perguntas, mostra respostas, esclarece dúvidas, mas, acima de tudo, o tempo traz verdades” “Transformar um medo em curiosidade é um dom”. C.R. “Planto amor para reflorestar o mundo”. B.M. “Acrescente em sua vida sal,…',
    imagem: require('../../assets/icons/Atividades3.jpg'),
  },
  {
    id: '4',
    titulo: 'JESUS E A PARÁBOLA DOS LAVRADORES MAUS OU DOS RENDEIROS INFIÉIS',
    texto:
      'Jesus estava no templo em Jerusalém, antes da Páscoa, aquela em que ele seria preso e morto, pregando para a população, quando alguns Sacerdotes e Anciãos, para provocá-lo, questionaram: – Com que autoridade você faz essas coisas? Quem lhe deu essa autoridade? – Eu também vou fazer uma pergunta – disse Jesus – e se…',
    imagem: require('../../assets/icons/Atividades4.jpg'),
  },
  {
    id: '5',
    titulo: 'MÃE – MARIA DE JESUS',
    texto:
      'Mãe, Maria do Filho do Criador Mãe, Maria de Todos os Filhos do Criador Olha Nossas imperfeições Olha Nossos Erros e Tropeços E Nos Ergue em Teu Coração. Mãe, Maria dos Pobres Abandonados Mãe, Maria dos Corações Aflitos Mãe, Maria dos Homens Cheios de Angústia Olha e nos Ergue Todos em Teu Coração. Mãe, Maria…',
    imagem: require('../../assets/icons/Atividades5.jpg'),
  },
  {
    id: '6',
    titulo: 'JESUS E A PARÁBOLA DO TESOURO ESCONDIDO',
    texto: 'JESUS E A PARÁBOLA DO TESOURO ESCONDIDO',
    imagem: require('../../assets/icons/Atividades6.jpg'),
  },
];
 
const LINK_FIXO = 'https://www.gfranciscodeassis.org.br/blog-2/#page-content';
 
export default function Atividades() {
  const navigation = useNavigation();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [searchText, setSearchText] = useState('');
 
  const atividadesFiltradas = useMemo(() => {
    if (!searchText) {
      return atividadesData;
    }
    const termo = searchText.toLowerCase();
    return atividadesData.filter(
      atividade =>
        atividade.titulo.toLowerCase().includes(termo) ||
        atividade.texto.toLowerCase().includes(termo),
    );
  }, [searchText]);
 
 
  const itensPorPagina = 4;
  const totalPaginas = Math.ceil(atividadesFiltradas.length / itensPorPagina);
 
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const atividadesPagina = atividadesFiltradas.slice(inicio, fim);
 
  const mudarPagina = novaPagina => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };
 
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [searchText]);
 
  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image style={styles.cardImage} source={item.imagem} />
      <View style={styles.cardTextContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardText} numberOfLines={3}>
          {item.texto}
        </Text>
        <TouchableOpacity
          style={styles.readMoreBtn}
          onPress={() => Linking.openURL(LINK_FIXO)}
        >
          <Text style={styles.readMoreTxt}>Ler mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoButton} 
         onPress={() => navigation.navigate('Home')}
        >
          <Image
            source={require('../../assets/icons/logo.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Pesquisar..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#A0A0A0"
        />
      </View>
 
      {atividadesFiltradas.length === 0 && searchText.length > 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Nenhuma atividade encontrada para "{searchText}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={atividadesPagina}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.flatListContent}
 
          ListFooterComponent={() => (
            <View style={styles.pagination}>
              <TouchableOpacity
                onPress={() => mudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
              >
                <Text
                  style={[styles.pageBtn, paginaAtual === 1 && styles.disabled]}
                >
                  ◀
                </Text>
              </TouchableOpacity>
 
              <Text style={styles.pageText}>
                {paginaAtual} / {totalPaginas}
              </Text>
 
              <TouchableOpacity
                onPress={() => mudarPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
              >
                <Text
                  style={[
                    styles.pageBtn,
                    paginaAtual === totalPaginas && styles.disabled,
                  ]}
                >
                  ▶
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height:100
  },
  logoButton: {
    paddingRight: 10,
  },
  logo: {
    width: 70,
    height: 60,
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#388E3C',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    alignSelf:"center",
    width:"70%",
    marginTop:10
  },
  flatListContent: {
    paddingVertical: 15,
    paddingBottom: 50,
  },
  cardContainer: {
    width: '90%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 10,
    backgroundColor: '#fff',
    alignSelf: 'center',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
  },
  cardTextContent: {
    padding: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
    fontFamily:"Roboto-Bold"
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
    fontFamily:"Roboto-Bold"
  },
  readMoreBtn: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginTop: 8,
  },
  readMoreTxt: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginBottom: 10,
    width: '100%',
  },
  pageBtn: {
    fontSize: 20,
    color: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontWeight: 'bold',
  },
  pageText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
  },
  disabled: {
    opacity: 0.4,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});