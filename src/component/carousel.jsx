import React from 'react';
import { UncontrolledCarousel } from 'reactstrap';

const items = [
    {
        src: 'https://media.wired.com/photos/5b92c4b41bde47451109e202/2:1/w_2322,h_1161,c_limit/TeslaModelS-630933336.jpg',
        key: '1'
    },
    {
        src: 'https://www.bmwmotorcycle.com/wp-content/uploads/2018/03/service-banner-mobile.jpg',
        header: 'Slide 2 Header',
        key: '2'
    },
    {
        src: 'https://images.bisnis-cdn.com//upload/img/Vespa%20Balap%20Jadul(1).jpg',
        key: '3'
    }
];

const CarouselComp = () => <UncontrolledCarousel items={items} />;

export default CarouselComp;