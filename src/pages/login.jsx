import React, { Component } from 'react';
import Header from '../component/header';
import Button from '../component/button'
import { Alert, Container } from 'reactstrap';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoginAction, LoginActionThunk, ResetActionThunk } from "./../redux/actions"; // * kalau kita panggil sampai folder doang, komputer otomatis akan mencari file index
import { connect } from 'react-redux'; // * mau dia reducers atau actions PERLU connect
import { Redirect } from "react-router-dom";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
// * untuk import kalau yang dari library pakai kurung kurawal dan yang exportnya langsung const .... , tidak pakai export default (isitalahnya export by name)
// * untuk import yang tidak pakai kurung kurawal itu berarti dia export default

class Login extends Component {
    state = {
        isVisible: false,
        email: "",
        password: "",
    }

    toggle = () => {
        this.setState({ isVisible: !this.state.isVisible })
    }

    onInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onLoginSubmit = (event) => {
        // * guna thunk adalah membuat Axios dapat ditulis di dalam Redux Actions
        // dengan thunk akan memudahkan agar semua data kita ada di redux
        event.preventDefault(); // <-- function ini untuk mencegah reload saat memasukan data
        const { username, password } = this.state

        // * without thunk:
        // axios
        //     .get(`${API_URL}/users?username=${username}&password=${password}`)
        //     .then((result) => {
        //         if (result.data.length) {
        //             localStorage.setItem('id', result.data[0].id); // * id didapat dari result.data ke 0 .id
        //             this.props.LoginAction(result.data[0])
        //         } else {
        //             alert('user tidak ditemukan')
        //         }
        //     }).catch((error) => {
        //         console.log(error)
        //     })

        // * with thunk:
        let data = { username: username, password }
        this.props.LoginActionThunk(data)
    }

    render() {
        if (this.props.dataUser.isLogin) {
            // * Redirect dipakai untuk pindah ke Home setelah Login
            return <Redirect to="/" />
        }
        return (
            <div>
                <Header />
                <Container>
                    {/* <div className="container mt-4" > */}
                    <div className="row" style={{ height: "70vh" }}>
                        <div className="col-md-6 align-self-center" style={{ backgroundColor: "" }}>
                            <img src="https://minzel.io/svg/logout_background_blue_spot_1.svg" alt="" />
                        </div>
                        <div className="col-md-6 d-flex align-items-center justify-content-center" style={{ backgroundColor: "" }}>
                            <form onSubmit={this.onLoginSubmit} className="d-flex flex-column align-items-center" style={{ width: "50%" }}>
                                <h1>Login</h1>
                                <input
                                    className=" form-control my-3 inp"
                                    type="text"
                                    placeholder="email"
                                    name="email" // namenya samain dengan yang ada di state
                                    onChange={this.onInputChange}
                                    value={this.state.email}
                                />
                                <input
                                    className="form-control mb-3"
                                    type={this.state.isVisible ? "text" : "password"}
                                    placeholder="password"
                                    name="password"
                                    onChange={this.onInputChange}
                                    value={this.state.password}
                                />
                                <h6>Belum Punya Akun? <Link to="/signup">Daftar Disini</Link> </h6>
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
                                            <Button submit={true}>Login</Button>
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
                    {/* </div> */}
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

export default connect(MapstatetoProps, { LoginAction, LoginActionThunk, ResetActionThunk })(Login);
// * export default, tiap file itu hanya boleh 1
// * kalau export by name itu boleh lebih dari 1, makanya pakai kurung kurawal