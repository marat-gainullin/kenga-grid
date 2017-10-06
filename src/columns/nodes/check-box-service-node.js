import HeaderNode from '../column-node';
import CheckServiceColumn from '../../columns/check-box-service-column';
import NodeView from '../../header/node-view';

class CheckServiceColumnNode extends HeaderNode {
    constructor() {
        const self = this;
        const column = new CheckServiceColumn(this);
        const header = new NodeView('\\', this);
        super(column, header);
        column.editor = null;

        function copy() {
            const copied = new CheckServiceColumnNode();
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

export default CheckServiceColumnNode;
