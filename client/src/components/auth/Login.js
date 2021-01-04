import React, { useState, useEffect } from "react"
import PropTypes from "prop-types";
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { loginUser } from "../../actions/authActions"
import classnames from "classnames"

const Login = (props) => {
    
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState([])

    const { email, password } = formData;

    const onChange = e => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };

      useEffect(() => {
        console.log(props)
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (props.auth.isAuthenticated) {
          props.history.push("/dashboard");
        }
      })
    const onSubmit = async e => {
        e.preventDefault();
        const User = {
          email,
          password
        };
        props.loginUser(User);
    };


    return(
        <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={(e) => onChange(e)}
                  value={email}
                  error={errors.email}
                  id="email"
                  name="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={(e) => onChange(e)}
                  value={password}
                  error={errors.password}
                  id="password"
                  name="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);