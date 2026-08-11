from app.utils.text_parsing import passage_to_sentences, tag_sentence, reform_passages

def test_passage_splits_into_sentences():
    result = passage_to_sentences("Hola mundo. Adiós mundo.")
    assert result[:2] == ["Hola mundo", "Adiós mundo"]
