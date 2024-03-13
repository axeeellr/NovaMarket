import React, { useEffect, useRef } from 'react';
import QRCode from 'html5-qrcode';

function CodeReader() {
    const videoRef = useRef();

    useEffect(() => {
        const qrCodeScanner = new QRCode(videoRef.current, {
            fps: 10,
            qrbox: 250,
        });

        qrCodeScanner.start();

        return () => {
            qrCodeScanner.stop();
        };
    }, []);

    return <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />;
}

export default CodeReader;


  