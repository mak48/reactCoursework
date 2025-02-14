import React from 'react';

import Login from './Login';


class WelcomePage extends React.Component {
  state ={
    email: '',
    password: ''
  }
  onEmailChange = (e) =>{
    this.setState({
        email: e.target.value
    })
  }  
  onPasswordChahge = (e) =>{
    this.setState({
      password: e.target.value
    })
  }
  onSigninSubmit = (e) =>{
    e.preventDefault();
    console.log('email: ' + this.state.email + ', password: ' + this.state.password);
  }
  render() {
    return(
      <Login 
        onSigninSubmit={this.onSigninSubmit} 
        onEmailChange={this.onEmailChange}
        email={this.state.email}
        password={this.state.password}
        onPasswordChahge={this.onPasswordChahge}
      />
    )
  }
}

export default WelcomePage;