/**
 * WordPress dependencies
 */
import { Component, createRef, compose } from '@wordpress/element';
import { createSlotFill, Button, IconButton, withGlobalEvents } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import './style.scss';

const { Slot, Fill } = createSlotFill( 'GuideTip' );

export class GuideTip extends Component {
	constructor() {
		super( ...arguments );

		this.anchorRef = createRef();
		this.advanceButtonRef = createRef();

		this.state = {
			direction: 'right',
			position: {},
		};
	}

	componentDidMount() {
		this.setPosition();
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.currentStep !== prevProps.currentStep ) {
			this.setPosition();

			if ( this.advanceButtonRef.current ) {
				this.advanceButtonRef.current.focus();
			}
		}
	}

	setPosition() {
		const anchor = this.anchorRef.current;
		if ( ! anchor || ! anchor.parentNode ) {
			return;
		}

		const rect = anchor.parentNode.getBoundingClientRect();
		const centerX = rect.left + ( rect.width / 2 );
		const centerY = rect.top + ( rect.height / 2 );

		const viewportCenterX = document.documentElement.clientWidth / 2;
		const direction = centerX > viewportCenterX ? 'left' : 'right';

		this.setState( {
			direction,
			position: {
				left: direction === 'left' ? rect.left : rect.right,
				top: centerY,
			},
		} );
	}

	render() {
		const { step, children, currentStep, onAdvance, onDismiss } = this.props;
		const { direction, position } = this.state;

		if ( currentStep !== step ) {
			return null;
		}

		return (
			<span ref={ this.anchorRef }>
				<Fill>
					<div
						className={ `editor-new-user-tip is-${ direction }` }
						style={ position }
						role="dialog"
						aria-modal="true"
						aria-label={ __( 'New User Guide' ) }
					>
						<div className="editor-new-user-tip__content">
							<p>{ children }</p>
							<p>
								<Button
									ref={ this.advanceButtonRef }
									isLarge
									isPrimary
									onClick={ onAdvance }
								>
									{ __( 'Got it' ) }
								</Button>
							</p>
							<IconButton
								icon="no-alt"
								label={ __( 'Dismiss guide' ) }
								className="editor-new-user-tip__close"
								onClick={ onDismiss }
							/>
						</div>
					</div>
				</Fill>
			</span>
		);
	}
}

const EnhancedGuideTip = compose(
	withSelect( ( select, { guideID } ) => {
		const { getCurrentGuideStep } = select( 'core/nux' );
		return {
			currentStep: getCurrentGuideStep( guideID ),
		};
	} ),
	withDispatch( ( dispatch, { guideID } ) => {
		const { advanceGuide, dismissGuide } = dispatch( 'core/nux' );
		return {
			onAdvance() {
				advanceGuide( guideID );
			},
			onDismiss() {
				dismissGuide( guideID );
			},
		};
	} ),
	withGlobalEvents( {
		resize: 'setPosition',
	} ),
)( GuideTip );

EnhancedGuideTip.Slot = Slot;

export default EnhancedGuideTip;
