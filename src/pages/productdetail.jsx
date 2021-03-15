import React, { Component } from 'react';
import Header from "../component/header"
import axios from 'axios';
import { API_URL, currencyFormatter } from '../helper';
import { Container } from 'react-bootstrap';
import Loading from '../component/loading';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import Button from '../component/button';
import { connect } from 'react-redux';
import { CartAction } from '../redux/actions/authActions'
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

class ProductDetail extends Component {
    state = {
        product: {},
        loading: true,
        qty: 1
    }

    componentDidMount() {
        let idprod = this.props.match.params.idprod;
        let data = this.props.location.state;
        if (!data) {
            axios
                .get(`${API_URL}/products/${idprod}`)
                .then((result) => {
                    this.setState({ product: result.data })
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    this.setState({ loading: false })
                })
        } else {
            this.setState({ product: data.product, loading: false })
        }
    }
    onQtyClick = (operator) => {
        if (operator === 'tambah') {
            let hasil = this.state.qty + 1
            if (hasil > this.state.product.stock) {
                toast.dark('Qty melebihi stock', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                this.setState({ qty: this.state.qty + 1 })
            }
        } else {
            let hasil = this.state.qty - 1
            if (hasil < 1) {
                toast.dark('Tidak boleh kurang dari 1', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                this.setState({ qty: this.state.qty - 1 })

            }
        }
    }

    onAddToCartClick = () => {
        if (this.props.dataUser.role == 'admin' || this.props.dataUser.isLogin === false) {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Anda Harus Login Terlebih Dahulu!',
            })
        } else {
            let id = this.props.dataUser.id
            let idprod = this.state.product.id
            let stok = this.state.product.stok
            axios
                .get(`${API_URL}/users/${id}`)
                .then((result) => {
                    let cart = result.data.cart // cart adalah sebuah array
                    let findIdx = cart.findIndex((val) => val.id == idprod)
                    if (findIdx < 0) {
                        let dataBaru = {
                            ...this.state.product,
                            qty: this.state.qty,
                        };
                        cart.push(dataBaru)
                        axios
                            .patch(`${API_URL}/users/${id}`, { cart: cart }) // expektasi data yg dikirim harus object.
                            .then((result1) => {
                                this.props.CartAction(result1.data.cart)
                                toast('Add To Cart Berhasil', {
                                    position: "top-center",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                });
                            }).catch((error) => {
                                console.log(error)
                            })
                    } else {
                        let qtyakhir = cart[findIdx].qty + this.state.qty
                        if (qtyakhir > stok) {
                            let qtyAbleBuy = stok - cart[findIdx].qty
                            alert("barang di cart melebihi stok, barang yang bisa dibeli hanya " + qtyAbleBuy)
                        } else {
                            cart[findIdx].qty = qtyakhir // ? cart adalah array karena di db.json itu array
                            axios
                                // pakai patch karena hanya cart nya saja yang di edit 
                                .patch(`${API_URL}/users/${id}`, { cart: cart }) // ? expektasi data yg dikirim diparemater kedua, harus object.
                                .then((result1) => {
                                    this.props.CartAction(result1.data.cart)
                                    alert("cart berhasil")
                                }).catch((error) => {
                                    console.log(error)
                                })
                        }
                    }

                }).catch((error) => {
                    console.log(error)
                })
        }
    }

    render() {
        if (this.state.loading) {
            return <Loading />
        }
        return (
            <div>
                <Header />
                <Container>
                    <Breadcrumb className="mt-5">
                        <BreadcrumbItem>
                            <Link to='/'>Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem><Link to='/products'>Product</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{this.state.product.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="row mt-2">
                        <div className="col-md-6 py-3 px-3 shadow">
                            <img
                                src={this.state.product.img}
                                alt=""
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <div className="col-md-6">
                            <div className="text-center display-4 my-2">
                                {this.state.product.name}
                            </div>
                            <div className="display-5 my-2">
                                Description:   {this.state.product.description}
                            </div>
                            <div className="font-weight-bold my-2">
                                {currencyFormatter(this.state.product.price * this.state.qty)}
                            </div>
                            <div className="mt-4 d-flex flex-row">
                                <Button onClick={() => this.onQtyClick('kurang')}>-</Button>
                                <div className="px-3 h5 align-self-center">{this.state.qty}</div>
                                <Button onClick={() => this.onQtyClick('tambah')}>+</Button>
                            </div>
                            <div className="my-4">
                                <Button className="w-100" onClick={this.onAddToCartClick}>Add to Cart</Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </div >
        );
    }
}

const MapstatetoProps = (state) => {
    return {
        dataUser: state.Auth, // Auth nya liat dari index.js karena tujuan kita authReducers

    }
}


export default connect(MapstatetoProps, { CartAction })(ProductDetail);