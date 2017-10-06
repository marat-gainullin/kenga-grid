import ColumnNode from '../column-node';
import OrderNumServiceColumn from '../order-num-service-column';
import NodeView from '../../header/node-view';

class OrderNumServiceColumnNode extends ColumnNode {
    constructor() {
        const self = this;
        const column = new OrderNumServiceColumn(this);
        const header = new NodeView('\\', this);
        super(column, header);

        function copy() {
            const copied = new OrderNumServiceColumnNode();
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

export default OrderNumServiceColumnNode;
