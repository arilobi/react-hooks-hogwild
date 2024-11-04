import React, { useState } from "react";
import '../components/App.css';
import Nav from "./Nav";
import hogs from "../porkers_data"; 

// Display name and image
const HogTile = ({ hog, onClick}) => (
  <div className="hog-tile" onClick={() => onClick(hog.name)}>
    <h3>{hog.name}</h3>
    <img src={hog.image} alt={hog.name} width="450"/>
  </div>
)

// Display details of each hog
const HogDetails = ({ hog }) => (
  <div className="hog-details">
    <p><strong>Specialty:</strong>{hog.specialty}</p>
    <p><strong>Weight:</strong>{hog.weight}</p>
    <p><strong>Greased:</strong>{hog.greased ? 'Yes' : 'No'}</p>
    <p><strong>Highest Medal Achieved:</strong>{hog["highest medal achieved"]}</p>
  </div>
);

// The main part for rendering 
function App() {
const [hogsData, setHogsData] = useState(hogs);
const [selectedHog, setSelectedHog] = useState(null);
const [filterGreased, setFilterGreased] = useState(false);
const [sortType, setSortType] = useState('');
const [hiddenHogs, setHiddenHogs] = useState(new Set());

//  Handling 

// Prev: means previous which means the original array
const handleTileClick = (hogName) => 
  setSelectedHog(selectedHog === hogName ? null : hogName)

//  the prev => !prev means that the filter option hasn't been called yet by the user meaning that they will see everything but when they click the button, it triggers it and it will show only the greased hogs.
const handleFilterGreased = () => setFilterGreased(prev => !prev);

// event listener. You can use (event) instead of e and this will enable the user to toggle between name and weight in the sort part.
const handleSortChange = (e) => setSortType(e.target.value);

// Any hidden Hog that will be clicked will be pushed in the hidden Hog set without affecting the original array.
const handleHideHog = (hogName) => setHiddenHogs(prev => new Set([...prev, hogName]));

// Add New Hog

const handleAddHog = (e) => {
  // Stop the form from submitting
  e.preventDefault();

  // The target is part of the event object (e) and the value will be the current thing that the user will key in when adding a new Hog
  const newHog = {
    name: e.target.name.value,
    specialty: e.target.specialty.value,
    weight: parseFloat(e.target.weight.value),
    greased: e.target.greased.checked,
    "highest medal achieved": e.target.medal.value,
    image: e.target.image.value,
  }
  // Updating the HogsData by using the set method and spread operator for the user to be able to add a new Hog to the existing array without affecting the original array.
  setHogsData(prev => [...prev, newHog]);
  // Clears the form after submission
  e.target.reset();
}

// Filtering and sorting 
// !filterGreased is currently true meaning that it will display all the hogs but if it was (filterGreased) it would return false and display only Hogs that are greased. The && joins the two by also displaying only the hogs that are not hidden thus why we use an exclamation mark before hiddenHogs.

const filteredHogs = hogsData.filter(hog => (!filterGreased || hog.greased) && !hiddenHogs.has(hog.name));

// the parantheses a and b symbolize name and weight
const sortedHogs = [...filteredHogs].sort((a, b) => {
  if (sortType === "name")
    // The localeCompare makes the Hogs to appear in alphabetical order. 
    return a.name.localeCompare(b.name);
    // This will sort out the weight numerically
  if (sortType === "weight")
    return a.weight - b.weight;
  // If the type is not weight, it will return 0 and nothing will change.
  return 0;
})

// Now, rendering
return (
  <div className="App">
    <Nav />

{/* Controls for the drop down */}
    <div className="controls">
      <button onClick={handleFilterGreased}>
      {filterGreased ? 'Show all' : 'Show greased only'}
      </button>

      <select onChange={handleSortChange}>
        <option value="">Sort by...</option>
        <option value="name">Name</option>
        <option value="weight">Weight</option>  
      </select>
    </div>

{/* Form */}
    <form onSubmit={handleAddHog} className="hog-form">
      <h2>Add a new Hog in the form below!</h2>
      <input name="name" placeholder="Name" required />
      <input name="specialty" placeholder="Specialty" required />
      <input name="weight" placeholder="Weight" type="number" step="0.1" required />
      <input name="image" placeholder="Image URL" required />

      <select name="medal" required> 
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
        <option value="bronze">Bronze</option>
        <option value="diamond">Diamond</option>
        <option value="wood">Wood</option>
        <option value="platinum">Platinum</option>
      </select>

      <label>
        Greased:
        <input name="greased" type="checkbox" />
      </label>
      <button type="submit" className="button-form">Add Hog</button>
    </form>

    {/* Contains hogtile component, their details and a hide hig button */}

    <div className="ui grid container">
      {/* Iterating the sorted hogs without affecting the original object */}
      {sortedHogs.map(hog => (
        <div key={hog.name} className="ui eight wide column hog-item">
          <HogTile hog={hog} onClick={handleTileClick} />
          {/* If selectedHog is equal to hog name, it will display the hog details. */}
          {selectedHog === hog.name && <HogDetails hog={hog} />}
          {/* Button function to hide the hog and push it to the hidden hog array */}
          <button onClick={() => handleHideHog(hog.name)}>Hide Hog</button>
        </div>
      ))}
    </div>
  </div>
);
}

export default App;
