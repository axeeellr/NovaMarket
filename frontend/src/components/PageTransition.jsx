import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import '../css/pagetransition.css';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [transitionKey, setTransitionKey] = useState(location.pathname);

  useEffect(() => {
    // Actualiza la clave de transición solo si la ruta ha cambiado
    setTransitionKey(location.pathname);
  }, [location.pathname]);

  // Verifica si la ruta debe tener transición
  const shouldTransition = location.pathname.startsWith('/shop');

  return (
    <TransitionGroup>
      <CSSTransition
        key={transitionKey}
        classNames={shouldTransition ? 'fade' : 'no-fade'}
        timeout={500}
      >
        <div className={shouldTransition ? 'transition-wrapper' : 'no-transition-wrapper'}>
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;
