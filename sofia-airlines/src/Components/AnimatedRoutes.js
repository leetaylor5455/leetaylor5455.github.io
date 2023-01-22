import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './Home';
import DatePage from './Date';
import Hotel from './Hotel';
import Activities from './Activities';

function AnimatedRoutes() {
  const location = useLocation();
  const [date, setDate] = useState(new Date());
  const [hotel, setHotel] = useState(0);
  const [activities, setActivities] = useState({});

  return (
    <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Home />}/>
            <Route path='/date' element={<DatePage date={date} setDate={setDate}/>}/>
            <Route path='/hotel' element={<Hotel hotel={hotel} setHotel={setHotel}/>}/>
            <Route path='/activities' element={<Activities activities={activities} setActivities={setActivities}/>}/>
        </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes