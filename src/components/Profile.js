import React from "react";
import axios from "axios";
import moment from 'moment';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      name: "",
      interFirm: "",
      fullTmOffer: "",
      MentorOrMentee: "Mentee",
      errorMessage: "",
      successMessage: "",
      caseName: "",
    };
  }

  componentDidMount() {
    this.setState({
      userName: this.props.userName,
      password: this.props.password,
      name: this.props.name,
      interFirm: this.props.interFirm,
      fullTmOffer: this.props.fullTmOffer,
      MentorOrMentee: this.props.MentorOrMentee,
      caseName: this.props.caseName,
    });
    
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        userName: this.props.userName,
        password: this.props.password,
        name: this.props.name,
        interFirm: this.props.interFirm,
        fullTmOffer: this.props.fullTmOffer,
        MentorOrMentee: this.props.MentorOrMentee,
        caseName: this.props.caseName,
      });
    }
  }

  async updateAvailability(e){
    console.log(e);
    const body = {
      userName: this.state.userName,
      password: this.state.password,
      name: this.state.name,
      interFirm: this.state.interFirm,
      fullTmOffer: this.state.fullTmOffer,
      isMentor: this.state.MentorOrMentee === "Mentor",
      startDate: e.startDate,
      endDate: e.endDate,
    };
    const headers = {
      "Access-Control-Allow-Origin": "http://localhost:8080",
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/delete-availability",
        body,
        {
          headers,
        }
      );
      console.log(response);
      this.setState({ successMessage: response.data, errorMessage: "" });
      this.props.getUserDetails();
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

  async handleSubmit(){
    const body = {
      userName: this.state.userName,
      password: this.state.password,
      name:this.state.name,
      interFirm:this.state.interFirm,
      fullTmOffer:this.state.fullTmOffer,
      isMentor:this.state.MentorOrMentee==="Mentor",
      numberOfMatches:0,
      caseName : this.state.caseName
    };
    const headers = {
      "Access-Control-Allow-Origin": "http://localhost:8080",
    };

    try {
      const response = await axios.post("http://localhost:8080/edit-profile", body, {
        headers,
      });
      console.log(response);
      this.setState({  successMessage: response.data });
    } catch (e) {
      console.log(e);
      if(e && e.response && e.response.data ){
        this.setState({ errorMessage: e.response.data.message, successMessage:"" });
        
      }else{
        this.setState({ errorMessage: e.message, successMessage:"" });
      }
      
    }
  }



  renderMentor() {
    if (this.state.MentorOrMentee === "Mentor") {
      return (
        <div>
          <div className="form-group ui bold">
            Internship Firm Name:{" "}
            <div className="ui normal">{this.state.interFirm}</div>
          </div>
          <div className="form-group">
            <label>Edit Full time offer with</label>
            <input
              type="OfferFirm"
              className="form-input-control-OfferFirm"
              placeholder="Enter Full time offer with"
              value={this.state.fullTmOffer}
              onChange={(e) =>
                this.setState({
                  fullTmOffer: e.target.value,
                  errorMessage: "",
                  successMessage: "",
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Edit Case Name/s</label>
            <input
              type="caseName"
              className="form-input-control-caseName"
              placeholder="Enter case name/s (Semi-colon seperated if more than one)"
              value={this.state.caseName}
              onChange={(e) =>
                this.setState({
                  caseName: e.target.value,
                  errorMessage: "",
                  successMessage: "",
                })
              }
            />
          </div>
        </div>
      );
    }
  }

  render() {
    console.log(this.state);
    console.log(this.props);
    return (
      <form className="ui form" onSubmit={(e) => e.preventDefault()}>
        <h2 className="ui header">Profile {this.state.MentorOrMentee}</h2>
        <div className="form-group ui bold">
          Email address: <div className="ui normal">{this.state.userName}</div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <label className="text red">*</label>
          <input
            type="password"
            value={this.state.password}
            className="form-input-control-password"
            placeholder="Change password"
            onChange={(e) =>
              this.setState({
                password: e.target.value,
                errorMessage: "",
                successMessage: "",
              })
            }
          />
        </div>
        <div className="form-group ui bold">
          Name: <div className="ui normal">{this.state.name}</div>
        </div>
        {this.renderMentor()}
        <button
          className="ui_button"
          type="submit"
          onClick={e => this.handleSubmit()}
        >
          Submit
        </button>
        <br/>
        <button
          className="ui button show aval"
          type="submit"
          onClick={this.props.showAvailability}
        >
          Register Availability
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
        <p className="ui bold">Selected avalabilities</p>
        <table>
          
        <tr>
          <th>From</th>
          <th>Till</th>
        </tr>
        {this.props.availabilitys.map((val, key) => {
          return (
            <tr key={key}>
              <td>{moment(val.startDate).format('MM-DD-YYYY hh:mm a')}</td>
              <td>{moment(val.endDate).format('MM-DD-YYYY hh:mm a')}</td>
              <td style={{border:'none'}}><button onClick={e=> this.updateAvailability(val)}>delete</button></td>
            </tr>
          )
        })}
        </table>
      </form>
    );
  }
}
