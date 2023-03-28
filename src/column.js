/* global Infinity */
import Ui from 'kenga/utils';
import Bound from 'kenga/bound';
import Id from './id';

class Column {
    constructor(node) {
        const self = this;
        const cols = []; // dom 'col' elements for header,frozen,body and footer sections of the grid
        const columnRule = document.createElement('style');
        const columnStyleName = `p-grid-column-${Id.next()}`;
        let field = null;
        let sortField = null;
        let renderer = null;
        let editor = null;
        /**
         * Minimum column width while resizing by a user.
         */
        let minWidth = 15;
        /**
         * Maximum column width while resizing by a user.
         */
        let maxWidth = Infinity;
        let width = '75px';
        let padding = 0;
        let readonly = false;
        let visible = true;
        let sortable = true;
        let switchable = true;
        let sortedAscending = false
        let sortedDescending = false
        let comparator; // PathComparator
        const headers = []; // multiple instances of NodeView
        let onShow = null;
        let onHide = null;
        let onResize = null;
        let onRender = null;
        let onHeaderRender = null;
        let onSelect = null;
        let grid = null;

        function paddedWidthToStyle() {
            return width == null || width === '' || width === Infinity ? '' : `width: ${typeof width == 'number' || (typeof width == 'string' && width.endsWith('px')) ? `${parseFloat(width) + padding}px` : width};`;
        }

        function minWidthToStyle() {
            return minWidth == null || minWidth === '' || minWidth === Infinity ? '' : `min-width: ${typeof minWidth == 'number' ? `${minWidth}px` : minWidth};`;
        }

        function maxWidthToStyle() {
            return maxWidth == null || maxWidth === '' || maxWidth === Infinity ? '' : `max-width: ${typeof maxWidth == 'number' ? `${maxWidth}px` : maxWidth};`;
        }

        function regenerateColStyle() {
            columnRule.innerHTML = `.${columnStyleName}{${visible ? '' : 'display: none;'}${paddedWidthToStyle()}${minWidthToStyle()}${maxWidthToStyle()}`;
        }

        regenerateColStyle();

        Object.defineProperty(this, 'styleName', {
            get: function () {
                return columnStyleName;
            }
        });

        function addCol() {
            const col = document.createElement('col');
            cols.push(col);
            col.className = columnStyleName;
            return col;
        }

        Object.defineProperty(this, 'addCol', {
            get: function () {
                return addCol;
            }
        });
        /**
         * Multiple 'col' elements for the single column, because of grid sections.
         */
        Object.defineProperty(this, 'elements', {
            get: function () {
                return cols;
            }
        });

        /**
         * Multiple 'headers' for the single column, because of splitted column nodes.
         */
        Object.defineProperty(this, 'headers', {
            get: function () {
                return headers;
            }
        });
        /**
         * Typically, we need only leaf column's header.
         * Leaf nodes' columns can have only single header, by nature.
         */
        Object.defineProperty(this, 'header', {
            get: function () {
                return headers.length === 1 ? headers[0] : null;
            }
        });
        Object.defineProperty(this, 'grid', {
            get: function () {
                return grid;
            },
            set: function (aValue) {
                grid = aValue;
            }
        });

        Object.defineProperty(this, 'node', {
            get: function () {
                return node;
            }
        });

        Object.defineProperty(this, 'columnRule', {
            get: function () {
                return columnRule;
            }
        });

        Object.defineProperty(this, 'sortedAscending', {
            get: function () {
                return sortedAscending;
            }
        });

        Object.defineProperty(this, 'sortedDescending', {
            get: function () {
                return sortedDescending;
            }
        });

        Object.defineProperty(this, 'comparator', {
            get: function () {
                if (!comparator) {
                  comparator = new Bound.PathComparator(sortField ? sortField : field, true);
                }
                return comparator;
            },
            set: function (aValue) {
                comparator = aValue;
            }
        });

        function sort(fireEvent) {
            if (arguments.length < 1)
                fireEvent = true;
            sortedAscending = true
            sortedDescending = false
            if (fireEvent) {
                grid.addSortedColumn(self);
            }
        }

        Object.defineProperty(this, 'sort', {
            get: function () {
                return sort;
            }
        });

        function sortDesc(fireEvent) {
            if (arguments.length < 1)
                fireEvent = true;
            sortedAscending = false
            sortedDescending = true
            if (fireEvent) {
                grid.addSortedColumn(self);
            }
        }

        Object.defineProperty(this, 'sortDesc', {
            get: function () {
                return sortDesc;
            }
        });

        function unsort(fireEvent) {
            if (arguments.length < 1)
                fireEvent = true;
            sortedAscending = false
            sortedDescending = false
            if (fireEvent) {
                grid.removeSortedColumn(self);
            }
        }

        Object.defineProperty(this, 'unsort', {
            get: function () {
                return unsort;
            }
        });

        Object.defineProperty(this, 'field', {
            get: function () {
                return field;
            },
            set: function (aValue) {
                if (field !== aValue) {
                    field = aValue;
                    comparator = new Bound.PathComparator(sortField ? sortField : field, true);
                }
            }
        });

        Object.defineProperty(this, 'sortField', {
            get: function () {
                return sortField;
            },
            set: function (aValue) {
                if (sortField !== aValue) {
                    sortField = aValue;
                    comparator = new Bound.PathComparator(sortField ? sortField : field, true);
                }
            }
        });

        Object.defineProperty(this, 'padding', {
            get: function () {
                return padding;
            },
            set: function (aValue) {
                if (aValue != null && padding !== aValue) {
                    padding = +aValue;
                    regenerateColStyle();
                    if (grid) {
                        grid.updateSectionsWidth();
                    }
                }
            }
        });

        Object.defineProperty(this, 'minWidth', {
            configurable: true,
            get: function () {
                return minWidth;
            },
            set: function (aValue) {
                if (minWidth !== aValue) {
                    minWidth = aValue;
                    regenerateColStyle();
                }
            }
        });

        Object.defineProperty(this, 'width', {
            get: function () {
                return width;
            },
            set: function (aValue) {
                if (width !== aValue) {
                    const oldWidth = width
                    width = aValue;
                    regenerateColStyle();
                    if (grid) {
                        grid.updateSectionsWidth();
                    }
                    if (onResize) {
                      Ui.later(() => {
                          if (onResize) {
                            onResize.call(self, self, oldWidth, width)
                          }
                      })
                    }
                }
            }
        });

        Object.defineProperty(this, 'maxWidth', {
            configurable: true,
            get: function () {
                return maxWidth;
            },
            set: function (aValue) {
                if (maxWidth !== aValue) {
                    maxWidth = aValue;
                    regenerateColStyle();
                }
            }
        });

        function getValue(aItem) {
            if (aItem && field) {
                return Bound.getPathData(aItem, field);
            } else {
                return null;
            }
        }

        Object.defineProperty(this, 'getValue', {
            configurable: true,
            get: function () {
                return getValue;
            }
        });

        function setValue(anElement, value) {
            if (anElement && field && !readonly) {
                Bound.setPathData(anElement, field, value);
            }
        }

        Object.defineProperty(this, 'setValue', {
            configurable: true,
            get: function () {
                return setValue;
            }
        });

        function render(viewRowIndex, viewColumnIndex, dataRow, viewCell) {
            let checkbox = null;
            let text;

            function handleSelection(event) {
                if (checkbox && !readonly) {
                    setValue(dataRow, !getValue(dataRow));
                }

                const focusedViewRowIndexBefore = grid.focusedRow;
                const focusedViewColumnIndexBefore = grid.focusedColumn;
                const onlySelectedBefore = grid.selected && grid.selected.length === 1 ? grid.selected[0] : null;

                if (!grid.stickySelection && !event.ctrlKey && !event.metaKey) {
                    grid.unselectAll(false);
                }
                grid.select(dataRow);

                const onlySelectedAfter = grid.selected && grid.selected.length === 1 ? grid.selected[0] : null;
                if (onlySelectedBefore !== onlySelectedAfter || focusedViewRowIndexBefore !== viewRowIndex || focusedViewColumnIndexBefore !== viewColumnIndex) {
                    grid.focusCell(viewRowIndex, viewColumnIndex, true);
                }
            }
            Ui.on(viewCell, Ui.Events.CLICK, handleSelection);
            if (checkbox) {
                Ui.on(checkbox, Ui.Events.CLICK, handleSelection);
            }
            Ui.on(viewCell, Ui.Events.DBLCLICK, event => {
                if (event.button === 0) {
                    handleSelection(event);
                    if (grid.editable && !readonly && !checkbox) {
                        grid.startEditing();
                    }
                }
            });
            const value = getValue(dataRow);
            if (value == null) { // null == undefined, null !== undefined
                // No native rendering for null values
                text = null
            } else if (typeof (value) === 'boolean') {
                checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = !!value;
                if (readonly) {
                  checkbox.onchange = () => {
                    checkbox.checked = !!value;
                  }
                }
                viewCell.appendChild(checkbox);
                viewCell.classList.add('p-grid-cell-check-box');
                text = `${value}`;
            } else {
                if (renderer) {
                    renderer.value = value;
                    text = renderer.text;
                } else if (value instanceof Date) {
                    text = value.toJSON();
                } else {
                    text = `${value}`;
                }
            }
            // User's rendering for all values, including null
            if (onRender || grid.onRender) {
                const handler = onRender ? onRender : grid.onRender;
                handler.call(self, dataRow, viewCell, viewRowIndex, text);
            } else {
                viewCell.innerText = text;
            }
            if (grid.treeIndicatorColumn === self) {
                const padding = grid.indent * (grid.depthOf(dataRow) - 1);
                viewCell.style.paddingLeft = padding > 0 ? `${padding}px` : '';
                viewCell.classList.add('p-grid-cell-node')
                if (!grid.isLeaf(dataRow)) {
                    viewCell.classList.add(grid.expanded(dataRow) ? 'p-grid-cell-expanded' : 'p-grid-cell-collapsed');
                }
                const viewcellTreeHandler = document.createElement('div')
                viewcellTreeHandler.classList.add('p-grid-cell-node-handler')
                Ui.on(viewcellTreeHandler, Ui.Events.CLICK, (event) => {
                  event.stopPropagation();
                  grid.toggle(dataRow);
                });
                if (viewCell.hasChildNodes()) {      
                  viewCell.insertBefore(viewcellTreeHandler, viewCell.firstChild);
                } else {
                  viewCell.appendChild(viewcellTreeHandler);
                }
            }
        }

        Object.defineProperty(this, 'render', {
            configurable: true,
            get: function () {
                return render;
            }
        });
        Object.defineProperty(this, 'visible', {
            get: function () {
                return visible;
            },
            set: function (aValue) {
                if (visible !== aValue) {
                    visible = aValue;
                    regenerateColStyle();
                    if (grid) {
                        grid.applyColumnsNodes();
                    }
                    if (visible) {
                      if (onShow) {
                        Ui.later(() => {
                          if (onShow) {
                            onShow.call(self, self)
                          }
                        })
                      }
                    } else {
                      if (onHide) {
                        Ui.later(() => {
                          if (onHide) {
                            onHide.call(self, self)
                          }
                        })
                      }
                    }
                }
            }
        });

        Object.defineProperty(this, 'readonly', {
            get: function () {
                return readonly;
            },
            set: function (aValue) {
                readonly = aValue;
            }
        });

        Object.defineProperty(this, 'sortable', {
            get: function () {
                return sortable;
            },
            set: function (aValue) {
                sortable = aValue;
            }
        });

        Object.defineProperty(this, 'switchable', {
            get: function () {
                return switchable;
            },
            set: function (aValue) {
                switchable = aValue;
            }
        });

        Object.defineProperty(this, 'onShow', {
            get: function () {
                return onShow;
            },
            set: function (aValue) {
                if (onShow !== aValue) {
                    onShow = aValue;
                }
            }
        });

        Object.defineProperty(this, 'onHide', {
            get: function () {
                return onHide;
            },
            set: function (aValue) {
                if (onHide !== aValue) {
                    onHide = aValue;
                }
            }
        });

        Object.defineProperty(this, 'onResize', {
            get: function () {
                return onResize;
            },
            set: function (aValue) {
                if (onResize !== aValue) {
                    onResize = aValue;
                }
            }
        });

        Object.defineProperty(this, 'onRender', {
            get: function () {
                return onRender;
            },
            set: function (aValue) {
                if (onRender !== aValue) {
                    onRender = aValue;
                }
            }
        });

        Object.defineProperty(this, 'onHeaderRender', {
            get: function () {
                return onHeaderRender;
            },
            set: function (aValue) {
                if (onHeaderRender !== aValue) {
                    onHeaderRender = aValue;
                }
            }
        });

        Object.defineProperty(this, 'onSelect', {
            get: function () {
                return editor ? editor.onSelect : null;
            },
            set: function (aValue) {
                if (onSelect !== aValue && editor) {
                    editor.onSelect = aValue;
                }
            }
        });

        Object.defineProperty(this, 'renderer', {
            get: function () {
                return renderer;
            },
            set: function (aValue) {
                if (renderer !== aValue) {
                    renderer = aValue;
                }
            }
        });
        Object.defineProperty(this, 'editor', {
            get: function () {
                return editor;
            },
            set: function (aValue) {
                if (editor !== aValue) {
                    if (editor && editor.element) {
                        editor.element.classList.remove('p-grid-cell-editor');
                    }
                    editor = aValue;
                    if (editor && editor.element) {
                        editor.element.classList.add('p-grid-cell-editor');
                    }
                }
            }
        });
    }
}

export default Column;
