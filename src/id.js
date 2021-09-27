function now() {
    return new Date().valueOf();
}

const COUNTER_DIGITS = 100;
let ID = now() * COUNTER_DIGITS;

function next() {
    const idMillis = Math.floor(ID / COUNTER_DIGITS);
    if (idMillis === now()) {
        const oldCounter = ID - idMillis * COUNTER_DIGITS;
        const newCounter = oldCounter + 1;
        if (newCounter === COUNTER_DIGITS) {
            // Spin with maximum duration of one millisecond ...
            let newMillis;
            do {
                newMillis = now();
            } while (newMillis === idMillis);
            ID = newMillis * COUNTER_DIGITS;
        } else {
            ID = idMillis * COUNTER_DIGITS + newCounter;
        }
    } else {
        ID = now() * COUNTER_DIGITS;
    }
    return ID;
}

const module = {};

Object.defineProperty(module, 'next', {
    enumerable: true,
    value: next
});

export default module;