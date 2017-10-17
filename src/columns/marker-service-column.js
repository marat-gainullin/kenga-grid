import Ui from 'kenga/utils';
import ServiceColumn from '../service-column';

class MarkerServiceColumn extends ServiceColumn {
    constructor(node) {
        super(node);
        const self = this;

        function render(viewRowIndex, viewColumnIndex, dataRow, viewCell) {
            Ui.on(viewCell, Ui.Events.CLICK, event => {
                self.grid.setCursorOn(dataRow);
                self.grid.focusCell(viewRowIndex, viewColumnIndex);
            });
            if (self.grid.cursorProperty && self.grid.rows && self.grid.rows[self.grid.cursorProperty] === dataRow) {
                viewCell.classList.add('p-grid-cell-cursor');
            }
            viewCell.classList.add('p-grid-cell-service');
            /*
             if (value.inserted)
             content.className = 'grid-marker-inserted';
             else if (value.updated)
             content.className = 'grid-marker-cell-dirty';
             */
        }
        Object.defineProperty(this, 'render', {
            get: function() {
                return render;
            }
        });

        function getValue(dataRow) {
            return dataRow;
        }
        Object.defineProperty(this, 'getValue', {
            get: function() {
                return getValue;
            }
        });
    }
}

export default MarkerServiceColumn;
