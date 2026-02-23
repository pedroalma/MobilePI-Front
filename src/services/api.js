import axios from 'axios';

const confirmar = async () => {
  try {
    await axios.post(
      'http://172.24.208.1:3000/api/produtos',
      dados
    );

    Alert.alert('Sucesso');
  } catch (error) {
    console.log(error.response?.data);
    Alert.alert('Erro', error.message);
  }
};
