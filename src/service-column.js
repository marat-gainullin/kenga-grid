import Column from './column';

class ServiceColumn extends Column {
    constructor(node) {
        super(node);
        const self = this;

        this.width = 22;
        this.readonly = true;

        Object.defineProperty(this, 'minWidth', {
            get: function() {
                return self.width;
            }
        });

        Object.defineProperty(this, 'maxWidth', {
            get: function() {
                return self.width;
            }
        });
    }
}

export default ServiceColumn;
