import React, { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [response, setResponse] = useState('');

  // Autocomplete zipcodes
  useEffect(() => {
    if (zipcode.length >= 3) {
      fetch(`https://api.zippopotam.us/CA/${zipcode}`)
        .then(res => res.json())
        .then(data => {
          if (data.places) {
            setSuggestions(data.places.map(p => p['post code']));
          }
        })
        .catch(() => setSuggestions([]));
    }
  }, [zipcode]);

  // Geolocation fallback
  useEffect(() => {
    if (!zipcode && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data.address && data.address.postcode) {
          setZipcode(data.address.postcode);
        }
      });
    }
  }, [zipcode]);

  const handleSearch = async () => {
    const res = await fetch('https://your-backend-url.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, zipcode })
    });
    const data = await res.json();
    setResponse(data.summary);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🛍️ Local Product Search</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for products..."
          style={{ marginRight: '1rem', padding: '0.5rem', width: '300px' }}
        />
        <input
          type="text"
          value={zipcode}
          onChange={e => setZipcode(e.target.value)}
          placeholder="Enter your zipcode"
          style={{ padding: '0.5rem', width: '150px' }}
          list="zipcode-suggestions"
        />
        <datalist id="zipcode-suggestions">
          {suggestions.map((zip, idx) => (
            <option key={idx} value={zip} />
          ))}
        </datalist>
      </div>
      <button onClick={handleSearch} style={{ padding: '0.5rem 1rem' }}>
        Search
      </button>
      <div style={{ marginTop: '2rem' }}>
        <h2>🔎 Results</h2>
        <div dangerouslySetInnerHTML={{ __html: response }} />
      </div>
    </div>
  );
}

export default App;