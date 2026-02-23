import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  processColor,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-charts-wrapper';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [chartData, setChartData] = useState({
    doacoes: [],               // [{ y: number }]
    meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    maisDoados: [],            // [{ value: number, label: string }]
    cestasMontadas: 0,
    metaCestas: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Iniciando requisição ao dashboard...');
        const response = await fetch('http://172.24.208.1:3000/api/dashboard');

        console.log('Status da resposta:', response.status);

        if (!response.ok) {
          throw new Error(`Erro do servidor: ${response.status}`);
        }

        const json = await response.json();
        console.log('Dados recebidos do backend:', json);

        // Preparar dados do BarChart
        let doacoes = [];
        if (Array.isArray(json.doacoesMensais)) {
          doacoes = json.doacoesMensais.map(valor => ({ y: Number(valor) || 0 }));
        }

        // Preparar maisDoados (aceita name ou label)
        let maisDoados = [];
        if (Array.isArray(json.maisDoados)) {
          maisDoados = json.maisDoados.map((item, index) => ({
            value: Number(item.value || item.quantidade || item.qtd || 0),
            label: item.label || item.name || item.produto || item.nome || `Item ${index + 1}`,
          }));
        }

        const meses = Array.isArray(json.meses)
          ? json.meses
          : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

        setChartData({
          doacoes,
          meses,
          maisDoados,
          cestasMontadas: Number(json.cestas?.montadas) || json.cestas?.totalDisponivel || 0,
          metaCestas: Number(json.cestas?.meta) || 100,
        });

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        setErro(error.message || 'Não foi possível carregar os dados');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color="#14532d" />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.errorText}>Erro ao carregar</Text>
        <Text style={styles.errorDetail}>{erro}</Text>
        <Text style={styles.errorHint}>
          Verifique se o backend está rodando{'\n'}
          IP: 172.24.208.1:3000
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setErro(null);
          }}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const semDados = chartData.maisDoados.length === 0;

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.screen}>
        {/* Logo */}
        <View style={styles.viewContImg}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Image source={require('../../assets/icons/logo1.png')} style={styles.img} />
          </TouchableOpacity>
        </View>

        {/* Gráfico de Barras */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Doações por mês</Text>
          <BarChart
            style={styles.barChart}
            data={{
              dataSets: [{
                label: 'Doações',
                values: chartData.doacoes.length > 0 ? chartData.doacoes : [{ y: 0 }],
                config: { color: processColor('#14532d') },
              }],
            }}
            xAxis={{
              valueFormatter: chartData.meses,
              granularityEnabled: true,
              granularity: 1,
              position: 'BOTTOM',
              textSize: 11,
              textColor: processColor('#fff'),
            }}
            yAxis={{ left: { enabled: false }, right: { enabled: true, textColor: processColor('#fff') } }}
            chartDescription={{ text: '' }}
            legend={{ enabled: false }}
            animation={{ durationX: 1200 }}
            touchEnabled={true}
          />
        </View>

        {/* PieChart centralizado - Produtos mais doados */}
        <View style={styles.pieCard}>
          <Text style={styles.cardTitle}>Produtos mais doados</Text>
          <PieChart
            style={styles.pieChart}
            data={{
              dataSets: [{
                values: semDados ? [{ value: 1, label: 'Sem dados' }] : chartData.maisDoados,
                label: 'Produtos',
                config: {
                  colors: [
                    processColor('#f87171'),
                    processColor('#facc15'),
                    processColor('#60a5fa'),
                    processColor('#34d399'),
                    processColor('#a78bfa'),
                    processColor('#fb923c'),
                  ],
                  valueTextSize: semDados ? 14 : 11,
                  valueTextColor: processColor('#000'),
                  selectionShift: 13,
                },
              }],
            }}
            legend={{ enabled: false }}
            chartDescription={{ text: '' }}
            entryLabelColor={processColor('#000')}
            entryLabelTextSize={11}
          />
          <View style={styles.dotRow}>
            <View style={[styles.dot, { backgroundColor: '#f87171' }]} />
            <View style={[styles.dot, { backgroundColor: '#facc15' }]} />
            <View style={[styles.dot, { backgroundColor: '#60a5fa' }]} />
            <View style={[styles.dot, { backgroundColor: '#34d399' }]} />
            <View style={[styles.dot, { backgroundColor: '#a78bfa' }]} />
            <View style={[styles.dot, { backgroundColor: '#fb923c' }]} />
          </View>
        </View>

        {/* Cards de cestas */}
        <View style={styles.largeCard}>
          <View style={styles.halfCardLeft}>
            <Text style={styles.label}>cestas montadas</Text>
            <Text style={styles.bigNumber}>{chartData.cestasMontadas}</Text>
          </View>
          <View style={styles.halfCardRight}>
            <Text style={styles.label}>meta de cestas</Text>
            <Text style={styles.bigNumber}>{chartData.metaCestas}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cestas')}>
          <Text style={styles.buttonText}>Fazer a cesta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f9fafb' },
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#14532d',
  },
  errorText: {
    fontSize: 20,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  errorDetail: {
    fontSize: 14,
    color: '#7f1d1d',
    marginTop: 8,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 13,
    color: '#991b1b',
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#14532d',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewContImg: {
    width: '90%',
    alignItems: 'center',
    marginVertical: 15,
  },
  img: {
    width: 220,
    height: 80,
    resizeMode: 'contain',
  },
  card: {
    width: '90%',
    backgroundColor: '#0d9488',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 5,
  },
  pieCard: {
    width: '90%',
    backgroundColor: '#0d9488',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  barChart: {
    height: 260,
    width: '100%',
  },
  pieChart: {
    width: 220,
    height: 220,
  },
  dotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    maxWidth: '80%',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    margin: 6,
  },
  largeCard: {
    width: '90%',
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 5,
  },
  halfCardLeft: {
    flex: 1,
    backgroundColor: '#14532d',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  halfCardRight: {
    flex: 1,
    backgroundColor: '#0d9488',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  bigNumber: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  button: {
    width: '90%',
    backgroundColor: '#14532d',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});