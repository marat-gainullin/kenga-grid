import Ui from 'ui/utils';
import ServiceColumn from '../service-column';

class CheckBoxServiceColumn extends ServiceColumn {
    constructor(node) {
        super(node);
        const self = this;

        function getValue(dataRow) {
            return self.grid.isSelected(dataRow);
        }

        function render(viewRowIndex, viewColumnIndex, dataRow, viewCell) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = self.grid.isSelected(dataRow);
            Ui.on(checkbox, Ui.Events.CHANGE, event => {
                if (checkbox.checked) {
                    self.grid.select(dataRow);
                } else {
                    self.grid.unselect(dataRow);
                }
                self.grid.focus();
            });
            viewCell.appendChild(checkbox);
            viewCell.classList.add('p-grid-cell-check-box');
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

export default CheckBoxServiceColumn;
