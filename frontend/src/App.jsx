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

function App() {
  const [exercises, setExercises] = useState([]);

  async function handleSubmit(text) {
    const response = await fetch("http://localhost:8000/create_exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();

    const built = data.exercises.map((tokens, i) => {
      const [maskIndex,answer] = data.answers[i];
      return {
        preVerb: tokens.slice(0, maskIndex).join(" "),
        maskedVerb: tokens[maskIndex].replaceAll("[","").replaceAll("]",""),
        postVerb: tokens.slice(maskIndex + 1).join(" "),
        answer: answer
      }
    });
    setExercises(built);
  }
 

  return (
    <main className="App">
      <h1>Text-to-Learning</h1>
      <EntryBox onSubmit={handleSubmit} />
      <ExerciseList exercises={exercises} />
    </main>
  )
}

export default App
