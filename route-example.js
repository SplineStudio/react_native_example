import { Alert, BackHandler } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import I18n from '@locales/config';

let navigation;

function setRoot(navigatorRef) {
    navigation = navigatorRef;
}

function navigate(url, params = undefined){
    navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [ NavigationActions.navigate({ key: url, routeName: url, params: params }) ]
    }));
} 

function goBackPress(url, params = undefined) {
    BackHandler.addEventListener("hardwareBackPress", () => {
        navigate(url, params);
        return true;
    });
}

function exit() {
    doubleClick = 0;
    BackHandler.addEventListener("hardwareBackPress", () => {
        if (doubleClick == 0) {
            doubleClick = 1;
            setTimeout(() => doubleClick = 0, 200);
            return true;
        } else if (doubleClick == 1) {
            Alert.alert(I18n.t('APPLICATION_NAME'), I18n.t('ALERT.EXIT'),
                [
                    { text: I18n.t('ALERT.BUTTON.CANCEL'), onPress: () => void 0 },
                    { text: I18n.t('ALERT.BUTTON.OK'), onPress: () => BackHandler.exitApp() }
                ],
                { cancelable: false }
            );
            doubleClick == 0;
            return true;
        }
    });
}

export default {
    exit,
    navigate,
    goBackPress,
    setRoot,
};
