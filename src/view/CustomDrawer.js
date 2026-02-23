import React from "react";
import { View, Text, StyleSheet ,TouchableOpacity} from "react-native";
import { DrawerContentScrollView,DrawerItemList } from "@react-navigation/drawer";
export default props =>{
    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
            <View>
            <Text style={styles.title}>Grupo Socorrista Francisco de Assis</Text>
            <Text style={styles.telefone}>gsfa@gfranciscodeassis.org.br</Text>
            </View>
            <DrawerItemList {...props}/>
            </DrawerContentScrollView>
        </View>
    );  
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    title:{ 
        fontSize:15,
        fontWeight:"bold",
        color:"#333"
    },
    telefone:{
        fontSize:15,
        color:"#666",
        marginBottom:20
    },
    button:{
        marginTop:10,
        marginBottom:20,
        padding:10,
        backgroundColor:"#4A90E2",
        borderRadius:5
    },
    buttonText:{
        color:"#FFF",
        fontSize:18
    }
});