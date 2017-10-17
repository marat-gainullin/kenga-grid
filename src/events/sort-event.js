import Event from 'kenga/event';

class SortEvent extends Event {
    constructor(w) {
        super(w, w);
    }
}

export default SortEvent;