import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';

import Splash from "../components/Splash/Splash";
import Login from "../components/Login/Login";
import home from "../components/Home/home";
import Atividades from "../components/Atividades/Atividades";
import NossosHorarios from "../components/NossosHorarios";
import ReceberPro from "../components/Receber produtos/index";
import QuemSomos from "../components/QuemSomos/QuemSomos";
const Stack = createStackNavigator();

export default props => {
    return(
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                options={{ headerShown: false }}
                name="Splash" component={Splash} />
            <Stack.Screen 
            options={{ headerShown: false }}
            name="Login" component={Login}/>
            <Stack.Screen 
            options={{ headerShown: false }} 
            name="Home" component={home}/>
            <Stack.Screen name="Atividades" component={Atividades}/>
            <Stack.Screen name="Horarios" component={NossosHorarios}/>
            <Stack.Screen name="ReceberPro" component={ReceberPro}/>
            <Stack.Screen name="QuemSomos" component={QuemSomos}/>
        </Stack.Navigator>
    );
}