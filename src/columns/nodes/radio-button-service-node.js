import HeaderNode from '../column-node';
import RadioServiceColumn from '../radio-button-service-column';
import NodeView from '../../header/node-view';

class RadioServiceColumnNode extends HeaderNode {
    constructor() {
        const self = this;
        const column = new RadioServiceColumn(this);
        const header = new NodeView('\\', this);
        super(column, header);
        column.editor = null; // TODO: Add radio button default editor

        function copy() {
            const copied = new RadioServiceColumnNode();
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

export default RadioServiceColumnNode;
