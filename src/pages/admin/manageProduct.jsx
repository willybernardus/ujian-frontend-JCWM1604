import React, { Component } from 'react';
import Header from '../../component/header';
import { Container, Table, Modal, ModalBody, ModalFooter, ModalHeader, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import axios from 'axios';
import { API_URL, currencyFormatter } from '../../helper';
import Button from '../../component/button';
import { BiTrashAlt, BiEditAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import Loading from "../../component/loading";
import { toast } from "react-toastify";

const MySwal = withReactContent(Swal)

class ManageProduct extends Component {
    state = {
        products: [],
        AddData: {
            id: 0,
            name: "",
            img: "",
            price: "",
            description: "",
        },
        EditData: {
            id: 0,
            name: "",
            img: "",
            price: "",
            description: "",
        },
        categories: [],
        modalAdd: false,
        modalEdit: false,
        page: 1,
        totaldata: 0,
        limit: 4,
        isLoading: true,
        indexEdit: -1,
        nameSearch: ""

    };

    componentDidMount() {
        axios
            .get(`${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=${this.state.limit}`)
            .then((response) => {
                axios
                    .get(`${API_URL}/categories`)
                    .then((response1) => {
                        console.log(response)
                        this.setState({
                            products: response.data,
                            categories: response1.data,
                            totaldata: response.headers["x-total-count"],
                            isLoading: false
                        });
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidUpdate(prevprops, prevstate) {
        if (this.state.page !== prevstate.page) { //! <-- buat bikin ga infinite masuknya
            axios
                .get(`${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=${this.state.limit}&name_like=${this.state.nameSearch}`)
                .then((response) => {
                    this.setState({
                        products: response.data,
                        totaldata: response.headers["x-total-count"],
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    renderProducts = () => {
        if (this.state.products.length == 0) {
            return (
                <tr>
                    <td height="500px" colSpan="8" className="text-center">
                        <h1>No Data</h1>
                    </td>

                </tr>
            )
        }

        return this.state.products.map((val, index) => {
            return (
                <tr key={val.id}>
                    <td width="50px">{(4 * (this.state.page - 1)) + index + 1}</td>
                    <td width="150px">{val.name}</td>
                    <td width="200px">
                        <img src={val.image} alt={val.name} widht="" height="200px" />
                    </td>
                    <td>{val.tahun}</td>
                    <td>{currencyFormatter(val.harga)}</td>
                    <td> {val.category.nama ? val.category.nama : ""}</td>
                    <td>{val.deskripsi}</td>
                    <td width="75px" className="d-flex justify-content-between mx-2">
                        <div onClick={() => this.onEditClick(index)} className="text-primary">
                            <BiEditAlt />
                        </div>
                        <div onClick={() => this.onDeleteClick(index)} className="text-danger">
                            <BiTrashAlt />
                        </div>
                    </td>
                </tr>
            )
        })
    }

    renderCategories = () => {
        return this.state.categories.map((val, index) => {
            return (
                <option value={val.id} key={index}>
                    {val.nama}
                </option>
            )
        })
    }

    renderPaging = () => {
        let { limit, totaldata, page } = this.state
        let berapaPaging = Math.ceil(totaldata / limit)
        let paging = []
        for (let i = 0; i < berapaPaging; i++) {
            if (i + 1 == page) {
                paging.push(
                    <PaginationItem active>
                        <PaginationLink>{i + 1}</PaginationLink>
                    </PaginationItem>
                )
            } else {
                paging.push( // setState adalah function dari react
                    <PaginationItem onClick={() => this.setState({ page: i + 1 })}>
                        <PaginationLink>{i + 1}</PaginationLink>
                    </PaginationItem>
                )
            }
        }
        return paging;
    };

    toggle = () => { // * penting untuk buka tutup
        this.setState({ modalAdd: !this.state.modalAdd });
    }

    toggleEdit = () => { // * penting untuk buka tutup
        this.setState({ modalEdit: !this.state.modalEdit });
    }

    onAddDataChange = (event) => {
        let mutasiData = this.state.AddData
        mutasiData[event.target.name] = event.target.value
        this.setState({ AddData: mutasiData })
    }

    onAddDataClick = () => {
        const { name, categoryId, deskripsi, harga, tahun, image } = this.state.AddData; // *cara destructuring
        let dataPost = this.state.AddData
        if (name && categoryId && deskripsi && harga && tahun && image) {
            axios
                .post(`${API_URL}/products`, dataPost) // *dataPost sudah berupa object, param ke 2 dari .post harus object!
                .then(() => {
                    axios
                        .get(`${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=${this.state.limit}`)
                        .then((response) => {
                            let obj = {
                                name: "",
                                image: "",
                                tahun: "",
                                harga: "",
                                deskripsi: "",
                                categoryId: 0,
                            };
                            this.setState({ products: response.data, modalAdd: false, AddData: obj });
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            alert("Mohon di isi bosque")
        }
    }

    onDeleteClick = (index) => {
        let id = this.state.products[index].id
        let namaProd = this.state.products[index].name
        Swal.fire({
            title: `Are you sure want to delete ${namaProd}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${API_URL}/products/${id}`)
                    .then(() => {
                        axios
                            .get(`${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=${this.state.limit}&name_like=${this.state.nameSearch}`)
                            .then((res) => {
                                this.setState({ products: res.data })
                            }).catch((err) => {
                                console.log(err);
                            })
                    }).catch((err) => {
                        console.log(err)
                    })
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

    onSearchChange = (event) => {
        // const page=this.state
        // this.setState({ nameSearch: event.target.value })
        // axios
        //     .get(
        //         `${API_URL}/products?_expand=category&_page=1&_limit=${this.state.limit}&name_like=${event.target.value}`
        //     )
        //     .then((response) => {
        //         console.log(response)
        //         this.setState({
        //             products: response.data,
        //             totaldata: response.headers["x-total-count"],
        //             page: 1,
        //         })
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })

        this.setState({ nameSearch: event.target.value })
    }

    onEditClick = (index) => {
        let EditData = this.state.EditData;
        let products = this.state.products;
        EditData = {
            ...EditData,
            id: products[index].id,
            name: products[index].name,
            tahun: products[index].tahun,
            harga: products[index].harga,
            image: products[index].image,
            categoryId: products[index].categoryId,
            deskripsi: products[index].deskripsi,
        };
        this.setState({ indexEdit: index, EditData: EditData, modalEdit: true });
    };

    onEditDataChange = (event) => {
        let mutasiEditData = this.state.EditData
        mutasiEditData[event.target.name] = event.target.value
        this.setState({ EditData: mutasiEditData })
    }

    onSaveEditClick = () => {
        let id = this.state.EditData.id
        let name = this.state.EditData.name
        let tahun = this.state.EditData.tahun
        let harga = this.state.EditData.harga
        let image = this.state.EditData.image
        let categoryId = this.state.EditData.categoryId
        let deskripsi = this.state.EditData.deskripsi
        if (id && name && tahun && harga && image && categoryId && deskripsi) {
            let data = {
                name: name,
                tahun: tahun,
                harga: harga,
                image: image,
                categoryId: categoryId,
                deskripsi: deskripsi,
            };
            axios
                .patch(`${API_URL}/products/${id}`, data)
                .then((result) => {
                    console.log(result.data);
                    axios
                        .get(`${API_URL}/products?_expand=category&_page=${this.state.page}&_limit=${this.state.limit}&name_like=${this.state.nameSearch}`)
                        .then((result1) => {
                            console.log(result1);
                            this.setState({
                                products: result1.data,
                                indexEdit: -1,
                                modalEdit: false,

                            });
                            toast.success("berhasil edit ", {
                                position: "top-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            toast.error("internal server error")
                        });
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Header />
                    <Loading />
                </div>
            )
        }
        return (
            <div>
                <Header />

                {/* MODAL ADD */}
                <Modal size="lg" isOpen={this.state.modalAdd} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} style={{ color: "#0D6EFD" }}>Add Data</ModalHeader>
                    <ModalBody>
                        <input className="form-control my-1" type="text" name="name" placeholder="Nama Produk" value={this.state.AddData.name} onChange={this.onAddDataChange} />
                        <input className="form-control my-1" type="text" name="image" placeholder="Link Foto" value={this.state.AddData.image} onChange={this.onAddDataChange} />
                        <input className="form-control my-1" type="number" name="tahun" placeholder="Tahun" value={this.state.AddData.tahun} onChange={this.onAddDataChange} />
                        <input className="form-control my-1" type="number" name="harga" placeholder="Harga (dalam juta)" value={this.state.AddData.harga} onChange={this.onAddDataChange} />
                        <select className="form-control my-1" name="categoryId" value={this.state.AddData.categoryId} onChange={this.onAddDataChange} >
                            <option value="0" hidden selected>Pilih Kategori</option>
                            {this.renderCategories()}
                        </select>
                        <textarea className="form-control my-1" name="deskripsi" placeholder="Deskripsi...." value={this.state.AddData.deskripsi} cols="30" rows="5" onChange={this.onAddDataChange} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.onAddDataClick}>Add</Button>
                    </ModalFooter>
                </Modal>

                {/* MODAL EDIT */}
                <Modal size="lg" isOpen={this.state.modalEdit} toggle={this.toggleEdit}>
                    <ModalHeader toggle={this.toggleEdit} style={{ color: "#0D6EFD" }}>Edit Data</ModalHeader>
                    <ModalBody>
                        <input className="form-control my-1" type="text" name="name" placeholder="Nama Produk" value={this.state.EditData.name} onChange={this.onEditDataChange} />
                        <input className="form-control my-1" type="text" name="image" placeholder="Link Foto" value={this.state.EditData.image} onChange={this.onEditDataChange} />
                        <input className="form-control my-1" type="number" name="tahun" placeholder="Tahun" value={this.state.EditData.tahun} onChange={this.onEditDataChange} />
                        <input className="form-control my-1" type="number" name="harga" placeholder="Harga (dalam juta)" value={this.state.EditData.harga} onChange={this.onEditDataChange} />
                        <select className="form-control my-1" name="categoryId" value={this.state.EditData.categoryId} onChange={this.onEditDataChange} >
                            <option value="0" hidden selected>Pilih Kategori</option>
                            {this.renderCategories()}
                        </select>
                        <textarea className="form-control my-1" name="deskripsi" placeholder="Deskripsi...." value={this.state.EditData.deskripsi} cols="30" rows="5" onChange={this.onEditDataChange} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.onSaveEditClick}>Save</Button>
                        <Button onClick={this.toggleEdit}>Cancel</Button>
                    </ModalFooter>
                </Modal>



                <Container>
                    <div className="my-3">
                        <Button onClick={() => this.setState({ modalAdd: true })}>Add Data</Button>
                        <div className="mt-2 w-25">
                            <input type="search"
                                className="form-control"
                                placeholder="Cari Nama Produk"
                                onChange={this.onSearchChange}
                                value={this.state.nameSearch}
                            />
                        </div>
                        <Table className="mt-3" striped>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Nama Produk</th>
                                    <th className="text-center">Foto</th>
                                    <th className="text-center">Tahun</th>
                                    <th className="text-center">Harga</th>
                                    <th className="text-center">Kategori</th>
                                    <th className="text-center">Deskripsi</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderProducts()}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-center align-bottom">
                            <Pagination>
                                <PaginationItem >
                                    <PaginationLink first href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink previous href="#" />
                                </PaginationItem>
                                {this.renderPaging()}
                                <PaginationItem>
                                    <PaginationLink next href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink last href="#" />
                                </PaginationItem>
                            </Pagination>
                        </div>
                    </div>
                </Container>

            </div >
        );
    }
}

export default ManageProduct;