import React, { Component } from 'react';
import Header from '../component/header';
import Button from '../component/button'
import { API_URL } from '../helper';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { connect } from 'react-redux';
import { LoginAction, LoginActionThunk, ErrorAction, ResetActionThunk, LoadingAction, RegActionThunk } from "./../redux/actions";
import { Container, Alert } from 'reactstrap';
import Loader from "react-loader-spinner";
import { Redirect } from 'react-router';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


class SignUp extends Component {
    state = {
        email: "",
        password: "",
        confirmpassword: "",
        isVisible: false,
    }

    toggle = () => {
        this.setState({ isVisible: !this.state.isVisible })
    }

    onInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onRegisterSubmit = (event) => {
        event.preventDefault();
        const { email, password, confirmpassword } = this.state
        let dataBaru = {
            id: 0,
            email,
            password,
            confirmpassword,
        }
        this.props.RegActionThunk(dataBaru)
    }

    render() {
        if (this.props.dataUser.isLogin) {
            MySwal.fire({
                position: 'center',
                icon: 'success',
                title: 'Berhasil Register',
                showConfirmButton: false,
                timer: 1500
            })
            return <Redirect to="/" />
        }
        return (
            <div>
                <Header />
                <Container>

                    <div className="container mt-4" >
                        <div className="row" style={{ height: "50vh" }}>
                            <div className="col-md-6 align-self-center" style={{ backgroundColor: "" }}>
                                <img src="https://minzel.io/svg/logout_background_blue_spot_1.svg" alt="" />
                            </div>
                            <div className="col-md-6 d-flex align-items-center justify-content-center" style={{ backgroundColor: "" }}>
                                <form className="d-flex flex-column align-items-center" onSubmit={this.onRegisterSubmit} style={{ width: "50%" }}>
                                    <h1>Sign Up</h1>
                                    <input
                                        className="form-control my-2"
                                        type="email"
                                        placeholder="email"
                                        name="email"
                                        onChange={this.onInputChange}
                                        value={this.state.email}
                                    />
                                    <input
                                        className="form-control mb-2"
                                        type={this.state.isVisible ? "text" : "password"}
                                        placeholder="password"
                                        name="password"
                                        onChange={this.onInputChange}
                                        value={this.state.password}
                                    />
                                    <input
                                        className="form-control mb-2"
                                        type={this.state.isVisible ? "text" : "password"}
                                        placeholder="confirm password"
                                        name="confirmpassword"
                                        onChange={this.onInputChange}
                                        value={this.state.confirmpassword}
                                    />
                                    <h6>Sudah Punya Akun? <Link to="/login">Masuk Disini</Link> </h6>
                                    <div className="float-right mt-1 mb-3">
                                        {this.state.isVisible ?
                                            <FaEye
                                                style={{ fontSize: "1.3em", color: "#0D6EFD" }}
                                                onClick={this.toggle}
                                            />
                                            :
                                            <FaEyeSlash
                                                style={{ fontSize: "1.3em", color: "grey" }}
                                                onClick={this.toggle}
                                            />
                                        }
                                    </div>
                                    <div className="w-100">
                                        {
                                            this.props.dataUser.loading ?
                                                <Loader type="Rings" color="#0D6EFD" height={100} width={100} />
                                                :
                                                <Button submit={true}>Register</Button>
                                        }
                                    </div>
                                    {
                                        this.props.dataUser.error ?
                                            <Alert color="danger mt-3 w-100">
                                                {this.props.dataUser.error}{" "} <span className="float-right" onClick={this.props.ResetActionThunk}>X</span>
                                            </Alert>
                                            :
                                            null
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

const MapstatetoProps = (state) => {
    return {
        dataUser: state.Auth,
    }
}

export default connect(MapstatetoProps, { LoginAction, ErrorAction, LoginActionThunk, ResetActionThunk, LoadingAction, RegActionThunk })(SignUp);