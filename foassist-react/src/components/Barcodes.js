import React from 'react';

import Barcode from 'react-barcode'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';

function Barcodes(props) {

    const filtered = props.products.filter(product => !product[1].inStock || product[1].units)

    const barcodes = filtered.map((product, index) => (
        <SwiperSlide
            key={product[0]}
        >
            <Barcode 
                value = {product[0]}
                width = {window.innerWidth > 600 ? 5 : 3}
            />
        <h2>{product[1].productName}</h2>
        <h2 
            className='barcode-units'
            style={{display: product[1].units ? 'block' : 'none'}}
        >
            Units: {product[1].units}
        </h2>

        <h4>{index+1} / {filtered.length}</h4>
        </SwiperSlide>
    ));

    return (
        <div className='barcodes container'>
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
            >

                {barcodes}

            </Swiper>
        </div>
    )

}

export default Barcodes;