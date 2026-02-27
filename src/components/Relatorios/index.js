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
import moment from "moment-timezone";
import axios from "axios";

export default function Relatorios() {
  const route = useRoute();
  const navigation = useNavigation();

  const [tableData, setTableData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState([]);

  // Larguras ajustadas para 8 colunas visíveis + ações
  const widthArr = [90, 100, 90, 100, 160, 100, 100, 140];

  const API_URL = "http://192.168.32.1:3000/api/produtos";

  const getTurno = () => {
    const agora = moment().tz("America/Sao_Paulo");
    const hora = agora.hours();
    const minutos = agora.minutes();
    const total = hora * 60 + minutos;

    if (total >= 8 * 60 && total < 12 * 60) return "Manhã";
    if (total >= 12 * 60 && total < 16 * 60) return "Tarde";
    if (total >= 16 * 60 && total < 19 * 60) return "Noite";
    return "Fora do horário";
  };

  const turnoAtual = getTurno();

  const formatarData = (data) => {
    if (!data) return new Date().toLocaleDateString("pt-BR");
    try {
      const d = new Date(data);
      if (!isNaN(d)) return d.toLocaleDateString("pt-BR");
    } catch {}
    return data;
  };

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToLandscape();

      if (route.params?.novoItem) {
        const item = route.params.novoItem;

        const novaLinha = [
          item.nomeProduto || "—",
          `${item.quantidadePorUnidade || 0} ${item.unidade || "kg"}`,
          item.quantidadeDePacotes || 0,
          item.validade || "—",
          item.descricao || "—",
          formatarData(item.dataRecebimento || item.dataReceb),
          turnoAtual,
          item.id || item._id || "", // ID no índice 7
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
    setEditData([...tableData[i]]); // Copia TODA a linha, incluindo ID no final
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditData([]);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;

    // Pega o ID da linha ORIGINAL (não alterada pela edição)
    const id = tableData[editingIndex][7];

    if (!id) {
      Alert.alert("Erro", "ID do produto não encontrado.");
      return;
    }

    const editedRow = editData;

    const updatedData = {
      nomeProduto: editedRow[0] || "",
      quantidadePorUnidade: parseFloat(editedRow[1]?.split(" ")[0] || "0") || 0,
      unidade: editedRow[1]?.split(" ")[1] || "kg",
      quantidadeDePacotes: Number(editedRow[2]) || 0,
      validade: editedRow[3] || "",
      descricao: editedRow[4] || "",
      dataRecebimento: editedRow[5] || "",
    };

    try {
      console.log("[PUT] Enviando para ID:", id);
      console.log("[PUT] Dados:", updatedData);

      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      console.log("[PUT] Sucesso - Status:", response.status);

      // Atualiza a tabela com os valores editados (mantém ID)
      setTableData((prev) => {
        const novaTabela = [...prev];
        novaTabela[editingIndex] = [...editedRow];
        return novaTabela;
      });

      Alert.alert("Sucesso", "Item atualizado!");
    } catch (error) {
      console.error("[PUT] Erro:", error?.response?.data || error.message);
      Alert.alert("Erro", "Falha ao atualizar. Verifique o console.");
    }

    setEditingIndex(null);
    setEditData([]);
  };

  const handleDelete = (index) => {
    Alert.alert("Excluir", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const id = tableData[index][7];

          if (!id) return Alert.alert("Erro", "ID não encontrado.");

          try {
            await axios.delete(`${API_URL}/${id}`);
            setTableData((prev) => prev.filter((_, i) => i !== index));
            Alert.alert("Sucesso", "Item excluído!");
          } catch (error) {
            console.error("[DELETE] Erro:", error?.response?.data || error.message);
            Alert.alert("Erro", "Falha ao excluir.");
          }
        },
      },
    ]);
  };

  const gerarPDF = async () => {
    if (tableData.length === 0)
      return Alert.alert("Erro", "Sem dados para gerar PDF.");

    const htmlContent = `
      <html>
        <body>
          <h1>Relatório de Doações</h1>
          <table border="1" style="width:100%; border-collapse:collapse;">
            <tr>
              <th>Produto</th>
              <th>Peso</th>
              <th>Quantidade</th>
              <th>Validade</th>
              <th>Descrição</th>
              <th>Recebimento</th>
              <th>Turno</th>
            </tr>
            ${tableData
              .map(
                (row) => `
              <tr>
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
                <td>${row[4]}</td>
                <td>${row[5]}</td>
                <td>${row[6]}</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </body>
      </html>
    `;

    try {
      const file = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: "Relatorio",
        directory: "Documents",
      });

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
                data={[
                  "Produto",
                  "Peso",
                  "Quantidade",
                  "Validade",
                  "Descrição",
                  "Recebimento",
                  "Turno",
                  "Ações",
                ]}
                widthArr={widthArr}
                style={styles.head}
                textStyle={styles.textHead}
              />
            </Table>

            <ScrollView style={{ marginTop: -1 }}>
              <Table borderStyle={{ borderWidth: 1 }}>
                {tableData.map((row, index) => {
                  const isEditing = editingIndex === index;

                  return (
                    <Row
                      key={index}
                      widthArr={widthArr}
                      style={styles.row}
                      textStyle={styles.text}
                      data={
                        isEditing
                          ? [
                              ...editData.slice(0, 6).map((cell, i) => (
                                <TextInput
                                  key={i}
                                  style={styles.input}
                                  value={String(cell ?? "")}
                                  onChangeText={(t) => {
                                    const d = [...editData];
                                    d[i] = t;
                                    setEditData(d);
                                  }}
                                  keyboardType={
                                    i === 1 || i === 2 ? "numeric" : "default"
                                  }
                                />
                              )),
                              <Text style={{ textAlign: "center", color: "#555", padding: 6 }}>
                                {editData[6]} {/* Turno fixo */}
                              </Text>,
                              <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                  onPress={handleSaveEdit}
                                  style={styles.btnSalvar}
                                >
                                  <Text style={styles.btnText}>Salvar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={cancelEditing}
                                  style={styles.btnCancelar}
                                >
                                  <Text style={styles.btnText}>Cancelar</Text>
                                </TouchableOpacity>
                              </View>,
                            ]
                          : [
                              ...row.slice(0, 7).map((cell) => String(cell)),
                              <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                  onPress={() => startEditing(index)}
                                  style={styles.btnEditar}
                                >
                                  <Text style={styles.btnText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleDelete(index)}
                                  style={styles.btnExcluir}
                                >
                                  <Text style={styles.btnText}>Excluir</Text>
                                </TouchableOpacity>
                              </View>,
                            ]
                      }
                    />
                  );
                })}
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
  textHead: { textAlign: "center", fontWeight: "bold", fontSize: 13 },
  row: { minHeight: 45, backgroundColor: "#fff" },
  text: { textAlign: "center", margin: 6, fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: "#007bff",
    width: "95%",
    textAlign: "center",
    height: 35,
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  btnEditar: {
    backgroundColor: "#007bff",
    padding: 6,
    marginRight: 6,
    borderRadius: 4,
  },
  btnExcluir: {
    backgroundColor: "#dc3545",
    padding: 6,
    borderRadius: 4,
  },
  btnSalvar: {
    backgroundColor: "#28a745",
    padding: 8,
    marginRight: 8,
    borderRadius: 6,
  },
  btnCancelar: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 6,
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  pdfButton: {
    marginTop: 15,
    backgroundColor: "#215727",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  pdfText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});