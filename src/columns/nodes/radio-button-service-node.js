import ColumnNode from '../column-node';
import RadioServiceColumn from '../radio-button-service-column';
import NodeView from '../../header/node-view';

class RadioServiceColumnNode extends ColumnNode {
    constructor() {
        super(RadioServiceColumn);
        this.view.text = '\\';
        this.column.editor = null; // TODO: Add radio button default editor
        
        const self = this;

        function copy() {
            const copied = new RadioServiceColumnNode();
            copied.column = self.column;
            copied.view.text = self.view.text;
            copied.leavesCount = self.leavesCount;
            copied.depthRemainder = self.depthRemainder;
            return copied;
        }

        Object.defineProperty(this, 'copy', {
            get: function () {
                return copy;
            }
        });
        Object.defineProperty(this, 'renderer', {
            get: function () {
                return null;
            }
        });
        Object.defineProperty(this, 'editor', {
            get: function () {
                return null;
            }
        });

        this.resizable = false;
    }
}

export default RadioServiceColumnNode;
