module.exports = function (callback) {
    return function (err) {
        if (err) {
            console.error(err);
        }
        if (callback) {
            callback(err);
        }
    };
}
