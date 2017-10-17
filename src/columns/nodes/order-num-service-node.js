import ColumnNode from '../column-node';
import OrderNumServiceColumn from '../order-num-service-column';
import NodeView from '../../header/node-view';

class OrderNumServiceColumnNode extends ColumnNode {
    constructor() {
        super(OrderNumServiceColumn);
        this.view.text = '\\';
        
        const self = this;

        function copy() {
            const copied = new OrderNumServiceColumnNode();
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

export default OrderNumServiceColumnNode;
