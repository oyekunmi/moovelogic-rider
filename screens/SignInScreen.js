import React, { useState } from 'react';
import {
    Text,
    View,
    Alert,
    Image,
    StyleSheet,
    AsyncStorage,
} from 'react-native';
import AppInput from '../components/UI/AppInput';
import AppButton from '../components/UI/AppButton';
import agent from '../agent';

export default function SignInScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authenticating, setAuthenticating] = useState(false);

    _signInAsync = async () => {
        setAuthenticating(true);
        agent.Auth.login(username, password).then(x=>{
            console.log(x);
            const token = x.data.token.access_token;
            AsyncStorage.setItem('jwt', token);
            AsyncStorage.setItem('user', JSON.stringify(x.data.user));
            agent.setToken(token); 
            props.navigation.navigate('App');
        },
        err => {
            console.log(err);
            setAuthenticating(false);
            Alert.alert("Bad credential", "Invalid login credential, kindly contact support for help on info@app.com", [{text: 'OK'}]);
        });
    };

    _onChangeText = (key, value) => {
        if (key == "username")
            setUsername(value);
        if (key == "password")
            setPassword(value);
    }

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
                    onChangeText={_onChangeText}
                    value={username}
                />
                <AppInput
                    placeholder="Password"
                    type='password'
                    onChangeText={_onChangeText}
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
    errorMessage: {
        fontSize: 12,
        marginTop: 10,
        color: 'transparent',
        // fontFamily: fonts.base
    },
});

SignInScreen.navigationOptions = {
    header: null,
};
