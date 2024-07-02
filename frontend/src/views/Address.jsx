import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TitlePage from '../components/TitlePage';

import '../css/address.css';

const Address = () => {
    return (
        <>
            <div className="address__container">
                <TitlePage/>
                <div className="address">
                    
                </div>
            </div>
        </>
    );
};

export default Address;
