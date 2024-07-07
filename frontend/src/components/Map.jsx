// src/components/Map.js
import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 13.6929403,
  lng: -89.2181911
};

const Map = ({ onSelectLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAcRKRW5P05BiU1nBQrjs22jqBaTEAz5L0'
  });

  const [markerPosition, setMarkerPosition] = useState(center);

  const onMapClick = useCallback((event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setMarkerPosition({ lat, lng });
    onSelectLocation({ lat, lng });
  }, [onSelectLocation]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onClick={onMapClick}
    >
      <Marker position={markerPosition} />
    </GoogleMap>
  ) : <></>;
};

export default React.memo(Map);
