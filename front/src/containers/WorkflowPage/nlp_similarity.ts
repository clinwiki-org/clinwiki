import * as Distance from './distance';

export interface SectionText {
  text: string;
  section: string;
  keyWord: string;
}

function addPromising({
  promisingIndicesArray,
  wordWindow,
  correctWords,
  distanceBarrier,
  index,
}: {
  promisingIndicesArray: number[];
  wordWindow: string;
  correctWords: string[];
  distanceBarrier: number;
  index: number;
}) {
  for (var j = 0; j < correctWords.length; j++) {
    var d = Distance.dLDistance({ a: wordWindow, b: correctWords[j] });
    if (d < distanceBarrier) {
      promisingIndicesArray.push(index);
    }
  }
}

function appendStringArrayWithSpace({ array }: { array: string[] }): string {
  var string = '';
  for (var i = 0; i < array.length; i++) {
    string += array[i] + ' ';
  }
  string = Distance.removeEscapeCharacters({ str: string });
  return string;
}

function countWhiteSpacesInString({ text }: { text: string }): number {
  var count = 0;
  if (text == null) {
    return 0;
  }

  for (var i = 0; i < text.length; i++) {
    if (text.charAt[i] == ' ') {
      count++;
    }
  }
  return count;
}

function getSectionFoundIn({
  indexOfWord,
  wordsArray,
}: {
  indexOfWord: number;
  wordsArray: string[];
}): string {
  var arrayOfSearchTerms = [
    /interventions/g,
    /facilities/g,
    /updatedAt/g,
    /createdAt/g,
    /overallStatus/g,
    /briefTitle/g,
    /conditions/g,
    /eligibilityCriteria/g,
    /detailedDescription/g,
    /briefSummary/g,
  ];
  for (var i = indexOfWord; i >= 0; i--) {
    for (var j = 0; j < arrayOfSearchTerms.length; j++) {
      var match = wordsArray[i].match(arrayOfSearchTerms[j]);
      if (match != null) {
        if (match.length > 0) {
          return match[0];
        }
      }
    }
  }
  return 'unsure';
}

function gettopFiveArray({
  promisingIndicesArray,
  wordsArray,
  topFiveArray,
}: {
  promisingIndicesArray: number[];
  wordsArray: string[];
  topFiveArray: SectionText[];
}) {
  for (var i = 0; i < promisingIndicesArray.length; i++) {
    var index = promisingIndicesArray[i];
    var backwardsWindow = index - 10;
    var forwardsWindow = index + 40;

    var sentence: string = '';
    if (backwardsWindow < 0 && forwardsWindow >= wordsArray.length) {
      sentence = appendStringArrayWithSpace({
        array: wordsArray.slice(0, wordsArray.length),
      });
    } else if (backwardsWindow < 0 && forwardsWindow < wordsArray.length) {
      sentence = appendStringArrayWithSpace({
        array: wordsArray.slice(0, forwardsWindow),
      });
    } else if (backwardsWindow >= 0 && forwardsWindow >= wordsArray.length) {
      sentence = appendStringArrayWithSpace({
        array: wordsArray.slice(backwardsWindow, wordsArray.length),
      });
    } else {
      sentence = appendStringArrayWithSpace({
        array: wordsArray.slice(backwardsWindow, forwardsWindow),
      });
    }
    if (i > 4) {
      break;
    }
    var toHighlight = Distance.removeEscapeCharacters({
      str: wordsArray[index],
    });
    topFiveArray.push({
      text: sentence,
      section: getSectionFoundIn({
        indexOfWord: index,
        wordsArray: wordsArray,
      }),
      keyWord: toHighlight,
    });
  }
}

