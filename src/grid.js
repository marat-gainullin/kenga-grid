/* global Infinity */
import Ui from 'kenga/utils';
import Bound from 'kenga/bound';
import Widget from 'kenga/widget';
import KeyCodes from 'kenga/key-codes';
import KeyEvent from 'kenga/events/key-event';
import BlurEvent from 'kenga/events/blur-event';
import ItemEvent from 'kenga/events/item-event';
import WidgetEvent from 'kenga/events/widget-event';
import FocusEvent from 'kenga/events/focus-event';
import Menu from 'kenga-menu/menu';
import CheckBoxMenuItem from 'kenga-menu/check-box-menu-item';
import SortEvent from './events/sort-event';
import Id from './id';
import Section from './section';
import HeaderAnalyzer from './header/analyzer';
import HeaderSplitter from './header/splitter';
import ServiceColumn from './service-column';

class Grid extends Widget {
    constructor() {
        const shell = document.createElement('div');
        super(shell);
        this.focusable = true;
        const self = this;

        const cellsStyleElement = document.createElement('style');
        const rowsStyleElement = document.createElement('style');
        const headerCellsStyleElement = document.createElement('style');
        const headerRowsStyleElement = document.createElement('style');

        const dynamicCellsClassName = `p-grid-cell-${Id.next()}`;
        const dynamicRowsClassName = `p-grid-row-${Id.next()}`;
        const dynamicHeaderCellsClassName = `p-grid-header-cell-${Id.next()}`;
        const dynamicHeaderRowsClassName = `p-grid-header-row-${Id.next()}`;

        const columnsChevronContainer = document.createElement('div');
        const columnsChevron = document.createElement('div');
        columnsChevronContainer.appendChild(columnsChevron)

        const frozenContainer = document.createElement('div');
        const frozenLeftContainer = document.createElement('div');
        const frozenRightContainer = document.createElement('div');

        const frozenLeft = new Section(self, dynamicCellsClassName, dynamicRowsClassName, dynamicHeaderCellsClassName, dynamicHeaderRowsClassName);
        Object.defineProperty(this, 'frozenLeft', {
            get: function () {
                return frozenLeft;
            }
        });
        frozenLeftContainer.appendChild(frozenLeft.element);
        const frozenRight = new Section(self, dynamicCellsClassName, dynamicRowsClassName, dynamicHeaderCellsClassName, dynamicHeaderRowsClassName);
        Object.defineProperty(this, 'frozenRight', {
            get: function () {
                return frozenRight;
            }
        });
        frozenRightContainer.appendChild(frozenRight.element);
        frozenContainer.appendChild(frozenLeftContainer);
        frozenContainer.appendChild(frozenRightContainer);

        const bodyContainer = document.createElement('div');
        const bodyLeftContainer = document.createElement('div');
        const bodyRightContainer = document.createElement('div');
        const bodyLeft = new Section(self, dynamicCellsClassName, dynamicRowsClassName, dynamicHeaderCellsClassName, dynamicHeaderRowsClassName);
        bodyLeft.virtual = true;
        Object.defineProperty(this, 'bodyLeft', {
            get: function () {
                return bodyLeft;
            }
        });
        bodyLeftContainer.appendChild(bodyLeft.element);
        const bodyRight = new Section(self, dynamicCellsClassName, dynamicRowsClassName, dynamicHeaderCellsClassName, dynamicHeaderRowsClassName);
        bodyRight.virtual = true;
        Object.defineProperty(this, 'bodyRight', {
            get: function () {
                return bodyRight;
            }
        });
        bodyRightContainer.appendChild(bodyRight.element);
        bodyContainer.appendChild(bodyLeftContainer);
        bodyContainer.appendChild(bodyRightContainer);

        const footerContainer = document.createElement('div');
        const footerLeftContainer = document.createElement('div');
        const footerRightContainer = document.createElement('div');
        const footerLeft = new Section(self, dynamicCellsClassName, dynamicRowsClassName, dynamicHeaderCellsClassName, dynamicHeaderRowsClassName);
        Object.defineProperty(this, 'footerLeft', {
            get: function () {
                return footerLeft;
            }
        });
        footerLeftContainer.appendChild(footerLeft.element);
        const footerRight = new Section(self, dynamicCellsClassName, dynamicRowsClassName, dynamicHeaderCellsClassName, dynamicHeaderRowsClassName);
        Object.defineProperty(this, 'footerRight', {
            get: function () {
                return footerRight;
            }
        });
        footerRightContainer.appendChild(footerRight.element);
        footerContainer.appendChild(footerLeftContainer);
        footerContainer.appendChild(footerRightContainer);
        footerContainer.style.display = 'none';

        let columnNodes = [];
        let leftHeader = [];
        let rightHeader = [];

        let columnsFacade = [];
        Object.defineProperty(this, 'columns', {
            get: function () {
                return columnsFacade;
            }
        });
        let sortedColumns = [];
        let headerRowsHeight = 30;
        let rowsHeight = 30;
        let renderingThrottle = 0;
        let renderingPadding = 1;
        let showHorizontalLines = true;
        let showVerticalLines = true;
        let showOddRowsInOtherColor = true
        let linesColor = null;

        let selectedRows = new Set();
        let selectionLead = null;
        let stickySelection = false

        Object.defineProperty(this, 'selectionLead', {
            get: function () {
                return selectionLead;
            }
        });
        Object.defineProperty(this, 'selected', {
            get: function () {
                return Array.from(selectedRows);
            }
        });
        Object.defineProperty(this, 'hasSelected', {
            get: function () {
                return selectedRows.size > 0;
            }
        });
        Object.defineProperty(this, 'selectedCount', {
            get: function () {
                return selectedRows.size;
            }
        });
        Object.defineProperty(this, 'stickySelection', {
            get: function () {
                return stickySelection;
            },
            set: function (value) {
                stickySelection = !!value;
            }
        });

        let frozenColumns = 0;
        let frozenRows = 0;
        let parentField = null;
        let childrenField = null;
        let indent = 20;
        //
        let data = null; // bounded data. this is not rows source. rows source is data['field' property path]
        let viewRows = []; // rows in view. subject of sorting. subject of collapse / expand in tree.
        const expandedRows = new Set();
        const depths = new Map();
        let field = null;
        let boundToData = null;
        let boundToElements = null;
        let boundToElementsComposition = null;
        let boundToCursor = null;
        let cursorProperty = 'cursor';
        let onHeaderChanged = null;
        let onRender = null;
        let onRowRender = null;
        let editable = true;
        let deletable = true;
        let insertable = true;
        let draggableRows = false;
        let treeIndicatorColumn;

        shell.className = 'p-widget p-grid-shell p-scroll p-vertical-scroll-filler p-horizontal-scroll-filler p-grid-empty';

        columnsChevronContainer.className = 'p-grid-section-tools';
        frozenContainer.className = 'p-grid-section-frozen';
        frozenLeftContainer.className = 'p-grid-section-frozen-left';
        frozenRightContainer.className = 'p-grid-section-frozen-right';
        bodyContainer.className = 'p-grid-section-body';
        bodyLeftContainer.className = 'p-grid-section-body-left';
        bodyRightContainer.className = 'p-grid-section-body-right';
        footerContainer.className = 'p-grid-section-footer';
        footerLeftContainer.className = 'p-grid-section-footer-left';
        footerRightContainer.className = 'p-grid-section-footer-right';

        columnsChevron.className = 'p-grid-columns-chevron';
        columnsChevron.style.height = `${headerRowsHeight}px`

        shell.appendChild(headerCellsStyleElement);
        shell.appendChild(headerRowsStyleElement);
        shell.appendChild(cellsStyleElement);
        shell.appendChild(rowsStyleElement);

        shell.appendChild(columnsChevronContainer);
        shell.appendChild(document.createElement('br'))
        shell.appendChild(frozenContainer);
        shell.appendChild(document.createElement('br'))
        shell.appendChild(bodyContainer);
        shell.appendChild(document.createElement('br'))
        shell.appendChild(footerContainer);

        /*
        Ui.on(shell, Ui.Events.SCROLL, event => {
            columnsChevron.style.right = `${-shell.scrollLeft}px`
            columnsChevron.style.top = `${shell.scrollTop}px`
        })
        */
        Ui.on(shell, Ui.Events.DRAGSTART, event => {
            if (draggableRows) {
                const targetElement = event.target;
                if ('tr' === targetElement.tagName.toLowerCase()) {
                    event.stopPropagation();
                    const dragged = targetElement[Section.JS_ROW_NAME];
                    const rows = discoverRows();
                    const dataIndex = rows.indexOf(dragged);
                    event.dataTransfer.setData('text/p-grid-row',
                        `{"p-grid-name":"${name}", "data-row-index": ${dataIndex}}`);
                }
            }
        });

        let columnsMenu = null;

        function showColumnsMenu(atElement, horizontal) {
            if (columnsMenu) {
                closeColumnMenu();
            }
            columnsMenu = new Menu();
            fillColumnsMenu(frozenLeft, columnsMenu);
            fillColumnsMenu(frozenRight, columnsMenu);
            Ui.startMenuSession(columnsMenu);
            columnsMenu.showRelativeTo(arguments.length > 0 ? atElement : columnsChevron, arguments.length > 1 ? horizontal : true)
        }

        function fillColumnsMenu(section, target) {
            for (let i = 0; i < section.columnsCount; i++) {
                const column = section.getColumn(i);
                if (column.switchable) {
                    const miCheck = new CheckBoxMenuItem(column.header.text, column.visible);
                    miCheck.addValueChangeHandler(event => {
                        column.visible = !!event.newValue;
                    });
                    target.add(miCheck);
                }
            }
        }

        Ui.on(columnsChevron, Ui.Events.MOUSEDOWN, event => {
            showColumnsMenu(columnsChevron, true);
        });

        regenerateDynamicHeaderCellsStyles();
        regenerateDynamicHeaderRowsStyles();
        regenerateDynamicCellsStyles();
        regenerateDynamicRowsStyles();

        Ui.on(shell, Ui.Events.KEYDOWN, event => {
            if (event.keyCode === KeyCodes.KEY_UP) {
                if (!focusedCell.editor) {
                    event.preventDefault();
                    if (self.focusedRow > 0) {
                        let wasFocused = self.focusedRow;
                        focusCell(focusedCell.row - 1, focusedCell.column, false);
                        if (self.focusedRow >= 0 && self.focusedRow < viewRows.length) {
                            if (event.shiftKey) {
                                if (isSelected(viewRows[self.focusedRow])) {
                                    unselect(viewRows[wasFocused]);
                                } else {
                                    select(viewRows[self.focusedRow]);
                                }
                            } else {
                                unselectAll(false);
                                select(viewRows[self.focusedRow]);
                            }
                        }
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_DOWN) {
                if (!focusedCell.editor) {
                    event.preventDefault();
                    if (self.focusedRow < viewRows.length - 1) {
                        let wasFocused = self.focusedRow;
                        focusCell(focusedCell.row + 1, focusedCell.column, false);
                        if (self.focusedRow >= 0 && self.focusedRow < viewRows.length) {
                            if (event.shiftKey) {
                                if (isSelected(viewRows[self.focusedRow])) {
                                    unselect(viewRows[wasFocused]);
                                } else {
                                    select(viewRows[self.focusedRow]);
                                }
                            } else {
                                unselectAll(false);
                                select(viewRows[self.focusedRow]);
                            }
                        }
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_LEFT) {
                if (!focusedCell.editor) {
                    event.preventDefault();

                    const goLeftCell = () => {
                        if (self.focusedColumn > 0 || self.focusedRow > 0) {
                            do {
                                if (self.focusedColumn === 0) {
                                    focusCell(self.focusedRow - 1, columnsFacade.length - 1);
                                } else {
                                    self.focusedColumn--;
                                }
                            } while ((self.focusedColumn > 0 || self.focusedRow > 0) &&
                                !columnsFacade[self.focusedColumn].visible);
                        }
                    };
                    if (isTreeConfigured() &&
                        self.focusedColumn >= 0 && self.focusedColumn < columnsFacade.length &&
                        columnsFacade[self.focusedColumn] === treeIndicatorColumn &&
                        self.focusedRow >= 0 && self.focusedRow < viewRows.length) {
                        if (hasRowChildren(viewRows[self.focusedRow]) && isExpanded(viewRows[self.focusedRow])) {
                            collapse(viewRows[self.focusedRow]);
                        } else {
                            const parent = getParentOf(viewRows[self.focusedRow]);
                            if (parent) {
                                goTo(parent);
                            } else {
                                goLeftCell();
                            }
                        }
                    } else {
                        goLeftCell();
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_RIGHT) {
                if (!focusedCell.editor) {
                    event.preventDefault();
                    if (isTreeConfigured() &&
                        self.focusedColumn >= 0 && self.focusedColumn < columnsFacade.length &&
                        columnsFacade[self.focusedColumn] === treeIndicatorColumn &&
                        self.focusedRow >= 0 && self.focusedRow < viewRows.length &&
                        hasRowChildren(viewRows[self.focusedRow]) &&
                        !isExpanded(viewRows[self.focusedRow])) {
                        expand(viewRows[self.focusedRow]);
                    } else {
                        if (self.focusedColumn < columnsFacade.length - 1 || self.focusedRow < viewRows.length - 1) {
                            do {
                                if (self.focusedColumn === columnsFacade.length - 1) {
                                    focusCell(self.focusedRow + 1, 0);
                                } else {
                                    self.focusedColumn++;
                                }
                            } while ((self.focusedColumn < columnsFacade.length - 1 || self.focusedRow < viewRows.length - 1) &&
                                !columnsFacade[self.focusedColumn].visible);
                        }
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_HOME) {
                if (!focusedCell.editor) {
                    event.preventDefault();
                    if (event.ctrlKey || event.metaKey) {
                        if (self.focusedRow > 0 || self.focusedColumn > 0) {
                            focusCell(0, 0);
                        }
                    } else {
                        self.focusedColumn = 0;
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_END) {
                if (!focusedCell.editor) {
                    event.preventDefault();
                    if (event.ctrlKey || event.metaKey) {
                        if (self.focusedRow < viewRows.length - 1 || self.focusedColumn < columnsFacade.length - 1) {
                            focusCell(viewRows.length - 1, columnsFacade.length - 1);
                        }
                    } else {
                        self.focusedColumn = columnsFacade.length - 1;
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_PAGEUP) {
                if (!focusedCell.editor && rowsHeight != null) {
                    event.preventDefault();
                    const page = frozenRows + Math.floor(bodyRightContainer.offsetHeight / rowsHeight);
                    if (self.focusedRow - page >= 0) {
                        self.focusedRow -= page;
                    } else {
                        self.focusedRow = 0;
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_PAGEDOWN && rowsHeight != null) {
                if (!focusedCell.editor) {
                    event.preventDefault();
                    const page = frozenRows + Math.floor(bodyRightContainer.offsetHeight / rowsHeight);
                    if (self.focusedRow + page < viewRows.length) {
                        self.focusedRow += page;
                    } else {
                        self.focusedRow = viewRows.length - 1;
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_F2) {
                if (self.focusedColumn >= 0 && self.focusedColumn < columnsFacade.length &&
                    editable && !columnsFacade[self.focusedColumn].readonly) {
                    if (focusedCell.editor) {
                        abortEditing();
                    } else {
                        editCell(self.focusedRow, self.focusedColumn);
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_ESCAPE) {
                abortEditing();
            } else if (event.keyCode === KeyCodes.KEY_ENTER) {
                completeEditing();
            } else if (!event.ctrlKey && !event.metaKey &&
                (event.keyCode >= KeyCodes.KEY_A && event.keyCode <= KeyCodes.KEY_Z ||
                    event.keyCode >= KeyCodes.KEY_ZERO && event.keyCode <= KeyCodes.KEY_NINE ||
                    event.keyCode >= KeyCodes.KEY_NUM_ZERO && event.keyCode <= KeyCodes.KEY_NUM_DIVISION && event.keyCode !== 108)
            ) {
                if (self.focusedColumn >= 0 && self.focusedColumn < columnsFacade.length &&
                    editable && !columnsFacade[self.focusedColumn].readonly) {
                    if (!focusedCell.editor) {
                        editCell(self.focusedRow, self.focusedColumn, true);
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_SPACE) {
                if (self.focusedColumn >= 0 && self.focusedColumn < columnsFacade.length &&
                    self.focusedRow >= 0 && self.focusedRow < viewRows.length) {
                    const dataRow = viewRows[self.focusedRow];
                    const column = columnsFacade[self.focusedColumn];
                    const value = column.getValue(dataRow);
                    if (typeof (value) === 'boolean') {
                        column.setValue(dataRow, !value);
                        redrawFrozen();
                        redrawBody();
                    }
                }
            } else if (event.keyCode === KeyCodes.KEY_DELETE) {
                if (deletable && !focusedCell.editor) {
                    deleteSelected();
                }
            } else if (event.keyCode === KeyCodes.KEY_INSERT) {
                if (insertable && !focusedCell.editor) {
                    insert();
                }
            }
        });

        function insert(instance) {
            const rows = discoverRows();
            let insertAt = rows.indexOf(selectionLead);
            insertAt++;
            const inserted = instance ? instance : rows.elementClass ? new rows.elementClass() : {};
            rows.splice(insertAt, 0, inserted);
            itemsAdded([inserted]);
            goTo(inserted, true);
        }

        Object.defineProperty(this, 'insert', {
            get: function () {
                return insert;
            }
        });

        function deleteSelected() {
            let rows = discoverRows();
            if (viewRows.length > 0) {
                // calculate some view sugar
                let lastSelectedViewIndex = -1;
                for (let i = viewRows.length - 1; i >= 0; i--) {
                    const element = viewRows[i];
                    if (isSelected(element)) {
                        lastSelectedViewIndex = i;
                        break;
                    }
                }
                // actually delete selected elements
                let deletedAt = -1;
                const deleted = [];
                for (let i = rows.length - 1; i >= 0; i--) {
                    const item = rows[i];
                    if (isSelected(item)) {
                        deleted.push(item);
                        rows.splice(i, 1);
                        deletedAt = i;
                    }
                }
                itemsRemoved(deleted);
                const viewIndexToSelect = lastSelectedViewIndex;
                if (deletedAt > -1) {
                    let vIndex = viewIndexToSelect;
                    if (vIndex >= 0 && viewRows.length > 0) {
                        if (vIndex >= viewRows.length) {
                            vIndex = viewRows.length - 1;
                        }
                        const toSelect = viewRows[vIndex];
                        goTo(toSelect, true);
                    } else {
                        self.focus();
                    }
                }
            }
        }

        Object.defineProperty(this, 'deleteSelected', {
            get: function () {
                return deleteSelected;
            }
        });

        function discoverRows() {
            const rows = data && field ? Bound.getPathData(data, field) : data;
            return rows ? rows : [];
        }

        function itemsRemoved(items) {
            abortEditing();
            if (!Array.isArray(items))
                items = [items];
            items.forEach(item => {
                expandedRows.delete(item);
            });
            unselectAll(false);
            rebindElements();
            rowsToViewRows(false);
            const wasScrollTop = shell.scrollTop;
            setupRanges(true);
            shell.scrollTop = wasScrollTop;
        }

        Object.defineProperty(this, 'removed', {
            get: function () {
                return itemsRemoved;
            }
        });

        function itemsAdded(items) {
            abortEditing();
            if (!Array.isArray(items))
                items = [items];
            rebindElements();
            rowsToViewRows(false);
            const wasScrollTop = shell.scrollTop;
            setupRanges(true);
            shell.scrollTop = wasScrollTop;
        }

        Object.defineProperty(this, 'added', {
            get: function () {
                return itemsAdded;
            }
        });

        function itemsChanged(items) {
            abortEditing();
            if (!Array.isArray(items))
                items = [items];
            const wasScrollTop = shell.scrollTop;
            redrawFrozen();
            redrawBody();
            shell.scrollTop = wasScrollTop;
        }

        Object.defineProperty(this, 'changed', {
            get: function () {
                return itemsChanged;
            }
        });

        function isSelected(item) {
            return selectedRows.has(item);
        }

        Object.defineProperty(this, 'isSelected', {
            get: function () {
                return isSelected;
            }
        });

        function setCursorOn(item, needRedraw) {
            if (cursorProperty) {
                if (arguments.length < 2)
                    needRedraw = true;
                const rows = discoverRows();
                rows[cursorProperty] = item;
                if (needRedraw) {
                    redrawFrozen();
                    redrawBody();
                }
            }
        }

        Object.defineProperty(this, 'setCursorOn', {
            get: function () {
                return setCursorOn;
            }
        });

        function select(items, needRedraw) {
            if (!Array.isArray(items))
                items = [items];
            if (arguments.length < 2)
                needRedraw = true;
            items.forEach(item => {
                selectedRows.add(item);
                selectionLead = item;
                fireSelected(item);
            });
            setCursorOn(selectionLead, false);
            if (needRedraw) {
                redrawFrozen(true);
                redrawBody(true);
            }
        }

        Object.defineProperty(this, 'select', {
            get: function () {
                return select;
            }
        });

        function selectAll(needRedraw) {
            if (arguments.length < 1)
                needRedraw = true;
            const rows = discoverRows();
            selectedRows = new Set(rows);
            selectionLead = rows.length > 0 ? rows[0] : null;
            setCursorOn(selectionLead, false);
            fireSelected(selectionLead);
            if (needRedraw) {
                redrawFrozen();
                redrawBody();
            }
        }

        Object.defineProperty(this, 'selectAll', {
            get: function () {
                return selectAll;
            }
        });

        function unselect(items, needRedraw) {
            if (!Array.isArray(items))
                items = [items];
            if (arguments.length < 2)
                needRedraw = true;
            let res = false;
            items.forEach(item => {
                if (selectionLead === item) {
                    selectionLead = null;
                }
                res = selectedRows.delete(item);
            });
            fireSelected(null);
            if (needRedraw) {
                redrawFrozen(true);
                redrawBody(true);
            }
            return res;
        }

        Object.defineProperty(this, 'unselect', {
            get: function () {
                return unselect;
            }
        });

        function unselectAll(needRedraw) {
            if (arguments.length < 1)
                needRedraw = true;
            selectionLead = null;
            selectedRows.clear();
            fireSelected(null);
            if (needRedraw) {
                redrawFrozen(true);
                redrawBody(true);
            }
        }

        Object.defineProperty(this, 'unselectAll', {
            get: function () {
                return unselectAll;
            }
        });

        Object.defineProperty(this, 'dynamicCellClassName', {
            get: function () {
                return dynamicCellsClassName;
            }
        });

        Object.defineProperty(this, 'showHorizontalLines', {
            get: function () {
                return showHorizontalLines;
            },
            set: function (aValue) {
                if (showHorizontalLines !== aValue) {
                    showHorizontalLines = !!aValue;
                    regenerateDynamicCellsStyles();
                }
            }
        });

        Object.defineProperty(this, 'showVerticalLines', {
            get: function () {
                return showVerticalLines;
            },
            set: function (aValue) {
                if (showVerticalLines !== aValue) {
                    showVerticalLines = !!aValue;
                    regenerateDynamicCellsStyles();
                }
            }
        });

        function regenerateDynamicCellsStyles() {
            cellsStyleElement.innerHTML =
                `.${dynamicCellsClassName}{${showHorizontalLines ? '' : 'border-top-style: none;'}${showHorizontalLines ? '' : 'border-bottom-style: none;'}${showVerticalLines ? '' : 'border-left-style: none;'}${showVerticalLines ? '' : 'border-right-style: none;'}${linesColor ? `border-color: ${linesColor.toStyled ? linesColor.toStyled() : linesColor};` : ''}}`;
        }

        Object.defineProperty(this, 'linesColor', {
            get: function () {
                return linesColor;
            },
            set: function (aValue) {
                if (linesColor !== aValue) {
                    linesColor = aValue;
                    regenerateDynamicCellsStyles();
                }
            }
        });

        function regenerateDynamicRowsStyles() {
            rowsStyleElement.innerHTML =
                `.${dynamicRowsClassName}{ height: ${rowsHeight}px;}`;
        }

        Object.defineProperty(this, 'showOddRowsInOtherColor', {
            get: function () {
                return showOddRowsInOtherColor;
            },
            set: function (aValue) {
                if (showOddRowsInOtherColor !== aValue) {
                    showOddRowsInOtherColor = !!aValue;
                    redrawFrozen();
                    redrawBody();
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
                    regenerateDynamicRowsStyles();
                    frozenLeft.rowsHeight = rowsHeight;
                    frozenRight.rowsHeight = rowsHeight;
                    bodyLeft.rowsHeight = rowsHeight;
                    bodyRight.rowsHeight = rowsHeight;
                    footerLeft.rowsHeight = rowsHeight;
                    footerRight.rowsHeight = rowsHeight;
                }
            }
        });
        Object.defineProperty(this, 'renderingThrottle', {
            get: function () {
                return renderingThrottle;
            },
            set: function (aValue) {
                renderingThrottle = aValue;
                [
                    frozenLeft, frozenRight,
                    bodyLeft, bodyRight
                ].forEach(section => {
                    section.renderingThrottle = renderingThrottle;
                });
            }
        });
        Object.defineProperty(this, 'renderingPadding', {
            get: function () {
                return renderingPadding;
            },
            set: function (aValue) {
                renderingPadding = aValue;
                [
                    frozenLeft, frozenRight,
                    bodyLeft, bodyRight
                ].forEach(section => {
                    section.renderingPadding = renderingPadding;
                });
            }
        });

        function regenerateDynamicHeaderCellsStyles() {
            headerCellsStyleElement.innerHTML =
                `.${dynamicHeaderCellsClassName}{}`;
        }

        function regenerateDynamicHeaderRowsStyles() {
            headerRowsStyleElement.innerHTML =
                `.${dynamicHeaderRowsClassName}{ height: ${headerRowsHeight}px;}`;
        }

        Object.defineProperty(this, 'headerRowsHeight', {
            get: function () {
                return headerRowsHeight;
            },
            set: function (aValue) {
                if (headerRowsHeight !== aValue) {
                    headerRowsHeight = aValue;
                    columnsChevron.style.height = `${headerRowsHeight}px`
                    regenerateDynamicHeaderRowsStyles();
                }
            }
        });

        Object.defineProperty(this, 'headerVisible', {
            get: function () {
                return frozenRight.headerVisible;
            },
            set: function (aValue) {
                columnsChevron.style.display = aValue ? '' : 'none';
                frozenLeft.headerVisible = aValue;
                frozenRight.headerVisible = aValue;
            }
        });

        Object.defineProperty(this, 'columnsChevron', {
            get: function () {
                return columnsChevron;
            }
        });

        Object.defineProperty(this, 'frozenColumns', {
            get: function () {
                return frozenColumns;
            },
            set: function (aValue) {
                if (aValue >= 0 && aValue <= getColumnsCount() && frozenColumns !== aValue) {
                    frozenColumns = aValue;
                    applyColumnsNodes();
                }
            }
        });

        Object.defineProperty(this, 'frozenRows', {
            get: function () {
                return frozenRows;
            },
            set: function (aValue) {
                if (aValue >= 0 && frozenRows !== aValue) {
                    frozenRows = aValue;
                    setupRanges();
                }
            }
        });

        Object.defineProperty(this, 'draggableRows', {
            get: function () {
                return draggableRows;
            },
            set: function (aValue) {
                if (draggableRows !== aValue) {
                    draggableRows = aValue;
                    [frozenLeft, frozenRight, bodyLeft, bodyRight].forEach(section => {
                        section.draggableRows = aValue;
                    });
                    redrawFrozen();
                    redrawBody();
                }
            }
        });

        Object.defineProperty(this, 'activeEditor', {
            get: function () {
                return focusedCell.editor;
            }
        });

        Object.defineProperty(this, 'onHeaderChanged', {
            get: function () {
                return onHeaderChanged;
            },
            set: function (aValue) {
                onHeaderChanged = aValue;
            }
        });

        Object.defineProperty(this, 'onRender', {
            get: function () {
                return onRender;
            },
            set: function (aValue) {
                onRender = aValue;
            }
        });

        Object.defineProperty(this, 'onRowRender', {
            get: function () {
                return onRowRender;
            },
            set: function (aValue) {
                onRowRender = aValue;
            }
        });

        Object.defineProperty(this, 'rows', {
            get: function () {
                return discoverRows();
            }
        });
        Object.defineProperty(this, 'viewRows', {
            get: function () {
                return viewRows;
            }
        });
        Object.defineProperty(this, 'cursorProperty', {
            get: function () {
                return cursorProperty;
            },
            set: function (aValue) {
                if (aValue && cursorProperty !== aValue) {
                    unbind();
                    cursorProperty = aValue;
                    bind();
                }
            }
        });

        Object.defineProperty(this, 'editable', {
            get: function () {
                return editable;
            },
            set: function (aValue) {
                editable = aValue;
            }
        });

        Object.defineProperty(this, 'deletable', {
            get: function () {
                return deletable;
            },
            set: function (aValue) {
                deletable = aValue;
            }
        });

        Object.defineProperty(this, 'insertable', {
            get: function () {
                return insertable;
            },
            set: function (aValue) {
                insertable = aValue;
            }
        });

        function depthOf(item) {
            return isTreeConfigured() ? depths.get(item) : 0;
        }

        Object.defineProperty(this, 'depthOf', {
            get: function () {
                return depthOf;
            }
        });

        function isExpanded(anElement) {
            return isTreeConfigured() && expandedRows.has(anElement);
        }

        Object.defineProperty(this, 'expanded', {
            get: function () {
                return isExpanded;
            }
        });

        function expand(aElements) {
            if (isTreeConfigured()) {
                const elements = Array.isArray(aElements) ? aElements : [aElements]
                const toExpand = elements.filter((anElement) => {
                    return !expandedRows.has(anElement)
                    /*
                    if (!expandedRows.has(anElement)) {
                        const children = getChildrenOf(anElement);
                        if (children && children.length > 0) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                    */
                })
                toExpand.forEach((anElement) => {
                    expandedRows.add(anElement);
                    fireExpanded(anElement);
                });
                if (toExpand.length > 0) {
                    rowsToViewRows(false);
                    const wasScrollTop = shell.scrollTop;
                    setupRanges(true);
                    shell.scrollTop = wasScrollTop;
                }
            }
        }

        Object.defineProperty(this, 'expand', {
            get: function () {
                return expand;
            }
        });

        function expandedChanged() {
            if (isTreeConfigured()) {
                rowsToViewRows(false);
                const wasScrollTop = shell.scrollTop;
                setupRanges(true);
                shell.scrollTop = wasScrollTop;
            }
        }

        Object.defineProperty(this, 'expandedChanged', {
            get: function () {
                return expandedChanged;
            }
        });

        function collapse(aElements) {
            if (isTreeConfigured()) {
                const elements = Array.isArray(aElements) ? aElements : [aElements]
                const toCollapse = elements.filter((anElement) => expandedRows.has(anElement))
                toCollapse.forEach((anElement) => {
                    expandedRows.delete(anElement);
                    fireCollapsed(anElement);
                });
                if (toCollapse.length > 0) {
                    rowsToViewRows(false);
                    const wasScrollTop = shell.scrollTop;
                    setupRanges(true);
                    shell.scrollTop = wasScrollTop;
                }
            }
        }

        Object.defineProperty(this, 'collapse', {
            get: function () {
                return collapse;
            }
        });

        function toggle(aElements) {
            if (isTreeConfigured()) {
                const elements = Array.isArray(aElements) ? aElements : [aElements]
                elements.forEach((anElement) => {
                    if (isExpanded(anElement)) {
                        expandedRows.delete(anElement);
                        fireCollapsed(anElement);
                    } else {
                        const children = getChildrenOf(anElement);
                        if (children && children.length > 0) {
                            expandedRows.add(anElement);
                            fireExpanded(anElement);
                        }
                    }
                });
                if (elements.length > 0) {
                    rowsToViewRows(false);
                    const wasScrollTop = shell.scrollTop;
                    setupRanges(true);
                    shell.scrollTop = wasScrollTop;
                }
            }
        }

        Object.defineProperty(this, 'toggle', {
            get: function () {
                return toggle;
            }
        });

        function isLeaf(anElement) {
            return !hasRowChildren(anElement);
        }

        Object.defineProperty(this, 'isLeaf', {
            get: function () {
                return isLeaf;
            }
        });

        function hasRowChildren(parent) {
            const children = findChildren(parent);
            return children && children.length > 0;
        }

        function findChildren(aParent) {
            if (aParent) {
                return aParent[childrenField];
            } else {
                const rows = discoverRows();
                const roots = [];
                for (let i = 0; i < rows.length; i++) {
                    const item = rows[i];
                    if (item && !item[parentField]) {
                        roots.push(item);
                    }
                }
                return roots;
            }
        }

        function getParentOf(anElement) {
            const parent = anElement[parentField];
            return parent == null ? null : parent; // undefined -> null
        }

        function getChildrenOf(anElement) {
            const found = findChildren(anElement);
            return found ? found : [];
        }

        /**
         * Builds path to specified element if the element belongs to the model.
         *
         * @param anItem Element to build path to.
         * @return Array of elements comprising the path, excluding
         * root null. So, for the roots of the forest path will be a list with one
         * element.
         */
        function pathTo(anItem) {
            const path = [];
            if (anItem) {
                let currentParent = anItem;
                const added = new Set();
                path.push(currentParent);
                added.add(currentParent);
                while (currentParent) {
                    currentParent = getParentOf(currentParent);
                    if (currentParent && !added.has(currentParent)) {
                        path.unshift(currentParent);
                        added.add(currentParent);
                    } else {
                        break;
                    }
                }
            }
            return path;
        }

        Object.defineProperty(this, 'pathTo', {
            get: function () {
                return pathTo;
            }
        });

        function goTo(anItem, aNeedToSelect) {
            let expanded = false;
            if (isTreeConfigured()) {
                const path = pathTo(anItem);
                for (let p = 0; p < path.length - 1 /* exclude last element*/; p++) {
                    if (!expandedRows.has(path[p])) {
                        expandedRows.add(path[p]);
                        fireRowsSort();
                        fireExpanded(path[p]);
                        expanded = true;
                    }
                }
            }
            if (expanded) {
                lookupDataColumn();
                generateViewRows();
                sortViewRows();
                setupRanges();
            }
            const index = viewRows.indexOf(anItem);
            if (index !== -1) {
                if (aNeedToSelect) {
                    unselectAll(false);
                    select(anItem);
                }
                focusCell(index, focusedCell.column !== -1 ? focusedCell.column : 0);
                return true;
            } else {
                return false;
            }
        }

        Object.defineProperty(this, 'goTo', {
            get: function () {
                return goTo;
            }
        });

        function rebind() {
            unbind();
            bind();
        }

        function bind() {
            if (data) {
                if (field) {
                    boundToData = Bound.observePath(data, field, {
                        change: anEvent => {
                            rebind();
                            redrawFrozen();
                            redrawBody();
                        }
                    });
                }
                bindElements();
                bindCursor();
            }
            rowsToViewRows(false);
            setupRanges(true);
        }

        function bindElements() {
            const rows = discoverRows();
            boundToElements = Bound.observeElements(rows, {
                change: anEvent => {
                    // TODO: May be it is worth to check a ore precise condition here
                    // TODO: but it is not clear yet.
                    // TODO: The goal of this condition id to avoid an unexpected removing of
                    // TODO: editing widget from a cell of the grid.
                    if (!focusedCell.editor) {
                        redrawFrozen();
                        redrawBody();
                    }
                }
            });
            boundToElementsComposition = Bound.listen(rows, {
                spliced: (added, removed) => {
                    itemsAdded(added);
                    itemsRemoved(removed)
                }
            });
        }

        function unbindElements() {
            if (boundToElements) {
                boundToElements.unlisten();
                boundToElements = null;
            }
            if (boundToElementsComposition) {
                boundToElementsComposition();
                boundToElementsComposition = null;
            }
        }

        function rebindElements() {
            unbindElements();
            bindElements();
        }

        function unbind() {
            selectedRows.clear();
            expandedRows.clear();
            if (boundToData) {
                boundToData.unlisten();
                boundToData = null;
            }
            unbindElements();
            unbindCursor();
            unselectAll(false);
            rowsToViewRows(false);
            setupRanges(true);
        }

        function bindCursor() {
            if (data) {
                const rows = discoverRows();
                if (cursorProperty) {
                    boundToCursor = Bound.observePath(rows, cursorProperty, {
                        change: anEvent => {
                            redrawFrozen();
                            redrawBody();
                        }
                    });
                }
            }
        }

        function unbindCursor() {
            if (boundToCursor) {
                boundToCursor.unlisten();
                boundToCursor = null;
            }
        }

        Object.defineProperty(this, 'data', {
            get: function () {
                return data;
            },
            set: function (aValue) {
                if (data !== aValue) {
                    unbind();
                    data = aValue;
                    bind();
                }
            }
        });

        Object.defineProperty(this, 'field', {
            get: function () {
                return field;
            },
            set: function (aValue) {
                if (field !== aValue) {
                    unbind();
                    field = aValue;
                    bind();
                }
            }
        });

        Object.defineProperty(this, 'parentField', {
            get: function () {
                return parentField;
            },
            set: function (aValue) {
                if (parentField !== aValue) {
                    const wasTree = isTreeConfigured();
                    parentField = aValue;
                    const isTree = isTreeConfigured();
                    if (wasTree !== isTree) {
                        expandedRows.clear();
                        rowsToViewRows(false);
                        setupRanges(true);
                    }
                }
            }
        });

        Object.defineProperty(this, 'indent', {
            get: function () {
                return indent;
            },
            set: function (aValue) {
                if (indent !== aValue) {
                    indent = aValue;
                    rowsToViewRows(true);
                }
            }
        });

        Object.defineProperty(this, 'childrenField', {
            get: function () {
                return childrenField;
            },
            set: function (aValue) {
                if (childrenField !== aValue) {
                    const wasTree = isTreeConfigured();
                    childrenField = aValue;
                    const isTree = isTreeConfigured();
                    if (wasTree !== isTree) {
                        expandedRows.clear();
                        rowsToViewRows(false);
                        setupRanges(true);
                    }
                }
            }
        });

        function isTreeConfigured() {
            return !!parentField && !!childrenField;
        }

        function setupRanges(needRedraw) {
            if (arguments.length < 1)
                needRedraw = true;
            if (!viewRows || viewRows.length === 0) {
                shell.classList.add('p-grid-empty');
            } else {
                shell.classList.remove('p-grid-empty');
            }
            const frozenRangeEnd = viewRows.length >= frozenRows ? frozenRows : viewRows.length;
            frozenLeft.setDataRange(0, frozenRangeEnd, needRedraw);
            frozenRight.setDataRange(0, frozenRangeEnd, needRedraw);

            bodyLeft.setDataRange(frozenRows, viewRows.length, needRedraw);
            bodyRight.setDataRange(frozenRows, viewRows.length, needRedraw);
        }

        function updateSectionsWidth() {
            let leftColumnsWidth = 0;
            for (let c = 0; c < frozenLeft.columnsCount; c++) {
                const lcolumn = frozenLeft.getColumn(c);
                if (lcolumn.visible) {
                    if ((typeof lcolumn.width === 'string' && (lcolumn.width.endsWith('%') || lcolumn.width === '')) || lcolumn.width == null) {
                        leftColumnsWidth = null;
                        break;
                    } else {
                        leftColumnsWidth += parseFloat(lcolumn.width) + lcolumn.padding;
                    }
                }
            }
            [
                frozenLeft,
                bodyLeft,
                footerLeft
            ].forEach(section => {
                section.element.style.width = leftColumnsWidth != null ? `${leftColumnsWidth}px` : '';
            });
            let rightColumnsWidth = 0;
            for (let c = 0; c < frozenRight.columnsCount; c++) {
                const rcolumn = frozenRight.getColumn(c);
                if (rcolumn.visible) {
                    if ((typeof rcolumn.width === 'string' && (rcolumn.width.endsWith('%') || rcolumn.width === '')) || rcolumn.width == null) {
                        rightColumnsWidth = null;
                        break;
                    } else {
                        rightColumnsWidth += parseFloat(rcolumn.width) + rcolumn.padding;
                    }
                }
            }
            [
                frozenRight,
                bodyRight,
                footerRight
            ].forEach(section => {
                section.element.style.width = rightColumnsWidth != null ? `${rightColumnsWidth}px` : '100%';
            });
        }

        Object.defineProperty(this, 'updateSectionsWidth', {
            get: function () {
                return updateSectionsWidth;
            }
        });

        function lookupDataColumn(treeWidthPadding) {
            let found = null;
            if (isTreeConfigured()) {
                let c = 0;
                while (c < getColumnsCount()) {
                    const column = getColumn(c);
                    if (column instanceof ServiceColumn) {
                        c++;
                    } else {
                        found = column;
                        break;
                    }
                }
            }

            if (treeIndicatorColumn !== found) {
                if (treeIndicatorColumn) {
                    treeIndicatorColumn.padding = 0;
                }
                treeIndicatorColumn = found;
                if (treeIndicatorColumn) {
                    treeIndicatorColumn.padding = treeWidthPadding;
                }
            }
        }

        Object.defineProperty(this, 'treeIndicatorColumn', {
            get: function () {
                return treeIndicatorColumn;
            }
        });

        function clearColumnsNodes(needRedraw = true) {
            function clearHeaders(forest) {
                forest.forEach(node => {
                    node.column.grid = null;
                    node.column.headers.splice(0, node.column.headers.length);
                    if (node.gridChanged) {
                        node.gridChanged();
                    }
                    clearHeaders(node.children);
                });
            }

            clearHeaders(columnNodes);
            if (leftHeader != null) {
                clearHeaders(leftHeader);
            }
            if (rightHeader != null) {
                clearHeaders(rightHeader);
            }
            columnsFacade = [];
            sortedColumns = [];
            for (let i = getColumnsCount() - 1; i >= 0; i--) {
                const toDel = getColumn(i);
                const column = toDel;
                if (column === treeIndicatorColumn) {
                    treeIndicatorColumn.padding = 0;
                    treeIndicatorColumn = null;
                }
                column.headers.splice(0, column.headers.length);
            }
            frozenLeft.clearColumnsAndHeader(needRedraw);
            frozenRight.clearColumnsAndHeader(needRedraw);
            bodyLeft.clearColumnsAndHeader(needRedraw);
            bodyRight.clearColumnsAndHeader(needRedraw);
            footerLeft.clearColumnsAndHeader(needRedraw);
            footerRight.clearColumnsAndHeader(needRedraw);
        }

        Object.defineProperty(this, 'clearColumnsNodes', {
            get: function () {
                return clearColumnsNodes;
            }
        });

        let columnsNodesVersion = 0

        function applyColumnsNodes() {
            if (columnsNodesVersion == Number.MAX_SAFE_INTEGER) {
                columnsNodesVersion = 0
            } else {
                columnsNodesVersion++
            }
            const wasColumnsNodesVersion = columnsNodesVersion
            Ui.later(() => {
                if (wasColumnsNodesVersion == columnsNodesVersion) {
                    const treeWidthPadding = treeIndicatorColumn ? treeIndicatorColumn.padding : 0;
                    clearColumnsNodes(false);

                    function injectHeaders(forest) {
                        forest.forEach(node => {
                            node.column.grid = self;
                            node.column.headers.push(node.view);
                            if (node.gridChanged) {
                                node.gridChanged();
                            }
                            injectHeaders(node.children);
                        });
                    }

                    const maxDepth = HeaderAnalyzer.analyzeDepth(columnNodes);
                    leftHeader = HeaderSplitter.split(columnNodes, 0, frozenColumns - 1);
                    injectHeaders(leftHeader);
                    HeaderAnalyzer.analyzeLeaves(leftHeader);
                    frozenLeft.setHeaderNodes(leftHeader, maxDepth, false);
                    rightHeader = HeaderSplitter.split(columnNodes, frozenColumns, Infinity);
                    injectHeaders(rightHeader);
                    HeaderAnalyzer.analyzeLeaves(rightHeader);
                    frozenRight.setHeaderNodes(rightHeader, maxDepth, false);

                    const leftLeaves = HeaderAnalyzer.toLeaves(leftHeader);
                    const rightLeaves = HeaderAnalyzer.toLeaves(rightHeader);
                    leftLeaves.forEach(leaf => { // linear list of column header nodes
                        addColumnToSections(leaf.column);
                    });
                    rightLeaves.forEach(leaf => { // linear list of column header nodes
                        addColumnToSections(leaf.column);
                    });
                    [
                        frozenLeftContainer,
                        bodyLeftContainer,
                        footerLeftContainer
                    ].forEach(section => {
                        section.style.display = frozenColumns > 0 ? '' : 'none';
                    });
                    lookupDataColumn(treeWidthPadding);
                    updateSectionsWidth();
                    redraw();
                    if (onHeaderChanged) {
                        Ui.later(() => {
                            if (onHeaderChanged) {
                                onHeaderChanged.call(self, new WidgetEvent(self))
                            }
                        });
                    }
                }
            })
        }

        Object.defineProperty(this, 'header', {
            get: function () {
                return columnNodes;
            },
            set: function (aHeader) {
                if (columnNodes !== aHeader) {
                    columnNodes = aHeader;
                    applyColumnsNodes();
                }
            }
        });

        Object.defineProperty(this, 'applyColumnsNodes', {
            get: function () {
                return applyColumnsNodes;
            }
        });

        Object.defineProperty(this, 'showColumnsMenuRelativeTo', {
            get: function () {
                return showColumnsMenu;
            }
        });

        function closeColumnMenu() {
            if (columnsMenu) {
                columnsMenu.close();
                columnsMenu = null;
            }
        }

        function removeColumnNode(aNode) {
            closeColumnMenu();
            const nodeIndex = columnNodes.indexOf(aNode);
            if (nodeIndex !== -1) {
                removeColumnNodeAt(nodeIndex);
            } else {
                return false;
            }
        }

        Object.defineProperty(this, 'removeColumnNode', {
            get: function () {
                return removeColumnNode;
            }
        });

        function removeColumnNodeAt(nodeIndex) {
            closeColumnMenu();
            if (nodeIndex >= 0 && nodeIndex < columnNodes.length) {
                const node = columnNodes[nodeIndex];
                node.column.grid = null; // TODO: Think about recursive assignment through all nodes
                columnNodes.splice(nodeIndex, 1);
                if (treeIndicatorColumn === node.column) {
                    treeIndicatorColumn.padding = 0;
                    treeIndicatorColumn = null;
                }
                applyColumnsNodes();
                return true;
            } else {
                return false;
            }
        }

        Object.defineProperty(this, 'removeColumnNodeAt', {
            get: function () {
                return removeColumnNodeAt;
            }
        });


        function addColumnNode(aNode) {
            closeColumnMenu();
            columnNodes.push(aNode);
            applyColumnsNodes();
        }

        Object.defineProperty(this, 'addColumnNode', {
            get: function () {
                return addColumnNode;
            }
        });

        function insertColumnNode(aIndex, aNode) {
            closeColumnMenu();
            columnNodes.splice(aIndex, 0, aNode);
            applyColumnsNodes();
        }

        Object.defineProperty(this, 'insertColumnNode', {
            get: function () {
                return insertColumnNode;
            }
        });

        Object.defineProperty(this, 'columnNodesCount', {
            get: function () {
                return columnNodes.length;
            }
        });

        function getColumnNode(nodeIndex) {
            if (nodeIndex >= 0 && nodeIndex < columnNodes.length) {
                return columnNodes[nodeIndex];
            }
        }

        Object.defineProperty(this, 'getColumnNode', {
            get: function () {
                return getColumnNode;
            }
        });

        function insertBeforeColumnNode(subject, insertBefore) {
            closeColumnMenu();
            if (subject && insertBefore && subject.parent === insertBefore.parent) {
                const neighbours = subject.parent ? subject.parent.children : columnNodes;
                const neighbourIndex = neighbours.indexOf(subject);
                neighbours.splice(neighbourIndex, 1);
                const insertAt = neighbours.indexOf(insertBefore);
                neighbours.splice(insertAt, 0, subject);
                applyColumnsNodes();
            }
        }

        Object.defineProperty(this, 'insertBeforeColumnNode', {
            get: function () {
                return insertBeforeColumnNode;
            }
        });

        function insertAfterColumnNode(subject, insertAfter) {
            closeColumnMenu();
            if (subject && insertAfter && subject.parent === insertAfter.parent) {
                const neighbours = subject.parent ? subject.parent.children : columnNodes;
                const neighbourIndex = neighbours.indexOf(subject);
                neighbours.splice(neighbourIndex, 1);
                const insertAt = neighbours.indexOf(insertAfter);
                neighbours.splice(insertAt + 1, 0, subject);
                applyColumnsNodes();
            }
        }

        Object.defineProperty(this, 'insertAfterColumnNode', {
            get: function () {
                return insertAfterColumnNode;
            }
        });

        function addColumnToSections(column) {
            columnsFacade.push(column);
            if (frozenLeft.columnsCount < frozenColumns) {
                frozenLeft.addColumn(column, false);
                bodyLeft.addColumn(column, false);
                footerLeft.addColumn(column, false);
            } else {
                frozenRight.addColumn(column, false);
                bodyRight.addColumn(column, false);
                footerRight.addColumn(column, false);
            }
        }

        function redraw() {
            frozenLeft.redraw();
            frozenRight.redraw();
            bodyLeft.redraw();
            bodyRight.redraw();
            footerLeft.redraw();
            footerRight.redraw();
        }

        Object.defineProperty(this, 'redraw', {
            get: function () {
                return redraw;
            }
        });

        function redrawFrozen(light) {
            frozenLeft.redraw(light);
            frozenRight.redraw(light);
        }

        Object.defineProperty(this, 'redrawFrozen', {
            get: function () {
                return redrawFrozen;
            }
        });

        function redrawBody(light) {
            bodyLeft.redraw(light);
            bodyRight.redraw(light);
        }

        Object.defineProperty(this, 'redrawBody', {
            get: function () {
                return redrawBody;
            }
        });

        function redrawHeaders() {
            frozenLeft.redrawHeaders();
            frozenRight.redrawHeaders();
        }

        Object.defineProperty(this, 'redrawHeaders', {
            get: function () {
                return redrawHeaders;
            }
        });

        function redrawFooters() {
            footerLeft.redrawFooters();
            footerRight.redrawFooters();
        }

        Object.defineProperty(this, 'redrawFooters', {
            get: function () {
                return redrawFooters;
            }
        });

        function getColumnsCount() {
            return (frozenLeft ? frozenLeft.columnsCount : 0) + (frozenRight ? frozenRight.columnsCount : 0);
        }

        Object.defineProperty(this, 'columnsCount', {
            get: function () {
                return getColumnsCount();
            }
        });

        function getColumn(aIndex) {
            if (aIndex >= 0 && aIndex < getColumnsCount()) {
                return aIndex >= 0 && aIndex < frozenLeft.columnsCount ? frozenLeft.getColumn(aIndex) : frozenRight.getColumn(aIndex - frozenLeft.columnsCount);
            } else {
                return null;
            }
        }

        Object.defineProperty(this, 'getColumn', {
            get: function () {
                return getColumn;
            }
        });

        function getCell(aRow, aCol) {
            let targetSection;
            if (aRow < frozenRows) {
                if (aCol < frozenColumns) {
                    targetSection = frozenLeft;
                } else {
                    targetSection = frozenRight;
                }
            } else {
                if (aCol < frozenColumns) {
                    targetSection = bodyLeft;
                } else {
                    targetSection = bodyRight;
                }
            }
            return targetSection.getViewCell(aRow, aCol);
        }

        Object.defineProperty(this, 'getCell', {
            get: function () {
                return getCell;
            }
        });

        let focusedCell = {
            row: -1,
            column: -1,
            cell: null
        };

        function verticalScrollIntoView(cell) {
            const viewRow = cell.parentElement;
            const viewTable = viewRow.parentElement.parentElement;
            if (viewRow.offsetTop + viewTable.offsetTop < shell.scrollTop) {
                shell.scrollTop = viewTable.offsetTop + viewRow.offsetTop;
            }
            const viewRowBottomInViewport = viewTable.offsetTop + viewRow.offsetTop + viewRow.offsetHeight - shell.scrollTop;
            const viewportHeight = shell.clientHeight - Math.max(frozenLeftContainer.offsetHeight, frozenRightContainer.offsetHeight);
            if (viewRowBottomInViewport > viewportHeight) {
                shell.scrollTop += viewRowBottomInViewport - viewportHeight;
            }
        }

        function verticalScrollIntoVirtualView(rowIndex, row) {
            if (rowsHeight != null && rowIndex >= frozenRows) {
                const headerHeight = Math.max(frozenLeftContainer.offsetHeight, frozenRightContainer.offsetHeight)
                const viewportHeight = shell.clientHeight - headerHeight;
                const rowTopInViewport = rowIndex * rowsHeight - viewportHeight
                const scrollPadding = viewportHeight / 2
                shell.scrollTop = Math.max(0, rowTopInViewport + scrollPadding);
                return true;
            } else {
                return false;
            }
        }

        function horizontalScrollIntoView(cell) {
            if (cell.offsetLeft < shell.scrollLeft) {
                shell.scrollLeft = cell.offsetLeft;
            }
            const viewCellRightInViewport = cell.offsetLeft - shell.scrollLeft + cell.offsetWidth;
            const viewportWidth = shell.clientWidth - Math.max(frozenLeftContainer.offsetWidth, bodyLeftContainer.offsetWidth);
            if (viewCellRightInViewport > viewportWidth) {
                shell.scrollLeft += viewCellRightInViewport - viewportWidth;
            }
        }

        function changeFocusCell(row, column, cell) {
            Section.unFocusCell(focusedCell.cell);
            focusedCell.row = row;
            focusedCell.column = column;
            focusedCell.cell = cell;
            Section.focusCell(focusedCell.cell);
        }

        function focusCell(row, column) {
            Section.unFocusCell(focusedCell.cell);
            if (row >= 0 && row < viewRows.length ||
                column >= 0 && column < columnsFacade.length) {
                if (row >= 0 && row < viewRows.length &&
                    column >= 0 && column < columnsFacade.length) {
                    let cell = frozenLeft.getViewCell(row, column);
                    if (cell) {
                        changeFocusCell(row, column, cell)
                        setCursorOn(viewRows[focusedCell.row], false);
                        return true;
                    } else {
                        cell = frozenRight.getViewCell(row, column);
                        if (cell) {
                            changeFocusCell(row, column, cell)
                            horizontalScrollIntoView(focusedCell.cell);
                            setCursorOn(viewRows[focusedCell.row], false);
                            return true;
                        } else {
                            cell = bodyLeft.getViewCell(row, column);
                            if (cell) {
                                changeFocusCell(row, column, cell)
                                verticalScrollIntoView(focusedCell.cell);
                                setCursorOn(viewRows[focusedCell.row], false);
                                return true;
                            } else {
                                cell = bodyRight.getViewCell(row, column);
                                if (cell) {
                                    changeFocusCell(row, column, cell)
                                    verticalScrollIntoView(focusedCell.cell);
                                    horizontalScrollIntoView(focusedCell.cell);
                                    setCursorOn(viewRows[focusedCell.row], false);
                                    return true;
                                } else {
                                    // Warning! Don't change 'row' to 'focusedCell.row' !
                                    if (verticalScrollIntoVirtualView(row, viewRows[row])) {
                                        changeFocusCell(row, column, null)
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }

        Object.defineProperty(this, 'focusCell', {
            get: function () {
                return focusCell;
            }
        });
        Object.defineProperty(this, 'focusedRow', {
            get: function () {
                return focusedCell.row;
            },
            set: function (aValue) {
                if (aValue >= 0 && aValue < viewRows.length && aValue !== focusedCell.row) {
                    focusCell(aValue, focusedCell.column);
                }
            }
        });
        Object.defineProperty(this, 'focusedColumn', {
            get: function () {
                return focusedCell.column;
            },
            set: function (aValue) {
                if (aValue >= 0 && aValue < columnsFacade.length && aValue !== focusedCell.column) {
                    focusCell(focusedCell.row, aValue);
                }
            }
        });

        Object.defineProperty(this, 'focusedCell', {
            get: function () {
                return focusedCell.cell;
            },
            set: function (aValue) {
                Section.unFocusCell(focusedCell.cell);
                focusedCell.cell = aValue;
                Section.focusCell(focusedCell.cell);
            }
        });

        function startEditing(replace = false) {
            if (!focusedCell.editor && focusedCell.row >= 0 && focusedCell.row < viewRows.length &&
                focusedCell.column >= 0 && focusedCell.column < columnsFacade.length) {
                const edited = viewRows[focusedCell.row];
                const column = columnsFacade[focusedCell.column];
                if (column.editor) {
                    const editor = column.editor;
                    const value = column.getValue(edited);
                    editor.value = replace || value === undefined ? null : value;
                    if (column === treeIndicatorColumn && depths.has(edited)) {
                        editor.element.style.paddingLeft = `${depths.get(edited) * indent}px`;
                    } else {
                        editor.element.style.paddingLeft = '';
                    }
                    editor.validateOnInput = false
                    focusedCell.editor = editor;
                    focusedCell.commit = () => {
                        if (editor.textChanged) {
                            editor.textChanged();
                        }
                        if (!editor.addValueChangeHandler) { // To avoid duplicated attempts to change a value
                            column.setValue(edited, editor.value);
                        }
                    };
                    let valueChangeReg = editor.addValueChangeHandler ?
                        editor.addValueChangeHandler(event => {
                            column.setValue(edited, event.newValue);
                        }) : null;
                    let focusLostReg = editor.addFocusLostHandler ?
                        editor.addFocusLostHandler(event => {
                            completeEditing();
                        }) : null;
                    focusedCell.clean = () => {
                        if (focusLostReg) {
                            focusLostReg.removeHandler();
                            focusLostReg = null;
                        }
                        if (valueChangeReg) {
                            valueChangeReg.removeHandler();
                            valueChangeReg = null;
                        }
                        focusedCell.clean = null;
                    };

                    const wasScrollTop = shell.scrollTop;
                    if (focusedCell.row < frozenRows) {
                        redrawFrozen();
                    } else {
                        redrawBody();
                    }
                    shell.scrollTop = wasScrollTop;
                    return true;
                }
            }
            return false;
        }

        Object.defineProperty(this, 'startEditing', {
            get: function () {
                return startEditing;
            }
        });

        function editCell(row, column, replace) {
            if (focusCell(row, column)) {
                startEditing(replace);
            }
        }

        function abortEditing() {
            if (focusedCell.clean) {
                focusedCell.clean();
                focusedCell.clean = null;
            }
            if (focusedCell.editor) {
                const wasEditor = focusedCell.editor;

                if (wasEditor.element.parentElement)
                    wasEditor.element.parentElement.removeChild(wasEditor.element);
                focusedCell.editor = null;
                focusedCell.commit = null;
                const wasScrollTop = shell.scrollTop;
                redrawFrozen();
                redrawBody();
                shell.scrollTop = wasScrollTop;
                self.focus();
            }
        }

        Object.defineProperty(this, 'abortEditing', {
            get: function () {
                return abortEditing;
            }
        });

        function completeEditing() {
            if (focusedCell.commit) {
                focusedCell.commit();
                focusedCell.commit = null;
            }
            abortEditing();
        }

        Object.defineProperty(this, 'completeEditing', {
            get: function () {
                return completeEditing;
            }
        });

        function sort() {
            rowsToViewRows(true);
            redrawHeaders();
        }

        Object.defineProperty(this, 'sort', {
            get: function () {
                return sort;
            }
        });

        function addSortedColumn(column) {
            const idx = sortedColumns.indexOf(column);
            if (idx === -1) {
                sortedColumns.push(column);
            }
            sort();
        }

        Object.defineProperty(this, 'addSortedColumn', {
            get: function () {
                return addSortedColumn;
            }
        });

        function removeSortedColumn(column) {
            const idx = sortedColumns.indexOf(column);
            if (idx !== -1) {
                sortedColumns.splice(idx, 1);
            }
            sort();
        }

        Object.defineProperty(this, 'removeSortedColumn', {
            get: function () {
                return removeSortedColumn;
            }
        });

        function unsort(apply) {
            if (arguments.length < 1)
                apply = true;
            sortedColumns = [];
            columnsFacade.forEach(column => {
                column.unsort(false);
            });
            if (apply) {
                rowsToViewRows(true);
                redrawHeaders();
            }
        }

        Object.defineProperty(this, 'unsort', {
            get: function () {
                return unsort;
            }
        });

        function generateViewRows() {
            depths.clear();
            const rows = discoverRows();
            if (isTreeConfigured()) {
                viewRows = [];
                const roots = getChildrenOf(null);
                const stack = [];
                const parents = [null];
                let maxPathLength = 1;
                Array.prototype.unshift.apply(stack, roots);
                while (stack.length > 0) {
                    const item = stack.shift();
                    while (parents[parents.length - 1] != null && parents[parents.length - 1] !== getParentOf(item)) {
                        parents.pop();
                    }
                    depths.set(item, parents.length);
                    viewRows.push(item);
                    if (expandedRows.has(item)) {
                        const children = getChildrenOf(item);
                        if (children.length > 0) {
                            parents.push(item);
                            if (maxPathLength < parents.length) {
                                maxPathLength = parents.length;
                            }
                            Array.prototype.unshift.apply(stack, children);
                        }
                    }
                }
                if (treeIndicatorColumn) {
                    treeIndicatorColumn.padding = maxPathLength * indent;
                }
            } else {
                viewRows = rows.slice(0, rows.length);
            }
        }

        function sortViewRows() {
            if (sortedColumns.length > 0) {
                viewRows.sort((o1, o2) => {
                    if (isTreeConfigured() && getParentOf(o1) !== getParentOf(o2)) {
                        const path1 = pathTo(o1);
                        const path2 = pathTo(o2);
                        if (path2.includes(o1)) {
                            // o1 is parent of o2
                            return -1;
                        }
                        if (path1.includes(o2)) {
                            // o2 is parent of o1
                            return 1;
                        }
                        for (let p = 0; p < Math.min(path1.length, path2.length); p++) {
                            if (path1[p] !== path2[p]) {
                                o1 = path1[p];
                                o2 = path2[p];
                                break;
                            }
                        }
                    }
                    let res = 0;
                    let index = 0;
                    while (res === 0 && index < sortedColumns.length) {
                        const column = sortedColumns[index++];
                        if (column.comparator) {
                            let comparator = column.comparator;
                            if (column.sortedAscending) {
                                res = comparator.compare ? comparator.compare(o1, o2) : comparator(o1, o2);
                            } else if (column.sortedDescending) {
                                res = -(comparator.compare ? comparator.compare(o1, o2) : comparator(o1, o2));
                            } else {
                                res = 0;
                            }
                        }
                    }
                    return res;
                });
            }
            viewRowsToSections();
            fireRowsSort();
        }

        function rowsToViewRows(needRedraw) {
            if (arguments.length < 1)
                needRedraw = true;
            lookupDataColumn();
            generateViewRows();
            sortViewRows();
            if (needRedraw) {
                redrawFrozen();
                redrawBody();
            }
        }

        const expandListeners = new Set();

        function addExpandHandler(h) {
            expandListeners.add(h);
            return {
                removeHandler: function () {
                    expandListeners.delete(h);
                }
            };
        }

        Object.defineProperty(this, 'addExpandHandler', {
            get: function () {
                return addExpandHandler;
            }
        });

        function fireExpanded(anElement) {
            const event = new ItemEvent(self, anElement);
            expandListeners.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        let onExpand;
        let expandedReg;
        Object.defineProperty(this, 'onExpand', {
            get: function () {
                return onExpand;
            },
            set: function (aValue) {
                if (onExpand !== aValue) {
                    if (expandedReg) {
                        expandedReg.removeHandler();
                        expandedReg = null;
                    }
                    onExpand = aValue;
                    if (onExpand) {
                        expandedReg = addExpandHandler(event => {
                            if (onExpand) {
                                onExpand(event);
                            }
                        });
                    }
                }
            }
        });

        const collapseHandlers = new Set();

        function addCollapseHandler(h) {
            collapseHandlers.add(h);
            return {
                removeHandler: function () {
                    collapseHandlers.delete(h);
                }
            };
        }

        Object.defineProperty(this, 'addCollapseHandler', {
            get: function () {
                return addCollapseHandler;
            }
        });

        function fireCollapsed(anElement) {
            const event = new ItemEvent(self, anElement);
            collapseHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        let onCollapse;
        let collapseReg;
        Object.defineProperty(this, 'onCollapse', {
            get: function () {
                return onCollapse;
            },
            set: function (aValue) {
                if (onCollapse !== aValue) {
                    if (collapseReg) {
                        collapseReg.removeHandler();
                        collapseReg = null;
                    }
                    onCollapse = aValue;
                    if (onCollapse) {
                        collapseReg = addCollapseHandler(event => {
                            if (onCollapse) {
                                onCollapse(event);
                            }
                        });
                    }
                }
            }
        });

        const sortHandlers = new Set();

        function addSortHandler(handler) {
            sortHandlers.add(handler);
            return {
                removeHandler: function () {
                    sortHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addSortHandler', {
            get: function () {
                return addSortHandler;
            }
        });

        function viewRowsToSections() {
            [
                frozenLeft, frozenRight,
                bodyLeft, bodyRight
            ].forEach(section => {
                section.data = viewRows;
            });
        }

        function fireRowsSort() {
            const event = new SortEvent(self);
            sortHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        let onSort;
        let sortedReg;
        Object.defineProperty(this, 'onSort', {
            get: function () {
                return onSort;
            },
            set: function (aValue) {
                if (onSort !== aValue) {
                    if (sortedReg) {
                        sortedReg.removeHandler();
                        sortedReg = null;
                    }
                    onSort = aValue;
                    if (onSort) {
                        sortedReg = addSortHandler(event => {
                            if (onSort) {
                                onSort(event);
                            }
                        });
                    }
                }
            }
        });

        const selectHandlers = new Set();

        function addSelectHandler(handler) {
            selectHandlers.add(handler);
            return {
                removeHandler: function () {
                    selectHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addSelectHandler', {
            get: function () {
                return addSelectHandler;
            }
        });

        function fireSelected(item) {
            const event = new ItemEvent(self, item);
            selectHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        const focusHandlers = new Set();

        function addFocusHandler(handler) {
            focusHandlers.add(handler);
            return {
                removeHandler: function () {
                    focusHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addFocusHandler', {
            get: function () {
                return addFocusHandler;
            }
        });

        Ui.on(shell, Ui.Events.FOCUS, fireFocus);

        function fireFocus() {
            const event = new FocusEvent(self);
            focusHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        const focusLostHandlers = new Set();

        function addFocusLostHandler(handler) {
            focusLostHandlers.add(handler);
            return {
                removeHandler: function () {
                    focusLostHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addFocusLostHandler', {
            get: function () {
                return addFocusLostHandler;
            }
        });

        Ui.on(shell, Ui.Events.BLUR, fireFocusLost);

        function fireFocusLost() {
            const event = new BlurEvent(self);
            focusLostHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        const keyReleaseHandlers = new Set();

        function addKeyReleaseHandler(handler) {
            keyReleaseHandlers.add(handler);
            return {
                removeHandler: function () {
                    keyReleaseHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addKeyReleaseHandler', {
            get: function () {
                return addKeyReleaseHandler;
            }
        });

        Ui.on(shell, Ui.Events.KEYUP, fireKeyRelease);

        function fireKeyRelease(nevent) {
            const event = new KeyEvent(self, nevent);
            keyReleaseHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        const keyPressHandlers = new Set();

        function addKeyPressHandler(handler) {
            keyPressHandlers.add(handler);
            return {
                removeHandler: function () {
                    keyPressHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addKeyPressHandler', {
            get: function () {
                return addKeyPressHandler;
            }
        });

        Ui.on(shell, Ui.Events.KEYDOWN, fireKeyPress);

        function fireKeyPress(nevent) {
            const event = new KeyEvent(self, nevent);
            keyPressHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        const keyTypeHandlers = new Set();

        function addKeyTypeHandler(handler) {
            keyTypeHandlers.add(handler);
            return {
                removeHandler: function () {
                    keyTypeHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addKeyTypeHandler', {
            get: function () {
                return addKeyTypeHandler;
            }
        });

        Ui.on(shell, Ui.Events.KEYPRESS, fireKeyType);

        function fireKeyType(nevent) {
            const event = new KeyEvent(self, nevent);
            keyTypeHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }
    }
}

export default Grid;
