// No topo do app.js
const { sequelize } = require('./models');  // ou só o sequelize se não usar index

// Antes do app.listen
sequelize.sync({ alter: true })   // cria/atualiza tabelas automaticamente (cuidado em produção!)
  .then(() => console.log('Tabelas sincronizadas'))
  .catch(err => console.error('Erro ao sincronizar tabelas:', err));
  
import React from "react";
import { SafeAreaView  } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";


import DrawerNav from "./navegacao/DrawerNav";


export default props =>{
    return(
        <SafeAreaView style={styles.container}>
            <NavigationContainer>
                <DrawerNav/>
            </NavigationContainer>
        </SafeAreaView> 
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    }
});

