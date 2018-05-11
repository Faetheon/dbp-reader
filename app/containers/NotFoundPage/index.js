/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import GenericErrorBoundary from 'components/GenericErrorBoundary';

import messages from './messages';

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<GenericErrorBoundary affectedArea="NotFound">
				<h1>
					<FormattedMessage {...messages.header} />
				</h1>
				<FormattedMessage {...messages.cause} />
				<ul>
					<li><FormattedMessage {...messages.technical} /></li>
					<li><FormattedMessage {...messages.moved} /></li>
					<li><FormattedMessage {...messages.clickedOld} /></li>
					<li><FormattedMessage {...messages.accident} /></li>
				</ul>
				<FormattedMessage {...messages.youDo} />
				<ul>
					<li><FormattedMessage {...messages.tryAgain} /></li>
					<li><FormattedMessage {...messages.homePage} /><a href={'https://bible.is'}><FormattedMessage {...messages.homePageLink} /></a></li>
				</ul>
				<FormattedMessage {...messages.weKnow} />
			</GenericErrorBoundary>
		);
	}
}
