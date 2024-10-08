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
            copied.view.background = self.view.background;
            copied.view.foreground = self.view.foreground;
            copied.view.font = self.view.font;
            copied.view.resizable = self.view.resizable;
            copied.view.moveable = self.view.moveable;
            copied.view.sortable = self.view.sortable;
            copied.leavesCount = self.leavesCount;
            copied.depthRemainder = self.depthRemainder;
            return copied;
        }

        function readThValue() {
            if (self.column.grid) {
                if (self.column.grid.data) {
                    const dataSize = self.column.grid.data.length;
                    const selectedSize = self.column.grid.selectedCount;
                    if (selectedSize === dataSize && dataSize > 0) {
                        thChecker.indeterminate = false;
                        thChecker.checked = true;
                    } else {
                        if (selectedSize === 0) {
                            thChecker.indeterminate = false;
                            thChecker.checked = false;
                        } else {
                            thChecker.indeterminate = true;
                            thChecker.checked = null;
                        }
                    }
                } else {
                    thChecker.indeterminate = false;
                    thChecker.checked = false;
                }
            } else {
                thChecker.indeterminate = false;
                thChecker.checked = false;
            }
        }

        let selectReg = null;
        this.gridChanged = () => {
            if (selectReg != null) {
                selectReg.removeHandler();
                selectReg = null;
            }
            readThValue();
            if (self.column.grid) {
                selectReg = self.column.grid.addSelectHandler(() => {
                    readThValue();
                });
            }
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
