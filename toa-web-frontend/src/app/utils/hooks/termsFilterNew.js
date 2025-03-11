export default function HighlightWords (text, wordsToHighlight){
    // const regex = new RegExp(`\\b(${wordsToHighlight.join('|')})\\b`, 'gi');
    const regex = new RegExp(`\\b(${wordsToHighlight.map((v) => v.word_name).join('|')})\\b`, 'gi'); 
    
    // Replace matched words with clickable spans
    return text.replace(regex, (match) => `<span class="termWord">${match}</span>`);
  };