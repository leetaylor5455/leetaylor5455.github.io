import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from "swiper";

function HotelCard(props) {

  const bg = {
    selected: '#FEF9FF',
    unselected: '#fff'
  }

  return (
    <div className='card-wrapper'>
        <div className='card-selected-border'
            style={{
                opacity: props.selected ? 1 : 0,
                boxShadow: props.selected ? '0px 8px 15px rgba(255, 103, 212, 0.3)' : '0px 6px 10px rgba(0, 0, 0, 0.05)'
            }}
            ></div>

        <div className='card'
            onClick={props.onClick}
            style={{ backgroundColor: props.selected ? bg.selected : bg.unselected }}
        >
            <div className='name'>{props.name}</div>
            <div className='hotel-pictures'>
                <Swiper className='hotel-pictures-wrapper'
                    spaceBetween={5}
                    loop={true}
                    pagination={true}
                    modules={[Pagination]}
                >
                    {props.sources.map((source, index) => (
                        <SwiperSlide>
                            <img 
                                key={`${props.name}Pic${index}`} 
                                className='hotel-img' 
                                src={source} 
                                alt={`HotelPic ${index}`}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <ul className='key-points'>
                {props.keyPoints.map((point, index) => (
                    <li 
                        className='key-point'
                    >{point}</li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default HotelCard