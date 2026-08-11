from fastapi import FastAPI
from contextlib import asynccontextmanager
from pydantic import BaseModel

import spacy
from app.utils.text_parsing import parse_document, choose_mask

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.nlp = spacy.load("es_core_news_sm")
    yield

app = FastAPI(lifespan=lifespan)

class ExerciseRequest(BaseModel):
    text: str
    passage_size: int = 3

class ExerciseResponse(BaseModel):
    exercises: list
    answers: list

@app.get("/")
async def root():
    return {"message":"Welcome to the Text-to-Learning API"}

@app.post("/create_exercises", response_model=ExerciseResponse)
async def create_exercises(request: ExerciseRequest):
    passages = parse_document(app.state.nlp, request.text, request.passage_size)

    exercises = []
    answers = []
    
    carry = [] # Carries previous passages as context if no valid verb is found
    for passage in passages:
        joined_carry = carry + passage
        masked, answer, index = choose_mask(joined_carry)
        
        if answer is None: 
            carry = joined_carry
            continue
        carry = []
        exercises.append(masked)
        answers.append((index, answer))
    return {"exercises": exercises, "answers": answers}
