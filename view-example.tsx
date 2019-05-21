import { field } from 'constants/colors'
import { fonts } from 'constants/fonts'
import React, { PureComponent } from 'react'
import { Animated } from 'react-native'

/** Props validation */
type Props = {
	fontSize: number
	activeFontSize: number
	style: any
	active?: any
	focused?: any
	errored?: any
	restricted?: any
	children: React.ReactNode
} & typeof defaultProps

/** State validation */
type State = {
	input: any
	focus: any
}

const defaultProps = {
	numberOfLines: 1,
}

class Label extends PureComponent<Props, State> {
	static defaultProps = defaultProps

	state = {
		input: new Animated.Value(0),
		focus: new Animated.Value(0),
	}

	componentDidUpdate = (prevProps: any) => {
		const { focus, input } = this.state
		const { active, focused, errored } = this.props
		if (focused ^ prevProps.focused || active ^ prevProps.active) {
			const toValue = active || focused ? 1 : 0
			Animated.timing(input, { toValue, duration: 255 }).start()
		}
		if (focused ^ prevProps.focused || errored ^ prevProps.errored) {
			const toValue = errored ? -1 : focused ? 1 : 0
			Animated.timing(focus, { toValue, duration: 255 }).start()
		}
	}

	/** Default render */
	render = (): React.ReactElement => {
		const { focus, input } = this.state
		const { children, restricted, fontSize, activeFontSize, style, errored, active, focused, ...props } = this.props

		const color = restricted
			? field.base
			: focus.interpolate({ inputRange: [-1, 0, 1], outputRange: [field.base, field.base, field.base] })

		const top = input.interpolate({
			inputRange: [0, 1],
			outputRange: [16 + fontSize * 0.25, 16 - 4 - activeFontSize],
		})

		const textStyle = {
			fontSize: input.interpolate({ inputRange: [0, 1], outputRange: [fontSize, activeFontSize] }),
			color,
			fontFamily: fonts.regular,
		}

		const containerStyle = { position: 'absolute', top }

		return (
			<Animated.View style={containerStyle}>
				<Animated.Text style={[style, textStyle]} {...props}>
					{children}
				</Animated.Text>
			</Animated.View>
		)
	}
}

export default Label
