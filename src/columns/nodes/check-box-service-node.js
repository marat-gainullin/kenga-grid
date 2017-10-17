import ColumnNode from '../column-node';
import CheckServiceColumn from '../check-box-service-column';
import NodeView from '../../header/node-view';

class CheckServiceColumnNode extends ColumnNode {
    constructor() {
        super(CheckServiceColumn);
        this.view.text = '\\';
        this.column.editor = null;
        
        const self = this;

        function copy() {
            const copied = new CheckServiceColumnNode();
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

export default CheckServiceColumnNode;
