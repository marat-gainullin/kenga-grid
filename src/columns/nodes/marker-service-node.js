import HeaderNode from '../column-node';
import MarkerServiceColumn from '../marker-service-column';
import NodeView from '../../header/node-view';

class MarkerServiceColumnNode extends HeaderNode {
    constructor() {
        const self = this;
        const column = new MarkerServiceColumn(this);
        const header = new NodeView('\\', this);
        super(column, header);

        function copy() {
            const copied = new MarkerServiceColumnNode();
            copied.column = column;
            copied.view.text = header.text;
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
