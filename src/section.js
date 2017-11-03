import Ui from 'kenga/utils';
import Invoke from 'septima-utils/invoke';

const JS_ROW_NAME = 'js-row';
let rowDrag = null;

class Section {
    constructor(
            grid,
            dynamicCellsClassName,
            dynamicRowsClassName,
            dynamicHeaderCellsClassName,
            dynamicHeaderRowsClassName,
            dynamicOddRowsClassName,
            dynamicEvenRowsClassName
            ) {
        const self = this;

        const table = document.createElement('table');
        table.className = 'p-grid-section';
        const colgroup = document.createElement('colgroup');
        let rowsHeight = 30;
        let headerNodes = [];
        let headerMaxDepth = 0;
        let draggableRows = false;
        let columns = [];
        let data = []; // Already sorted data
        let dataRangeStart = 0; // Inclusive
        let dataRangeEnd = 0; // Exclusive
        let renderedRangeStart = 0; // Inclusive
        let renderedRangeEnd = 0; // Exclusive
        let renderingThrottle = 0; // No throttling
        let renderingPadding = 0; // No padding
        let viewportBias = 0;
        let onDrawBody = null;

        let thead;
        recreateHead();
        let tbody;
        recreateBody();
        let tfoot;
        recreateFoot();
        const bodyFiller = document.createElement('div');
        bodyFiller.className = 'p-grid-body-filler';

        Object.defineProperty(this, 'element', {
            get: function () {
                return table;
            }
        });
        Object.defineProperty(this, 'data', {
            get: function () {
                return data;
            },
            set: function (aValue) {
                if (data !== aValue) {
                    data = aValue;
                }
            }
        });
        Object.defineProperty(this, 'rowsHeight', {
            get: function () {
                return rowsHeight;
            },
            set: function (aValue) {
                if (rowsHeight !== aValue) {
                    rowsHeight = aValue;
                    redrawBody();
                }
            }
        });
        Object.defineProperty(this, 'renderingThrottle', {
            get: function () {
                return renderingThrottle;
            },
            set: function (aValue) {
                renderingThrottle = aValue;
            }
        });
        Object.defineProperty(this, 'viewportBias', {
            get: function () {
                return viewportBias;
            },
            set: function (aValue) {
                viewportBias = aValue;
            }
        });
        Object.defineProperty(this, 'renderingPadding', {
            get: function () {
                return renderingPadding;
            },
            set: function (aValue) {
                renderingPadding = aValue;
            }
        });
        Object.defineProperty(this, 'onDrawBody', {
            get: function () {
                return onDrawBody;
            },
            set: function (aValue) {
                onDrawBody = aValue;
            }
        });
        Object.defineProperty(this, 'draggableRows', {
            get: function () {
                return draggableRows;
            },
            set: function (aValue) {
                if (draggableRows !== aValue) {
                    draggableRows = aValue;
                }
            }
        });

        function insertColumn(index, aColumn, needRedraw) {
            if (arguments.length < 3)
                needRedraw = true;
            if (index >= 0 && index <= columns.length) { // It is all about insertBefore
                if (index < columns.length) { // It is all about insertBefore
                    columns.splice(index, 0, aColumn);
                    const col = colgroup.getChild(index);
                    colgroup.insertBefore(aColumn.addCol(), col);
                } else {
                    columns.push(aColumn);
                    colgroup.appendChild(aColumn.addCol());
                }
                table.parentElement.parentElement.appendChild(aColumn.columnRule);
                if (needRedraw) {
                    redraw();
                }
            }
        }
        Object.defineProperty(this, 'insertColumn', {
            get: function () {
                return insertColumn;
            }
        });

        function addColumn(aColumn, needRedraw) {
            if (arguments.length < 2)
                needRedraw = true;
            insertColumn(columns.length, aColumn, needRedraw);
        }
        Object.defineProperty(this, 'addColumn', {
            get: function () {
                return addColumn;
            }
        });

        function removeColumn(index, needRedraw) {
            if (arguments.length < 2)
                needRedraw = true;
            if (index >= 0 && index < columns.length) {
                const removed = columns.splice(index, 1)[0];
                removed.elements.forEach(col => {
                    col.parentElement.removeChild(col);
                });
                removed.elements.splice(0, removed.elements.length);
                if (removed.columnRule.parentElement)
                    removed.columnRule.parentElement.removeChild(removed.columnRule);
                if (needRedraw) {
                    redraw();
                }
                return removed;
            } else {
                return null;
            }
        }
        Object.defineProperty(this, 'removeColumn', {
            get: function () {
                return removeColumn;
            }
        });

        Object.defineProperty(this, 'columnsCount', {
            get: function () {
                return columns.length;
            }
        });

        function getColumn(index) {
            return index >= 0 && index < columns.length ? columns[index] : null;
        }
        Object.defineProperty(this, 'getColumn', {
            get: function () {
                return getColumn;
            }
        });

        function getColumnIndex(column) {
            return columns.indexOf(column);
        }

        Object.defineProperty(this, 'getColumnIndex', {
            get: function () {
                return getColumnIndex;
            }
        });

        Object.defineProperty(this, 'rowsCount', {
            get: function () {
                return tbody.rows.length;
            }
        });

        function getViewCell(row, col) {
            if (columns.length > 0) {
                const grid = columns[0].grid;
                const viewRows = tbody.rows;
                const columnsBias = self === grid.frozenRight || self === grid.bodyRight ? grid.frozenColumns : 0;
                if (row - renderedRangeStart >= 0 && row - renderedRangeStart < viewRows.length) {
                    const viewRow = viewRows[row - renderedRangeStart];
                    const cells = viewRow.cells;
                    if (col - columnsBias >= 0 && col - columnsBias < cells.length) {
                        return cells[col - columnsBias];
                    }
                }
            }
            return null;
        }
        Object.defineProperty(this, 'getViewCell', {
            get: function () {
                return getViewCell;
            }
        });

        function setHeaderNodes(aHeader, maxDepth, needRedraw) {
            if (arguments.length < 2)
                needRedraw = false;
            headerNodes = aHeader;
            headerMaxDepth = maxDepth;
            if (needRedraw) {
                redrawHeaders();
            }
        }
        Object.defineProperty(this, 'setHeaderNodes', {
            get: function () {
                return setHeaderNodes;
            }
        });

        function clearColumnsAndHeader(needRedraw) {
            if (arguments.length < 1)
                needRedraw = true;
            columns.forEach(removed => {
                removed.elements.forEach(col => {
                    col.parentElement.removeChild(col);
                });
                removed.elements.splice(0, removed.elements.length);
                if (removed.columnRule.parentElement)
                    removed.columnRule.parentElement.removeChild(removed.columnRule);
            });
            columns = [];
            headerNodes = [];
            if (needRedraw) {
                redraw();
            }
        }
        Object.defineProperty(this, 'clearColumnsAndHeader', {
            get: function () {
                return clearColumnsAndHeader;
            }
        });

        function redraw() {
            redrawHeaders();
            redrawBody();
            redrawFooters();
        }
        Object.defineProperty(this, 'redraw', {
            get: function () {
                return redraw;
            }
        });

        function recreateHead() {
            if (thead && thead.parentElement)
                table.removeChild(thead);
            if (colgroup && colgroup.parentElement)
                table.removeChild(colgroup);
            thead = document.createElement('thead');
            table.insertBefore(thead, tbody);
            table.insertBefore(colgroup, thead);
        }

        function redrawHeaders() {
            recreateHead();
            drawHeaders();
        }
        Object.defineProperty(this, 'redrawHeaders', {
            get: function () {
                return redrawHeaders;
            }
        });

        function drawHeaders() {
            if (columns.length > 0) {
                let r = 0;
                let nextLayer = headerNodes;
                while (nextLayer.length > 0) {
                    nextLayer = drawHeaderRow(nextLayer);
                    r++;
                }
                while (r < headerMaxDepth) {
                    drawHeaderRow([]);
                    r++;
                }
            }
        }

        function drawHeaderRow(layer) {
            const children = [];
            const tr = document.createElement('tr');
            tr.className = `p-grid-header-row ${dynamicHeaderRowsClassName}`;
            layer.forEach(node => {
                tr.appendChild(node.view.element);
                if (node.column.comparator) {
                    node.view.element.className = node.column.comparator.ascending ? 'p-grid-header-sorted-asc ' : 'p-grid-header-sorted-desc ';
                } else {
                    node.view.element.className = '';
                }
                node.view.element.className += `p-grid-header-cell ${dynamicHeaderCellsClassName}`; // reassign classes
                node.view.element.classList.add(node.column.styleName);
                Array.prototype.push.apply(children, node.children);
            });
            thead.appendChild(tr);
            return children;
        }

        function recreateBody() {
            if (tbody && tbody.parentElement)
                table.removeChild(tbody);
            tbody = document.createElement('tbody');
            table.insertBefore(tbody, tfoot);
        }

        function drawBody() {
            let startRenderedRow;
            let endRenderedRow;
            let viewportHeight;

            function calc() {
                const rowsCount = dataRangeEnd - dataRangeStart;

                viewportHeight = table.parentElement.clientHeight - viewportBias;
                const contentHeight = rowsCount * rowsHeight;
                let topPadding = Math.floor(viewportHeight * renderingPadding);
                topPadding = Math.max(topPadding, 0);
                let bottomPadding = Math.floor(viewportHeight * renderingPadding);
                bottomPadding = Math.max(bottomPadding, 0);

                let startY = table.parentElement.scrollTop - topPadding;
                startY = Math.max(startY, 0);
                startRenderedRow = Math.floor(startY / rowsHeight);

                let endY = table.parentElement.scrollTop + viewportHeight + bottomPadding;
                endY = Math.min(endY, contentHeight - 1);
                endRenderedRow = Math.ceil(endY / rowsHeight);
                endRenderedRow = Math.min(endRenderedRow, rowsCount);

                const renderedRowsCount = endRenderedRow - startRenderedRow;
                const fillerHeight = rowsHeight * (rowsCount - renderedRowsCount) + viewportBias;
                bodyFiller.style.height = `${fillerHeight}px`;
                bodyFiller.style.display = fillerHeight === 0 ? 'none' : '';

                renderRange(startRenderedRow + dataRangeStart, endRenderedRow + dataRangeStart);

                table.style.top = `${startRenderedRow * rowsHeight}px`;
            }
            calc();
            if (viewportHeight !== table.parentElement.clientHeight) {
                calc();
            }
            if (onDrawBody) {
                onDrawBody();
            }
        }

        function redrawBody() {
            renderedRangeStart = renderedRangeEnd = -1;
            Invoke.throttle(renderingThrottle, drawBody);
        }
        Object.defineProperty(this, 'redrawBody', {
            get: function () {
                return redrawBody;
            }
        });

        function inTrRect(viewRow, event) {
            const rect = viewRow.getBoundingClientRect();
            return event.clientX >= rect.left &&
                    event.clientY >= rect.top &&
                    event.clientX < rect.right &&
                    event.clientY < rect.bottom;
        }

        function checkRegion(viewRow, event) {
            function clear() {
                if (rowDrag.clear) {
                    rowDrag.clear();
                    rowDrag.clear = null;
                }
                rowDrag.clear = () => {
                    viewRow.classList.remove('p-grid-row-drop-before');
                    viewRow.classList.remove('p-grid-row-drop-into');
                    viewRow.classList.remove('p-grid-row-drop-after');
                };
            }

            function check(className) {
                if (!viewRow.className.includes(className)) {
                    clear();
                    viewRow.classList.add(className);
                    return true;
                } else {
                    return false;
                }
            }
            const rect = viewRow.getBoundingClientRect();
            const heightPortion = (event.clientY - rect.top) / rect.height;
            if (heightPortion <= 0.2) {
                const modified = check('p-grid-row-drop-before');
                return {
                    onDrag: grid.onDragBefore,
                    onDrop: grid.onDropBefore,
                    modified
                };
            } else if (heightPortion > 0.2 && heightPortion <= 0.8) {
                const modified = check('p-grid-row-drop-into');
                return {
                    onDrag: grid.onDragInto,
                    onDrop: grid.onDropInto,
                    modified
                };
            } else {
                const modified = check('p-grid-row-drop-after');
                return {
                    onDrag: grid.onDragAfter,
                    onDrop: grid.onDropAfter,
                    modified
                };
            }
        }

        function drawBodyPortion(start, end) {
            if (end - start > 0 && columns.length > 0) {
                const grid = columns[0].grid;
                for (let i = start; i < end; i++) {
                    const dataRow = data[i];
                    const viewRow = document.createElement('tr');
                    if (draggableRows) {
                        viewRow.draggable = draggableRows;
                    }
                    viewRow.className = `p-grid-row ${dynamicRowsClassName}`;
                    if ((i + 1) % 2 === 0) {
                        viewRow.classList.add(dynamicEvenRowsClassName);
                    } else {
                        viewRow.classList.add(dynamicOddRowsClassName);
                    }
                    if (grid.isSelected(dataRow))
                        viewRow.classList.add('p-grid-selected-row');
                    viewRow[JS_ROW_NAME] = dataRow;
                    if (i < renderedRangeStart) {
                        // insertFirst ...
                        if (tbody.firstElementChild)
                            tbody.insertBefore(viewRow, tbody.firstElementChild);
                        else
                            tbody.appendChild(viewRow);
                        // ... insertFirst
                    } else {
                        tbody.appendChild(viewRow);
                    }
                    const columnsBias = self === grid.frozenRight || self === grid.bodyRight ? grid.frozenColumns : 0;
                    for (let c = 0; c < columns.length; c++) {
                        const column = columns[c];
                        const viewCell = document.createElement('td');
                        // TODO: Check alignment of the cell
                        // TODO: Check image decoration of the cell and decoration styles
                        viewCell.className = `p-grid-cell ${dynamicCellsClassName} ${column.styleName}`;
                        if (i === grid.focusedRow && columnsBias + c === grid.focusedColumn) {
                            viewCell.classList.add('p-grid-cell-focused');
                        }
                        viewRow.appendChild(viewCell);
                        column.render(i, columnsBias + c, dataRow, viewCell);
                        if (grid.activeEditor && i === grid.focusedRow && grid.activeEditor === column.editor) {
                            viewCell.appendChild(grid.activeEditor.element);
                            if (grid.activeEditor.focus) {
                                grid.activeEditor.focus();
                            }
                        }
                    }
                    if (draggableRows) {
                        Ui.on(viewRow, Ui.Events.DRAGSTART, event => {
                            event.stopPropagation();
                            rowDrag = {
                                row: dataRow
                            };
                            event.dataTransfer.effectAllowed = 'move';
                            event.dataTransfer.setData('text/plain', 'p-grid-row-move');
                            let onDragEnd = Ui.on(viewRow, Ui.Events.DRAGEND, event => {
                                event.stopPropagation();
                                if (onDragEnd) {
                                    onDragEnd.removeHandler();
                                    onDragEnd = null;
                                }
                                if (rowDrag) {
                                    if (rowDrag.clear) {
                                        rowDrag.clear();
                                    }
                                    rowDrag = null;
                                }
                            });
                        });

                        const onDragEnterOver = (event) => {
                            if (rowDrag && rowDrag.row !== dataRow && inTrRect(viewRow, event)) {
                                event.preventDefault();
                                event.stopPropagation();
                                const region = checkRegion(viewRow, event);
                                if (region.onDrag) {
                                    event.dropEffect = 'move';
                                    if (region.modified) {
                                        region.onDrag(rowDrag.row, dataRow, event);
                                    }
                                } else {
                                    event.dropEffect = 'none';
                                }
                            }
                        };
                        Ui.on(viewRow, Ui.Events.DRAGENTER, onDragEnterOver);
                        Ui.on(viewRow, Ui.Events.DRAGOVER, onDragEnterOver);
                        Ui.on(viewRow, Ui.Events.DROP, event => {
                            if (rowDrag && rowDrag.row !== dataRow) {
                                if (rowDrag.clear) {
                                    rowDrag.clear();
                                    rowDrag.clear = null;
                                }
                                event.preventDefault();
                                event.stopPropagation();
                                const region = checkRegion(viewRow, event);
                                if (region.onDrop) {
                                    event.dropEffect = 'move';
                                    region.onDrop(rowDrag.row, dataRow, event);
                                } else {
                                    event.dropEffect = 'none';
                                }
                            }
                        });
                        Ui.on(viewRow, Ui.Events.DRAGLEAVE, event => {
                            if (rowDrag && !inTrRect(viewRow, event)) {
                                event.preventDefault();
                                event.stopPropagation();
                                if (rowDrag && rowDrag.clear) {
                                    rowDrag.clear();
                                    rowDrag.clear = null;
                                }
                            }
                        });
                    }
                }
            }
        }

        function setDataRange(start, end, needRedraw) {
            if (arguments.length < 3)
                needRedraw = true;
            if (!bodyFiller.parentElement) {
                table.parentElement.appendChild(bodyFiller);
                Ui.on(table.parentElement, Ui.Events.SCROLL, event => {
                    Invoke.throttle(renderingThrottle, drawBody);
                });
            }
            dataRangeStart = start;
            dataRangeEnd = end;
            if (needRedraw) {
                redrawBody();
            }
        }
        Object.defineProperty(this, 'setDataRange', {
            get: function () {
                return setDataRange;
            }
        });

        function renderRange(start, end) {
            if (start !== renderedRangeStart || end !== renderedRangeEnd) {
                if (start >= renderedRangeEnd || end < renderedRangeStart) {
                    recreateBody();
                    renderedRangeStart = start;
                    renderedRangeEnd = end;
                    drawBodyPortion(renderedRangeStart, renderedRangeEnd);
                } else {
                    if (start < renderedRangeStart) {
                        drawBodyPortion(start, renderedRangeStart);
                    } else if (start > renderedRangeStart) {
                        for (let i1 = renderedRangeStart; i1 < start && tbody.rows.length > 0; i1++) {
                            tbody.removeChild(tbody.rows[0]);
                        }
                    }
                    renderedRangeStart = start;
                    if (end < renderedRangeEnd) {
                        for (let i2 = renderedRangeEnd - 1; i2 >= end && tbody.rows.length > 0; i2--) {
                            tbody.removeChild(tbody.rows[tbody.rows.length - 1]);
                        }
                    } else if (end > renderedRangeEnd) {
                        drawBodyPortion(renderedRangeEnd, end);
                    }
                    renderedRangeEnd = end;
                }
            }
        }

        function recreateFoot() {
            if (tfoot && tfoot.parentElement)
                table.removeChild(tfoot);
            tfoot = document.createElement('tfoot');
            table.appendChild(tfoot);
        }

        function redrawFooters() {
            recreateFoot();
            drawFooters();
        }
        Object.defineProperty(this, 'redrawFooters', {
            get: function () {
                return redrawFooters;
            }
        });

        function drawFooters() {
            if (columns.length > 0) {
            }
        }
    }
}

export default Section;
