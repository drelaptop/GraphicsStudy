module.exports = {
    "extends": "google",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "rules": {
        "require-jsdoc": 0,
        "max-len": ["error", 120, 4],
        "camelcase": "warn",
        "linebreak-style": 0,
        "no-var": "error"
    }
};