/**
 *
 * Notes
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import SvgWrapper from 'components/SvgWrapper';
import EditNote from 'components/EditNote';
import MyNotes from 'components/MyNotes';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import {
	setActiveNote,
} from 'containers/HomePage/actions';
import {
	setActiveChild,
	setPageSize,
	toggleVerseText,
	toggleAddVerseMenu,
	togglePageSelector,
	setActivePageData,
	addNote,
	getNotes,
	addBookmark,
	addHighlight,
	updateNote,
	deleteNote,
} from './actions';
import makeSelectNotes, {
	selectUserId,
	selectActiveNote,
	selectHighlightedText,
	selectUserAuthenticationStatus,
	selectNotePassage,
	selectActiveTextId,
	vernacularBookNameObject,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

export class Notes extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		this.props.dispatch(setActiveChild(props.openView));
	}

	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
	}

	setRef = (node) => {
		this.ref = node;
	}

	setActiveChild = (child) => this.props.dispatch(setActiveChild(child))
	setActivePageData = (page) => this.props.dispatch(setActivePageData(page))
	setActiveNote = ({ note }) => this.props.dispatch(setActiveNote({ note }))
	setPageSize = (size) => this.props.dispatch(setPageSize(size))
	getNotes = () => this.props.dispatch(getNotes({ userId: this.props.userId }))
	toggleVerseText = () => this.props.dispatch(toggleVerseText())
	toggleAddVerseMenu = () => this.props.dispatch(toggleAddVerseMenu())
	togglePageSelector = () => this.props.dispatch(togglePageSelector())
	addBookmark = (data) => this.props.dispatch(addBookmark({ userId: this.props.userId, data }))
	addHighlight = (data) => this.props.dispatch(addHighlight({ userId: this.props.userId, data }))
	addNote = (data) => this.props.dispatch(addNote({ userId: this.props.userId, data: { ...data, user_id: this.props.userId } }))
	updateNote = (data) => this.props.dispatch(updateNote({ userId: this.props.userId, data: { ...data, user_id: this.props.userId } }))
	deleteNote = (noteId) => this.props.dispatch(deleteNote({ userId: this.props.userId, noteId }))

	titleOptions = {
		edit: 'EDIT NOTE',
		notes: 'MY NOTES',
		bookmarks: 'MY BOOKMARKS',
		highlights: 'MY HIGHLIGHTS',
	}

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleNotesModal();
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	render() {
		const {
			activeChild,
			listData,
			isAddVerseExpanded,
			isVerseTextVisible,
			activePageData,
			paginationPageSize: pageSize,
			pageSelectorState,
		} = this.props.notes;
		const {
			toggleNotesModal,
			selectedText,
			authenticationStatus,
			note,
			toggleProfile,
			notePassage,
			activeTextId,
			vernacularNamesObject,
		} = this.props;

		return (
			<GenericErrorBoundary affectedArea="Notes">
				<aside ref={this.setRef} className="notes">
					<header>
						<span role="button" tabIndex={0} className="close-icon" onClick={() => { setActiveChild('notes'); toggleNotesModal(); }}>
							<SvgWrapper height="25px" width="25px" fill="#fff" opacity="0.5" svgid="go-left" />
						</span>
						<h2 className="section-title">NOTEBOOK</h2>
					</header>
					{
						authenticationStatus ? (
							<React.Fragment>
								<div className="top-bar">
									{
										activeChild === 'notes' ? (
											<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('edit')} className={activeChild === 'notes' ? 'svg active' : 'svg'} height="30px" width="30px" svgid="note-list" />
										) : null
									}
									{
										activeChild !== 'notes' ? (
											<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('notes')} className={activeChild === 'edit' ? 'svg active' : 'svg'} height="30px" width="30px" svgid="notes" />
										) : null
									}
									<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('highlights')} className={activeChild === 'highlights' ? 'svg active' : 'svg'} height="30px" width="30px" svgid="highlights" />
									<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('bookmarks')} className={activeChild === 'bookmarks' ? 'svg active' : 'svg'} height="30px" width="30px" svgid="bookmarks" />
									<span className="text">{this.titleOptions[activeChild]}</span>
								</div>
								{
									activeChild === 'edit' ? (
										<EditNote
											addNote={this.addNote}
											deleteNote={this.deleteNote}
											updateNote={this.updateNote}
											toggleVerseText={this.toggleVerseText}
											toggleAddVerseMenu={this.toggleAddVerseMenu}
											note={note}
											notePassage={notePassage}
											activeTextId={activeTextId}
											selectedText={selectedText}
											isVerseTextVisible={isVerseTextVisible}
											isAddVerseExpanded={isAddVerseExpanded}
											vernacularNamesObject={vernacularNamesObject}
										/>
									) : (
										<MyNotes
											getNotes={this.getNotes}
											setPageSize={this.setPageSize}
											setActiveNote={this.setActiveNote}
											setActiveChild={this.setActiveChild}
											setActivePageData={this.setActivePageData}
											togglePageSelector={this.togglePageSelector}
											listData={listData}
											pageSize={pageSize}
											sectionType={activeChild}
											activePageData={activePageData}
											pageSelectorState={pageSelectorState}
											vernacularNamesObject={vernacularNamesObject}
										/>
									)
								}
							</React.Fragment>
						) : (
							<div className="need-to-login">
								Please <span className="login-text" role="button" tabIndex={0} onClick={() => { toggleNotesModal(); toggleProfile(); }}>Login</span> to access the notebook
							</div>
						)
					}
				</aside>
			</GenericErrorBoundary>
		);
	}
}

Notes.propTypes = {
	dispatch: PropTypes.func.isRequired,
	notes: PropTypes.object.isRequired,
	toggleNotesModal: PropTypes.func.isRequired,
	openView: PropTypes.string.isRequired,
	selectedText: PropTypes.string,
	authenticationStatus: PropTypes.bool,
	toggleProfile: PropTypes.func,
	note: PropTypes.object,
	vernacularNamesObject: PropTypes.object,
	activeTextId: PropTypes.string,
	userId: PropTypes.string,
	notePassage: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
	notes: makeSelectNotes(),
	selectedText: selectHighlightedText(),
	authenticationStatus: selectUserAuthenticationStatus(),
	userId: selectUserId(),
	note: selectActiveNote(),
	notePassage: selectNotePassage(),
	activeTextId: selectActiveTextId(),
	vernacularNamesObject: vernacularBookNameObject(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'notes', reducer });
const withSaga = injectSaga({ key: 'notes', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(Notes);
