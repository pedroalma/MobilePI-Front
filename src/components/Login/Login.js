import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  ScrollView
} from "react-native";

export default ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const validarLogin = () => {
    if (email.trim() === "senac" && senha.trim() === "senac") {
      navigation.navigate("Cadastro");
    } else {
      Alert.alert("E-mail ou senha inválidos!");
      setEmail("");
      setSenha("");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={styles.container}>
      <Image
        style={styles.imgLogo}
        source={require("../../assets/icons/logo.png")}
      />

      <Text style={styles.txtTitulo}>Login</Text>

      <View style={styles.boxInput}>
        <TextInput
          style={styles.input}
          placeholder="Insira seu e-mail:"
          maxLength={100}
          placeholderTextColor="#1D2D2E"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Insira sua senha:"
          maxLength={12}
          secureTextEntry={!mostrarSenha}
          placeholderTextColor="#1D2D2E"
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          onPress={() => setMostrarSenha(!mostrarSenha)}
          style={styles.toggleSenha}
        >
          <Text style={styles.toggleTxt}>
            {mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={validarLogin}>
          <Text style={styles.txtButton}>Acessar</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  imgLogo: {
    width: 170,
    height: 150,
    alignSelf: "center",
    marginBottom: 18,
  },

  txtTitulo: {
    fontSize: 35,
    color: "#000",
    fontFamily: "Roboto-Bold",
    padding: 30,
  },

  boxInput: {
    paddingVertical: 34,
    paddingHorizontal: 14,
  },

  input: {
    width: 300,
    height: 50,
    color: "black",
    backgroundColor: "#fff",
    marginBottom: 12,
    borderColor: "#000000a4",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 8,
  },

  toggleSenha: {
    alignSelf: "flex-end",
    marginRight: 10,
    marginBottom: 10,
  },

  toggleTxt: {
    color: "#007AFF",
    fontWeight: "600",
  },

  button: {
    width: 300,
    height: 40,
    backgroundColor: "#3fffa3",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  txtButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#101026",
  },
});
