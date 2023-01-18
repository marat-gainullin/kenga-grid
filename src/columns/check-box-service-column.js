import Ui from 'kenga/utils';
import ServiceColumn from '../service-column';

class CheckBoxServiceColumn extends ServiceColumn {
    constructor(node) {
        super(node);
        const self = this;
        this.sortable = true;

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
            viewCell.classList.add('p-grid-cell-service');
            viewCell.classList.add('p-grid-cell-check-box');
            // User's rendering for all values, including null
            if (self.onRender || self.grid.onRender) {
                const handler = self.onRender ? self.onRender : self.grid.onRender;
                handler.call(self, dataRow, viewCell, viewRowIndex, null);
            }
        }

        Object.defineProperty(this, 'render', {
            get: function () {
                return render;
            }
        });
        Object.defineProperty(this, 'getValue', {
            get: function () {
                return getValue;
            }
        });
        Object.defineProperty(this, 'checked', {
            get: function () {
                return self.grid && self.grid.data ? self.grid.hasSelected && self.grid.data.length === self.grid.selectedCount : false;
            },
            set: function (value) {
                if (self.grid != null) {
                    if (value) {
                        self.grid.selectAll()
                    } else {
                        self.grid.unselectAll()
                    }
                }
            }
        });
        this.comparator = (o1, o2) => {
          const s1 = self.grid.isSelected(o1) ? 1 : 0
          const s2 = self.grid.isSelected(o2) ? 1 : 0
          return s1 - s2
        }
    }
}

export default CheckBoxServiceColumn;
