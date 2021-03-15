import React, { Component } from 'react';
import Header from "../component/header";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Carousel } from 'react-bootstrap';
import Button from '../component/button';
import axios from 'axios';
import { API_URL, currencyFormatter } from '../helper';
import { Link } from "react-router-dom";


class Home extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        axios.get(`${API_URL}/products?_limit=4`)
            .then((result) => {
                this.setState({ data: result.data })
            }).catch((error) => {
                console.log(error)
            })
    }

    renderProducts = () => {
        return this.state.data.map((val, index) => {
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
                <Container className="mt-5">
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://c.static-nike.com/a/images/w_1920,c_limit/bzl2wmsfh7kgdkufrrjq/image.jpg"
                                alt="First slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://s3.amazonaws.com/nikeinc/assets/101479/NikeNews_VaporflyNEXTPercent_2_SP21_RN_Fast_Vaporfly_2_Next_M_Connect_Photography_Profile_native_1000.jpg?1614379648"
                                alt="Second slide"
                            />

                            <Carousel.Caption>
                                <h3></h3>
                                <p></p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://s3.amazonaws.com/nikeinc/assets/91660/Nike-Air-Zoom-Pulse_2_native_1600.jpg?1573245547"
                                alt="Third slide"
                            />
                            <Carousel.Caption>
                                <h3></h3>
                                <p></p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Container>
                <div className="mb-5">
                    <section className="d-flex justify-content-center align-items-center mt-5 py-5 shadow mb-5" style={{ borderTop: "2px solid #0D6EFD", borderBottom: "2px solid #0D6EFD" }}>
                        <h1>Just Do It.</h1>
                    </section>
                    <Container>
                        <div className="py-3 d-flex justify-content-end">
                            <Link to="/products">
                                <Button>View All Products</Button>
                            </Link>
                        </div>
                        <section className="row">
                            {this.renderProducts()}
                        </section>
                    </Container>
                </div>
            </div >
        );
    }
}

export default Home;