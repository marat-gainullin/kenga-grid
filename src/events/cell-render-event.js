import Event from 'kenga/event';

class CellRenderEvent extends Event {
    constructor(aSource, viewIndex, element, aRendered, aCell) {
        super(aSource, aSource);
        Object.defineProperty(this, "viewIndex", {
            get: function() {
                return viewIndex;
            }
        });
        Object.defineProperty(this, "element", {
            get: function() {
                return element;
            }
        });
        Object.defineProperty(this, "object", {
            get: function() {
                return aRendered;
            }
        });
        Object.defineProperty(this, "cell", {
            get: function() {
                return aCell;
            }
        });
    }
}

export default CellRenderEvent;