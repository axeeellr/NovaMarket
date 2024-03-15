import React from 'react';
import '../css/root.css';
import '../css/notifications.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

function Notifications() {
    return(
        <div className="notifications">
            <div className="notifications__new__container">
                <h1>Nuevas</h1>
                <div className="notifications__new">
                    <img src="https://www.finedininglovers.com/es/sites/g/files/xknfdk1706/files/2022-04/zanahoria%C2%A9iStock.jpg" alt="" />
                    <p>¡Hay nuevos productos añadidos en el pasillo 3!</p>
                    <div className="notifications__options">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
                <div className="notifications__new">
                    <img src="https://www.finedininglovers.com/es/sites/g/files/xknfdk1706/files/2022-04/zanahoria%C2%A9iStock.jpg" alt="" />
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    <div className="notifications__options">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
                <div className="notifications__new">
                    <img src="https://www.finedininglovers.com/es/sites/g/files/xknfdk1706/files/2022-04/zanahoria%C2%A9iStock.jpg" alt="" />
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    <div className="notifications__options">
                        <FontAwesomeIcon icon={faEllipsis}/>
                    </div>
                </div>
            </div>
            <div className="notifications__old">

            </div>
        </div>
    )
}

export default Notifications