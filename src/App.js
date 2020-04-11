import React from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import NavBar from "./components/NavBar";
import WorksOverview from "./components/WorksOverview";
import ProjectDetails from "./components/ProjectDetails";
import About from "./components/About";
import Contact from "./components/Contact";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.backgroundVideo = React.createRef();

        this.handlePanelInView = this.handlePanelInView.bind(this);
        this.handleProjectSelected = this.handleProjectSelected.bind(this);
    }

    handlePanelInView(video) {
        let player = this.backgroundVideo.current;
        if(video) {
            if(player.style.opacity > 0.0) {
                player.style.opacity = 0.0;
                player.ontransitionend = () => {
                    player.style.opacity = 1.0;
                    player.src = video;
                    player.type = "video/mp4";
                    player.ontransitionend = () => {

                    }
                };
            } else {
                player.src = video;
                player.type = "video/mp4";
                player.style.opacity = 1.0;
            }
        } else {
            player.style.opacity = 0.0;
            player.src = '';
        }
    }

    handleProjectSelected() {

    }

    render() {
        return (
            <div className="App" id="mainView">
                <video className="App-video" muted={true} loop={true} autoPlay={true} ref={this.backgroundVideo} playsInline={true}/>
                <div className="App-header">
                    <NavBar/>
                </div>
                <div className="App-body">
                    <Switch>
                        <Route exact path="/" render={(props) => {
                            return <WorksOverview onPanelInView={this.handlePanelInView} {...props}/>
                        }}/>
                        <Route exact path="/about" render={(props) => {
                            return <About onBackgroundLoaded={this.handlePanelInView} {...props}/>
                        }}/>
                        <Route exact path="/contact" render={(props) => {
                            return <Contact {...props}/>
                        }}/>
                        <Route exact path="/projects/:name" render={(props) => {
                            return <ProjectDetails {...props}/>
                        }}/>
                    </Switch>
                </div>
            </div>
        );
    }
}
