import spacy

def passage_to_sentences(passage):
    """
    Splits a passage into individual sentences.

    Args:
        passage (str): The passage to be split.

    Returns:
        list: A list of sentences extracted from the passage.
    """
    sentences = passage.split(".")
    return [s.strip() for s in sentences]

def tag_sentence(nlp, sentence):
    """
    Tags a sentence using the provided spaCy NLP model.

    Args:
        nlp: The spaCy NLP model.
        sentence (str): The sentence to be tagged.

    Returns:
        list: A list of tuples containing the token text, lemma, and its corresponding part-of-speech tag.
    """
    doc = nlp(sentence)
    return [(token.text, token.lemma_, token.pos_) for token in doc]

if __name__ == "__main__":
    nlp = spacy.load("es_core_news_sm")

