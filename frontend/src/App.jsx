import React, { useState } from 'react'
import './App.css'

function EntryBox({ onSubmit }) {
  const [textValue, setTextValue] = useState('');

  return (
    <div className="entry-form">
      <textarea
        className="entry-box"
        value = {textValue}
        onChange={(e) => setTextValue(e.target.value)}
        rows = {4}
        cols = {80}
        placeholder = "Enter Spanish text here..."
        />
      <button className="submit-button" onClick={() => onSubmit(textValue)}>
        Generate exercises
      </button>
    </div>
  );
}

function ExerciseList({ exercises }) {
  return (
    <div className="exercise-list">
      {exercises.map((exercise, index) => (
        <Exercise key={index} exercise={exercise} />
      ))}
    </div>
  );
}

function Exercise({ exercise }) {
  return (<p>{exercise.preVerb} {exercise.maskedVerb} {exercise.postVerb}</p>);
}

const EXERCISES = [
  {preVerb: "Ayer yo", maskedVerb: "comer", postVerb: "la manzana que me dio mi madre."},
  {preVerb: "Mañana tú", maskedVerb: "estudiar", postVerb: "para el examen de matemáticas."},
]

function App() {
  function handleSubmit(text) {
    console.log("Submitted text:", text);
  }

  return (
    <main className="App">
      <h1>Text-to-Learning</h1>
      <EntryBox onSubmit={handleSubmit} />
      <ExerciseList exercises={EXERCISES} />
    </main>
  )
}

export default App
