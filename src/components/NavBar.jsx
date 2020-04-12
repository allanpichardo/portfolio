import React from 'react';
import './NavBar.css';
import {NavLink, withRouter} from "react-router-dom";
import Utils from "../utils/utils";
import slugify from "slugify";

class NavBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isWorkDropdownShowing: false,
            projects: [],
        };

        this.workLink = React.createRef();

        this.generateWorkDropdown = this.generateWorkDropdown.bind(this);
        this.getDropdownOptions = this.getDropdownOptions.bind(this);
        this.calculateDropdownPlacement = this.calculateDropdownPlacement.bind(this);
        this.handleUnfocusNavigation = this.handleUnfocusNavigation.bind(this);
    }

    calculateDropdownPlacement() {
        let div = document.querySelector('.NavBar-dropdown');
        div.style.left = `${this.workLink.current.offsetLeft}px`;
        div.style.top = `${this.workLink.current.offsetTop + this.workLink.current.offsetHeight}px`;
    }

    generateWorkDropdown() {
        this.calculateDropdownPlacement();

        let _this = this;
        Utils.fetchProjects((err, projects) => {
            if(err) {
                console.log(err);
            } else {
                _this.setState({
                    projects: projects
                });
            }
        });
    }

    getDropdownOptions() {
        return this.state.projects.map((project) => {
            let slug = slugify(project.name);
            let path = `/projects/${slug}`;
            return(
                <div key={slug}>
                    <NavLink exact to={path} activeClassName="NavBar-active" isActive={(match, location) => {
                        return location.pathname.includes(slug);
                    }}>
                        {project.name}
                    </NavLink>
                    <br/>
                </div>
            );
        });
    }

    handleUnfocusNavigation(e) {
        let div = document.querySelector('.NavBar-dropdown');
        if(this.state.isWorkDropdownShowing && (e.target === div || e.target === this.workLink.current.parentElement)) {
            this.setState({
                isWorkDropdownShowing: false,
            }, () => {
                div.style.visibility = 'hidden';
            });
        }
    }

    componentDidMount() {
        this.generateWorkDropdown();
        window.onresize = this.calculateDropdownPlacement;
    }

    render() {
        return(
            <div className="NavBar">
                <div/>
                <div onPointerLeave={this.handleUnfocusNavigation}>
                    <NavLink ref={this.workLink} exact to="/" activeClassName="NavBar-active" isActive={(match, location) => {
                        return location.pathname === '/' || location.pathname.includes('projects');
                    }} onMouseEnter={() => {
                        if(!this.state.isWorkDropdownShowing) {
                            this.setState({
                                isWorkDropdownShowing: true,
                            }, () => {
                                let div = document.querySelector('.NavBar-dropdown');
                                div.style.visibility = 'visible';
                            });
                        }
                    }}>&nbsp;Work&nbsp;</NavLink>
                    <NavLink exact to="/about" activeClassName="NavBar-active">&nbsp;About&nbsp;</NavLink>
                    <NavLink exact to="/contact" activeClassName="NavBar-active">&nbsp;Contact&nbsp;</NavLink>
                </div>
                <div ref={this.dropdown} className="NavBar-dropdown" onPointerLeave={this.handleUnfocusNavigation}>
                    {this.getDropdownOptions()}
                </div>
            </div>
        )
    }
}

export default withRouter(NavBar);
