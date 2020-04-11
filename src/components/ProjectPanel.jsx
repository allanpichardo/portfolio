import React from 'react';
import './ProjectPanel.css';
import {Link} from "react-router-dom";
import slugify from "slugify";
import Utils from "../utils/utils";

export default class ProjectPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            shouldUpdateBackground: true,
        };

        this.isActiveInView = this.isActiveInView.bind(this);
        this.renderLink = this.renderLink.bind(this);
    }

    isActiveInView() {
        return Math.floor(this.props.scrollPosition / this.props.index) === 1;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.isActiveInView() && this.state.shouldUpdateBackground) {
            let _this = this;
            this.setState({
                shouldUpdateBackground: false
            }, () => {
                if(_this.props.onPanelInView) {
                    _this.props.onPanelInView(Utils.getResourcePath(_this.props.project.media_dir, _this.props.project.cover_video));
                }
            });
        } else if(!this.isActiveInView() && !this.state.shouldUpdateBackground) {
            this.setState({
                shouldUpdateBackground: true
            });
        }
    }

    renderLink() {
        let slug = slugify(this.props.project.name);
        return this.isActiveInView() ?
            <Link to={`/projects/${slug}`}><h1>{this.props.project.name}</h1></Link> :
            <span/>
    }

    render() {
        return(
            <div className="ProjectPanel">
                {this.renderLink()}
            </div>
        );
    }
}
