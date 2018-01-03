/**
*
* ContextPortal
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import styled from 'styled-components';

const StyledDiv = styled.div`
	width:160px;
	height:80px;
	position:absolute;
	left:${(props) => props.x}px;
	top:${(props) => props.y}px;
	background-color:#fff;
	border:1px solid grey;
`;

const Row = styled.div`
	display:flex;
	height:40px;
	width:100%;
`;

const Item = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
	background-color:rgb(204,178,165);
	fill:#fff;
	width:40px;
	height:40px;
`;

function ContextPortal({ coordinates, parentNode }) {
	const component = (
		<StyledDiv x={coordinates.x} y={coordinates.y}>
			<Row>
				<Item><SvgWrapper height="25px" width="25px" svgid="note-list" /></Item>
				<Item><SvgWrapper height="25px" width="25px" svgid="highlights" /></Item>
				<Item><SvgWrapper height="25px" width="25px" svgid="bookmarks" /></Item>
				<Item className="facebook"><SvgWrapper height="35px" width="35px" svgid="fb-thumb" /></Item>
			</Row>
			<Row>
				<Item className="facebook"><SvgWrapper height="25px" width="25px" svgid="facebook" /></Item>
				<Item className="google"><SvgWrapper height="25px" width="25px" svgid="google_plus" /></Item>
				<Item className="twitter"><SvgWrapper height="35px" width="35px" svgid="twitter" /></Item>
				<Item><SvgWrapper height="25px" width="25px" svgid="email" /></Item>
			</Row>
		</StyledDiv>
	);
	return ReactDOM.createPortal(component, parentNode);
}

ContextPortal.propTypes = {
	parentNode: PropTypes.node,
	coordinates: PropTypes.object,
};

export default ContextPortal;
