import React from 'react';
import './IntroPanel.css';

export default class IntroPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            shouldUpdateBackground: true,
        };

        this.isActiveInView = this.isActiveInView.bind(this);
    }

    isActiveInView() {
        return Math.floor(this.props.scrollPosition) === 0;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.isActiveInView() && this.state.shouldUpdateBackground) {
            let _this = this;
            this.setState({
                shouldUpdateBackground: false
            }, () => {
                if(_this.props.onPanelInView) {
                    _this.props.onPanelInView(null);
                }
            });
        } else if(!this.isActiveInView() && !this.state.shouldUpdateBackground) {
            this.setState({
                shouldUpdateBackground: true
            });
        }
    }

    render() {
        return(
            <div className="IntroPanel">
                <h1><mark>Hi, I'm Allan <br/>and I'm a creative <br/>technologist.</mark></h1>
                <span className="material-icons">arrow_forward</span>
            </div>
        )
    }
}
