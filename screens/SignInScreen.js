import React, { useState } from 'react';
import {
    AsyncStorage,
    View,
    Button,
    StyleSheet,
    Image,
    Text,
} from 'react-native';
import AppInput from '../components/UI/AppInput';
import AppButton from '../components/UI/AppButton';

export default function SignInScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authenticating, setAuthenticating] = useState(false);

    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        props.navigation.navigate('App');
    };

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.headingImage}
                    resizeMode="contain"
                />
            </View>
            <Text style={[styles.greeting]}>
                Welcome back,
                </Text>
            <Text style={[styles.greeting2]}>
                sign in to continue
                </Text>

            <View style={styles.inputContainer}>
                <AppInput
                    placeholder="User Name"
                    type='username'
                    onChangeText={this.onChangeText}
                    value={username}
                />
                <AppInput
                    placeholder="Password"
                    type='password'
                    onChangeText={this.onChangeText}
                    value={password}
                    secureTextEntry
                />
            </View>

            <AppButton
                isLoading={authenticating}
                title='Sign In'
                onPress={_signInAsync}
            />

        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
        justifyContent: "center",
    },
    heading: {
        flexDirection: 'row'
    },
    headingImage: {
        width: 100,
        height: 38
    },
    greeting: {
        marginTop: 20,
        fontSize: 24,
    },
    greeting2: {
        color: '#666',
        fontSize: 24,
        marginTop: 5,
    },
    inputContainer: {
        marginTop: 40
    },
    loginButton: {
        marginTop: 30,
    },

});

SignInScreen.navigationOptions = {
    header: null,
};
