import React, { useState, useCallback } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from "react-native";
import { Table, Row } from "react-native-table-component";
import { useFocusEffect, useRoute, useNavigation } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";

export default function Relatorios() {
  const route = useRoute();
  const navigation = useNavigation();

  const [tableData, setTableData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      // 🔒 trava a tela em modo retrato
      Orientation.lockToPortrait();

      if (route.params?.novoItem) {
        setTableData((prev) => [...prev, route.params.novoItem]);
        navigation.setParams({ novoItem: null });
      }

      // 🔓 libera orientação ao sair da tela
      return () => {
        Orientation.unlockAllOrientations();
      };
    }, [route.params, navigation])
  );

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditData([...tableData[index]]);
  };

  const saveEditing = () => {
    const newData = [...tableData];
    newData[editingIndex] = editData;
    setTableData(newData);
    setEditingIndex(null);
    setEditData([]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditData([]);
  };

  const deleteRow = (index) => {
    setTableData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1 }}>
        <Row
          data={["Produtos", "Descrição", "Data de Saída", "Ações"]}
          style={styles.head}
          textStyle={styles.text}
        />

        {tableData.map((row, index) => (
          <Row
            key={index}
            data={
              editingIndex === index
                ? [
                    <TextInput
                      style={styles.input}
                      value={Array.isArray(editData[0]) ? editData[0].join(", ") : ""}
                      onChangeText={(text) => {
                        const newEdit = [...editData];
                        newEdit[0] = text.split(", ");
                        setEditData(newEdit);
                      }}
                    />,
                    <TextInput
                      style={styles.input}
                      value={editData[1] || ""}
                      onChangeText={(text) => {
                        const newEdit = [...editData];
                        newEdit[1] = text;
                        setEditData(newEdit);
                      }}
                    />,
                    <TextInput
                      style={styles.input}
                      value={editData[2] || ""}
                      onChangeText={(text) => {
                        const newEdit = [...editData];
                        newEdit[2] = text;
                        setEditData(newEdit);
                      }}
                    />,
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity onPress={saveEditing} style={styles.button}>
                        <Text style={styles.buttonText}>Salvar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={cancelEditing} style={styles.button}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>,
                  ]
                : [
                    Array.isArray(row[0]) ? row[0].join(", ") : row[0],
                    row[1],
                    row[2],
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity onPress={() => startEditing(index)} style={styles.button}>
                        <Text style={styles.buttonText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteRow(index)} style={styles.button}>
                        <Text style={styles.buttonText}>Excluir</Text>
                      </TouchableOpacity>
                    </View>,
                  ]
            }
            textStyle={styles.text}
          />
        ))}
      </Table>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  text: {
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    margin: 2,
    flex: 1,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 5,
    margin: 2,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
