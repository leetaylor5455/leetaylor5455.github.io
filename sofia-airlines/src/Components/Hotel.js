import React, { useState } from 'react'

import Nav from './Nav';
import HotelTitle from '../Images/HotelTitle.svg';
import Button from './Button';

import HotelCard from './HotelCard';

function Hotel(props) {

  const hotelData = [
    { 
        index: 1,
        name: "Le Robinet d'Or",
        sources: [
            '/LeRobinet/6.jpg',
            '/LeRobinet/2.jpg',
            '/LeRobinet/1.jpg',
            '/LeRobinet/3.jpg',
            '/LeRobinet/4.jpg',
            '/LeRobinet/5.jpg',
        ],
        keyPoints: ['lounge/terrace bar',
        '25 min walk to Sacre-Coeur',
        '5 min walk to underground'
]
    },
    { 
        index: 2,
        name: "OKKO Paris Gare de l'Est",
        sources: [
            '/OKKO/1.jpg',
            '/OKKO/2.jpg',
            '/OKKO/3.jpg',
            '/OKKO/4.jpg',
            '/OKKO/5.jpg',
            '/OKKO/6.jpg',
        ],
        keyPoints: ['gym with sauna',
        'evening appetiser buffet',
        'great breakfast'
]
    },
    { 
        index: 3,
        name: "Hotel Henriette",
        sources: [
            '/Henriette/1.jpg',
            '/Henriette/2.jpg',
            '/Henriette/3.jpg',
            '/Henriette/4.jpg',
            '/Henriette/5.jpg',
            '/Henriette/6.jpg',
        ],
        keyPoints: ['interior courtyard',
        '200 yards from underground',
        'great area'
]
    }
  ];

  return (
    <div className='container'>
        <Nav title={HotelTitle} back='/date'/>

        <div className='hotels'>

            {hotelData.map((hotel) => (
                <HotelCard 
                    key={hotel.name}
                    name={hotel.name}
                    sources={hotel.sources}
                    keyPoints={hotel.keyPoints}
                    onClick={() => props.setHotel(hotel)}
                    selected={props.hotel.index === hotel.index ? true : false}
                />
            ))}

        </div>
        <Button text='Next' link='/activities'/>
    </div>
  )
}

export default Hotel