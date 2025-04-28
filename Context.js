import { createContext, useContext, useEffect, useState } from "react"; // Importa funções do react
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // Funções de autenticação do Firebase
// Importa configurações e funções do Firebase 
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estadi di usuário atual
    const [isAuthenticated, setIsAuthenticated] = useState(undefined); // Estado de autenticação

    // useEffect para escutar mudanças de autenticação
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => { //Escuta o estado do usuário (login/logout)
            // console.log('got user: ', user);
            if (user) { // Login
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid); // Atualiza informações adicionais do Firestore
            } else {
                setIsAuthenticated(false); // Logout
                setUser(null);
            }
        });
        return unsub; // Remove o listener quando o componente desmontar
    }, []);

    // Função para buscar dados do usuário no firestore
    const updateUserData = async (userId) => {
        const docRef = doc(db, 'users', userId); // Referência ao documento do usuário 
        const docSnap = await getDoc(docRef); // Busca o documento 

        if (docSnap.exists()) { // Se existir, atualiza o usuário
            let data = docSnap.data(); // Pega os dados do documento 
            setUser({ ...user, username: data.username, profileUrl: data.profileUrl, userId: data.userId })
        }
    }

    // Função de login
    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return { success: true }; //Login bem sucedido
        } catch (e) {
            // Tratamento de erros para mensagens
            let msg = e.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'E-mail inválido'
            if (msg.includes('(auth/invalid-credential)')) msg = 'E-mail ou Senha errada'
            return { success: false, msg }; // Retorna o erro
        }
    }
    //Função de logout
    const logout = async () => {
        try {
            await signOut(auth); // Desloga o usuário 
            return { success: true } // Retorna sucesso
        } catch (e) {
            return { success: false, msg: e.message, error: e };  // Retorna erro
        }
    }
    // Função de cadastro
    const register = async (email, password, username, profileUrl) => {
        try {
            // Cria o usuário no Firebase Auth
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user :', response?.user);

            // setUser(response?.user);
            // setIsAuthenticated(true);

            //Cria o documento do usuário no Firestore
            await setDoc(doc(db, "users", response?.user?.uid), { // Em caso de sucesso, retorna o usuário
                username,
                profileUrl,
                userId: response?.user?.uid
            });
            return { success: true, data: response?.user };
        } catch (e) {
            let msg = e.message; // Se der erro
            // Mensagens de erros comuns
            if (msg.includes('(auth/invalid-email)')) msg = 'E-mail inválido'
            if (msg.includes('(auth/email-already-in-use)')) msg = 'Esse e-mail já está em uso'
            return { success: false, msg }; // Retorna o erro
        }
    }

    // Retorna os componentes com os valores desejados
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


//Hook personalizado
export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) { // Se não estiver dentro do AuthContextProvider
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value; //Retorna o valor
}