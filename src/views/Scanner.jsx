import CodeReader from '../components/CodeReader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

const Scanner = () => {
  return (
    <div className='scanner__container'>
      <div className="scanner__title">
        <FontAwesomeIcon icon={faArrowCircleLeft} className='title__icon'/>
        <h1>Escáner</h1>
      </div>
      <CodeReader/>
    </div>
  );
};

export default Scanner;
