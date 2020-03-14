export function dLDistance({ a, b }: { a: string; b: string; }) {
  if (!a || a.length === 0)
    if (!b || b.length === 0)
      return 0;
    else
      return b.length;
  else if (!b)
    return a.length;

  a = a.toLowerCase();
  b = b.toLowerCase();

  //don't allow more than 25% of the characters to be incorrect
  var maxNumberOfCharacters = 0.25*b.length;  

  //clean up the source string a, which may have escape characters.
  a = removeEscapeCharactersAndPunctuation({str: a});

  var sourceLength = a.length;
  var targetLength = b.length;
  var score = new Array<Array<number>>();

  var INF = sourceLength + targetLength;
  score[0] = [INF];
  for (var i = 0; i <= sourceLength; i++) { score[i + 1] = []; score[i + 1][1] = i; score[i + 1][0] = INF; }
  for (var i = 0; i <= targetLength; i++) { score[1][i + 1] = i; score[0][i + 1] = INF; }

  var sd = {};
  var combinedStrings = a + b;
  var combinedStringsLength = combinedStrings.length;
  for (var i = 0; i < combinedStringsLength; i++) {
    var letter = combinedStrings[i];
    if (!sd.hasOwnProperty(letter))
      sd[letter] = 0;
  }

  for (var i = 1; i <= sourceLength; i++) {
    var DB = 0;
    for (var j = 1; j <= targetLength; j++) {
      var i1 = sd[b[j - 1]];
      var j1 = DB;

      if (a[i - 1] == b[j - 1]) {
        score[i + 1][j + 1] = score[i][j];
        DB = j;
      }
      else
        score[i + 1][j + 1] = Math.min(score[i][j], Math.min(score[i + 1][j], score[i][j + 1])) + 1;

      score[i + 1][j + 1] = Math.min(score[i + 1][j + 1], score[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1));
    }
    sd[a[i - 1]] = i;
  }

  return score[sourceLength + 1][targetLength + 1] >= maxNumberOfCharacters ? 100 : score[sourceLength + 1][targetLength + 1];  
}

export function removeEscapeCharactersAndPunctuation({ str }: { str: string }) {
  str = removeEscapeCharacters({str: str});
  str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  return str;
}

export function removeEscapeCharacters({str}: {str: string}) {
  str = str.replace(/\\\\n/g, "");
  str = str.replace(/\\n/g, "");
  str = str.replace(/\\/g, "");
  return str;
}