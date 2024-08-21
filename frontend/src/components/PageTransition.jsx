import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import '../css/pagetransition.css';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Rutas que deberían tener la transición
  const routesWithTransition = [
    '/shop/meats',
    '/shop/grains',
    '/shop/hygiene',
    '/shop/snacks',
    '/shop/dairy',
    '/shop/cleaning',
    '/shop/fruits'
  ];

  // Verifica si la ruta actual debe tener la transición
  const shouldTransition =
    routesWithTransition.some(route => currentPath.startsWith(route)) &&
    !currentPath.startsWith('/product');  // Excluir rutas que empiezan con /product

  return (
    <TransitionGroup>
      {shouldTransition ? (
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={500}
        >
          <div className="transition-wrapper">
            {children}
          </div>
        </CSSTransition>
      ) : (
        <div className="no-transition-wrapper">
          {children}
        </div>
      )}
    </TransitionGroup>
  );
};

export default PageTransition;
