import Ui from 'kenga/utils';

const HEADER_VIEW = 'header-view';
let columnDrag = null;

class NodeView {
    constructor(text, viewColumnNode) {
        const self = this;
        const th = document.createElement('th');
        const thResizer = document.createElement('div');
        thResizer.className = 'p-grid-column-resizer';
        const thMover = document.createElement('div');
        thMover.className = 'p-grid-column-mover';
        const thTitle = document.createElement('div');
        thTitle.className = 'p-grid-column-title';
        let background = null;
        let foreground = null;
        let font = null;
        let moveable = true;
        let resizable = true;
        thMover.draggable = moveable;

        th[HEADER_VIEW] = this;
        thTitle.innerText = text;
        th.appendChild(thTitle);
        th.appendChild(thResizer);
        th.appendChild(thMover);
        const moveHintLeft = document.createElement('div');
        moveHintLeft.className = 'p-grid-column-move-hint-left';
        const moveHintRight = document.createElement('div');
        moveHintRight.className = 'p-grid-column-move-hint-right';

        Ui.on(th, Ui.Events.CLICK, event => {
            function checkOthers() {
                if (!event.ctrlKey && !event.metaKey) {
                    column.grid.unsort(false);
                }
            }
            if (event.button === 0) {
                var column = viewColumnNode.column;
                if (viewColumnNode.leaf && column.sortable) {
                    if (!column.comparator) {
                        checkOthers();
                        column.sort();
                    } else if (column.comparator.ascending) {
                        checkOthers();
                        column.sortDesc();
                    } else {
                        checkOthers();
                        column.unsort();
                    }
                }
            }
        });

        ((() => {
            Ui.on(thResizer, Ui.Events.CLICK, event => {
                if (resizable && event.button === 0) {
                    event.stopPropagation();
                }
            });
            let mouseDownAtX = null;
            let mouseDownWidth = null;
            let onMouseUp = null;
            let onMouseMove = null;
            let columnToResize = null;
            Ui.on(thResizer, Ui.Events.MOUSEDOWN, event => {
                if (resizable && event.button === 0) {
                    event.preventDefault();
                    event.stopPropagation();
                    columnDrag = {
                        resize: true
                    };
                    columnToResize = findRightMostLeafColumn();
                    mouseDownAtX = 'pageX' in event ? event.pageX : event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    mouseDownWidth = viewColumnNode.width;
                    if (!onMouseUp) {
                        onMouseUp = Ui.on(document, Ui.Events.MOUSEUP, event => {
                            event.stopPropagation();
                            columnDrag = null;
                            columnToResize = null;
                            if (onMouseUp) {
                                onMouseUp.removeHandler();
                                onMouseUp = null;
                            }
                            if (onMouseMove) {
                                onMouseMove.removeHandler();
                                onMouseMove = null;
                            }
                        });
                    }
                    if (!onMouseMove) {
                        onMouseMove = Ui.on(document, Ui.Events.MOUSEMOVE, event => {
                            event.preventDefault();
                            event.stopPropagation();
                            const newPageX = 'pageX' in event ? event.pageX : event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                            const dx = newPageX - mouseDownAtX;
                            const newWidth = mouseDownWidth + dx;
                            if (columnToResize.minWidth <= newWidth && newWidth <= columnToResize.maxWidth) {
                                columnToResize.width = newWidth;
                            }
                        });
                    }
                }
            });
        })());

        Ui.on(thMover, Ui.Events.DRAGSTART, event => {
            if (columnDrag && columnDrag.resize) {
                event.stopPropagation();
                event.preventDefault();
            } else {
                columnDrag = {
                    move: true,
                    column: viewColumnNode.column
                };
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', 'p-grid-column-move');
                let onDragEnd = Ui.on(thMover, Ui.Events.DRAGEND, event => {
                    onDragEnd.removeHandler();
                    onDragEnd = null;
                    if (columnDrag &&
                        columnDrag.move) {
                        if (columnDrag.clear) {
                            columnDrag.clear();
                            columnDrag.clear = null;
                        }
                        columnDrag = null;
                    }
                });
            }
        });

        function onDragOver(event) {
            if (columnDrag &&
                columnDrag.move &&
                columnDrag.column !== viewColumnNode.column &&
                columnDrag.column.node.parent === viewColumnNode.column.node.parent) {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                if (inThRect(event) && columnDrag.enteredTh === th) {
                    const rect = th.getBoundingClientRect();
                    if (event.clientX < rect.left + rect.width / 2) {
                        if (!moveHintLeft.parentElement) {
                            th.appendChild(moveHintLeft);
                        }
                        if (moveHintRight.parentElement) {
                            th.removeChild(moveHintRight);
                        }
                    } else {
                        if (!moveHintRight.parentElement) {
                            th.appendChild(moveHintRight);
                        }
                        if (moveHintLeft.parentElement) {
                            th.removeChild(moveHintLeft);
                        }
                    }
                }
            } else {
                event.dataTransfer.dropEffect = 'none';
            }
        }
        Ui.on(th, Ui.Events.DRAGOVER, onDragOver);

        function inThRect(event) {
            const rect = th.getBoundingClientRect();
            return event.clientX >= rect.left &&
                event.clientY >= rect.top &&
                event.clientX < rect.right &&
                event.clientY < rect.bottom;
        }

        function onDragEnter(event) {
            if (inThRect(event) && columnDrag &&
                columnDrag.move &&
                columnDrag.column !== viewColumnNode.column &&
                columnDrag.column.node.parent === viewColumnNode.column.node.parent) {
                columnDrag.enteredTh = th;
                event.dataTransfer.dropEffect = 'move';
                if (columnDrag.clear) {
                    columnDrag.clear();
                    columnDrag.clear = null;
                }
                if (!th.className.includes('p-grid-column-move-target')) {
                    th.classList.add('p-grid-column-move-target');

                    const rect = th.getBoundingClientRect();
                    if (event.clientX < rect.left + rect.width / 2) {
                        th.appendChild(moveHintLeft);
                    } else {
                        th.appendChild(moveHintRight);
                    }
                    columnDrag.clear = () => {
                        th.classList.remove('p-grid-column-move-target');
                        if (moveHintLeft.parentElement) {
                            th.removeChild(moveHintLeft);
                        }
                        if (moveHintRight.parentElement) {
                            th.removeChild(moveHintRight);
                        }
                    };
                }
            } else {
                event.dataTransfer.dropEffect = 'none';
            }
        }
        Ui.on(th, Ui.Events.DRAGENTER, onDragEnter);

        function onDragLeave(event) {
            if (!inThRect(event) && columnDrag &&
                columnDrag.move &&
                columnDrag.enteredTh === th) {
                if (columnDrag.clear) {
                    columnDrag.clear();
                    columnDrag.clear = null;
                }
            }
        }
        Ui.on(th, Ui.Events.DRAGLEAVE, onDragLeave);

        function onDrop(event) {
            if (inThRect(event) && columnDrag &&
                columnDrag.move &&
                columnDrag.enteredTh === th) {
                const droppedNode = columnDrag.column.node;
                const targetNode = viewColumnNode.column.node;
                const grid = viewColumnNode.column.grid;
                if (columnDrag.clear) {
                    columnDrag.clear();
                    columnDrag.clear = null;
                }
                columnDrag = null;
                const rect = th.getBoundingClientRect();
                if (event.clientX < rect.left + rect.width / 2) {
                    grid.insertBeforeColumnNode(droppedNode, targetNode);
                } else {
                    grid.insertAfterColumnNode(droppedNode, targetNode);
                }
            }
        }
        Ui.on(th, Ui.Events.DROP, onDrop);

        Object.defineProperty(this, 'element', {
            get: function() {
                return th;
            }
        });

        Object.defineProperty(this, 'text', {
            get: function() {
                return thTitle.innerText;
            },
            set: function(aValue) {
                thTitle.innerText = aValue;
            }
        });

        Object.defineProperty(this, 'column', {
            get: function() {
                return findRightMostLeafColumn();
            }
        });

        Object.defineProperty(this, 'columnNode', {
            get: function() {
                return viewColumnNode;
            }
        });

        Object.defineProperty(this, 'background', {
            get: function() {
                return background;
            },
            set: function(aValue) {
                background = aValue;
            }
        });

        Object.defineProperty(this, 'foreground', {
            get: function() {
                return foreground;
            },
            set: function(aValue) {
                foreground = aValue;
            }
        });

        Object.defineProperty(this, 'font', {
            get: function() {
                return font;
            },
            set: function(aValue) {
                font = aValue;
            }
        });

        Object.defineProperty(this, 'resizable', {
            get: function() {
                return resizable;
            },
            set: function(aValue) {
                if (resizable !== aValue) {
                    resizable = aValue;
                    if (resizable) {
                        thResizer.style.display = '';
                        thMover.classList.remove('p-grid-column-mover-alone');
                    } else {
                        thResizer.style.display = 'none';
                        thMover.classList.add('p-grid-column-mover-alone');
                    }
                }
            }
        });

        Object.defineProperty(this, 'moveable', {
            get: function() {
                return moveable;
            },
            set: function(aValue) {
                if (moveable !== aValue) {
                    moveable = aValue;
                    thMover.draggable = moveable;
                }
            }
        });

        function findRightMostLeafColumn() {
            let node = viewColumnNode;
            while (!node.leaf) {
                node = node.children[node.children.length - 1];
            }
            return node.column;
        }
    }
}

Object.defineProperty(NodeView, 'HEADER_VIEW', {
    get: function() {
        return HEADER_VIEW;
    }
});

export default NodeView;