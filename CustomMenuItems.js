import { Text, View } from 'react-native'; // Componentes básicos
import {
    MenuOption,
  } from 'react-native-popup-menu'; // Componente do menu popup
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; // Resposnsividade

// Componente funcional MenuItem
export const MenuItem = ({text, action, value, icon})=>{ // Recebe props: texto a mostrar, função a executar, valor passado para a função, ícone a exibir
    return ( // Cada item é um MenuOption que executa uma ação ao ser selecionado
        <MenuOption onSelect={()=> action(value)}>
            <View className="px-4 py-1 flex-row justify-between items-center">
                <Text style={{fontSize: hp(1.7)}} className="font-semibold text-neutral-600">
                    {text}
                </Text>
                {icon}
            </View>
        </MenuOption>
    )
}