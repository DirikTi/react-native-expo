import { useEffect } from 'react';
import { SafeAreaView, Text } from "react-native";
import { RootStackScreenProps } from '../App';

export default function DetailScreen({ navigation, route }: RootStackScreenProps<"Detail">) {
    
    useEffect(() => {

    }, []);

    return (
        <SafeAreaView>
            <Text>Detail Screen</Text>
        </SafeAreaView>
    )
}