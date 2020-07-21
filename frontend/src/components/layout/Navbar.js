import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        const { user } = this.props.auth;
        return (
            <div className="navbar-fixed">
                <nav className="z-depth-0">
                    <div className="nav-wrapper white">
                        { this.props.location.pathname.toLowerCase() === "/groups" ? null :
                        <Link
                            to="/groups"
                            className="btn waves-effect waves-light hoverable blue accent-3">
                            Return to groups
                        </Link>
                        }
                        <Link
                        to="/groups"
                        style={{
                            fontFamily: "monospace"
                        }}
                        className="col s5 brand-logo center black-text"
                        >
                            <i className="material-icons">code</i>
                            MERIDIAN
                        </Link>
                        { user == null || user.name == null ? null :
                            <ul className="right">
                                <li><span className="currentUser">Hello, {user.name.split(" ")[0]}</span></li>
                                <li><button
                                onClick={ this.onLogoutClick}
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3">
                                Logout
                            </button></li>
                            </ul>
                        }
                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect (
    mapStateToProps,
    { logoutUser }
)(withRouter(Navbar));