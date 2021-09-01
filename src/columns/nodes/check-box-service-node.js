import ColumnNode from '../column-node';
import CheckServiceColumn from '../check-box-service-column';
import Ui from "kenga/utils";

class CheckServiceColumnNode extends ColumnNode {
    constructor() {
        super(CheckServiceColumn);
        this.view.text = '';
        const thChecker = document.createElement('input');
        thChecker.setAttribute('type', 'checkbox')
        thChecker.className = 'p-grid-column-checker';
        const thCheckerAligner = document.createElement('div');
        thCheckerAligner.className = 'p-grid-column-checker-aligner';
        const self = this;
        Ui.on(thChecker, Ui.Events.CLICK, event => {
            event.stopPropagation();
        });
        Ui.on(thChecker, Ui.Events.CHANGE, event => {
            self.column.checked = thChecker.checked
        });
        this.view.mover.appendChild(thCheckerAligner);
        this.view.mover.appendChild(thChecker);
        this.column.editor = null;

        function copy() {
            const copied = new CheckServiceColumnNode();
            copied.column = self.column;
            copied.view.text = self.view.text;
            copied.leavesCount = self.leavesCount;
            copied.depthRemainder = self.depthRemainder;
            return copied;
        }

        this.gridChanged = () => {
            thChecker.checked = self.column.checked;
        };

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
        Object.defineProperty(this, 'checker', {
            get: function () {
                return thChecker;
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

export default CheckServiceColumnNode;
