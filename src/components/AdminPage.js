import React from "react";
import axios from "axios";
import Spinner from "react-spinkit";

export default class Availabilities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.userName || "",
      password: this.props.password || "",
      errorMessage: "",
      successMessage: "",
      loading: false,
    };
  }
  async handleScheduleClick() {
    this.setState({ loading: true, errorMessage: "", successMessage: "" });
    let url = `http://localhost:8080/schedule/${this.state.userName}`;
    try {
      const response = await axios.get(url, {
        headers: {
          password: this.state.password,
        },
      });
      console.log(response);
      this.setState({
        successMessage: response.data,
        errorMessage: "",
        loading: false,
      });
    } catch (e) {
      console.log(e);
      if (e && e.response && e.response.data) {
        this.setState({
          errorMessage: e.response.data.message,
          successMessage: "",
          loading: false,
        });
      } else {
        this.setState({
          errorMessage: e.message,
          successMessage: "",
          loading: false,
        });
      }
    }
  }

  renderAdminForm() {
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
        <button
          className="ui button top right"
          type="submit"
          onClick={this.props.logout}
        >
          Logout
        </button>
        <button
          className="ui button schedule"
          type="submit"
          onClick={(e) => this.handleScheduleClick()}
        >
          Schedule
        </button>
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

  render() {
    if (this.props.isAdmin === false) {
      return null;
    }
    console.log(this.state);
    return (
      <div>
        <form className="ui form" onSubmit={(e) => e.preventDefault()}>
          {this.renderAdminForm()}
        </form>
        <div className="text center">
          {this.state.loading
            ? null
            : "Click on Schedule button for scheduling appoitments!"}
        </div>
      </div>
    );
  }
}
