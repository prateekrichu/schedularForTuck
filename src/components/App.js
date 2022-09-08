import React from "react";
import axios from "axios";
import Signup from "./Signup";
import Availabilities from "./Availabilities";
import AdminPage from "./AdminPage";
import ForgotPassword from "./ForgotPassword";
import Route from "./Route";
import pic from "../download.png";
import { backendData } from "./Data.js";
import Spinner from "react-spinkit";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      openPage: false,
      errorMessage: "",
      isAdmin:false,
      loading:false
    };
    this.logout = this.logout.bind(this);
  }

  logout(){
    this.setState({openPage:false, userName:"", password:"", errorMessage:"", isAdmin:false});
  }

  async handleChange() {
    if(this.state.userName==="" || this.state.password===""){
      this.setState({errorMessage:"Username or Password cannot be empty!"});
      return null;
    }
    this.setState({loading:true, errorMessage:""});
    const body = {
      userName: this.state.userName,
      password: this.state.password,
    };
    const headers = {
      "Access-Control-Allow-Origin":  backendData.URL ,
    };

    try {
      const response = await axios.post(`${backendData.URL}/login`, body, {
        headers,
      });
      // console.log(response);
      this.setState({ openPage: response.data.openPage, isAdmin:response.data.isAdmin
        , errorMessage:"", loading:false });
    } catch (e) {
      // console.log(e);
      if(e && e.response && e.response.data ){
        this.setState({ errorMessage: e.response.data.message, loading:false });
        
      }else{
        this.setState({ errorMessage: e.message, loading:false });
      }
      
    }
  }
  login() {
    if (this.state.loading) {
      return (
        <div>
          <Spinner
            className="spinner"
            name="wave"
            color="coral"
            style={{ width: 100, height: 100}}
          />
        </div>
      );
    }
    if (this.state.openPage) {
      return null;
    }
    if (this.state.isAdmin) {
      return null;
    }
    return (
      <form className="ui form" onSubmit={(e) => e.preventDefault()}>
        <h2 className="ui header">Sign in</h2>
        <div className="equal width fields">
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-input-control-email"
              placeholder="Enter email"
              value={this.state.userName}
              onChange={(e) => this.setState({ userName: e.target.value , errorMessage:""})}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={this.state.password}
              className="form-input-control-password"
              placeholder="Enter password"
              onChange={(e) => this.setState({ password: e.target.value , errorMessage:""})}
            />
          </div>
        </div>
        <button
          type="submit"
          className="ui_button"
          onClick={(e) => this.handleChange(e)}
        >
          Submit
        </button>
        <div className="error">
        {this.state.errorMessage && this.state.errorMessage !== "" ? (
          this.state.errorMessage
        ) : ""}
        </div>
        <p className="forgot-password text-left">
          Forgot{" "}
          <a href="/forgot-password" className="item">
            Password
          </a>
        </p>
        <p className="forgot-password text-right">
          New User{" "}
          <a href="/sign-up" className="item">
            Signup
          </a>
        </p>
      </form>
    );
  }

  render() {
    // console.log(this.state);
    return (
      <div>
        <img className="tuck_image" src={pic} alt="Tuck School of Business" />
        <Route path="/">{this.login()}</Route>
        <Route path="/forgot-password">
          <ForgotPassword username={this.state.userName} />
        </Route>
        <Route path="/sign-up">
          <Signup />
        </Route>
        {this.state.openPage ? <Availabilities
        userName={this.state.userName}
        password={this.state.password}
        logout={this.logout}
        /> : null}
        {this.state.isAdmin ? <AdminPage
        userName={this.state.userName}
        password={this.state.password}
        logout={this.logout}
        /> : null}
      </div>
    );
  }
}
