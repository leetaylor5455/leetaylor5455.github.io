import React from 'react'

import Nav from './Nav';
import ActivitiesTitle from '../Images/ActivitiesTitle.svg';
import ActivityCard from './ActivityCard';
import Button from './Button';

function Activities(props) {

  const activitiesData = [
    { id: 'lo', name:'Visit the Louvre', image:'/Activities/louvre.jpg' },
    { id: 'ei', name:'Go up the Eiffel Tower', image:'/Activities/eiffel.jpg' },
    { id: 'se', name:'River Seine Cruise', image:'/Activities/seine2.jpg' },
    { id: 'ch', name:'Sainte Chappelle', image:'/Activities/sainte.jpg' },
    { id: 'ar', name:'Arc de Triomphe', image:'/Activities/arc.jpg' },
    { id: 'ca', name:'Visit the Catacombs', image:'/Activities/catacombs.jpg' },

  ]

  return (
    <div className='container'>
        <Nav title={ActivitiesTitle} back='/hotel'/>

        <div className='activities'>

            {activitiesData.map((activity) => (
                <ActivityCard 
                    key={activity.id}
                    data={activity}
                    name={activity.name}
                    image={activity.image}
                    activities={props.activities}
                    selectActivity={props.selectActivity}
                />
            ))}
        </div>

        <Button text='Next' link='/summary'/> 
    </div>
  )
}

export default Activities