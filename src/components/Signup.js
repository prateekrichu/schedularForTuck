import React from "react";
import axios from "axios";
import { backendData } from "./Data.js";
import Spinner from "react-spinkit";
 


export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      name: "",
      interFirm: "",
      fullTmOffer: "",
      caseName:"",
      MentorOrMentee: "",
      errorMessage:"",
      successMessage:"",
      officeLoc:"",
      loading:false
    };
  }



  async handleSubmit(){
    this.setState({loading:true, errorMessage: "", successMessage: "" });
    const body = {
      userName: this.state.userName,
      password: this.state.password,
      name:this.state.name,
      interFirm:this.state.interFirm,
      fullTmOffer:this.state.fullTmOffer,
      isMentor:this.state.MentorOrMentee==="Mentor",
      numberOfMatches:0,
      caseName : this.state.caseName,
      officeLoc:this.state.officeLoc,
    };
    const headers = {
      "Access-Control-Allow-Origin": backendData.URL,
    };

    try {
      const response = await axios.post(`${backendData.URL}/sign-up`, body, {
        headers,
      });
      // console.log(response);
      this.setState({ successMessage: response.data, errorMessage:"" , userName: "",
      password: "",
      name: "",
      interFirm: "",
      fullTmOffer: ""
      ,caseName:""
      ,loading:false
      ,officeLoc:""
  });
    } catch (e) {
      // console.log(e);
      if(e && e.response && e.response.data ){
        this.setState({ errorMessage: e.response.data.message, successMessage:"" ,loading:false});
        
      }else{
        this.setState({ errorMessage: e.message, successMessage:"" ,loading:false});
      }
      
    }
  }
 
  radioSelectorMenteMentor() {
    return (
      <form className="ui form" onSubmit={(e) => e.preventDefault()}>
        <h2 className="ui header">Sign up</h2>
        <input
          className="form-input-control-radio"
          type="radio"
          value="Mentor"
          name="selector"
          onChange={(e) => this.setState({ MentorOrMentee: e.target.value, errorMessage:"", successMessage:"" })}
        />{" "}
        Mentor
        <input
          className="form-input-control-radio"
          type="radio"
          value="Mentee"
          name="selector"
          onChange={(e) => this.setState({ MentorOrMentee: e.target.value, errorMessage:"", successMessage:"" })}
        />{" "}
        Mentee
        {this.renderMenteeOrMentor()}
      </form>
    );
  }
  renderMenteeOrMentor() {
    if (this.state.MentorOrMentee === "") {
      return null;
    }
    return (
      <div className="ui fields">
        <div className="form-group">
          <label>Email address</label>
          <label className="text red">*</label>
          <input
            type="email"
            className="form-input-control-email"
            placeholder="Enter email"
            value={this.state.userName}
            onChange={(e) => this.setState({ userName: e.target.value , errorMessage:"", successMessage:""})}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <label className="text red">*</label>
          <input
            type="password"
            value={this.state.password}
            className="form-input-control-password"
            placeholder="Enter password"
            onChange={(e) => this.setState({ password: e.target.value , errorMessage:"", successMessage:""})}
          />
        </div>
        <div className="form-group">
          <label>Name</label>
          <label className="text red">*</label>
          <input
            type="name"
            className="form-input-control-name"
            placeholder="Enter name"
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value , errorMessage:"", successMessage:""})}
          />
        </div>
        {this.rendeMentor()}
        <button type="submit" className="ui_button" onClick={e=> this.handleSubmit()}>
          Submit
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
 
  rendeMentor() {
    if (this.state.MentorOrMentee === "Mentor") {
      return (
        <div>
          <div className="form-group">
            <label>Internship firm</label>
            <label className="text red">*</label>
            <input
              type="internshipFirm"
              className="form-input-control-internshipFirm"
              placeholder="Enter name of the firm you interned with"
              value={this.state.interFirm}
              onChange={(e) => this.setState({ interFirm: e.target.value , errorMessage:"", successMessage:""})}
            />
          </div>
          <div className="form-group">
            <label>Full time firm</label>
            <input
              type="OfferFirm"
              className="form-input-control-OfferFirm"
              placeholder="Enter name of the firm you are joining full time"
              value={this.state.fullTmOffer}
              onChange={(e) => this.setState({ fullTmOffer: e.target.value, errorMessage:"", successMessage:"" })}
            />
          </div>
          <div className="form-group">
            <label>Office Location</label>
            <input
              type="OfficeLoc"
              className="form-input-control-office-loc"
              placeholder="Enter the firm location you are joining full time"
              value={this.state.officeLoc}
              onChange={(e) => this.setState({ officeLoc: e.target.value, errorMessage:"", successMessage:"" })}
            />
          </div>
          <div className="form-group">
            <label>List of available case/s (name)</label>
            <input
              type="caseName"
              className="form-input-control-caseName"
              placeholder="Enter case name/s (Semi-colon seperated if more than one)"
              value={this.state.caseName}
              onChange={(e) => this.setState({ caseName: e.target.value, errorMessage:"", successMessage:"" })}
            />
          </div>
        </div>
      );
    }
  }
 
  render() {
    // console.log(this.state);
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
    
    return (
      <div>
        <a href="/" className="ui button top right" style={{color:"white", fontWeight:"bold"}}>
              Home
            </a>
        {/* <img className="tuck_image" src={pic} alt="Tuck School of Business" /> */}
        {this.radioSelectorMenteMentor()}
        <div className="text center">
          Note: <label className="text red">*</label> marked fields are
          mandatory
        </div>
      </div>
    );
  }
}
