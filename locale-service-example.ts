import { replace } from 'lodash'
import { action, computed, observable } from 'mobx'
import { NativeModules, Platform } from 'react-native'

const Locales = {
	ru: require('locales/ru.json'),
	en: require('locales/en.json'),
}

type TLocale = keyof typeof Locales
interface ILocales {
	[key: string]: TLocale
}
type TDictionary = { [key in TLocale]: ILocales }

class Localization {
	@observable private _locale: TLocale
	@observable private dictionary: TDictionary

	constructor(dictionary: TDictionary, locale?: TLocale | undefined) {
		this._locale = this.defaultLocale(locale)
		this.dictionary = dictionary
	}

	@computed get getLocale(): TLocale {
		return this._locale
	}

	@action setLocale(locale?: TLocale | undefined) {
		this._locale = this.defaultLocale(locale)
	}

	translate(text: string, params: Record<string, any> = {}) {
		if (this.dictionary && this.dictionary[this._locale] && this.dictionary[this._locale][text]) {
			return Object.keys(params).reduce((acc: string, param) => {
				return replace(acc, new RegExp(`{${param}}`, 'g'), params[param])
			}, this.dictionary[this._locale][text])
		}
		return text
	}

	private defaultLocale(locale: TLocale | undefined) {
		if (Object.keys(Locales).some((element: string) => element === locale)) {
			return locale
		}
		return Platform.select({
			android: NativeModules.I18nManager.localeIdentifier,
			ios: NativeModules.SettingsManager ? NativeModules.SettingsManager.settings.AppleLocale : 'en',
		}).substring(0, 2)
	}
}

export default new Localization(Locales)
