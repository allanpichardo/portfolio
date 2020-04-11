import React from 'react';
import './ProjectDetails.css';
import slugify from "slugify";
import Utils from "../utils/utils";
import {Helmet} from "react-helmet-async";

export default class ProjectDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: null,
        };

    }

    componentDidMount() {
        let slug = slugify(this.props.match.params.name);
        Utils.fetchProjectBySlug(slug, (err, project) => {
            if(err) {
                console.log(err);
            } else {
                this.setState({
                    project: project,
                    slug: slug
                });
            }
        });
    }

    render() {
        if(this.state.project) {
            return(
                <div className="ProjectDetails">
                    <Helmet>
                        <title>{`${this.state.project.name} - Allan Pichardo`}</title>
                        <meta name="twitter:card" content="summary" />
                        <meta name="twitter:site" content="@allanpichardo" />
                        <meta name="twitter:creator" content="@allanpichardo" />
                        <meta property="og:title" content={`${this.state.project.name}`} />
                        <meta property="og:type" content="article" />
                        <meta property="og:url" content={`https://www.allanpichardo.com/projects/${this.state.slug}`} />
                        <meta property="og:description" content={this.state.project.notes} />
                        <meta property="og:image" content={`https://www.allanpichardo.com${this.state.project.cover_image}`} />
                    </Helmet>
                    <div className="ProjectDetails-section">
                        <div className="ProjectDetails-title">
                            <h1><mark>{this.state.project.name}</mark></h1>
                        </div>
                        <div className="projectDetails-subtitle">
                            <h2><mark>{this.state.project.subtitle}</mark></h2>
                            {
                                this.state.project.link ?
                                <h2><mark><a rel="noopener noreferrer" target="_blank" href={this.state.project.link}>{this.state.project.link}</a></mark></h2> :
                                <span/>
                            }
                        </div>
                        <div className="ProjectDetails-background1"/>
                        <div className="ProjectDetails-video1">
                            <div className="ProjectDetails-aspect-ratio">
                                <iframe src={`https://www.youtube.com/embed/${this.state.project.youtube_video_id}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen>
                                </iframe>
                            </div>
                        </div>
                        <div className="ProjectDetails-description1">
                            <p><mark>{this.state.project.description_1}</mark></p>
                        </div>
                        <div className="ProjectDetails-background2"/>
                        <div className="ProjectDetails-video2">
                            <video playsInline={true} muted={true} autoPlay={true} loop={true} src={Utils.getResourcePath(this.state.project.media_dir, this.state.project.video2)}/>
                        </div>
                        <div className="ProjectDetails-description2">
                            <p><mark>{this.state.project.description_2}</mark></p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<div/>);
        }

    }
}
