import React from 'react';
import './Contact.css';
import Utils from "../utils/utils";

export default class Contact extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            subject: '',
            body: '',
            isSent: false,
            error: ''
        };

        this.contactError = React.createRef();

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.handleSendClicked = this.handleSendClicked.bind(this);
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value
        });
    }

    handleSubjectChange(e) {
        this.setState({
            subject: e.target.value
        });
    }

    handleBodyChange(e) {
        this.setState({
            body: e.target.value
        });
    }

    handleSendClicked(e) {
        e.preventDefault();

        this.contactError.current.style.display = 'none';

        let _this = this;
        Utils.sendEmail(
            this.state.email,
            this.state.subject,
            this.state.body,
            (err, info) => {
                if(err) {
                    _this.setState({
                        isSent: false,
                        error: err.message
                    }, () => {
                        _this.contactError.current.style.display = 'block';
                        _this.contactError.current.style.visibility = 'visible';
                    });
                } else {
                    _this.setState({
                        isSent: info.success,
                        error: info.message
                    }, () => {
                        if(!info.success) {
                            _this.contactError.current.style.display = 'block';
                            _this.contactError.current.style.visibility = 'visible';
                        }
                    });
                }
        });
    }

    isValid() {

    }

    render() {
        return (
            <div className="Contact">
                <div className="Contact-message">
                    <h1><mark>Let's get in touch</mark></h1>
                </div>
                <div className="Contact-form">
                    {!this.state.isSent ? <form onSubmit={this.handleSendClicked}>
                        <label htmlFor="sender"><mark>From</mark></label>
                        <br/>
                        <input type="email" onChange={this.handleEmailChange} required={true}/>
                        <br/><br/>
                        <label htmlFor="sender"><mark>Subject</mark></label>
                        <br/>
                        <input type="text" onChange={this.handleSubjectChange} required={true}/>
                        <br/><br/>
                        <label htmlFor="subject"><mark>Message</mark></label>
                        <br/>
                        <textarea onChange={this.handleBodyChange} required={true}/>
                        <br/>
                            <div className="Contact-error" ref={this.contactError}>
                                <p><mark>&nbsp;<span className="material-icons">error_outline</span>&nbsp;Something went wrong:&nbsp;{this.state.error}</mark></p>
                            </div>
                        <br/>
                        <input type="submit" value="&nbsp;Send!&nbsp;"/>
                    </form> :
                    <div className="Contact-success">
                        <h3>
                            <mark>
                                Message Sent!
                            </mark>
                        </h3>

                    </div>
                    }

                </div>
            </div>
        );
    }
}
