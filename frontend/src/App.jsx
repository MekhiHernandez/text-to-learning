import React, { useState } from 'react'
import './App.css'

function EntryBox() {
  const [textValue, setTextValue] = useState('');

  return (
    <div>
      <textarea
        className="entry-box"
        value = {textValue}
        onChange={(e) => setTextValue(e.target.value)}
        rows = {4}
        cols = {80}
        placeholder = "Enter Spanish text here..."
        />
    </div>
  );
}

function ExercisesList({ exercises }) {}

const EXERCISES = [
  {preVerb: "", maskedVerb: "", postVerb: ""}
]

function App() {
  return (
    <main className="App">
      <h1>Text-to-Learning</h1>
      <EntryBox />
    </main>
  )
}

export default App
