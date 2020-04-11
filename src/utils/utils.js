import slugify from "slugify";
import path from 'path';

export default class Utils {

    static sendEmail(from, subject, message, callback) {

        fetch('http://localhost:3002/email', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: new URLSearchParams({
                'from': from,
                'subject': subject,
                'message': message,
            })
        }).then((r) => {
            return r.json();
        }).then((r) => {
            callback(null, r);
        }).catch((e) => {
            callback(e);
        });
    }

    static fetchInfo(callback) {
        fetch('/data/info.json')
            .then(response => {
                return response.json();
            }).then(projects => {
            if(callback) {
                callback(null, projects);
            }
        }).catch(e => {
            if(callback) {
                callback(e);
            }
        });
    }

    static fetchProjects(callback) {
        fetch('/data/projects.json')
            .then(response => {
                return response.json();
            }).then(projects => {
                if(callback) {
                    callback(null, projects);
                }
            }).catch(e => {
                if(callback) {
                    callback(e);
                }
            });
    }

    static fetchProjectBySlug(slug, callback) {
        this.fetchProjects((err, projects) => {
            if(err) {
                if(callback) {
                    callback(err);
                }
            } else {
                let found = null;
                for(let i = 0; i < projects.length; i++) {
                    if(slugify(projects[i].name) === slug) {
                        found = projects[i];
                        break;
                    }
                }
                if(callback) {
                    callback(null, found);
                }
            }
        })
    }

    static getResourcePath(mediaDir, file) {
        let width = window.innerWidth;
        let def = width <= 960 ? 'lo' : 'hi';
        let p = path.join(mediaDir, def, file);
        return p;
    }

}
