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

