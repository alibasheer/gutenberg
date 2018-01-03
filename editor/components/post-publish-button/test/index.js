/**
 * External dependencies
 */
import { shallow } from 'enzyme';
import { merge } from 'lodash';

/**
 * Internal dependencies
 */
import { PostPublishButton } from '../';

describe( 'PostPublishButton', () => {
	const user = {
		data: {
			id: 1,
			post_type_capabilities: {
				publish_posts: true,
			},
		},
	};

	const contributor = merge( {}, user, {
		data: {
			post_type_capabilities: {
				publish_posts: false,
			},
		},
	} );

	describe( 'disabled', () => {
		it( 'should be disabled if current user is unknown', () => {
			const wrapper = shallow(
				<PostPublishButton user={ {} } />
			);

			expect( wrapper.prop( 'disabled' ) ).toBe( true );
		} );

		it( 'should be disabled if post is currently saving', () => {
			const wrapper = shallow(
				<PostPublishButton user={ user } isSaving />
			);

			expect( wrapper.prop( 'disabled' ) ).toBe( true );
		} );

		it( 'should be disabled if post is not publishable', () => {
			const wrapper = shallow(
				<PostPublishButton user={ user } isPublishable={ false } />
			);

			expect( wrapper.prop( 'disabled' ) ).toBe( true );
		} );

		it( 'should be disabled if post is not saveable', () => {
			const wrapper = shallow(
				<PostPublishButton user={ user } isSaveable={ false } />
			);

			expect( wrapper.prop( 'disabled' ) ).toBe( true );
		} );

		it( 'should be enabled otherwise', () => {
			const wrapper = shallow(
				<PostPublishButton user={ user } isPublishable isSaveable />
			);

			expect( wrapper.prop( 'disabled' ) ).toBe( false );
		} );
	} );

	describe( 'publish status', () => {
		it( 'should be pending for contributor', () => {
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			const wrapper = shallow(
				<PostPublishButton
					user={ contributor }
					onStatusChange={ onStatusChange }
					onSave={ onSave } />
			);

			wrapper.simulate( 'click' );

			expect( onStatusChange ).toHaveBeenCalledWith( 'pending' );
		} );

		it( 'should be future for scheduled post', () => {
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			const wrapper = shallow(
				<PostPublishButton
					user={ user }
					onStatusChange={ onStatusChange }
					onSave={ onSave }
					isBeingScheduled />
			);

			wrapper.simulate( 'click' );

			expect( onStatusChange ).toHaveBeenCalledWith( 'future' );
		} );

		it( 'should be private for private visibility', () => {
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			const wrapper = shallow(
				<PostPublishButton
					user={ user }
					onStatusChange={ onStatusChange }
					onSave={ onSave }
					visibility="private" />
			);

			wrapper.simulate( 'click' );

			expect( onStatusChange ).toHaveBeenCalledWith( 'private' );
		} );

		it( 'should be publish otherwise', () => {
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			const wrapper = shallow(
				<PostPublishButton
					user={ user }
					onStatusChange={ onStatusChange }
					onSave={ onSave } />
			);

			wrapper.simulate( 'click' );

			expect( onStatusChange ).toHaveBeenCalledWith( 'publish' );
		} );
	} );

	describe( 'click', () => {
		it( 'should save with status', () => {
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			const wrapper = shallow(
				<PostPublishButton
					user={ user }
					onStatusChange={ onStatusChange }
					onSave={ onSave } />
			);

			wrapper.simulate( 'click' );

			expect( onStatusChange ).toHaveBeenCalledWith( 'publish' );
			expect( onSave ).toHaveBeenCalled();
		} );
	} );

	it( 'should have save modifier class', () => {
		const wrapper = shallow(
			<PostPublishButton user={ user } isSaving />
		);

		expect( wrapper.hasClass( 'is-saving' ) ).toBe( true );
	} );

	it( 'should have save modifier class when autosaving', () => {
		const wrapper = shallow(
			<PostPublishButton user={ user } isAutosaving />
		);

		expect( wrapper.hasClass( 'is-saving' ) ).toBe( true );
	} );

	it( 'should have save modifier class when autosaving and is published', () => {
		const wrapper = shallow(
			<PostPublishButton user={ user } isAutosaving />
		);

		expect( wrapper.hasClass( 'is-saving' ) ).toBe( true );
	} );

} );
