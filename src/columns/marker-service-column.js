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
            viewCell.classList.add('p-grid-cell-service');
            viewCell.classList.add('p-grid-cell-marker');
            if (self.grid.cursorProperty && self.grid.rows && self.grid.rows[self.grid.cursorProperty] === dataRow) {
                viewCell.classList.add('p-grid-cell-cursor');
            }
            Ui.on(viewCell, Ui.Events.CLICK, event => {
                self.grid.unselectAll(false);
                self.grid.select(dataRow);
                self.grid.focusCell(viewRowIndex, viewColumnIndex);
            });
            /*
             if (value.inserted)
             content.className = 'grid-marker-inserted';
             else if (value.updated)
             content.className = 'grid-marker-cell-dirty';
             */
            // User's rendering for all values, including null
            if (self.onRender || self.grid.onRender) {
                const handler = self.onRender ? self.onRender : self.grid.onRender;
                handler.call(self, dataRow, viewCell, viewRowIndex, null);
            }
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
