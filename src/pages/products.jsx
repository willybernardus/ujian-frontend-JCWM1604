import React, { Component } from 'react';
import Header from "../component/header"
import axios from 'axios';
import { Container } from 'reactstrap';
import { API_URL, currencyFormatter } from '../helper';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';
import { Link } from "react-router-dom";
import Button from '../component/button';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

class Products extends Component {
    state = {
        products: [],
    }
    componentDidMount() {
        axios.get(`${API_URL}/products`)
            .then((result) => {
                this.setState({ products: result.data })
            }).catch((error) => {
                console.log(error)
            })
    }

    renderProducts = () => {
        return this.state.products.map((val, index) => {
            return (
                <div key={index} className="col-md-3 p-2">
                    <Card>
                        <CardImg
                            top width="100%"
                            src={val.img}
                            alt="Card image cap"
                            height="200vh"
                        />
                        <CardBody>
                            <CardTitle tag="h5">{val.name}</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">{currencyFormatter(val.price)}</CardSubtitle>
                            <Link to={{ pathname: `/products/${val.id}`, state: { product: val } }}>
                                <Button className="w-100 py-2">Details</Button>
                            </Link>
                        </CardBody>
                    </Card>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                <Header />
                <Container>
                    <Breadcrumb className="mt-5">
                        <BreadcrumbItem>
                            <Link to='/'>Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>Product</BreadcrumbItem>
                    </Breadcrumb>
                    <section className="row">
                        {this.renderProducts()}
                    </section>
                </Container>
            </div>
        );
    }
}

export default Products;