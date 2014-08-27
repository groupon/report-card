var languageToSentence = require('../../../../tasks/render/helpers/language-to-sentence');
var assert = require('assertive');

describe("language-to-sentence helper", function(){
  it('shows only one language if passed only one language', function(){
    var sentence = languageToSentence([{language:'Ruby'}])
    assert.equal(sentence, "<span style='color:#701516'>Ruby</span>")
  });

  it('shows languages, colorized, as a sentence', function(){
    var sentence = languageToSentence([{language:'Ruby'}, {language:'C'}])
    assert.equal(sentence, "<span style='color:#701516'>Ruby</span> and <span style='color:#555'>C</span>")
  });

  it('shows languages, colorized, as a sentence', function(){
    var sentence = languageToSentence([{language:'Ruby'}, {language:'JavaScript'}, {language:'C'}])
    assert.equal(sentence, "<span style='color:#701516'>Ruby</span>, <span style='color:#f15501'>JavaScript</span>, and <span style='color:#555'>C</span>")
  });
});
