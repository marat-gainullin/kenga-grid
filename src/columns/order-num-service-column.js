import Ui from 'kenga/utils';
import ServiceColumn from '../service-column';

class OrderNumServiceColumn extends ServiceColumn {
    constructor(node) {
        super(node);
        const self = this;

        function getValue(dataRow) {
            return dataRow;
        }

        function render(viewRowIndex, viewColumnIndex, dataRow, viewCell) {
            viewCell.innerText = `${viewRowIndex + 1}`;
            Ui.on(viewCell, Ui.Events.CLICK, event => {
                self.grid.unselectAll(false);
                self.grid.select(dataRow);
                self.grid.focusCell(viewRowIndex, viewColumnIndex);
            });
            viewCell.classList.add('p-grid-cell-service');
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
        Object.defineProperty(this, 'getValue', {
            get: function() {
                return getValue;
            }
        });
    }
}

export default OrderNumServiceColumn;
