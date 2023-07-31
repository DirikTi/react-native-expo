import { useEffect, useState } from 'react';
import { Button, SafeAreaView, Text, TextInput } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackScreenProps } from '../App';
import { useSelector } from 'react-redux';
import { useAppDispatch, type RootStateType } from '../store/store';
import { userSliceActions } from '../store/reducers/user/userSlice';
import { ActivityIndicator } from 'react-native';

export default function LoginScreen({ navigation, route }: RootStackScreenProps<"Login">)  {
    
    const dispatch = useAppDispatch()

    const [email, setEmail] = useState("ertugrul@gmail.com");
    const [password, setPassword] = useState("123456");

    const { loading, error } = useSelector((state: RootStateType) => state.user);

    async function onPressLogin() {
        const result = await dispatch(userSliceActions.apiLoginThunk({ email, password })).unwrap();
        
        console.log("Result", result);

        navigation.navigate("Home");
    }

    return (
        <SafeAreaView>
            <Text>Login Screen</Text>

            <TextInput placeholder='email' value={email} onChangeText={setEmail} />
            <TextInput placeholder='password' value={password} onChangeText={setPassword} />
            {!loading ? (
                <Button title="press" onPress={onPressLogin} />
            ) : (
                <ActivityIndicator color="#377dff" />
            )}
            
        </SafeAreaView>
    )
}