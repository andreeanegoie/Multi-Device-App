import "./App.css";
import { useEffect, useState } from "react";

import amsterdamImage from "./assets/destinations/amsterdam.jpg";
import barcelonaImage from "./assets/destinations/barcelona.jpg";
import cyprusImage from "./assets/destinations/cyprus.jpg";
import dubaiImage from "./assets/destinations/dubai.jpg";
import madeiraImage from "./assets/destinations/madeira.jpg";
import maltaImage from "./assets/destinations/malta.jpg";
import mauritiusImage from "./assets/destinations/mauritius.jpg";
import parisImage from "./assets/destinations/paris.jpg";
import pragueImage from "./assets/destinations/prague.jpg";
import romeImage from "./assets/destinations/rome.jpg";
import santoriniImage from "./assets/destinations/santorini.jpg";
import tenerifeImage from "./assets/destinations/tenerife.jpg";

const destinations = [
  { name: "Mauritius", image: mauritiusImage, climate: "Warm", tripType: "Beach", activities: ["Swimming", "Snorkelling", "Sightseeing"], thingsToDo: ["Chamarel Seven Coloured Earth", "Black River Gorges", "Blue Bay Marine Park"] },
  { name: "Tenerife", image: tenerifeImage, climate: "Warm", tripType: "Beach", activities: ["Swimming", "Hiking", "Nightlife"], thingsToDo: ["Teide National Park", "Los Gigantes", "La Laguna"] },
  { name: "Malta", image: maltaImage, climate: "Warm", tripType: "City", activities: ["Swimming", "Sightseeing", "Culture"], thingsToDo: ["Valletta", "Mdina", "Blue Grotto"] },
  { name: "Cyprus", image: cyprusImage, climate: "Warm", tripType: "Beach", activities: ["Swimming", "Food", "Sightseeing"], thingsToDo: ["Nissi Beach", "Paphos Archaeological Park", "Troodos Mountains"] },
  { name: "Rome", image: romeImage, climate: "Mild", tripType: "City", activities: ["Culture", "Food", "Sightseeing"], thingsToDo: ["Colosseum", "Trevi Fountain", "Vatican City"] },
  { name: "Barcelona", image: barcelonaImage, climate: "Warm", tripType: "City", activities: ["Beach", "Nightlife", "Food"], thingsToDo: ["Sagrada Familia", "Park Güell", "Gothic Quarter"] },
  { name: "Paris", image: parisImage, climate: "Mild", tripType: "City", activities: ["Culture", "Food", "Sightseeing"], thingsToDo: ["Eiffel Tower", "Louvre Museum", "Montmartre"] },
  { name: "Amsterdam", image: amsterdamImage, climate: "Cool", tripType: "City", activities: ["Culture", "Sightseeing", "Nightlife"], thingsToDo: ["Canal District", "Rijksmuseum", "Jordaan"] },
  { name: "Santorini", image: santoriniImage, climate: "Warm", tripType: "Beach", activities: ["Relaxing", "Sightseeing", "Food"], thingsToDo: ["Oia", "Fira", "Red Beach"] },
  { name: "Dubai", image: dubaiImage, climate: "Hot", tripType: "City", activities: ["Shopping", "Beach", "Sightseeing"], thingsToDo: ["Burj Khalifa", "Dubai Marina", "Jumeirah Beach"] },
  { name: "Madeira", image: madeiraImage, climate: "Mild", tripType: "Nature", activities: ["Hiking", "Nature", "Sightseeing"], thingsToDo: ["Pico do Arieiro", "Funchal", "Levada Walks"] },
  { name: "Prague", image: pragueImage, climate: "Cool", tripType: "City", activities: ["Culture", "Nightlife", "Sightseeing"], thingsToDo: ["Charles Bridge", "Old Town Square", "Prague Castle"] }
];

const packingSuggestions = {
  Beach: ["Swimwear", "Sun cream", "Sunglasses", "Beach shoes"],
  City: ["Comfortable shoes", "Day bag", "Portable charger", "Reusable water bottle"],
  Nature: ["Walking shoes", "Light rain jacket", "Reusable water bottle", "Small backpack"],
  Swimming: ["Swimwear", "Beach towel", "Waterproof phone case"],
  Snorkelling: ["Swim shoes", "Waterproof phone case", "Snorkelling mask"],
  Hiking: ["Walking shoes", "Water bottle", "Light jacket"],
  Nightlife: ["Evening outfit", "Small bag"],
  Culture: ["Comfortable shoes", "Day bag"],
  Sightseeing: ["Comfortable shoes", "Portable charger", "Reusable water bottle"],
  Food: ["Reusable water bottle"],
  Shopping: ["Comfortable shoes", "Foldable tote bag"],
  Relaxing: ["Book", "Sunglasses"]
};

