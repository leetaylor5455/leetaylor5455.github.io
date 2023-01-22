import React from 'react';
import Title from '../Images/Title.svg';
import Eiffel from '../Images/Eiffel.svg';
import Button from './Button';

function Home() {
    return (
        <div className="container">
            <div className="eiffel-bg">
                <img src={Eiffel} alt='Eiffel Tower'/>
            </div>
            <div className="intro-title">
                <img src={Title} alt='Welcome to your Paris birthday'/>
            </div>
            <Button text='Get Started' link="/date"/>
        </div>
    )
}

export default Home;