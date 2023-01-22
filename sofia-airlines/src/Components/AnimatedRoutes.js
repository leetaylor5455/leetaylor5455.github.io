import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './Home';
import DatePage from './Date';
import Hotel from './Hotel';
import Activities from './Activities';
import Summary from './Summary';
import Receipt from './Receipt';

function AnimatedRoutes() {
  const location = useLocation();
  const [date, setDate] = useState(new Date());
  const [hotel, setHotel] = useState({});
  const [activities, setActivities] = useState([]);

  function selectActivity(item) {
    const index = activities.findIndex(element => element.id === item.id);

    if (index >= 0) {
        setActivities(prev => {
            return [
            ...prev.slice(0, index),
            ...prev.slice(index+1, prev.length)
        ]});
    } else {
        setActivities(prev => [...prev, item]);
    }
  }

  return (
    <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Home />}/>
            <Route path='/date' element={<DatePage date={date} setDate={setDate}/>}/>
            <Route path='/hotel' element={<Hotel hotel={hotel} setHotel={setHotel}/>}/>
            <Route path='/activities' element={<Activities activities={activities} selectActivity={selectActivity}/>}/>
            <Route path='/summary' 
            element={<Summary
                date={date}
                hotel={hotel}
                activities={activities}
                />}
            />
            <Route path='/receipt' element={<Receipt/>}/>
        </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes