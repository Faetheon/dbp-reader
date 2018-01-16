/**
*
* SignUp
*
*/

import React from 'react';
import SvgWrapper from 'components/SvgWrapper';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class SignUp extends React.PureComponent {
	state = {
		username: '',
		password: '',
		confirmPassword: '',
		email: '',
		validPassword: false,
		validEmail: false,
		wasSignupSent: false,
	}

	componentDidUpdate(prevProps, prevState) {
		if ((prevState.confirmPassword !== prevState.password) && (this.state.password === this.state.confirmPassword)) {
			this.setValidPassword(true);
		} else if (((prevState.confirmPassword === prevState.password) && prevState.password.length) && (this.state.password !== this.state.confirmPassword)) {
			this.setValidPassword(false);
		}
	}

	setValidPassword = (valid) => {
		this.setState({ validPassword: valid });
	}

	handlePasswordChange = (e) => {
		this.setState({ password: e.target.value });
	}

	handleEmailChange = (e) => {
		const email = e.target.value;
		const indexOfAt = email.indexOf('@');

		if (indexOfAt !== -1) {
			this.setState({
				username: email.slice(0, indexOfAt),
				validEmail: true,
				email,
			});
		} else {
			this.setState({ email });
		}
	}

	handleConfirmPassword = (e) => {
		const value = e.target.value;

		this.setState({ confirmPassword: value });
	}

	handleSignup = () => {
		if (this.state.validPassword && this.state.validEmail) {
			this.props.sendSignupForm({ email: this.state.email, password: this.state.password, username: this.state.username });
			this.setState({ wasSignupSent: true });
		}
	}

	render() {
		return (
			<React.Fragment>
				<section className="message">
					<p>Signing up lets you create Bookmarks, Highlights and Notes, and access them wherever you use Bible.is!</p>
				</section>
				<input style={{ border: !this.state.validEmail ? '2px solid red' : 'none' }} onChange={this.handleEmailChange} className="email" placeholder="Enter E-mail" value={this.state.email} />
				<input type="password" onChange={this.handlePasswordChange} className="first-password" placeholder="Enter Password" value={this.state.password} />
				<input type="password" style={{ border: !this.state.validPassword ? '2px solid red' : 'none' }} onChange={this.handleConfirmPassword} className="second-password" placeholder="Confirm Password" value={this.state.confirmPassword} />
				<div className="sign-up-button"><span role="button" tabIndex={0} onClick={() => this.handleSignup()} className="text">SIGN UP</span></div>
				<div className="google">
					<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="google_plus" />
					Sign up with Google
				</div>
				<div className="facebook">
					<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="facebook" />
					Sign up with Facebook
				</div>
				<section className="disclaimer">
					By creating an account, you agree to the Bible.is
					<Link className="link" to="/privacy-policy"> Privacy Policy </Link> &
					<Link className="link" to="/terms-of-use"> Terms of Use</Link>.
				</section>
			</React.Fragment>
		);
	}
}

SignUp.propTypes = {
	sendSignupForm: PropTypes.func,
};

export default SignUp;
