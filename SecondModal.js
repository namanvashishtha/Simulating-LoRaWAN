
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SecondModal.css';

const SecondModal = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [ngrokUrl, setNgrokUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        
        const ngrokResponse = await fetch('https://e883-34-139-237-33.ngrok-free.app/get-ngrok-url', {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'MyReactApp/1.0',
            'ngrok-skip-browser-warning': 'true', 
            'Cache-Control': 'no-cache'
          },
          credentials: 'include'
        });

        // First check if response is HTML
        const text = await ngrokResponse.text();
        if (text.startsWith('<!DOCTYPE html>')) {
          throw new Error('Received HTML instead of JSON. Check ngrok authentication.');
        }

        const ngrokData = JSON.parse(text);
        const cleanUrl = new URL(ngrokData.ngrok_url).origin;
        setNgrokUrl(cleanUrl);
        console.log('cleanurl-' + cleanUrl );
        // Fetch image with security headers
        const imageResponse = await fetch(`${cleanUrl}/images/water_usage_graph_2.png`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'User-Agent': 'MyReactApp/1.0'
          }
        });
        console.log('imageResponse- ' + imageResponse)
        if (!imageResponse.ok) {
          throw new Error(`Image failed to load: ${imageResponse.status}`);
        }

        const imageBlob = await imageResponse.blob();
        setImageUrl(URL.createObjectURL(imageBlob));

      } catch (error) {
        console.error("Critical Fetch Error:", error);
        setImageUrl(null);
       
      }
    }

    fetchData();
  }, []);

  const handleGoBack = () => navigate('/');

  return (
    <div className="second-modal">
      <div className="second-modal-content">
        {/* <h1>Water Usage Analysis</h1> */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Water Usage Visualization"
            className="graph-image"
            onError={() => setImageUrl(null)}
          />
        ) : (
          <p>{ngrokUrl ? "Generating visualization..." : "Initializing connection..."}</p>
        )}
        <button className="go-back-button" onClick={handleGoBack}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SecondModal;