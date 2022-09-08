import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { enUS } from "date-fns/esm/locale";
import { addDays, addMinutes } from "date-fns";
import { components } from "react-select";
import { colourOptions, backendData } from "./Data.js";
import { default as ReactSelect } from "react-select";
import axios from "axios";
import Profile from "./Profile.js";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export default class Availabilities extends React.Component {
  constructor(props) {
    super(props);
    var d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    // console.log(d);
    registerLocale("en-us", enUS);
    setDefaultLocale("en-us");
    this.state = {
      userName: "",
      password: "",
      name: "",
      interFirm: "",
      fullTmOffer: "",
      MentorOrMentee: "Mentee",
      startDate: d,
      optionSelected: [],
      data: {},
      errorMessage: "",
      successMessage: "",
      endDate: addMinutes(d, 45),
      caseName: "",
      openAvalabilityPage: false,
      availabilitys: [],
      officeLoc:""
    };
    this.showAvailability = this.showAvailability.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
  }

  componentDidMount() {
    this.setState({
      userName: this.props.userName,
      password: this.props.password,
    });
    this.getUserDetails();
  }

  async getUserDetails() {
    let url = `${backendData.URL}/get-user-details/${this.props.userName}`;

    try {
      const response = await axios.get(url, {
        headers: {
          password: this.props.password,
        },
      });
      // console.log(response);
      this.setState({
        userName: response.data.userName,
        password: response.data.password,
        name: response.data.name,
        interFirm: response.data.interFirm,
        fullTmOffer: response.data.fullTmOffer,
        MentorOrMentee: response.data.isMentor ? "Mentor" : "Mentee",
        caseName: response.data.caseName,
        availabilitys: response.data.availabilitys,
        officeLoc:response.data.officeLoc
      });
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

  handleChange = (selected) => {
    this.setState({
      optionSelected: selected,
      errorMessage: "",
      successMessage: "",
    });
  };
  async handleClick() {
    // if (this.state.optionSelected.length === 0) {
    //   this.setState({ errorMessage: "Please select an option and try again!" });
    //   return null;
    // }
    const option = this.state.optionSelected.map((obj) => obj.label);
    const body = {
      userName: this.state.userName,
      password: this.state.password,
      name: this.state.name,
      interFirm: this.state.interFirm,
      fullTmOffer: this.state.fullTmOffer,
      isMentor: this.state.MentorOrMentee === "Mentor",
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      options: option,
    };
    const headers = {
      "Access-Control-Allow-Origin": backendData.URL,
    };

    try {
      const response = await axios.post(
        `${backendData.URL}/availabilities`,
        body,
        {
          headers,
        }
      );
      // console.log(response);
      this.setState({ successMessage: response.data, errorMessage: "" });
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

  renderMenteeForm() {
    if (this.state.MentorOrMentee === "Mentor") {
      return null;
    }
    return (
      <div>
        {this.renderDateParams()}
        {/* <FaCalendar className="cal icon"/> */}
      </div>
    );
  }

  renderDateParams() {
    var d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    // console.log(d);
    return (
      <div>
        <div className="form-group">
        <label>{this.state.MentorOrMentee === "Mentee"?"Available from (submit again for multiple):":"Available time slots (submit again for multiple):"}</label>
          <label className="text red">*</label>
          <DatePicker
            className="ui calender"
            locale="en-us"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={d}
            maxDate={addDays(d, 6)}
            selected={this.state.startDate}
            onChange={(date) =>
              this.setState({
                startDate: date,
                endDate: addMinutes(date, 45),
                errorMessage: "",
                successMessage: "",
              })
            }
          />
          {this.state.MentorOrMentee === "Mentee" ? (
            <div>
              <label>Available till:</label>
              <label className="text red">*</label>
              <DatePicker
                className="ui calender"
                locale="en-us"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={d}
                maxDate={addDays(d, 6)}
                selected={this.state.endDate}
                onChange={(date) =>
                  this.setState({
                    endDate: date,
                    errorMessage: "",
                    successMessage: "",
                  })
                }
              />
            </div>
          ) : null}
        </div>
        <div className="form-group">
          <label>{this.state.MentorOrMentee === "Mentee"?"Select the type of case you want to practice (please select one; subject to availability):":"Select the type of case/s available:"}</label>
          {/* <label className="text red">*</label> */}
          <span
            className="d-inline-block"
            data-toggle="popover"
            data-trigger="focus"
            data-content="Please selecet account(s)"
          >
            <ReactSelect
              options={colourOptions}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                Option,
              }}
              onChange={this.handleChange}
              allowSelectAll={true}
              value={this.state.optionSelected}
            />
          </span>
        </div>
        <button
          type="submit"
          className="ui_button"
          onClick={(e) => this.handleClick()}
        >
          Submit
        </button>
        <br />
        <button
          className="ui button show"
          type="submit"
          onClick={(e) => this.showProfile()}
        >
          Show profile
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
  showProfile() {
    this.getUserDetails();
    this.setState({ openAvalabilityPage: false });
  }

  renderAvalailityOrProfie() {
    if (this.state.openAvalabilityPage) {
      return (
        <form className="ui form" onSubmit={(e) => e.preventDefault()}>
          <h2 className="ui header">
            Welcome {this.state.name}, select availabilities
          </h2>
          {this.renderMentorForm()}
          {this.renderMenteeForm()}
        </form>
      );
    } else {
      return (
        <Profile
          userName={this.state.userName}
          password={this.state.password}
          name={this.state.name}
          interFirm={this.state.interFirm}
          fullTmOffer={this.state.fullTmOffer}
          MentorOrMentee={this.state.MentorOrMentee}
          caseName={this.state.caseName}
          officeLoc={this.state.officeLoc}
          availabilitys={this.state.availabilitys}
          showAvailability={this.showAvailability}
          getUserDetails={this.getUserDetails}
        />
      );
    }
  }

  showAvailability() {
    this.setState({
      openAvalabilityPage: true,
    });
  }

  renderMentorForm() {
    if (this.state.MentorOrMentee === "Mentee") {
      return null;
    }
    return (
      <div>
        {this.renderDateParams()}
        {/* <FaCalendar className="cal icon"/> */}
      </div>
    );
  }
  render() {
    if (this.props.openPage === false) {
      return null;
    }
    // console.log(this.state);
    return (
      <div>
        <button
          className="ui button top right"
          type="submit"
          onClick={this.props.logout}
        >
          Logout
        </button>
        {this.renderAvalailityOrProfie()}
      </div>
    );
  }
}
