import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from "react-router-dom";
import NotFound from "./pages/notfound";
import Home from "./pages/Home";
import ManageProduct from './pages/admin/manageProduct';
import axios from 'axios';
import { API_URL } from './helper';
import { LoginAction } from './redux/actions'
import { connect } from "react-redux";
import Loading from './component/loading'
import Products from './pages/products';
import ProductDetail from './pages/productdetail';
import Login from './pages/login';
import SignUp from './pages/signup';
import Cart from './pages/user/cart';
import Transaction from './pages/user/transaction';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class App extends Component {
  state = {
    isLoading: true
  }

  componentDidMount() {
    let id = localStorage.getItem('id');
    axios
      .get(`${API_URL}/users/${id}`)
      .then((response) => {
        this.props.LoginAction(response.data)
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.setState({ isLoading: false })
      })
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />
    }
    return (

      <div>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/products' exact component={Products} />
          <Route path='/products/:idprod' component={ProductDetail} />
          <Route path='/cart' exact component={Cart} />
          <Route path='/transaction' exact component={Transaction} />
          <Route path='/login' exact component={Login} />
          <Route path='/signup' exact component={SignUp} />
          <Route path='*' component={NotFound} />
        </Switch>
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataUser: state.Auth
  }
}

export default connect(mapStateToProps, { LoginAction })(App);
