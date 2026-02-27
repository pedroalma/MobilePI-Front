import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-paper";
import Relatorios from "../Relatorios/index"; // ajuste o caminho se necessário

const Tab = createBottomTabNavigator();

const API_URL = "http://192.168.32.1:3000/api/produtos"; // seu IP local

// Função auxiliar para converter data "MM/AAAA" → "YYYY-MM-DD" (assume dia 01)
const formatValidade = (val) => {
  if (!val) return null;
  const [mm, yyyy] = val.split('/');
  if (!mm || !yyyy) return null;
  return `${yyyy}-${mm.padStart(2, '0')}-01`;
};

// Data de hoje em ISO (YYYY-MM-DD)
const getTodayISO = () => new Date().toISOString().split('T')[0];

function Cadastro() {
  const [descricao, setDescricao] = useState(null); // mudou de nomeProduto
  const [unidade, setUnidade] = useState("kg");
  const [quantidade, setQuantidade] = useState(""); // mudou de quantidadePorUnidade
  const [peso, setPeso] = useState("1");            // novo campo (obrigatório)
  const [validade, setValidade] = useState("");
  const [dataReceb, setDataReceb] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    setDataReceb(getTodayISO());
  }, []);

  const handleChangeValidade = (text) => {
    let digits = text.replace(/\D/g, "");
    if (digits.length > 2) {
      digits = digits.slice(0, 2) + "/" + digits.slice(2);
    }
    setValidade(digits.slice(0, 7));
  };

  const handleConfirm = async () => {
  if (!descricao || !quantidade || !peso || !validade) {
    Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
    return;
  }

  // Converte "MM/AAAA" para "YYYY-MM-DD" (assume dia 01)
  const formatValidade = (val) => {
    if (!val) return null;
    const [mm, yyyy] = val.split('/');
    if (!mm || !yyyy || mm.length !== 2 || yyyy.length !== 4) return null;
    return `${yyyy}-${mm}-01`;
  };

  const novoItem = {
  descricao: descricao.trim(),           // ex: "Arroz"
  quantidade: Number(quantidade) || 0,
  peso: Number(peso) || 1.000,
  unidade: unidade.toLowerCase(),        // ex: "kg"
  codBar: null,
  dataDeEntrada: getTodayISO(),
  dataDeValidade: formatValidade(validade), // ex: "2026-12-01"
  dataLimiteDeSaida: null,
  codUsu: 1,
  codOri: 1,
  codList: 1
};

  console.log("Dados enviados:", novoItem); // debug

  try {
    const response = await axios.post(API_URL, novoItem, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Sucesso:", response.data);
    Alert.alert("Sucesso", "Produto cadastrado!");

    navigation.navigate("Relatórios", { novoItem });

    // Limpa formulário
    setDescricao(null);
    setUnidade("kg");
    setQuantidade("");
    setPeso("1");
    setValidade("");
  } catch (error) {
  console.error("ERRO AXIOS COMPLETO:", error);
  console.error("RESPONSE DATA:", error.response?.data);
  console.error("RESPONSE STATUS:", error.response?.status);
  console.error("RESPONSE HEADERS:", error.response?.headers);

  let msg = "Erro ao cadastrar. Tente novamente.";
  if (error.response?.data?.message) {
    msg = error.response.data.message;
  } else if (error.response?.data?.erro) {
    msg = error.response.data.erro;
  } else if (error.message) {
    msg = error.message;
  }

  Alert.alert("Erro", msg);
}
};

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.centralizaitem}>
          <View style={styles.Pickerborder}>
            <Picker
              selectedValue={descricao}
              onValueChange={setDescricao}
              mode="dropdown"
            >
              <Picker.Item label="Nome do Produto" value={null} />
              <Picker.Item label="Arroz" value="Arroz" />
              <Picker.Item label="Feijão" value="Feijão" />
              <Picker.Item label="Macarrão" value="Macarrão" />
              <Picker.Item label="Açúcar" value="Açúcar" />
              <Picker.Item label="Café" value="Café" />
            </Picker>
          </View>

          <View style={styles.rowInputs}>
            <TextInput
              placeholder="Quantidade"
              style={styles.input}
              keyboardType="numeric"
              value={quantidade}
              onChangeText={(t) => setQuantidade(t.replace(/[^0-9.]/g, ""))}
            />

            <View style={styles.inputPicker}>
              <Picker selectedValue={unidade} onValueChange={setUnidade}>
                <Picker.Item label="g" value="g" />
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="ml" value="ml" />
                <Picker.Item label="L" value="L" />
              </Picker>
            </View>

            <TextInput
              placeholder="Peso (kg)"
              style={styles.input}
              keyboardType="numeric"
              value={peso}
              onChangeText={(t) => setPeso(t.replace(/[^0-9.]/g, ""))}
            />
          </View>

          <TextInput
            placeholder="Validade (MM/AAAA)"
            style={styles.inputFull}
            maxLength={7}
            keyboardType="numeric"
            value={validade}
            onChangeText={handleChangeValidade}
          />

          <TextInput
            style={styles.dtreceb}
            value={dataReceb}
            editable={false}
          />

          <TouchableOpacity style={styles.btnconfirm} onPress={handleConfirm}>
            <Text style={styles.txtbtnconfirm}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 80,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="Cadastro"
        component={Cadastro}
        options={{
          tabBarIcon: () => <Icon source="hospital-box" size={30} color="#215727" />,
        }}
      />
      <Tab.Screen
        name="Relatórios"
        component={Relatorios}
        options={{
          tabBarIcon: () => <Icon source="text-box" size={30} color="#215727" />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, top: 55 },
  centralizaitem: { alignItems: "center", padding: 15, gap: 15 },
  Pickerborder: {
    borderWidth: 2,
    borderColor: "#215727",
    borderRadius: 8,
    width: 340,
    overflow: "hidden",
  },
  rowInputs: { flexDirection: "row", flexWrap: "wrap", gap: 20, paddingLeft: 40 },
  input: { borderWidth: 2, borderColor: "#215727", width: 150, borderRadius: 8, padding: 8 },
  inputFull: { borderWidth: 2, borderColor: "#215727", width: 340, borderRadius: 8, padding: 8 },
  inputPicker: {
    borderWidth: 2,
    borderColor: "#215727",
    width: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  dtreceb: { borderWidth: 2, borderColor: "#215727", width: 340, height: 50, borderRadius: 8, padding: 10 },
  btnconfirm: {
    width: 340,
    height: 50,
    backgroundColor: "#215727",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  txtbtnconfirm: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});