import React from "react";
import axios from "axios";
import Spinner from "react-spinkit";
import { backendData } from "./Data.js";
import TableFilter from "react-table-filter";
import "react-table-filter/lib/styles.css";

export default class Availabilities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.userName || "",
      password: this.props.password || "",
      errorMessage: "",
      successMessage: "",
      loading: false,
      users:[],
      
    };
    this._filterUpdated = this._filterUpdated.bind(this);
  }
  async handleScheduleClick() {
    this.setState({ loading: true, errorMessage: "", successMessage: "" });
    let url = `${backendData.URL}/schedule/${this.state.userName}`;
    try {
      const response = await axios.get(url, {
        headers: {
          password: this.state.password,
        },
      });
      // console.log(response);
      this.setState({
        successMessage: response.data,
        errorMessage: "",
        loading: false,
      });
    } catch (e) {
      // console.log(e);
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

  async handleGetDetailsClick(){
    this.setState({ loading: true, errorMessage: "", successMessage: "" });
    let url = `${backendData.URL}/get-all-user-details`;
    try {
      const response = await axios.get(url, {
        headers: {
          username: this.state.userName,
          password: this.state.password,
        },
      });
      // console.log(response);
      this.setState({
        users:response.data,
        successMessage: "success",
        errorMessage: "",
        loading: false,
      });
    } catch (e) {
      // console.log(e);
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
        <div className="ui center">
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
      <div className="ui center">
        <button
          className="ui button top right"
          type="submit"
          onClick={this.props.logout}
        >
          Logout
        </button>
        <button
          className="ui_button schedule"
          type="submit"
          onClick={(e) => this.handleScheduleClick()}
        >
          Schedule
        </button>
        <button
          className="ui_button getusers"
          type="submit"
          onClick={(e) => this.handleGetDetailsClick()}
        >
          Get All Users
        </button>
        {this.renderTable()}
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
  async deleteUser(e){
    const body = {
      userName: this.state.userName,
      password: this.state.password,
      userToDelete: e.userName
    };
    const headers = {
      "Access-Control-Allow-Origin": backendData.URL,
    };
    try {
      const response = await axios.post(
        `${backendData.URL}/delete-user`,
        body,
        {
          headers,
        }
      );
      // console.log(response);
      this.setState({ successMessage: response.data, errorMessage: "" });
      this.handleGetDetailsClick();
    } catch (e) {
      // console.log(e);
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


  renderTable(){
    const result = this.state.users.reduce((a,v) =>  a = a + v.numberOfCases , 0 );
    let elementsHtml = this.state.users.map((user, index) => {
      return (
        <tr key={"row_" + index}>
          <td className="cell">{user.userName}</td>
          <td className="cell">{user.name}</td>
          <td className="cell">{user.isMentor? "Mentor": "Mentee"}</td>
          <td className="cell">{user.numberOfCases}</td>
          <td style={{border:'none'}}><button onClick={(e)=> this.deleteUser(user)}>delete</button></td>
        </tr>
      );
    });
    elementsHtml = elementsHtml.concat(<tr key = "row_Total">
      <td></td>
      <td></td>
      <td>Total</td>
      <td>{result}</td>
    </tr>)
    
    return (
      <div className="ui table">
        <h3>Users</h3>
        <table className="basic-table">
          <thead>
            <TableFilter
                  rows={this.state.users}
                  onFilterUpdate={ this._filterUpdated}
                >
                <th
                    key="userName"
                    filterkey="userName"
                    className="cell"
                    casesensitive={"true"}
                    showsearch={"true"}
                  >
                    Email
                  </th>
                  <th
                    key="name"
                    filterkey="name"
                    className="cell"
                    casesensitive={"true"}
                    showsearch={"true"}
                  >
                    Name
                  </th>
                  <th
                    key="isMentor"
                    filterkey="isMentor"
                    className="cell"
                    alignleft={"true"}
                  >
                    Mentor/Mentee
                  </th>
                  <th
                    key="numberOfCases"
                    filterkey="numberOfCases"
                    className="cell"
                    alignleft={"true"}
                  >
                    Number Of Cases
                  </th>
            </TableFilter>
            </thead>
            <tbody>{elementsHtml}</tbody>
        </table>
      </div>
    );
  }
  _filterUpdated(newData, filtersObject) {
    this.setState({
      users: newData
    });
  }

  render() {
    console.log(this.state.users);
    if (this.props.isAdmin === false) {
      return null;
    }
    // console.log(this.state);
    return (
      <div>
        <form className="ui admin form" onSubmit={(e) => e.preventDefault()}>
          {this.renderAdminForm()}
          
        </form>
        <div className="text center">
          {this.state.loading
            ? null
            : "Click on Schedule button for scheduling appointments!"}
        </div>
      </div>
    );
  }
}
