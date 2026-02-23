import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";


const Drawer = createDrawerNavigator();

import CustomDrawer from "../view/CustomDrawer";
import Home from "../components/Home/home";
import Splash from "../components/Splash/Splash";
import Login from "../components/Login/Login";

import Atividades from "../components/Atividades/Atividades";
import NossosHorarios from "../components/NossosHorarios/index";
import QuemSomos from "../components/QuemSomos/QuemSomos";
import Cadastro from "../components/CadastroProduto/index";
import Dashboard from "../components/Dashboard/index";
import Cestas from "../components/Receber cestas/index";

export default props => {
    const telas = [
  { name: "Splash", component: Splash, hide: true, header: false },
  // { name: "Home", component: Login,  header: false },
  { name: "Login", component: Login, hide: true, header: false },
  { name: "Cadastro", component: Cadastro, },
  { name: "Cestas", component: Cestas, hide: true },

  // { name: "Atividades", component: Atividades },
  // { name: "NossosHorarios", component: NossosHorarios },
  // { name: "QuemSomos", component: QuemSomos },
  
  { name: "Dashboard", component: Dashboard },
];

    return(
        <Drawer.Navigator
  drawerContent={props => <CustomDrawer {...props} />}
  screenOptions={{
    headerShown: true,
    drawerActiveTintColor: '#FFFFFF',
    drawerInactiveTintColor: '#FFFFFF',
    drawerInactiveBackgroundColor: '#215727',
    drawerActiveBackgroundColor: '#215727',
    
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
    },
  }}
>
  {telas.map((tela) => (
    <Drawer.Screen
  key={tela.name}
  name={tela.name}
  component={tela.component}
  options={{
    headerShown: tela.header === false ? false : true,
    drawerItemStyle: tela.hide
      ? { display: "none" }
      : { marginVertical: 8 }, 
  }}
/>
  ))}
</Drawer.Navigator>

    )
}


