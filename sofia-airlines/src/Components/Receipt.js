import React from 'react'

import Louvre from '../Images/Louvre.svg'
import PYB from '../Images/PackYourBags.svg';

function Receipt() {
  return (
    <div className='container'>

        <div className="louvre-bg">
            <img src={Louvre} alt='Louvre'/>
        </div>

        <div
        style={{
            marginTop: 156
        }}>
            <img src={PYB} alt='Pack your bags!'/>
        </div>
    </div>
  )
}

export default Receipt