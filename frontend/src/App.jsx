import React, { useState } from 'react'
import './App.css'

function EntryBox({ onSubmit }) {
  const [textValue, setTextValue] = useState('');

  return (
    <div className="entry-form">
      <textarea
        className="entry-box"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        rows={4}
        cols={80}
        placeholder="Enter Spanish text here..."
      />
      <button className="submit-button" onClick={() => onSubmit(textValue)}>
        Generate exercises
      </button>
    </div>
  );
}

function Exercise({ exercise, guess, onGuessChange}) {
  return (
    <p className="exercise-sentence">
      {exercise.preVerb}{' '}
      <input 
        value={guess}
        onChange={(e) => onGuessChange(e.target.value)}
        placeholder={exercise.maskedVerb}
      />{' '}
      {exercise.postVerb}
    </p>
  );
}

function App() {
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [showScore, setShowScore] = useState(false);

  function updateGuess(index, value) {
    setGuesses(guesses.map((g,i) => (i === index ? value : g)));
  }

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
    setGuesses(Array(built.length).fill(""));
    setExercises(built);
  }

  function getScores(exercises, guesses) {
    return exercises.filter((exercise, i) => exercise.answer.toLowerCase() === guesses[i].trim().toLowerCase()).length;
  }
 

  return (
    <main className="App">
      <h1>Text-to-Learning</h1>
      <EntryBox onSubmit={handleSubmit} />

      {exercises.length >0 && (
        <div className="exercise-card">
          <Exercise 
            exercise={exercises[currentExerciseIndex]} 
            guess={guesses[currentExerciseIndex]}
            onGuessChange={(value) => updateGuess(currentExerciseIndex, value)}
          />
          <div className="nav-buttons">
            <button
              onClick={() => setCurrentExerciseIndex(currentExerciseIndex -1)}
              disabled = {currentExerciseIndex === 0}
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
              disabled = {currentExerciseIndex === exercises.length - 1}
            >
              Next
            </button>
            <span className="exercise-count">
              {currentExerciseIndex + 1} of {exercises.length}
            </span>
          </div>
        </div>
      )}
      <div className="score-section">
        <button onClick={() => setShowScore(true)}>
          Check Score
        </button>
        {showScore && (
          <p className="score-display">
            Your score: {getScores(exercises, guesses)} / {exercises.length}
          </p>
        )}
      </div>
    </main>
  );
}

export default App
