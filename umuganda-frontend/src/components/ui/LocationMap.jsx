import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to auto-center map when data changes
const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const LocationMap = ({ locations = [], center = [-1.9441, 30.0619], zoom = 8, title = "Geographic Overview" }) => {
    const [mapCenter, setMapCenter] = useState(center);

    // Mock coordinates for demo if they are missing in the data
    const processedLocations = locations.map((loc, index) => {
        if (loc.latitude && loc.longitude) return loc;
        
        // Generate stable mock coords for Rwanda based on ID/Index if real ones are missing
        const lat = -1.9 + (Math.sin(index) * 0.5);
        const lng = 30.0 + (Math.cos(index) * 0.5);
        
        return { ...loc, latitude: lat, longitude: lng };
    });

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-sm z-10">
                <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-rwanda-blue" />
                        {title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Interactive spatial distribution</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-rwanda-blue/10 text-rwanda-blue text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {processedLocations.length} Points
                    </span>
                </div>
            </div>
            
            <div className="flex-1 relative z-0">
                <MapContainer 
                    center={mapCenter} 
                    zoom={zoom} 
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {processedLocations.map((loc) => (
                        <Marker 
                            key={loc.id} 
                            position={[loc.latitude, loc.longitude]}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1">
                                    <h4 className="font-black text-gray-900 text-sm leading-tight">{loc.name}</h4>
                                    <p className="text-[10px] font-bold text-rwanda-blue uppercase tracking-tighter mt-0.5">{loc.type}</p>
                                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-2">
                                        <button className="text-[10px] font-bold bg-rwanda-blue text-white px-2 py-1 rounded-md flex items-center gap-1">
                                            <Navigation className="w-2.5 h-2.5" />
                                            Go to Profile
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    <RecenterMap center={mapCenter} />
                </MapContainer>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .leaflet-container {
                    font-family: inherit;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 16px;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                    padding: 4px;
                }
                .leaflet-popup-tip {
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                }
            `}} />
        </div>
    );
};

export default LocationMap;
