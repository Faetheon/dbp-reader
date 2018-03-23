/**
*
* VersionList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import some from 'lodash/some';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
// import SvgWrapper from 'components/SvgWrapper';
import LoadingSpinner from 'components/LoadingSpinner';
import VersionListSection from 'components/VersionListSection';
import messages from './messages';
import {
	getVersionsError,
	selectActiveChapter,
	selectActiveBookId,
} from './selectors';

class VersionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		filterText: '',
	// 	};
	// }

	get filteredVersionList() {
		const {
			bibles,
			activeIsoCode,
			activeTextId,
			activeBookId,
			activeChapter,
			versionsError,
			filterText,
		} = this.props;
		// const { filterText } = this.state;
		const filteredBibles = filterText ? bibles.filter((bible) => this.filterFunction(bible, filterText, activeIsoCode)) : bibles.filter((bible) => activeIsoCode === 'ANY' ? true : bible.get('iso') === activeIsoCode);
		// Change the way I figure out if a resource has text or audio
		// path, key, types, className, text, clickHandler
		// console.log('filtered bibles', filteredBibles.get(0).get('filesets').valueSeq());
		const scrubbedBibles = filteredBibles.reduce((acc, bible) => ([...acc, {
			path: `/${bible.get('abbr').toLowerCase()}/${activeBookId.toLowerCase()}/${activeChapter}`,
			key: `${bible.get('abbr')}${bible.get('date')}`,
			clickHandler: () => this.handleVersionListClick(bible),
			className: bible.get('abbr') === activeTextId ? 'active-version' : '',
			text: bible.get('name'),
			types: bible.get('filesets').reduce((a, c) => ({ ...a, [c.get('set_type_code')]: true }), {}),
		}]), []);
		// console.log('scrubbed bibles', scrubbedBibles);
		// const scrubbedBibles = filteredBibles.map((bible) => {
		// 	const newBible = {};
		// 	newBible.path = ;
		// 	newBible.key = ;
		// 	newBible.clickHandler = ;
		// 	newBible.className =;
		// 	newBible.text =;
		// 	console.log(bible);
		// }).toJS();
		// When I first get the response from the server with filesets
		const audioAndText = []; // filteredBibles.reduce();
		const audioOnly = []; // filteredBibles.reduce();
		const textOnly = []; // filteredBibles.reduce();

		scrubbedBibles.forEach((b) => {
			// console.log(b);
			if ((b.types.audio_drama || b.types.audio) && (b.types.text_plain || b.types.text_formatt)) {
				audioAndText.push(b);
			} else if (b.types.audio_drama || b.types.audio) {
				audioOnly.push(b);
			} else {
				textOnly.push(b);
			}
		});

		const components = [
			<div><FormattedMessage style={{ backgroundColor: 'black' }} {...messages.audioAndText} /><VersionListSection items={audioAndText} /></div>,
			<div><FormattedMessage style={{ backgroundColor: 'black' }} {...messages.audioOnly} /><VersionListSection items={audioOnly} /></div>,
			<div><FormattedMessage style={{ backgroundColor: 'black' }} {...messages.textOnly} /><VersionListSection items={textOnly} /></div>,
		];
		// Create three options, hasPlainText, hasAudio and hasFormatted
		// Then pass these three options into redux and use them here
		// const components = filteredBibles.map((bible) => (
		// 	<Link
		// 		to={`/${bible.get('abbr').toLowerCase()}/${activeBookId.toLowerCase()}/${activeChapter}`}
		// 		className="version-item-button"
		// 		key={`${bible.get('abbr')}${bible.get('date')}`}
		// 		onClick={() => this.handleVersionListClick(bible)}
		// 	>
		// 		{
		// 			bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'text_formatt').size || bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'text_plain').size ? (
		// 				<SvgWrapper className="active" height="20px" width="20px" svgid="text" />
		// 			) : (
		// 				<SvgWrapper className="inactive" height="20px" width="20px" svgid="text" />
		// 			)
		// 		}
		// 		{
		// 			bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'audio_drama').size || bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'audio').size ? (
		// 				<SvgWrapper className="active" height="20px" width="20px" svgid="volume" />
		// 			) : (
		// 				<SvgWrapper className="inactive" height="20px" width="20px" svgid="volume" />
		// 			)
		// 		}
		// 		<h4 className={bible.get('abbr') === activeTextId ? 'active-version' : ''}>{bible.get('name')}</h4>
		// 	</Link>
		// ));

		if (bibles.size === 0 || versionsError) {
			return <span className="version-item-button">There was an error fetching this resource, an Admin has been notified. We apologize for the inconvenience.</span>;
		}

		return scrubbedBibles.length ? components : <span className="version-item-button">There are no matches for your search.</span>;
	}

	filterFunction = (bible, filterText, iso) => {
		const lowerCaseText = filterText.toLowerCase();

		if (!(bible.get('iso') === iso) && iso !== 'ANY') {
			return false;
		}

		if (bible.get('language').toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (bible.get('abbr').toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (bible.get('name').toLowerCase().includes(lowerCaseText)) {
			return true;
		}
		return false;
	}

	handleVersionListClick = (bible) => {
		const {
			// setCountryListState,
			// toggleLanguageList,
			// toggleVersionList,
			toggleTextSelection,
			setActiveText,
			// active,
		} = this.props;

		if (bible) {
			setActiveText({ textId: bible.get('abbr'), textName: bible.get('name'), filesets: bible.get('filesets') });
			toggleTextSelection();
		}
	}

	// handleChange = (e) => this.setState({ filterText: e.target.value });

	render() {
		const {
			// activeTextName,
			active,
			loadingVersions,
			versionsError,
		} = this.props;

		if (active) {
			return (
				<div className="text-selection-section">
					<div className="version-name-list">
						{
							loadingVersions && !versionsError ? (
								<LoadingSpinner />
							) : this.filteredVersionList
						}
					</div>
				</div>
			);
		}
		return null;
	}
}

VersionList.propTypes = {
	bibles: PropTypes.object,
	setActiveText: PropTypes.func,
	// toggleVersionList: PropTypes.func,
	// toggleLanguageList: PropTypes.func,
	toggleTextSelection: PropTypes.func,
	// setCountryListState: PropTypes.func,
	activeBookId: PropTypes.string,
	activeIsoCode: PropTypes.string,
	activeTextId: PropTypes.string,
	filterText: PropTypes.string,
	activeChapter: PropTypes.number,
	active: PropTypes.bool,
	versionsError: PropTypes.bool,
	loadingVersions: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
	versionsError: getVersionsError(),
	activeBookId: selectActiveBookId(),
	activeChapter: selectActiveChapter(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(VersionList);
