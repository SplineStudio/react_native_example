import { Alert, BackHandler } from 'react-native'
import { NavigationActions } from 'react-navigation'
import I18n from 'services/locale'

class Route {
	navigation: any = {}

	root = (ref: any): void => {
		this.navigation = ref
	}

	navigate = (url: string, params?: any): void => {
		this.navigation.dispatch(
			NavigationActions.navigate({
				key: url,
				params,
				routeName: url,
			}),
		)
	}

	back = (url: string, params?: any): void => {
		BackHandler.addEventListener('hardwareBackPress', () => {
			this.navigate(url, params)
			return true
		})
	}

	exit = (): void => {
		BackHandler.addEventListener('hardwareBackPress', () => {
			const { nav } = this.navigation.state
			if (nav.index === 0) {
				Alert.alert(
					I18n.t('APP_NAME'),
					I18n.t('EXIT'),
					[
						{
							text: I18n.t('BUTTON.CANCEL'),
							onPress: () => void 0,
						},
						{
							text: I18n.t('BUTTON.OK'),
							onPress: () => BackHandler.exitApp(),
						},
					],
					{ cancelable: false },
				)
				return true
			}
		})
	}
}

export default new Route()
