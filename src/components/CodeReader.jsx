import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

const CodeReader = (props) => {
  const [data, setData] = useState('No result');
  const navigate = useNavigate();

  useEffect(() => {
    if (data !== 'No result') {
      navigate(`/product/${encodeURIComponent(data)}`);
    }
  }, [data]);

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            //console.info(error);
          }
        }}
        style={{ width: '100%' }}
      />
      <p>{data}</p>
    </>
  );
};

export default CodeReader