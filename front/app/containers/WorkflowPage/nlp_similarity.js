"use strict";
exports.__esModule = true;
var Distance = require("./distance");
function addPromising(_a) {
    var promisingIndicesArray = _a.promisingIndicesArray, wordWindow = _a.wordWindow, correctWords = _a.correctWords, distanceBarrier = _a.distanceBarrier, index = _a.index;
    for (var j = 0; j < correctWords.length; j++) {
        var d = Distance.dLDistance({ a: wordWindow, b: correctWords[j] });
        if (d < distanceBarrier) {
            promisingIndicesArray.push(index);
        }
    }
}
function appendStringArrayWithSpace(_a) {
    var array = _a.array;
    var string = "";
    for (var i = 0; i < array.length; i++) {
        string += array[i] + " ";
    }
    string = Distance.removeEscapeCharacters({ str: string });
    return string;
}
function countWhiteSpacesInString(_a) {
    var text = _a.text;
    var count = 0;
    if (text == null) {
        return 0;
    }
    for (var i = 0; i < text.length; i++) {
        if (text.charAt[i] == " ") {
            count++;
        }
    }
    return count;
}
function getSectionFoundIn(_a) {
    var indexOfWord = _a.indexOfWord, wordsArray = _a.wordsArray;
    var arrayOfSearchTerms = [/interventions/g, /facilities/g, /updatedAt/g, /createdAt/g, /overallStatus/g, /briefTitle/g, /conditions/g,
        /eligibilityCriteria/g, /detailedDescription/g, /briefSummary/g];
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
    return "unsure";
}
function gettopFiveArray(_a) {
    var promisingIndicesArray = _a.promisingIndicesArray, wordsArray = _a.wordsArray, topFiveArray = _a.topFiveArray;
    for (var i = 0; i < promisingIndicesArray.length; i++) {
        var index = promisingIndicesArray[i];
        var backwardsWindow = index - 10;
        var forwardsWindow = index + 40;
        var sentence = "";
        if (backwardsWindow < 0 && forwardsWindow >= wordsArray.length) {
            sentence = appendStringArrayWithSpace({ array: wordsArray.slice(0, wordsArray.length) });
        }
        else if (backwardsWindow < 0 && forwardsWindow < wordsArray.length) {
            sentence = appendStringArrayWithSpace({ array: wordsArray.slice(0, forwardsWindow) });
        }
        else if (backwardsWindow >= 0 && forwardsWindow >= wordsArray.length) {
            sentence = appendStringArrayWithSpace({ array: wordsArray.slice(backwardsWindow, wordsArray.length) });
        }
        else {
            sentence = appendStringArrayWithSpace({ array: wordsArray.slice(backwardsWindow, forwardsWindow) });
        }
        if (i > 4) {
            break;
        }
        var toHighlight = Distance.removeEscapeCharacters({ str: wordsArray[index] });
        topFiveArray.push({ text: sentence, section: getSectionFoundIn({ indexOfWord: index, wordsArray: wordsArray }), keyWord: toHighlight });
    }
}
function findPhrases(_a) {
    var wordsToFind = _a.wordsToFind, text = _a.text;
    //ensure priority is given to words that were entered first in the list.
    console.log(wordsToFind);
    // wordsToFind = wordsToFind.reverse();
    console.log(wordsToFind);
    var promisingIndices = new Array();
    var words = new Array();
    if (wordsToFind.length == 0) {
        var topFive = new Array();
        for (var i = 0; i < 5; i++) {
            topFive.push({ text: "Could not find another phrase", section: "none", keyWord: "" });
        }
        return topFive;
    }
    // sort words by number of words
    var allWordsToFind = new Array(6);
    for (var i = 0; i < allWordsToFind.length; i++) {
        allWordsToFind[i] = new Array();
    }
    //put words into array corresponding by how mnay words in the phrase
    for (var i = 0; i < wordsToFind.length; i++) {
        var numWhiteSpace = countWhiteSpacesInString({ text: wordsToFind[i] });
        if (numWhiteSpace <= 5 && wordsToFind[i].length > 2) {
            allWordsToFind[numWhiteSpace].push(wordsToFind[i]);
        }
    }
    words = text.split(" ");
    for (var i = 0; i < words.length; i++) {
        var wordToCheck = words[i];
        addPromising({ promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[0], distanceBarrier: 3, index: i });
        addPromising({ promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[1], distanceBarrier: 3, index: i });
    }
    for (var i = 0; i < words.length - 1; i++) {
        var wordToCheck = appendStringArrayWithSpace({ array: words.slice(i, i + 2) });
        addPromising({ promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[0], distanceBarrier: 3, index: i });
        addPromising({ promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[1], distanceBarrier: 3, index: i });
    }
    for (var i = 0; i < words.length - 2; i++) {
        var wordToCheck = appendStringArrayWithSpace({ array: words.slice(i, i + 3) });
        addPromising({ promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[2], distanceBarrier: 4, index: i });
    }
    for (var i = 0; i < words.length - 3; i++) {
        var wordToCheck = appendStringArrayWithSpace({ array: words.slice(i, i + 4) });
        addPromising({ promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[3], distanceBarrier: 5, index: i });
    }
    for (var i = 0; i < words.length - 4; i++) {
        var wordToCheck = appendStringArrayWithSpace({ array: words.slice(i, i + 5) });
        addPromising({ promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[4], distanceBarrier: 6, index: i });
    }
    for (var i = 0; i < words.length - 5; i++) {
        var wordToCheck = appendStringArrayWithSpace({ array: words.slice(i, i + 6) });
        addPromising({ promisingIndicesArray: promisingIndices, wordWindow: wordToCheck, correctWords: allWordsToFind[5], distanceBarrier: 8, index: i });
    }
    //remove duplicates from the promising indices array
    promisingIndices = promisingIndices.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
    });
    //declare top 5 array
    var topFive = new Array();
    gettopFiveArray({ promisingIndicesArray: promisingIndices, wordsArray: words, topFiveArray: topFive });
    if (promisingIndices.length < 5) {
        for (var i = promisingIndices.length; i < 5; i++) {
            topFive.push({ text: "Could not find another phrase", section: "none", keyWord: "" });
        }
    }
    return topFive;
}
exports.findPhrases = findPhrases;
