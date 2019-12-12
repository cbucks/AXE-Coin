/* global assert */

function isException(error, customMessage) {
    let strError = error.toString();
    return strError.includes(`revert ${customMessage}`) ||
        strError.includes('invalid opcode') ||
        strError.includes('invalid JUMP');
}

function ensureException(error, customMessage) {
    assert(isException(error, customMessage));
}

module.exports = {
    isException,
    ensureException,
};
