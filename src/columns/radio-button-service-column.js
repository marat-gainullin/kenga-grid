import Id from 'core/id';
import ServiceColumn from '../service-column';

class RadioButtonServiceColumn extends ServiceColumn {
    constructor(node) {
        super(node);
        const self = this;
        const radioGroup = `p-grid-group-${Id.generate()}`;

        function getValue(dataRow) {
            return self.grid.isSelected(dataRow);
        }

        function render(viewRowIndex, viewColumnIndex, dataRow, viewCell) {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = radioGroup;
            radio.checked = self.grid.isSelected(dataRow);
            radio.onchange = event => {
                if (radio.checked) {
                    self.grid.unselectAll();
                    self.grid.select(dataRow);
                }
                self.grid.focus();
            };
            viewCell.appendChild(radio);
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

export default RadioButtonServiceColumn;
