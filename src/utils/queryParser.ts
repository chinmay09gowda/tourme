export function parseUserQuery(query: string): {
  place: string | null;
  needsWeather: boolean;
  needsPlaces: boolean;
} {
  const lowerQuery = query.toLowerCase();

  const weatherKeywords = ['weather', 'temperature', 'temp', 'rain', 'climate', 'forecast'];
  const placesKeywords = ['places', 'visit', 'attractions', 'tourist', 'see', 'go', 'trip', 'plan'];

  const needsWeather = weatherKeywords.some(keyword => lowerQuery.includes(keyword));
  const needsPlaces = placesKeywords.some(keyword => lowerQuery.includes(keyword));

  const placeMatch = query.match(/(?:go to|going to|visit|plan.*trip.*to|trip.*to)\s+([A-Za-z\s,]+?)(?:\?|,|$|\s+what|\s+let)/i);

  let place = null;
  if (placeMatch && placeMatch[1]) {
    place = placeMatch[1].trim();
  } else {
    const words = query.split(/\s+/);
    const stopWords = ['i', 'am', 'going', 'to', 'go', 'visit', 'what', 'is', 'the', 'in', 'at', 'let', 'plan', 'my', 'trip'];
    const meaningfulWords = words.filter(word =>
      word.length > 2 &&
      !stopWords.includes(word.toLowerCase()) &&
      !/[?.,;:]/.test(word)
    );
    if (meaningfulWords.length > 0) {
      place = meaningfulWords.slice(0, 3).join(' ');
    }
  }

  return {
    place,
    needsWeather: needsWeather || (!needsPlaces && !needsWeather),
    needsPlaces: needsPlaces || (!needsPlaces && !needsWeather),
  };
}
