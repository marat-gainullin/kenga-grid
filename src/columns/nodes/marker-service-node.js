import ColumnNode from '../column-node';
import MarkerServiceColumn from '../marker-service-column';

class MarkerServiceColumnNode extends ColumnNode {
    constructor() {
        super(MarkerServiceColumn);
        this.view.text = '\\';

        const self = this;
        
        function copy() {
            const copied = new MarkerServiceColumnNode();
            copied.column = self.column;
            copied.view.text = self.view.text;
            copied.leavesCount = self.leavesCount;
            copied.depthRemainder = self.depthRemainder;
            return copied;
        }

        Object.defineProperty(this, 'copy', {
            get: function() {
                return copy;
            }
        });
        Object.defineProperty(this, 'renderer', {
            get: function() {
                return null;
            }
        });
        Object.defineProperty(this, 'editor', {
            get: function() {
                return null;
            }
        });

        this.resizable = false;
    }
}

export default MarkerServiceColumnNode;
