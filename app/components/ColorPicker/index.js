/**
*
* ColorPicker
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import messages from '../HighlightColors/messages';
// import styled from 'styled-components';

function ColorPicker({ handlePickedColor }) {
	// console.log('Rendered colorpicker');
	return (
		<div className={'color-picker'}>
			<span className={'color-group'}>
				<span style={{ backgroundColor: 'rgba(252,230,0,.25)' }} aria-label="yellow" role={'button'} tabIndex={-1} className={'yellow'} onClick={() => handlePickedColor({ color: '252,230,0,.25' })} />
			</span>
			<span className={'color-group'}>
				<span style={{ backgroundColor: 'rgba(84,185,72,.25)' }} aria-label="green" role={'button'} tabIndex={-2} className={'green'} onClick={() => handlePickedColor({ color: '84,185,72,.25' })} />
			</span>
			<span className={'color-group'}>
				<span style={{ backgroundColor: 'rgba(208,105,169,.25)' }} aria-label="pink" role={'button'} tabIndex={-3} className={'pink'} onClick={() => handlePickedColor({ color: '208,105,169,.25' })} />
			</span>
			<span className={'color-group'}>
				<span style={{ backgroundColor: 'rgba(137,103,172,.25)' }} aria-label="purple" role={'button'} tabIndex={-4} className={'purple'} onClick={() => handlePickedColor({ color: '137,103,172,.25' })} />
			</span>
			<span className={'color-group'}>
				<span style={{ backgroundColor: 'rgba(80,165,220,.25)' }} aria-label="blue" role={'button'} tabIndex={-5} className={'blue'} onClick={() => handlePickedColor({ color: '80,165,220,.25' })} />
			</span>
		</div>
	);
}

ColorPicker.propTypes = {
	handlePickedColor: PropTypes.func,
};

export default ColorPicker;