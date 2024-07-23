import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '../../helpers/loadGoogleMapsScript';
import './Map.Component.css';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { database } from '../../helpers/firebase';
import { get, push, ref, remove, set } from 'firebase/database';
import { Marker, MarketData } from '../../models/MarkerDadta.Model';

const MapComponent = () => {
  const map = useRef<google.maps.Map | null>(null);
  const markerList = useRef<Marker[]>([]);
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [loaded, setLoaded] = useState(false);
  let counter = 1;
  
  const removeMarker = (markerId: string) => {
    for (let i = 0; i < markerList.current.length; i++) {
      if (markerList.current[i].data.id === markerId) {
          markerList.current[i].object.map = null;
          clusterer.current!.removeMarker(markerList.current[i].object);
          if(i>0) {
            markerList.current[i-1].data.nextId = markerList.current[i].data.nextId;
          }
          markerList.current = markerList.current.filter((m) => m.data.id !== markerId);
          deleteMarker(markerId+'');
      }
    }
  } 

  const addMarker = async (map: google.maps.Map, position: {lat:number, lng:number}, id: string | null) => {
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    const marker = new AdvancedMarkerElement({
      map,
      position,
      gmpDraggable: true,
      content: getTag(counter++ +''),
    });

    const markerData: MarketData = {
      lat: position.lat,
      lng: position.lng,
      time: Date.now(),
    }

    if (!id)
      id = await saveData(markerData);
    else
      markerData.id = id;

    if (markerList.current.length > 0) {
      markerList.current[markerList.current.length - 1].data.nextId = id;
    }

    marker.addListener('click', () => {
      removeMarker(id!);
    });

    markerList.current.push(
      {
        data: markerData,
        object: marker
      }
    );

    clusterer.current!.addMarker(marker);

    return marker;
  }

  const getTag = (text: string) => {
    const priceTag = document.createElement('div');
    priceTag.className = 'tag';
    priceTag.textContent = text;
    return priceTag;
  }

  const deleteMarker = (markerId: string) => {
    const markerRef = ref(database, `marker/${markerId}`);
    
    remove(markerRef)
      .catch((error) => {
        console.error('Error deleting marker:', error);
      });
  };

  const saveData = async (marker: MarketData) => {
    const dRef = ref(database, "marker");
    const newDRef = await push(dRef);  // Creates a new unique reference
    await set(newDRef, marker);
    return newDRef.key!;
  }

  const fetchData = async () => {
    const dRef = ref(database, "marker")

    get(dRef).then((s) => {
      s.forEach((i) => {
        addMarker(map.current!, { lat: i.val().lat, lng: i.val().lng }, i.key);
      });
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }


  useEffect(() => {
    if(!loaded){
      setLoaded(true);
      fetchData();
    }

    const initMap = async () => {
      try {
        await loadGoogleMapsScript('AIzaSyDNjSg9GKiYY3Q_tqYvzUiEVgnPNrbElBs');

        if (!window.google) {
          console.error("Google Maps JavaScript API not loaded");
          return;
        }

        const { Map } = await window.google.maps.importLibrary("maps") as google.maps.MapsLibrary;

        map.current = new Map(document.getElementById('map') as HTMLElement, {
          center: { lat: 49.84, lng: 24.03 },
          zoom: 14,
          mapId: '4504f8b37365c3d0',
        });

        map.current.addListener('click', async (event: any) => {
          await addMarker(map.current!, event.latLng.toJSON(), null);
        });
        
        const options = {
          markers: markerList.current.map((m) => m.object),
          map: map.current,
        }
        clusterer.current = new MarkerClusterer(options);

      } catch (error) {
        console.error('Error loading Google Maps API:', error);
      }
      
    };

    initMap();
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapComponent;