import { View, Text, FlatList } from 'react-native' // Componentes básicos
import React from 'react'
import ChatItem from './ChatItem' // Item individual da lista
import { useRouter } from 'expo-router' // Hook para navegação

//Mostra uma lista de usuários para conversar
export default function ChatList({ users, currentUser }) {
    const router = useRouter(); // Navega ao clicar no chat
    return (
        <View className="flex-1">
            <FlatList
                data={users} //Lista de usuários
                contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
                keyExtractor={item => Math.random()} // Gera chave aleatória
                showsVerticalScrollIndicator={false} //Esconde barra de rolagem
                renderItem={({ item, index }) =>  //Renderiza cada item da lista
                    <ChatItem
                        noBorder={index + 1 == users.length}
                        router={router}
                        currentUser={currentUser}
                        item={item}
                        index={index}
                    />
                }
            />
        </View>
    )
}