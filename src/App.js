import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Navbar from './components/layout/Navbar.js'
import Users from './components/users/Users.js'
import Search from './components/users/Search.js'
import Alert from './components/layout/Alert.js'
import About from './components/pages/About.js'
import User from './components/users/User.js'
import axios from 'axios'
import './App.css';



class App extends Component {
state = {
  users: [],
  user: {},
  loading: false,
  alert: null,
}



//Search Github users
searchUsers = async(text) => {
this.setState({loading: true})

  const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
  this.setState({users: res.data.items, loading: false})
}

//Get single github user
getUser = async (username) => {
  this.setState({loading: true})

  const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
  this.setState({user: res.data, loading: false})
}

//Clear users from state
clearUsers = () => this.setState({users: [], loading: false})

//set alert
setAlert = (msg, type) => {
this.setState( { alert: {msg: msg, type: type } })

setTimeout(() => this.setState({alert: null}), 3000)
}

  render(){
    const {users, user, loading} = this.state

  return (
    <Router>
    <div className="app">
      <Navbar />
      
      <div className="container">
        <Alert alert={this.state.alert} />
        <Switch>
          <Route exact path="/" render={props => (
            <Fragment>
              <Search searchUsers={this.searchUsers} clearUsers={this.clearUsers} showClear={users.length > 0 ? true : false} setAlert={this.setAlert} />
              <Users loading={ loading} users={users} />
            </Fragment>
          )}/>
          <Route exact path="/about" component={About} />
          <Route exact path="/user/:login" render={props => (
            <User {...props } getUser={this.getUser} user={user} loading={loading} />
          )} />
        </Switch>
      </div>
     
    </div>
    </Router>
  );
} 
}

export default App;

//This load users in the starting page
// async componentDidMount(){
//   this.setState({loading: true});

//   const res = await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
//     this.setState({users: res.data, loading: false})

// }