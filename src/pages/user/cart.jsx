import React, { Component } from 'react';
import Header from '../../component/header';
import { Table, Modal, ModalBody, ModalHeader, ModalFooter, Container } from "reactstrap";
import { connect } from "react-redux";
import { API_URL, currencyFormatter } from '../../helper';
import axios from "axios";
import { CartAction } from '../../redux/actions';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from "react-toastify";

const MySwal = withReactContent(Swal)

class Cart extends Component {
    state = {
        modal: false,
        stokadmin: [],
        loading: true,
        products: []
    };

    componentDidMount() {
        // axios
        //     .get(`${API_URL}/products`)
        //     .then((res) => {
        //         this.setState({ products: res.data });
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        var arr = []
        let cart = this.props.dataUser.cart
        cart.forEach((val) => {
            arr.push(axios.get(`${API_URL}/products/${val.id}`))
        })
        console.log(cart, "30")
        Promise.all(arr).then((result) => {
            console.log(result);
            var newarr = []
            result.forEach((val, index) => {
                newarr.push({ id: val.data.id, stokadmin: val.data.stock })
            })
            console.log(newarr)
            this.setState({ stokadmin: newarr })
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            this.setState({ loading: false })
        })

    }

    onMinusClick = (index) => {
        let cart = this.props.dataUser.cart;
        let hasil = cart[index].qty - 1
        if (hasil < 1) {

        } else {
            cart[index].qty = cart[index].qty - 1;
            let iduser = this.props.dataUser.id;
            axios.patch(`${API_URL}/users/${iduser}`, { cart: cart })
                .then((result) => {
                    this.props.CartAction(result.data.cart)
                })
                .catch((error) => {
                    console.log(error)
                })

        }
    }

    onPlusClick = (index) => {
        let cart = this.props.dataUser.cart;
        let idprod = cart[index].id
        axios
            .get(`${API_URL}/products/${idprod}`)
            .then((result) => {
                let stock = result.data.stock
                let qty = cart[index].qty
                let hasil = qty + 1
                if (hasil > stock) {
                    toast.error('Qty melebihi stock', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    cart[index].qty = hasil
                    let iduser = this.props.dataUser.id;
                    axios.patch(`${API_URL}/users/${iduser}`, { cart: cart })
                        .then((result) => {
                            this.props.CartAction(result.data.cart)
                        })
                        .catch((error) => {
                            console.log(error)
                        })

                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    renderCart = () => {
        return this.props.dataUser.cart.map((val, index) => {
            return (
                <tr keys={index}>
                    <td>{index + 1}</td>
                    <td>{val.name}</td>
                    <td><img src={val.img} alt={val.name} widht="" height="200px" /></td>
                    <td>{currencyFormatter(val.price)}</td>
                    <td>
                        <button
                            className="btn btn-danger mr-2"
                            disabled={val.qty === 1}
                            onClick={() => this.onMinusClick(index)}
                        >
                            -
                        </button>
                        {val.qty}
                        <button
                            className="btn btn-success ml-2"
                            onClick={() => this.onPlusClick(index)}
                        // disabled={val.qty === this.state.stokadmin[index].stokadmin}
                        >
                            +
                        </button>
                    </td>
                    <td>{currencyFormatter(val.price * val.qty)}</td>
                    <td>
                        <button onClick={() => this.onDeleteClick(index)} className="btn btn-danger">
                            Delete
                        </button>
                    </td>
                </tr >
            )
        })
    }

    renderTotal = () => {
        let total = 0
        this.props.dataUser.cart.forEach((val) => {
            total += val.price * val.qty
        })
        return total
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal })
    }

    onInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    renderRadio = () => {
        return this.state.banks.map((val, index) => {
            return (
                <label key={index} className="mx-3">
                    <input
                        type="radio"
                        name="pilihanId"
                        onChange={this.onInputChange}
                        checked={this.state.pilihanId == val.id}
                        value={val.id}
                        className="mr-1"
                    />
                    {val.nama} : {val.norek}
                </label>

            )
        })
    }

    onCheckoutClick = () => {
        console.log(this.state)
        let iduser = this.props.dataUser.id
        let data = {
            userId: this.props.dataUser.id,
            tanggal: new Date(),
            status: "belum bayar",
            products: this.props.dataUser.cart,
            bankId: 0,
            bukti: ''
        }
        axios
            .post(`${API_URL}/transactions`, data)
            .then(() => {
                axios
                    .patch(`${API_URL}/users/${iduser}`, { cart: [] })
                    .then((result2) => {
                        var stokadmin = this.state.stokadmin
                        var cart = this.props.dataUser.cart
                        var stokfetch = stokadmin.map((val, index) => {
                            let stokakhir = val.stokadmin - cart[index].qty
                            return axios.patch(`${API_URL}/products/${val.id}`, { stok: stokakhir })
                        })
                        Promise.all(stokfetch).then(() => {
                            this.props.CartAction(result2.data.cart)
                            this.setState({ modal: false })
                        }).catch((error) => {
                            console.log(error)
                        })

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }


    onDeleteClick = (index) => {
        let cart = this.props.dataUser.cart;
        // start sweetalert
        MySwal.fire({
            title: `Are you sure wanna Delete ${cart[index].name} ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // edit cart
                cart.splice(index, 1);
                let iduser = this.props.dataUser.id;
                // refresh cart
                axios
                    .patch(`${API_URL}/users/${iduser}`, { cart: cart })
                    .then((res) => {
                        this.props.CartAction(res.data.cart);
                        MySwal.fire("Deleted!", "Your Cart has been deleted.", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    };

    render() {
        if (this.state.loading) {
            return (
                <h1>Loading</h1>
            )
        }
        return (
            <div>
                <Modal centered isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Checkout</ModalHeader>
                    <ModalBody>
                        Are you sure want to checkout?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-success" onClick={this.onCheckoutClick}>
                            Yes
                        </button>
                        <button className="btn btn-danger" onClick={this.toggle}>
                            Cancel
                        </button>
                    </ModalFooter>
                </Modal>
                <Header />
                <Container>
                    <Breadcrumb className="mt-5">
                        <BreadcrumbItem>
                            <Link to='/'>Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem><Link to='/products'>Product</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Cart</BreadcrumbItem>
                    </Breadcrumb>
                    <Table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderCart()}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>TOTAL</td>
                                <td>{currencyFormatter(this.renderTotal())}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => this.setState({ modal: true })}>
                                        Checkout
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
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
export default connect(MapstatetoProps, { CartAction })(Cart);