import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import '../css/pagetransition.css';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [transitionKey, setTransitionKey] = useState(location.pathname);

  useEffect(() => {
    setTransitionKey(location.pathname);
  }, [location.pathname]);

  const shouldTransition = location.pathname.startsWith('/shop');

  return (
    <TransitionGroup>
      <CSSTransition
        key={transitionKey}
        classNames={shouldTransition ? 'fade' : 'no-fade'}
        timeout={500}
      >
        <div className="transition-wrapper">
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;
