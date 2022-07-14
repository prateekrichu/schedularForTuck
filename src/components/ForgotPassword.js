import React from "react";
import axios from "axios";
import Spinner from "react-spinkit";
import { backendData } from "./Data";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.username || "",
      password: "",
      otp: "",
      errorMessage: "",
      loading: false,
      successMessage: "",
    };
  }
  async handleResetChange() {
    const url = `${backendData.URL}/reset-password`;
    const body = {
      userName: this.state.userName,
      password: this.state.password,
      otp: this.state.otp,
    };
    const headers = {
      "Access-Control-Allow-Origin": backendData.URL,
    };
    try {
      const response = await axios.post(url, body, {
        headers,
      });
      console.log(response);
      this.setState({ successMessage: response.data, errorMessage: "" });
    } catch (e) {
      console.log(e);
      if (e && e.response && e.response.data) {
        this.setState({
          errorMessage: e.response.data.message,
          successMessage: "",
        });
      } else {
        this.setState({ errorMessage: e.message, successMessage: "" });
      }
    }
  }

  async handleOtpChange() {
    this.setState({ loading: true });
    if (this.state.userName === "") {
      this.setState({
        loading: false,
        errorMessage: "Please enter a username!",
      });

      return null;
    }
    try {
      const url = `${backendData.URL}/generate-otp/${this.state.userName}`;
      const response = await axios.get(url);
      console.log(response);
      this.setState({ loading: false, errorMessage: "" });
    } catch (e) {
      console.log(e);
      if (e && e.response && e.response.data) {
        this.setState({
          loading: false,
          errorMessage: e.response.data.message,
          successMessage: "",
        });
      } else {
        this.setState({
          loading: false,
          errorMessage: e.message,
          successMessage: "",
        });
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
            style={{ width: 100, height: 100 }}
          />
        </div>
      );
    }
    return (
      <div>
        <h2 className="ui header">Reset Password</h2>
        <div className="equal width fields">
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-input-control-email"
              placeholder="Enter email"
              value={this.state.userName}
              onChange={(e) =>
                this.setState({
                  userName: e.target.value,
                  errorMessage: "",
                  successMessage: "",
                })
              }
            />
          </div>
          <div className="form-group">
            <label>OTP</label>
            <input
              type="otp"
              value={this.state.otp}
              className="form-input-control-otp"
              placeholder="Enter OTP"
              onChange={(e) =>
                this.setState({
                  otp: e.target.value,
                  errorMessage: "",
                  successMessage: "",
                })
              }
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={this.state.password}
              className="form-input-control-password"
              placeholder="Enter password"
              onChange={(e) =>
                this.setState({
                  password: e.target.value,
                  errorMessage: "",
                  successMessage: "",
                })
              }
            />
          </div>
        </div>
        {this.renderButtons()}
        <div className="error">
          {this.state.errorMessage && this.state.errorMessage !== ""
            ? this.state.errorMessage
            : ""}
        </div>
        <div className="success">
          {this.state.successMessage && this.state.successMessage !== ""
            ? this.state.successMessage
            : ""}
        </div>
      </div>
    );
  }

  renderButtons() {
    if (this.state.otp === "") {
      return (
        <button
          type="submit"
          className="ui_button"
          onClick={(e) => this.handleOtpChange(e)}
        >
          Genetrate OTP
        </button>
      );
    }
    if (this.state.otp !== "" && this.state.userName !== "") {
      return (
        <button
          type="submit"
          className="ui_button"
          onClick={(e) => this.handleResetChange(e)}
        >
          Submit
        </button>
      );
    }
  }

  render() {
    console.log(this.state);
    return (
      <form className="ui form" onSubmit={(e) => e.preventDefault()}>
        {this.login()}
      </form>
    );
  }
}

export default ForgotPassword;
