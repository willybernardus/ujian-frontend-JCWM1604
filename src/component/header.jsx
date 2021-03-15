import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge,
} from 'reactstrap';
import "./styles/header.css";
import { GiSonicShoes } from "react-icons/gi";
import { FaCartArrowDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { LogoutAction } from '../redux/actions';


class Header extends Component {
    state = {
        isOpen: false,
    }

    toggle = () => this.setState({ isOpen: !this.setState.isOpen });

    onLogOutClick = () => {
        localStorage.removeItem("id");
        this.props.LogoutAction();
        toast('Logout Berhasil', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    }
    render() {
        return (
            <div>
                <Navbar className="bg-light px-5 shadow" light expand="md">
                    <NavbarBrand href="/">
                        <span className="font-weight-bold header-brand header-color">
                            <GiSonicShoes /> Cupatu
                        </span>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.stateisOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {this.props.dataUser.isLogin ? (
                                <>
                                    {
                                        this.props.dataUser.role === 'admin' ? null
                                            :
                                            <>
                                                <Link to='/transaction'>
                                                    <NavItem className="py-2 mx-2">Transaction</NavItem>
                                                </Link>
                                                <NavItem className="py-2 mx-2">
                                                    <Link to='/cart'>
                                                        <FaCartArrowDown style={{ fontSize: "25px", color: "black" }} />
                                                    </Link>

                                                    {
                                                        this.props.dataUser.cart.length ? (
                                                            <Badge
                                                                style={{
                                                                    position: "relative",
                                                                    bottom: 10,
                                                                    right: 5,
                                                                    backgroundColor: "#0D6EFD",
                                                                }}
                                                                className="p-1 rounded-circle text-center"
                                                            >
                                                                {this.props.dataUser.cart.length}
                                                            </Badge>)
                                                            :
                                                            null
                                                    }
                                                </NavItem>
                                            </>
                                    }
                                    <UncontrolledDropdown nav inNavbar>
                                        {/* dataUser asalnya dari MapstatetoProps */}
                                        <DropdownToggle nav>{this.props.dataUser.email}</DropdownToggle>
                                        <DropdownMenu right>
                                            {/* <Link to='/manageProd' className='normal-link'>
                                                <DropdownItem>Manage Product</DropdownItem>
                                            </Link> */}

                                            <Link to="/">
                                                <DropdownItem onClick={this.onLogOutClick}>Log Out</DropdownItem>
                                            </Link>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </>
                            ) : (
                                <>
                                    <NavItem className="mx-2">
                                        <Link to="/login">
                                            <button className="header-login rounded px-4 py-2 font-weight-bold">
                                                Login
                                            </button>
                                        </Link>
                                    </NavItem>
                                    {/* <NavItem className="mx-2">
                                        <Link to="/signup">
                                            <button className="header-login rounded px-4 py-2 font-weight-bold">
                                                Sign Up
                                            </button>
                                        </Link>
                                    </NavItem> */}
                                </>
                            )
                            }
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

// * guna MapstatetoProps itu adalah membuat state yang ada di redux menjadi props untuk component header
// * ingat ya redux itu adalah state global. 
// * dia menghubungkannya ke component, itu mengubah state global menjadi props atau sebuah properti di component header
// * jadi dibawah ini adalah sebuah function yang isinya untuk mengubah state global menjadi propsnya si header
// * jadi seakan-akan redux itu menjadi bapak atau parent untuk semua component, kalau dia dikasih 'connect'
// * makanya dengan connect itu bisa menghubungkan semua component ke redux

const MapstatetoProps = (state) => {
    return {
        dataUser: state.Auth // Auth nya liat dari index.js karena tujuan kita authReducers
    }
}

export default connect(MapstatetoProps, { LogoutAction })(Header);