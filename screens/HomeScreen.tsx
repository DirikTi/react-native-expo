import { useEffect, useLayoutEffect } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, Text } from "react-native";
import { RootStackScreenProps } from '../App';
import asikusServiceInstance from '../api/services/AsikusService';
import { useDispatch, useSelector } from 'react-redux';
import { RootStateType } from '../store/store';
import { GuestType, guestReceived, guestSelector } from '../store/reducers/guest/guestSlice';
import { View } from 'react-native';
import { LoadingStatus } from '../store/reducers/globalPayload';


export default function HomeScreen({ navigation, route }: RootStackScreenProps<"Home">)  {

    const datas = useSelector((state: RootStateType) => guestSelector.selectAll(state.guest));

    const dispatch = useDispatch();

    useEffect(() => {
        async function startup() {
            const resp = await asikusServiceInstance.guests.getAll();
            
            dispatch(guestReceived(resp.data || []));
        }

        startup();
    }, []);

    const RenderItem = (props: any) => {
        let item: GuestType = props.item;

        return (
            <View style={{ marginVertical: 15 }}>
                <Text>Name: {item.name}</Text>
                <Text>Age: {item.age}</Text>
                <Text>City: {item.city}</Text>
                <Text>Email: {item.email}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <FlatList
            data={datas}
            renderItem={({item, index}) => (
                <RenderItem item={item} key={index} />
            )}
            keyExtractor={(v, i) => i.toString()}
            />
        </SafeAreaView>
    )
}