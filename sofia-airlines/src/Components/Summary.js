import React, { useState, useEffect } from 'react'

import Nav from './Nav';
import SummaryTitle from '../Images/SummaryTitle.svg'

import HotelCard from './HotelCard';
import ActivityCard from './ActivityCard';
import Button from './Button';

function Summary(props) {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const [formattedDate, formatDate] = useState('');

  useEffect(() => {
    const dateNum = props.date.getDate();
    const strDateNum = String(dateNum);

    const lastDigit = strDateNum[strDateNum.length-1];
    let ending;

    if (dateNum < 10 || dateNum > 20) {
      switch (lastDigit) {
        case '1':
          ending = 'st';
          break;
        case '2':
          ending = 'nd';
          break;
        case '3':
          ending = 'rd';
          break;
        default:
          ending = 'th';
      }
    } else {
      ending = 'th';
    }
    const dateMonth = monthNames[props.date.getMonth()];

    formatDate(dateNum + ending + ' ' + dateMonth);

  }, []);


  return (
    <div className='container'>
        <Nav title={SummaryTitle} back='/activities'/>

        <div className='summary'>
          <div className='summary-heading'>We'll be going on the</div>
          <div className='date'>{formattedDate}</div>

          <div className='summary-heading'>We'll be staying in</div>
          <HotelCard
            name={props.hotel.name}
            sources={props.hotel.sources}
            keyPoints={props.hotel.keyPoints}
            onClick={null}
            selected={true}
          />

          <div className='summary-heading'>We'll be doing</div>
          {props.activities.map(activity => (
            <ActivityCard 
              key={'summary' + activity.id}
              data={activity}
              name={activity.name}
              image={activity.image}
              activities={props.activities}
              selectActivity={null}             
            />
          ))}
        </div>

        <Button text='Okay!' link='/receipt'/>
    </div>
  )
}

export default Summary