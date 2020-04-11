import React from 'react';
import './About.css';
import Utils from "../utils/utils";

export default class About extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            about: '',
            video: '',
        };
    }

    componentDidMount() {
        let _this = this;
        Utils.fetchInfo((err, info) => {
            if(err) {
                console.log(err);
            } else {
                _this.setState({
                    about: info.about,
                    video: Utils.getResourcePath(info.about_media_dir, info.about_bg),
                    resume_path: info.resume_path,
                }, () => {
                    if(_this.props.onBackgroundLoaded) {
                        _this.props.onBackgroundLoaded(this.state.video);
                    }
                });
            }
        });
    }

    render() {
        return(
            <div className="About">
                <div>
                    <h1><mark>Allan Pichardo</mark></h1>
                    <mark><a href={this.state.resume_path} target="_blank">💾 Resume</a></mark>
                </div>
                <p><mark>{this.state.about}</mark></p>
                <p/>
            </div>
        );
    }
}
