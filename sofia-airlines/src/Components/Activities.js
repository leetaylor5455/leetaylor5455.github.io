import React from 'react'

import Nav from './Nav';
import ActivitiesTitle from '../Images/ActivitiesTitle.svg';
import ActivityCard from './ActivityCard';
import Button from './Button';

function Activities() {
  return (
    <div className='container'>
        <Nav title={ActivitiesTitle} back='/hotel'/>

        <div className='activities'>
            <ActivityCard name='Visit the Louvre' image='/Activities/louvre.jpg'/>
            <ActivityCard name='Go up the Eiffel Tower' image='/Activities/eiffel.jpg'/>
            <ActivityCard name='River Seine Cruise' image='/Activities/seine2.jpg'/>
            <ActivityCard name='Sainte Chappelle' image='/Activities/sainte.jpg'/>
            <ActivityCard name='Arc de Triomphe' image='/Activities/arc.jpg'/>
            <ActivityCard name='Visit the Catacombs' image='/Activities/catacombs.jpg'/>
        </div>

        <Button text='Next' link='/summary'/> 
    </div>
  )
}

export default Activities