export function findPhrases({
  wordsToFind,
  text,
}: {
  wordsToFind: string[];
  text: string;
}): SectionText[] {
  //ensure priority is given to words that were entered first in the list.
  console.log(wordsToFind);
  // wordsToFind = wordsToFind.reverse();
  console.log(wordsToFind);

  var promisingIndices = new Array<number>();
  var words = new Array<string>();
  if (wordsToFind.length == 0) {
    var topFive = new Array<SectionText>();
    for (var i = 0; i < 5; i++) {
      topFive.push({
        text: 'Could not find another phrase',
        section: 'none',
        keyWord: '',
      });
    }
    return topFive;
  }

  // sort words by number of words
  var allWordsToFind = new Array<string[]>(6);
  for (var i = 0; i < allWordsToFind.length; i++) {
    allWordsToFind[i] = new Array<string>();
  }

  //put words into array corresponding by how mnay words in the phrase
  for (var i = 0; i < wordsToFind.length; i++) {
    var numWhiteSpace = countWhiteSpacesInString({ text: wordsToFind[i] });
    if (numWhiteSpace <= 5 && wordsToFind[i].length > 2) {
      allWordsToFind[numWhiteSpace].push(wordsToFind[i]);
    }
  }

  words = text.split(' ');
  for (var i = 0; i < words.length; i++) {
    var wordToCheck = words[i];
    addPromising({
      promisingIndicesArray: promisingIndices,
      wordWindow: wordToCheck,
      correctWords: allWordsToFind[0],
      distanceBarrier: 3,
      index: i,
    });
    addPromising({
      promisingIndicesArray: promisingIndices,
      wordWindow: wordToCheck,
      correctWords: allWordsToFind[1],
      distanceBarrier: 3,
      index: i,
    });
  }

  for (var i = 0; i < words.length - 1; i++) {
    var wordToCheck = appendStringArrayWithSpace({
      array: words.slice(i, i + 2),
    });
    addPromising({
      promisingIndicesArray: promisingIndices,
      wordWindow: wordToCheck,
      correctWords: allWordsToFind[0],
      distanceBarrier: 3,
      index: i,
    });
    addPromising({
      promisingIndicesArray: promisingIndices,
      wordWindow: wordToCheck,
      correctWords: allWordsToFind[1],
      distanceBarrier: 3,
      index: i,
    });
  }

  for (var i = 0; i < words.length - 2; i++) {
    var wordToCheck = appendStringArrayWithSpace({
      array: words.slice(i, i + 3),
    });
    addPromising({
      promisingIndicesArray: promisingIndices,
      wordWindow: wordToCheck,
      correctWords: allWordsToFind[2],
      distanceBarrier: 4,
      index: i,
    });
  }

  for (var i = 0; i < words.length - 3; i++) {
    var wordToCheck = appendStringArrayWithSpace({
      array: words.slice(i, i + 4),
    });
    addPromising({
      promisingIndicesArray: promisingIndices,
      wordWindow: wordToCheck,
      correctWords: allWordsToFind[3],
      distanceBarrier: 5,
      index: i,
    });
  }

  for (var i = 0; i < words.length - 4; i++) {
    var wordToCheck = appendStringArrayWithSpace({
      array: words.slice(i, i + 5),
    });
    addPromising({
      promisingIndicesArray: promisingIndices,
      wordWindow: wordToCheck,
      correctWords: allWordsToFind[4],
      distanceBarrier: 6,
      index: i,
    });
  }

  for (var i = 0; i < words.length - 5; i++) {
    var wordToCheck = appendStringArrayWithSpace({
      array: words.slice(i, i + 6),
    });
    addPromising({
      promisingIndicesArray: promisingIndices,
      wordWindow: wordToCheck,
      correctWords: allWordsToFind[5],
      distanceBarrier: 8,
      index: i,
    });
  }

  //remove duplicates from the promising indices array
  promisingIndices = promisingIndices.filter(function (
    item,
    index,
    inputArray
  ) {
    return inputArray.indexOf(item) == index;
  });
  //declare top 5 array
  var topFive = new Array<SectionText>();
  gettopFiveArray({
    promisingIndicesArray: promisingIndices,
    wordsArray: words,
    topFiveArray: topFive,
  });

  if (promisingIndices.length < 5) {
    for (var i = promisingIndices.length; i < 5; i++) {
      topFive.push({
        text: 'Could not find another phrase',
        section: 'none',
        keyWord: '',
      });
    }
  }
  return topFive;
}
