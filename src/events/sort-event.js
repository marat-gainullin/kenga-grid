import Event from '../event';

class SortEvent extends Event {
    constructor(w) {
        super(w, w);
    }
}

export default SortEvent;