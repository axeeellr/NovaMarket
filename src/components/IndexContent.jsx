import React from 'react';
import '../css/content.css';

function IndexContent() {
  return (
    <div className="content">
      <div className="content__img">
        <img src="https://storage.googleapis.com/support-kms-prod/mQmcrC93Ryi2U4x5UdZNeyHQMybbyk71yCVm" alt="" />
      </div>
      <div className="content__info">
        <h4>Empieza a escanear</h4>
        <p>Añade tus productos al carrito escanenado el código QR de cada uno.</p>
        <button>Escanear</button>
      </div>
    </div>
  );
}

export default IndexContent;