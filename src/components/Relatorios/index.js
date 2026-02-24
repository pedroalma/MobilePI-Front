import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { Table, Row } from "react-native-table-component";
import { useFocusEffect, useRoute, useNavigation } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import moment from 'moment-timezone';
import axios from 'axios';

export default function Relatorios() {
  const route = useRoute();
  const navigation = useNavigation();

  const [tableData, setTableData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState([]);

  const widthArr = [100, 110, 100, 110, 130, 110, 150];

  const API_URL = 'http://192.168.0.106:3000/api/produtos';

  const getTurno = () => {
    const agora = moment().tz('America/Sao_Paulo');
    const hora = agora.hours();
    const minutos = agora.minutes();
    const minutosTotais = hora * 60 + minutos;

    if (minutosTotais >= 8 * 60 && minutosTotais < 12 * 60) return "Manhã";
    if (minutosTotais >= 12 * 60 && minutosTotais < 16 * 60) return "Tarde";
    if (minutosTotais >= 16 * 60 && minutosTotais < 19 * 60) return "Noite";
    return "Fora do horário";
  };

  useEffect(() => {
    if (tableData.length > 0) {
      const turnoCorreto = getTurno();
      setTableData(prev =>
        prev.map(row => {
          const novaRow = [...row];
          novaRow[5] = turnoCorreto;
          return novaRow;
        })
      );
    }
  }, []);

  const formatarData = (data) => {
    if (!data) return new Date().toLocaleDateString("pt-BR");
    try {
      const d = new Date(data);
      if (!isNaN(d)) return d.toLocaleDateString("pt-BR");
    } catch {}
    return data;
  };

  const turnoAtual = getTurno();

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToLandscape();

      if (route.params?.novoItem) {
        const item = route.params.novoItem;

        console.log("[DEBUG] Novo item recebido:", JSON.stringify(item, null, 2));
        console.log("[DEBUG] ID recebido:", item.id || item._id || "SEM ID");

        const novaLinha = [
          item.nomeProduto || "—",
          `${item.quantidadePorUnidade || 0} ${item.unidade || "kg"}`,
          item.quantidadeDePacotes || 0,
          item.validade || "—",
          formatarData(item.dataRecebimento || item.dataReceb),
          turnoAtual,
          item.id || item._id || "", // ID no índice 6
        ];

        setTableData((prev) => [...prev, novaLinha]);
        navigation.setParams({ novoItem: null });
      }

      return () => {
        Orientation.lockToPortrait();
      };
    }, [route.params, navigation, turnoAtual])
  );

  const startEditing = (i) => {
    setEditingIndex(i);
    setEditData([...tableData[i]]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditData([]);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;

    const editedRow = editData;
    const id = editedRow[6];

    if (!id) {
      Alert.alert("Erro", "ID do produto não encontrado.");
      return;
    }

    const updatedData = {
      nomeProduto: editedRow[0],
      quantidadePorUnidade: parseFloat(editedRow[1].split(" ")[0]) || 0,
      unidade: editedRow[1].split(" ")[1] || "kg",
      quantidadeDePacotes: Number(editedRow[2]),
      validade: editedRow[3],
      dataRecebimento: editedRow[4],
    };

    try {
      console.log("[PUT] Atualizando ID:", id, "Dados:", updatedData);
      await axios.put(`${API_URL}/${id}`, updatedData);

      setTableData(prev => {
        const novaTabela = [...prev];
        novaTabela[editingIndex] = [...editedRow];
        return novaTabela;
      });

      Alert.alert("Sucesso", "Item atualizado!");
    } catch (error) {
      console.error("[PUT ERRO]:", error.response?.data || error.message);
      Alert.alert("Erro", "Falha ao atualizar.");
    }

    setEditingIndex(null);
    setEditData([]);
  };

  const handleDelete = (index) => {
    Alert.alert(
      "Excluir",
      "Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const id = tableData[index][6];

            if (!id) {
              Alert.alert("Erro", "ID não encontrado.");
              return;
            }

            try {
              await axios.delete(`${API_URL}/${id}`);

              setTableData(prev => prev.filter((_, i) => i !== index));
              Alert.alert("Sucesso", "Item excluído!");
            } catch (error) {
              console.error("Erro DELETE:", error.response?.data || error.message);
              Alert.alert("Erro", "Falha ao excluir.");
            }
          }
        }
      ]
    );
  };

  const gerarPDF = async () => {
    if (tableData.length === 0) return Alert.alert("Erro", "Sem dados.");

    const htmlContent = `
      <html>
        <body>
          <h1>Relatório de Doações</h1>
          <table border="1" style="width:100%; border-collapse:collapse;">
            <tr>
              <th>Produto</th><th>Peso</th><th>Quantidade</th><th>Validade</th><th>Recebimento</th><th>Turno</th>
            </tr>
            ${tableData.map(row => `
              <tr>
                <td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td><td>${row[5]}</td>
              </tr>
            `).join("")}
          </table>
        </body>
      </html>
    `;

    try {
      const file = await RNHTMLtoPDF.convert({ html: htmlContent, fileName: "Relatorio", directory: "Documents" });
      await FileViewer.open(file.filePath);
    } catch (error) {
      Alert.alert("Erro PDF", error.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ScrollView horizontal>
          <View>
            <Table borderStyle={{ borderWidth: 1 }}>
              <Row
                data={["Produto", "Peso", "Quantidade", "Validade", "Recebimento", "Turno", "Ações"]}
                widthArr={widthArr}
                style={styles.head}
                textStyle={[styles.textHead, { padding: 0, margin: 0 }]}
              />
            </Table>

            <ScrollView style={{ marginTop: -1 }}>
              <Table borderStyle={{ borderWidth: 1 }}>
                {tableData.map((row, index) => (
                  <Row
                    key={index}
                    widthArr={widthArr}
                    style={styles.row}
                    textStyle={[styles.text, { padding: 0, margin: 0 }]}
                    data={
                      editingIndex === index
                        ? [
                            ...editData.map((cell, i) =>
                              i === 5 ? (
                                <Text key={i} style={{ padding: 0, margin: 0 }}>
                                  {cell}
                                </Text>
                              ) : (
                                <TextInput
                                  key={i}
                                  style={[styles.input, { padding: 0, margin: 0 }]}
                                  value={String(cell)}
                                  onChangeText={(t) => {
                                    const d = [...editData];
                                    d[i] = t;
                                    setEditData(d);
                                  }}
                                />
                              )
                            ),
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity onPress={handleSaveEdit} style={styles.btnSalvar}>
                                <Text style={styles.btnText}>✔</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={cancelEditing} style={styles.btnCancelar}>
                                <Text style={styles.btnText}>✖</Text>
                              </TouchableOpacity>
                            </View>,
                          ]
                        : [
                            ...row.map((cell, i) => (
                              <Text key={i} style={{ padding: 0, margin: 0, textAlign: "center" }}>
                                {String(cell)}
                              </Text>
                            )),
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity onPress={() => startEditing(index)} style={styles.btnEditar}>
                                <Text style={styles.btnText}>Editar</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => handleDelete(index)} style={styles.btnExcluir}>
                                <Text style={styles.btnText}>Excluir</Text>
                              </TouchableOpacity>
                            </View>,
                          ]
                    }
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.pdfButton} onPress={gerarPDF}>
          <Text style={styles.pdfText}>📄 Gerar PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  head: { height: 50, backgroundColor: "#c1f0c1" },
  textHead: { 
    textAlign: "center", 
    fontWeight: "bold",
    fontSize: 13,
    padding: 0,
    margin: 0,
  },
  row: { 
    minHeight: 45, 
    backgroundColor: "#fff",
    padding: 0,
  },
  text: { 
    textAlign: "center", 
    margin: 0,
    padding: 0,
    fontSize: 13,
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#007bff", 
    width: "100%", 
    textAlign: "center", 
    height: 40,
    padding: 0,
    margin: 0,
    fontSize: 13,
  },
  buttonContainer: { 
    flexDirection: "row", 
    justifyContent: "center",
    padding: 0,
    margin: 0,
  },
  btnEditar: { 
    backgroundColor: "#007bff", 
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 4,
    borderRadius: 4,
  },
  btnExcluir: { 
    backgroundColor: "#dc3545", 
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  btnSalvar: { 
    backgroundColor: "#28a745", 
    padding: 6,
    marginRight: 4,
    borderRadius: 4,
  },
  btnCancelar: { 
    backgroundColor: "#dc3545", 
    padding: 6,
    borderRadius: 4,
  },
  btnText: { 
    color: "#fff", 
    fontSize: 12,
    padding: 0,
    margin: 0,
  },
  pdfButton: { 
    marginTop: 15, 
    backgroundColor: "#215727", 
    padding: 15, 
    borderRadius: 10, 
    alignItems: "center" 
  },
  pdfText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});