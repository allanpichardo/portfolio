import React from 'react';
import './WorksOverview.css';
import IntroPanel from "./IntroPanel";
import Utils from "../utils/utils";
import ProjectPanel from "./ProjectPanel";

export default class WorksOverview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            projects: null,
            scrollPosition: 0
        };

        this.mainDiv = React.createRef();

        this.getPanelStyles = this.getPanelStyles.bind(this);
        this.renderProjects = this.renderProjects.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handlePanelInView = this.handlePanelInView.bind(this);
    }

    handlePanelInView(coverImage) {
        if(this.props.onPanelInView) {
            this.props.onPanelInView(coverImage);
        }
    }

    getScreenWidth() {
        return window.innerWidth;
    }

    getNumberPanels() {
        return this.state.projects ? this.state.projects.length : 1;
    }

    handleScroll(e) {
        let scrollX = e.target.scrollLeft + 40;
        this.setState({
            scrollPosition: scrollX / this.getScreenWidth(),
        });
    }

    handleWheel(event) {
        this.mainDiv.current.scrollBy(event.deltaY, 0);
    }

    componentDidMount() {
        Utils.fetchProjects((err, projects) => {
            if(err) {
                console.log(err);
            } else {
                this.setState({
                    projects: projects
                });
            }
        });

    }

    getPanelStyles() {
        let columns = '100vw';
        if(this.state.projects) {
            this.state.projects.forEach((project) => {
                columns = `${columns} 100vw`;
            })
        }

        columns = `${columns} 37.5vw`;

        return {
            gridTemplateColumns: columns,
        }
    }

    renderProjects() {
        let projects = this.state.projects ? this.state.projects : [];
        return projects.map((project, key) => {
            return(
                <div className="WorksOverview-panel" key={key}>
                    <ProjectPanel onPanelInView={this.handlePanelInView} scrollPosition={this.state.scrollPosition} index={key + 1} project={project}/>
                </div>
            )
        });
    }

    render() {
        return(
            <div ref={this.mainDiv} onWheel={this.handleWheel} onScroll={this.handleScroll} className="WorksOverview" style={this.getPanelStyles()}>
                <IntroPanel onPanelInView={this.handlePanelInView} scrollPosition={this.state.scrollPosition} index={0}/>
                {this.renderProjects()}
                <div/>
            </div>
        )
    }
}