function App() {
  const [screen, setScreen] = useState("login");
  const [activePage, setActivePage] = useState("dashboard");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("username") || "");
  const [trips, setTrips] = useState(() => JSON.parse(localStorage.getItem("trips")) || []);
  const [preferences, setPreferences] = useState(() => JSON.parse(localStorage.getItem("preferences")) || {
    climate: "Warm",
    tripType: "Beach",
    activity: "Sightseeing"
  });

  const [destination, setDestination] = useState("Mauritius");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripType, setTripType] = useState("Beach");
  const [activity, setActivity] = useState("Sightseeing");

  const [item, setItem] = useState("");
  const [category, setCategory] = useState("Clothes");
  const [packingItems, setPackingItems] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setScreen("dashboard");
      getItems();
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem("preferences", JSON.stringify(preferences));
  }, [preferences]);

  async function getItems() {
    const response = await fetch("/api/items");
    const data = await response.json();
    setPackingItems(data);
  }

  async function addItem() {
    if (!item.trim()) return;

    const response = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, category })
    });

    const serverData = await response.json();
    setPackingItems(serverData);
    setItem("");
  }

  async function registerUser() {
    setMessage("");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const serverData = await response.json();
    setMessage(serverData.message);

    if (serverData.success) {
      setScreen("login");
      setPassword("");
    }
  }

  async function loginUser() {
    setMessage("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const serverData = await response.json();
    setMessage(serverData.message);

    if (serverData.success) {
      localStorage.setItem("username", serverData.name);
      setCurrentUser(serverData.name);
      setPassword("");
    }
  }

  function logoutUser() {
    localStorage.removeItem("username");
    setCurrentUser("");
    setName("");
    setEmail("");
    setPassword("");
    setMessage("");
    setScreen("login");
    setActivePage("dashboard");
  }

  function createTrip() {
    const newTrip = {
      id: Date.now(),
      destination,
      startDate,
      endDate,
      tripType,
      activity
    };

    setTrips([...trips, newTrip]);
    setStartDate("");
    setEndDate("");
    setActivePage("dashboard");
  }

  function savePreferences() {
    localStorage.setItem("preferences", JSON.stringify(preferences));
    setMessage("Preferences saved.");
  }

  const recommendedDestinations = destinations
    .filter((place) => {
      const preferenceMatch =
        place.climate === preferences.climate ||
        place.tripType === preferences.tripType ||
        place.activities.includes(preferences.activity);

      const previousTripMatch = trips.some(
        (trip) => trip.tripType === place.tripType || place.activities.includes(trip.activity)
      );

      return preferenceMatch || previousTripMatch;
    })
    .slice(0, 4);

  const selectedTrip = trips.length > 0 ? trips[trips.length - 1] : null;
  const selectedDestination = selectedTrip
    ? destinations.find((place) => place.name === selectedTrip.destination)
    : destinations[0];

  const suggestedItems = selectedTrip
    ? [
        ...(packingSuggestions[selectedTrip.tripType] || []),
        ...(packingSuggestions[selectedTrip.activity] || [])
      ].filter((value, index, array) => array.indexOf(value) === index)
    : [];

  if (screen === "login") {
    return (
      <main className="account-page">
        <section className="account-card">
          <p className="brand-mark">TRIPMATE</p>
          <h1>Plan better trips.</h1>
          <p>Sign in to manage your trips and packing lists.</p>

          <form action={loginUser}>
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <input type="submit" value="Login" />
          </form>

          {message && <p className="message">{message}</p>}

          <button className="text-button" onClick={() => { setMessage(""); setScreen("register"); }}>
            Create an account
          </button>
        </section>
      </main>
    );
  }

  if (screen === "register") {
    return (
      <main className="account-page">
        <section className="account-card">
          <p className="brand-mark">TRIPMATE</p>
          <h1>Create your account</h1>
          <p>Start building a more personal travel planner.</p>

          <form action={registerUser}>
            <label htmlFor="register-name">Name</label>
            <input id="register-name" type="text" value={name} minLength="2" onChange={(e) => setName(e.target.value)} required />

            <label htmlFor="register-email">Email</label>
            <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label htmlFor="register-password">Password</label>
            <input id="register-password" type="password" value={password} minLength="6" onChange={(e) => setPassword(e.target.value)} required />

            <input type="submit" value="Register" />
          </form>

          {message && <p className="message">{message}</p>}

          <button className="text-button" onClick={() => { setMessage(""); setScreen("login"); }}>
            Back to login
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-mark">TRIPMATE</p>
          <p className="welcome-text">Welcome, {currentUser}</p>
        </div>
        <button className="logout-button" onClick={logoutUser}>Logout</button>
      </header>

      <nav className="main-nav">
        {["dashboard", "trips", "packing", "explore", "preferences"].map((page) => (
          <button
            key={page}
            className={activePage === page ? "active-nav" : ""}
            onClick={() => { setMessage(""); setActivePage(page); }}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
      </nav>

      <main className="content">
        {activePage === "dashboard" && (
          <>
            <section className="hero-section">
              <div className="hero-copy">
                <p className="eyebrow">PERSONALISED TRIP PLANNER</p>
                <h1>Your next trip starts here.</h1>
                <p>Plan trips, organise your packing and get recommendations based on what you enjoy.</p>
              </div>

              {selectedTrip && selectedDestination && (
                <div className="next-trip-card">
                  <img src={selectedDestination.image} alt={selectedTrip.destination} />
                  <div>
                    <span className="card-label">LATEST TRIP</span>
                    <h2>{selectedTrip.destination}</h2>
                    <p>{selectedTrip.startDate || "Date not set"} {selectedTrip.endDate && `– ${selectedTrip.endDate}`}</p>
                    <p>{selectedTrip.tripType} · {selectedTrip.activity}</p>
                  </div>
                </div>
              )}
            </section>

            <section className="dashboard-grid">
              <article className="summary-card">
                <p className="card-label">PACKING</p>
                <h3>{packingItems.length} items</h3>
                <p>Keep your essentials organised before you travel.</p>
                <button onClick={() => setActivePage("packing")}>View packing list</button>
              </article>

              <article className="summary-card">
                <p className="card-label">MY TRIPS</p>
                <h3>{trips.length} saved</h3>
                <p>Create a trip and keep your travel plans in one place.</p>
                <button onClick={() => setActivePage("trips")}>Manage trips</button>
              </article>

              <article className="summary-card">
                <p className="card-label">PREFERENCES</p>
                <h3>{preferences.tripType}</h3>
                <p>{preferences.climate} · {preferences.activity}</p>
                <button onClick={() => setActivePage("preferences")}>Update preferences</button>
              </article>
            </section>

            <section className="section-block">
              <div className="section-title">
                <div>
                  <p className="eyebrow">FOR YOU</p>
                  <h2>Recommended destinations</h2>
                </div>
                <button className="secondary-button" onClick={() => setActivePage("explore")}>See all</button>
              </div>

              <div className="destination-grid">
                {recommendedDestinations.map((place) => (
                  <article className="destination-card" key={place.name}>
                    <img src={place.image} alt={place.name} />
                    <div className="destination-content">
                      <h3>{place.name}</h3>
                      <p>{place.climate} · {place.tripType}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {selectedTrip && (
              <section className="two-column-section">
                <article className="detail-card">
                  <p className="eyebrow">PACK FOR {selectedTrip.destination.toUpperCase()}</p>
                  <h2>Suggested essentials</h2>
                  <div className="suggestion-list">
                    {suggestedItems.map((suggestion) => (
                      <button
                        key={suggestion}
                        className="suggestion-item"
                        onClick={() => { setItem(suggestion); setCategory("Other"); setActivePage("packing"); }}
                      >
                        <span>{suggestion}</span><span>+</span>
                      </button>
                    ))}
                  </div>
                </article>

                <article className="detail-card">
                  <p className="eyebrow">EXPLORE</p>
                  <h2>Things to do</h2>
                  <div className="things-list">
                    {selectedDestination.thingsToDo.map((thing) => <div key={thing}>{thing}</div>)}
                  </div>
                </article>
              </section>
            )}
          </>
        )}

        {activePage === "trips" && (
          <section className="section-block">
            <div className="section-title">
              <div>
                <p className="eyebrow">MY TRIPS</p>
                <h1>Create and review trips</h1>
              </div>
            </div>

            <div className="trips-layout">
              <section className="form-card">
                <h2>Create a trip</h2>

                <form action={createTrip}>
                  <label htmlFor="destination">Destination</label>
                  <select id="destination" value={destination} onChange={(e) => setDestination(e.target.value)}>
                    {destinations.map((place) => <option key={place.name}>{place.name}</option>)}
                  </select>

                  <label htmlFor="start-date">Start date</label>
                  <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

                  <label htmlFor="end-date">End date</label>
                  <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

                  <label htmlFor="trip-type">Trip type</label>
                  <select id="trip-type" value={tripType} onChange={(e) => setTripType(e.target.value)}>
                    <option>Beach</option>
                    <option>City</option>
                    <option>Nature</option>
                  </select>

                  <label htmlFor="activity">Main activity</label>
                  <select id="activity" value={activity} onChange={(e) => setActivity(e.target.value)}>
                    <option>Sightseeing</option>
                    <option>Swimming</option>
                    <option>Snorkelling</option>
                    <option>Hiking</option>
                    <option>Nightlife</option>
                    <option>Culture</option>
                    <option>Food</option>
                    <option>Shopping</option>
                    <option>Relaxing</option>
                  </select>

                  <input type="submit" value="Save trip" />
                </form>
              </section>

              <section className="saved-trips">
                {trips.length === 0 ? (
                  <div className="empty-card">
                    <h2>No trips yet</h2>
                    <p>Create your first trip to start receiving personalised suggestions.</p>
                  </div>
                ) : (
                  trips.map((trip) => {
                    const place = destinations.find((destinationItem) => destinationItem.name === trip.destination);
                    return (
                      <article className="trip-card" key={trip.id}>
                        <img src={place.image} alt={trip.destination} />
                        <div>
                          <h3>{trip.destination}</h3>
                          <p>{trip.startDate} – {trip.endDate}</p>
                          <p>{trip.tripType} · {trip.activity}</p>
                        </div>
                      </article>
                    );
                  })
                )}
              </section>
            </div>
          </section>
        )}

        {activePage === "packing" && (
          <section className="section-block">
            <div className="section-title">
              <div>
                <p className="eyebrow">PACKING</p>
                <h1>Your packing list</h1>
              </div>
            </div>

            <div className="packing-layout">
              <section className="form-card">
                <h2>Add an item</h2>

                <form action={addItem}>
                  <label htmlFor="item">Item</label>
                  <input type="text" id="item" value={item} onChange={(e) => setItem(e.target.value)} required />

                  <label htmlFor="category">Category</label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>Clothes</option>
                    <option>Toiletries</option>
                    <option>Electronics</option>
                    <option>Documents</option>
                    <option>Other</option>
                  </select>

                  <input type="submit" value="Add item" />
                </form>

                {suggestedItems.length > 0 && (
                  <div className="mini-suggestions">
                    <h3>Suggested for this trip</h3>
                    {suggestedItems.map((suggestion) => (
                      <button key={suggestion} onClick={() => { setItem(suggestion); setCategory("Other"); }}>
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="list-card">
                <div className="section-title">
                  <div>
                    <h2>Packing list</h2>
                    <p>{packingItems.length} items added</p>
                  </div>
                </div>

                {packingItems.length === 0 ? (
                  <p className="empty-message">Your packing list is empty.</p>
                ) : (
                  packingItems.map((packingItem) => (
                    <div className="packing-item" key={packingItem.key}>
                      <div>
                        <strong>{packingItem.item}</strong>
                        <span>{packingItem.category}</span>
                      </div>
                    </div>
                  ))
                )}
              </section>
            </div>
          </section>
        )}

        {activePage === "explore" && (
          <section className="section-block">
            <div className="section-title">
              <div>
                <p className="eyebrow">EXPLORE</p>
                <h1>Destination ideas</h1>
                <p>Recommendations are influenced by your saved preferences and previous trips.</p>
              </div>
            </div>

            <div className="destination-grid explore-grid">
              {destinations.map((place) => (
                <article className="destination-card" key={place.name}>
                  <img src={place.image} alt={place.name} />
                  <div className="destination-content">
                    <p className="card-label">{place.tripType}</p>
                    <h3>{place.name}</h3>
                    <p>{place.climate}</p>
                    <p>{place.activities.join(" · ")}</p>
                    <div className="things-preview">
                      {place.thingsToDo.map((thing) => <span key={thing}>{thing}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePage === "preferences" && (
          <section className="preferences-section">
            <div>
              <p className="eyebrow">PERSONALISE</p>
              <h1>Your travel preferences</h1>
              <p>These preferences help the app choose destinations that are more relevant to you.</p>
            </div>

            <section className="preferences-card">
              <label htmlFor="preference-climate">Preferred climate</label>
              <select
                id="preference-climate"
                value={preferences.climate}
                onChange={(e) => setPreferences({ ...preferences, climate: e.target.value })}
              >
                <option>Warm</option>
                <option>Hot</option>
                <option>Mild</option>
                <option>Cool</option>
              </select>

              <label htmlFor="preference-type">Preferred trip type</label>
              <select
                id="preference-type"
                value={preferences.tripType}
                onChange={(e) => setPreferences({ ...preferences, tripType: e.target.value })}
              >
                <option>Beach</option>
                <option>City</option>
                <option>Nature</option>
              </select>

              <label htmlFor="preference-activity">Favourite activity</label>
              <select
                id="preference-activity"
                value={preferences.activity}
                onChange={(e) => setPreferences({ ...preferences, activity: e.target.value })}
              >
                <option>Sightseeing</option>
                <option>Swimming</option>
                <option>Snorkelling</option>
                <option>Hiking</option>
                <option>Nightlife</option>
                <option>Culture</option>
                <option>Food</option>
                <option>Shopping</option>
                <option>Relaxing</option>
              </select>

              <button className="primary-button" onClick={savePreferences}>Save preferences</button>
              {message && <p className="message">{message}</p>}
            </section>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
