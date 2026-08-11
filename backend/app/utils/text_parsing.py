import spacy
import itertools
import random

def passage_to_sentences(passage):
    """
    Splits a passage into individual sentences.

    Args:
        passage (str): The passage to be split.

    Returns:
        list: A list of sentences extracted from the passage.
    """
    try:
        sentences = passage.split(".")
        out = [s.strip() for s in sentences]
        return out
    except Exception as e:
        print(f"Error occurred while splitting passage into sentences: {e}")
        return []

def tag_sentence(sentence):
    """
    Tags a sentence using the provided spaCy NLP model.

    Args:
        sentence (str): The sentence to be tagged.

    Returns:
        list: A list of tuples containing the token text, lemma, and its 
            corresponding part-of-speech tag for verbs, and just the token 
            text for other parts of speech.
    """
    doc = sentence.as_doc()
    sent_out = []
    for token in doc:
        if token.pos_ == "VERB":
            sent_out.append((token.text, token.lemma_, token.pos_))
        else:
            sent_out.append((token.text))
    return sent_out

def reform_passages(tagged_sentences, passage_size=3):
    """
    Regroups tagged sentences into passages in groups of [passage_size] sentences each.

    Args:
        tagged_sentences (list): A list of tagged sentences.
        passage_size (int): The number of sentences to include in each passage.
    """
    passages = []
    for i in range(0, len(tagged_sentences), passage_size):
        passage = tagged_sentences[i:i + passage_size]
        flat_passage = list(itertools.chain.from_iterable(passage))
        passages.append(flat_passage)
    return passages

def parse_document(nlp, document, passage_size=3):
    """
    Parses a document into tagged passages.

    Args:
        nlp: The spaCy NLP model.
        document (str): The document to be parsed.
        passage_size (int): The number of sentences to include in each passage.

    Returns:
        list: A list of tagged passages.
    """
    spacy_doc = nlp(document)
    tagged_sentences = [tag_sentence(sentence) for sentence in spacy_doc.sents]
    passages = reform_passages(tagged_sentences, passage_size)
    return passages

def choose_mask(passage, seed=None):
    """
    Chooses a verb in the passage to hide for fill-in-the-blank exercises.
    Cannot be the first one in the passage, and cannot be an infinitive.

    Args:
        passage (list): A list of tagged tokens in the passage.
    
    Returns:
        list: A list of tokens with one verb replaced by a mask token.
        answer (str): The lemma of the masked verb.
        index (int): The index of the masked verb in the passage.
    """
    candidates = [token for token in passage if isinstance(token, tuple) and token[2] == "VERB" and token[1] != token[0]]

    if len(candidates) < 2:
        return passage, None, None
    
    rng = random.Random(seed)
    chosen_candidate = rng.choice(candidates[1:])
    answer = chosen_candidate[0]
    index = passage.index(chosen_candidate)

    masked_intermed = [(f"[{chosen_candidate[1]}]" if t == chosen_candidate else t) for t in passage]
    masked_passage = [(t[0] if isinstance(t, tuple) else t) for t in masked_intermed]
    return masked_passage, answer, index

if __name__ == "__main__":
    nlp = spacy.load("es_core_news_sm")
    parsed = parse_document(nlp, "Hola mundo. Adiós mundo. ¿Cómo estás? Todo bien, gracias a Dios. Espero que estés teniendo un buen día.", 2)
    print(parsed)
