import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import '../css/pagetransition.css'; // Asegúrate de tener los estilos correctos

const PageTransition = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define las rutas que tendrán la transición
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
  const shouldTransition = routesWithTransition.some(route =>
    currentPath.startsWith(route)
  );

  return (
    <TransitionGroup>
      {shouldTransition ? (
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={1000} // Duración de la transición en milisegundos
        >
          <div className="transition-wrapper">
            {children}
          </div>
        </CSSTransition>
      ) : (
        children
      )}
    </TransitionGroup>
  );
};

export default PageTransition;
