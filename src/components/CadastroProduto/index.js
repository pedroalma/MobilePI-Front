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

const API_URL = "http://172.28.176.1:3000/api/produtos";

const getTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

function Cadastro() {
  const [nomeProduto, setNomeProduto] = useState(null);
  const [unidade, setUnidade] = useState("kg");
  const [quantidadePorUnidade, setQuantidadePorUnidade] = useState("");
  const [quantidadeDePacotes, setQuantidadeDePacotes] = useState("1");
  const [validade, setValidade] = useState("");
  const [dataReceb, setDataReceb] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    setDataReceb(getTodayDate());
  }, []);

  const handleChangeValidade = (text) => {
    let digits = text.replace(/\D/g, "");
    if (digits.length > 2) {
      digits = digits.slice(0, 2) + "/" + digits.slice(2);
    }
    setValidade(digits.slice(0, 7));
  };

  const handleConfirm = async () => {
    if (
      !nomeProduto ||
      !quantidadePorUnidade ||
      !quantidadeDePacotes ||
      !validade
    ) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
      return;
    }

    const novoItem = {
      nomeProduto,
      unidade,
      quantidadePorUnidade: Number(quantidadePorUnidade),
      quantidadeDePacotes: Number(quantidadeDePacotes),
      validade,
      dataRecebimento: dataReceb,
    };

    try {
      const response = await axios.post(API_URL, novoItem, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Produto criado com sucesso:", JSON.stringify(response.data, null, 2));

    // Tenta pegar o ID de várias formas comuns
    const created = response.data;
    const id = 
      created.id || 
      created._id || 
      created.produto?.id || 
      created.produto?._id || 
      created.data?.id || 
      created.data?._id;

    if (!id) {
      console.warn("Nenhum ID encontrado no response!");
      Alert.alert("Aviso", "Produto cadastrado, mas ID não retornado. Edição pode falhar.");
    } else {
      console.log("ID encontrado:", id);
    }

    const itemParaRelatorios = {
      ...novoItem,
      id: id || "", // se não tiver ID, envia vazio (vai dar o alerta na edição)
    };

    Alert.alert("Sucesso", "Produto cadastrado!");

      navigation.navigate("Relatórios", { novoItem: itemParaRelatorios });

      setNomeProduto(null);
      setUnidade("kg");
      setQuantidadePorUnidade("");
      setQuantidadeDePacotes("1");
      setValidade("");
      setDataReceb(getTodayDate());
    } catch (error) {
      console.error("Erro ao cadastrar:", error.message);
      if (error.response) console.log("Erro do servidor:", error.response.data);
      Alert.alert("Erro", "Falha ao cadastrar.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.centralizaitem}>
          <View style={styles.Pickerborder}>
            <Picker
              selectedValue={nomeProduto}
              onValueChange={setNomeProduto}
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
              placeholder="Peso"
              style={styles.input}
              keyboardType="numeric"
              value={quantidadePorUnidade}
              onChangeText={(t) => setQuantidadePorUnidade(t.replace(/[^0-9.]/g, ""))}
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
              placeholder="Nº de pacotes"
              style={styles.input}
              keyboardType="numeric"
              value={quantidadeDePacotes}
              onChangeText={(t) => setQuantidadeDePacotes(t.replace(/\D/g, ""))}
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