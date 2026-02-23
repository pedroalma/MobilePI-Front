import React, { useState, useEffect } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import Relatorios from "../Relatorios cestas";
import { Icon } from "react-native-paper";
 
const Tab = createBottomTabNavigator();
 
const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};
 
function Cadastro() {
    const [selecionaComida, setSelecionaComida] = useState(null);
    const [produtosSelecionados, setProdutosSelecionados] = useState([]);
    const [descricao, setDescricao] = useState('');
    const [dataReceb, setDataReceb] = useState('');
   
    const navigation = useNavigation();
 
        useEffect(() => {
            setDataReceb(getTodayDate());
        }, []);
 
    const handleChange = (text, setter) => {
        let cleaned = text.replace(/\D/g, '');
        if (cleaned.length > 2 && cleaned.length <= 4) {
            cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        } else if (cleaned.length > 4) {
            cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
        }
        setter(cleaned.slice(0, 10));
    };
 
    const handleAdicionarProduto = () => {
        if (selecionaComida) {
            const novosProdutos = [...produtosSelecionados, selecionaComida];
            setProdutosSelecionados(novosProdutos);
            setDescricao(novosProdutos.join('\n'));
            setSelecionaComida(null);
        }
    };
 
    const handleConfirm = () => {
        if (produtosSelecionados.length === 0 || !descricao || !dataReceb) {
            alert("⚠️ Preencha todos os campos!");
            return;
        }
 
        const novoItem = [produtosSelecionados, descricao, dataReceb];
 
        navigation.navigate("Relatórios", { novoItem });
 
       
        setProdutosSelecionados([]);
        setDescricao('');
        setDataReceb('');
    };
 
    return (
        <View style={styles.container}>
            <View style={styles.centralizaitem}>
                <View style={styles.Pickerborder}>
                    <Picker
                        selectedValue={selecionaComida}
                        onValueChange={(itemValue) => setSelecionaComida(itemValue)}
                        mode="dropdown"
                        dropdownIconColor="#000"
                        style={styles.Picker}
                    >
                        <Picker.Item label="Nome do Produto" value={null} />
                        <Picker.Item label="Arroz" value="Arroz" />
                        <Picker.Item label="Feijão" value="Feijão" />
                        <Picker.Item label="Macarrão" value="Macarrão" />
                        <Picker.Item label="Açúcar" value="Açúcar" />
                        <Picker.Item label="Café" value="Café" />
                    </Picker>
                </View>
 
                <TouchableOpacity style={styles.btnadicionar} onPress={handleAdicionarProduto}>
                    <Text style={styles.txtbtnadicionar}>Adicionar Produto</Text>
                </TouchableOpacity>
 
                <TextInput
                    placeholder="Descrição"
                    style={styles.descricao}
                    multiline={true}
                    value={descricao}
                    onChangeText={setDescricao}
                />
 
                <TextInput
                    placeholder="Data de Saída"
                    style={styles.dtreceb}
                    maxLength={10}
                    keyboardType="numeric"
                    value={dataReceb}
                    editable={false}
                    onChangeText={(t) => handleChange(t, setDataReceb)}
                />
 
                <TouchableOpacity style={styles.btnconfirm} onPress={handleConfirm}>
                    <Text style={styles.txtbtnconfirm}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
 
export default function AppTabs() {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle:{
                backgroundColor:"#fff",
                width: "100%",
                height: 80,
                color: "#000",
                paddingTop:10
            }
        }}>
            <Tab.Screen name="Cadastro cestas" component={Cadastro} options={{
                tabBarIcon: ({ }) => (
                    <Icon source="hospital-box" size={30} color="#215727" />
                )
            }}/>
            <Tab.Screen name="Relatórios" component={Relatorios} options={{
                tabBarIcon: ({ }) => (
                    <Icon source="text-box" size={30} color="#215727" />
                )
            }}/>
        </Tab.Navigator>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 55,
    },
    input: {
        borderWidth: 2,
        borderColor: "#215727",
        width: 150,
        borderRadius: 8,
        padding: 5
    },
    descricao: {
        borderWidth: 2,
        borderColor: "#215727",
        width: 350,
        height: 150,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: "top",
        color: "#000"
    },
    dtreceb: {
        borderWidth: 2,
        borderColor: "#215727",
        width: 350,
        height: 50,
        borderRadius: 8,
        padding: 10,
        color: "#000"
    },
    Picker: {
        height: 50,
        width: 340,
        color: "#000"
    },
    Pickerborder: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#215727",
        borderRadius: 8
    },
    centralizaitem: {
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        gap: 10
    },
    btnconfirm: {
        width: 350,
        height: 50,
        backgroundColor: "#215727",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10
    },
    txtbtnconfirm: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    },
    btnadicionar: {
        width: 350,
        height: 50,
        backgroundColor: "#215727",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10
    },
    txtbtnadicionar: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    }
});