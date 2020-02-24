"use strict";
exports.__esModule = true;
function dLDistance(_a) {
    var a = _a.a, b = _a.b;
    if (a.length == 0) {
        return b.length;
    }
    if (b.length == 0) {
        return a.length;
    }
    var m = a.length;
    var n = b.length;
    var maxVariance = m + n;
    var score = new Array(m + 2);
    var sd = {};
    for (var i = 0; i <= m + 1; i++) {
        score[i] = new Array(n + 2);
    }
    score[0][0] = maxVariance;
    for (var i = 0; i <= m; i++) {
        score[i + 1][1] = i;
        score[i + 1][0] = maxVariance;
        sd[a[i]] = 0;
    }
    for (var j = 0; j <= n; j++) {
        score[1][j + 1] = j;
        score[0][j + 1] = maxVariance;
        sd[b[j]] = 0;
    }
    for (var i = 1; i <= m; i++) {
        var tmp = 0;
        for (var j = 1; j <= n; j++) {
            var i1 = sd[b[j - 1]], j1 = tmp;
            if (a[i - 1] == b[j - 1]) {
                score[i + 1][j + 1] = score[i][j];
                tmp = j;
            }
            else {
                score[i + 1][j + 1] = Math.min(score[i][j], score[i + 1][j], score[i][j + 1]) + 1;
            }
            if (score[i1]) {
                score[i + 1][j + 1] = Math.min(score[i + 1][j + 1], score[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1));
            }
            else {
                score[i + 1][j + 1] = Math.min(score[i + 1][j + 1], Infinity);
            }
        }
        sd[a[i - 1]] = i;
    }
    return score[m + 1][n + 1];
}
exports.dLDistance = dLDistance;
