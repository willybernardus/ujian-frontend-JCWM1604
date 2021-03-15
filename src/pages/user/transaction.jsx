import React, { Component } from 'react';
import axios from "axios";
import { API_URL, formatDate, currencyFormatter } from '../../helper';
import Header from '../../component/header';
import { Table, Modal, ModalBody, ModalHeader, ModalFooter, Container } from "reactstrap";
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

class Transaction extends Component {
    state = {
        banks: [],
        pilihanId: "",
        modal: false,
        modalDetail: false,
        bukti: "",
        transaction: [],
        indexDetail: -1,
        products: []
    }

    async componentDidMount() {
        try {
            var result = await axios.get(`${API_URL}/banks`)
            var result1 = await axios.get(`${API_URL}/transactions?userId=${this.props.dataUser.id}`)
            // get data semua products
            var result2 = await axios.get(`${API_URL}/products`);
            this.setState({ banks: result.data, transaction: result1.data, products: result2.data })
        } catch (error) {
            console.log(error)
        }
    }

    renderTotalDetail = () => {
        let total = 0
        this.state.transaction[this.state.indexDetail].products.forEach((val) => {
            total += val.price * val.qty
        })
        return total
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal })
    }
    toggleDetail = () => {
        this.setState({ modalDetail: !this.state.modalDetail })
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

    renderDetail = () => {
        var indexdetail = this.state.indexDetail
        return this.state.transaction[indexdetail].products.map((val, index) => {
            return (
                <tr key={index}>
                    <td>{val.name}</td>
                    <td>{currencyFormatter(val.price)}</td>
                    <td>{val.qty}</td>
                    <td>{currencyFormatter(val.qty * val.price)}</td>
                </tr>
            )
        })
    }



    onDetailClick = (index) => {
        this.setState({ indexDetail: index, modalDetail: true })
    }

    onBatalClick = async (index) => {
        let productsAdmin = this.state.products
        console.log(productsAdmin)
        let productTransaction = this.state.transaction[index].products
        try {
            // edit stok products
            for (let i = 0; i < productTransaction.length; i++) {
                for (let j = 0; j < productsAdmin.length; j++) {
                    if (productTransaction[i].id === productsAdmin[j].id) {
                        let stocknew = productTransaction[i].qty + productsAdmin[j].stok
                        await axios.patch(`${API_URL}/products/${productsAdmin[j].id}`, {
                            stok: stocknew
                        })
                    }
                }
            }
            // edit transaksi
            await axios.patch(`${API_URL}/transactions/${this.state.transaction[index].id}`, {
                status: "batal bayar"
            })
            // refresh data
            var result1 = await axios.get(`${API_URL}/transactions?userId=${this.props.dataUser.id}`);
            this.setState({ history: result1.data })
            toast('Berhasil Membatalkan Pemayaran', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            toast.error('error server')
        }
    }


    renderTransaction = () => {
        return this.state.transaction.map((val, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formatDate(val.tanggal)}</td>
                    <td>{val.status}</td>
                    <td>
                        <button
                            className="btn btn-primary"
                            onClick={() => this.onDetailClick(index)}
                        // disabled={val.status === "batal"}
                        >
                            Detail
                        </button>
                    </td>
                    <td>
                        <button
                            className="btn btn-danger"
                            onClick={() => this.onBatalClick(index)}
                            disabled={val.status === "batal bayar"}
                        >
                            Batal
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.indexDetail < 0 ?
                        null
                        :
                        <Modal size="lg" centered isOpen={this.state.modalDetail} toggle={this.toggleDetail}>
                            <ModalHeader toggle={this.toggleDetail}>
                                Detail Transaksi
                            </ModalHeader>
                            <ModalBody>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Nama Produk</th>
                                            <th>Harga</th>
                                            <th>Qty</th>
                                            <th>Sub Total</th>

                                        </tr>

                                    </thead>
                                    <tbody>
                                        {this.renderDetail()}
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th>Total</th>
                                            <th>{currencyFormatter(this.renderTotalDetail())}</th>

                                        </tr>
                                    </tbody>
                                </Table>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="input bukti"
                                    value={this.state.bukti}
                                    onChange={this.onInputChange}
                                    name="bukti"

                                />
                                <div className="mb-2">
                                    {this.renderRadio()}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <button className="btn btn-success">Bayar</button>
                                <button onClick={this.toggleDetail} className="btn btn-secondary">Close</button>
                            </ModalFooter>
                        </Modal>

                }
                <Header />
                <div className="mt-5">
                    <Container>
                        <Breadcrumb className="mt-5">
                            <BreadcrumbItem>
                                <Link to='/'>Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem><Link to='/products'>Product</Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to='/cart'>Cart</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Transaction</BreadcrumbItem>
                        </Breadcrumb>
                        <Table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Tanggal</th>
                                    <th>Status</th>
                                    <th>Details</th>
                                    <th>Batal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTransaction()}
                            </tbody>
                        </Table>
                    </Container>
                </div>
            </div>
        );
    }
}

const MapstatetoProps = (state) => {
    return {
        dataUser: state.Auth,
    }
}

export default connect(MapstatetoProps)(Transaction);