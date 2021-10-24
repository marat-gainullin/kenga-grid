import TextField from 'kenga-fields/text-field';
import Column from '../column';
import NodeView from '../header/node-view';

class ColumnNode {
    constructor(AColumn) {
        const self = this;
        let name = null;
        let column = AColumn ? new AColumn(this) : new Column(this);

        const nodeView = new NodeView('', this);
        let parent = null;
        let children = [];

        let leavesCount = 0;
        let depthRemainder = 0;

        column.renderer = new TextField();
        column.editor = new TextField();

        function copy() {
            const copied = new ColumnNode();
            // Only one column is possible for one header node.
            // Multiple header nodes are possible for the same column.
            // It is ok, because of public API.
            copied.column = column;
            // For one header node, single or multiple header cells may be created, while header split.
            // So, we have to replicate header cell and copied.header = header assignment is not applicable.
            // Otherwise, spans will be reassigned by header nodes unpredictably.
            copied.view.text = nodeView.text;
            copied.leavesCount = leavesCount;
            copied.depthRemainder = depthRemainder;
            return copied;
        }

        Object.defineProperty(this, 'copy', {
            configurable: true,
            get: function () {
                return copy;
            }
        });
        Object.defineProperty(this, 'column', {
            configurable: true,
            get: function () {
                return column;
            },
            set: function (aValue) {
                column = aValue;
            }
        });

        Object.defineProperty(this, 'parent', {
            get: function () {
                return parent;
            },
            set: function (aValue) {
                parent = aValue;
            }
        });

        Object.defineProperty(this, 'children', {
            get: function () {
                return children;
            }
        });

        Object.defineProperty(this, 'view', {
            get: function () {
                return nodeView;
            }
        });

        function removeColumnNode(aNode, applyOnGrid = true) {
            if (children) {
                const idx = children.indexOf(aNode);
                if (idx !== -1) {
                    const removed = children.splice(idx, 1);
                    removed[0].parent = null;
                    if (applyOnGrid && column && column.grid) {
                        column.grid.applyColumnsNodes();
                    }
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        Object.defineProperty(this, 'removeColumnNode', {
            get: function () {
                return removeColumnNode;
            }
        });

        function removeColumnNodeAt(idx, applyOnGrid = true) {
            if (children) {
                if (idx >= 0 && idx < children.length) {
                    const removed = children.splice(idx, 1);
                    removed[0].parent = null;
                    if (applyOnGrid && column && column.grid) {
                        column.grid.applyColumnsNodes();
                    }
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        Object.defineProperty(this, 'removeColumnNodeAt', {
            get: function () {
                return removeColumnNodeAt;
            }
        });

        function addColumnNode(aNode, applyOnGrid = true) {
            if (!children) {
                children = [];
            }
            if (!children.includes(aNode)) {
                children.push(aNode);
                aNode.parent = self;
            }
            if (applyOnGrid && column && column.grid) {
                column.grid.applyColumnsNodes();
            }
        }

        Object.defineProperty(this, 'addColumnNode', {
            get: function () {
                return addColumnNode;
            }
        });

        function insertColumnNode(atIndex, aNode, applyOnGrid = true) {
            if (!children) {
                children = [];
            }
            if (!children.includes(aNode) && atIndex >= 0 && atIndex <= children.length) {
                children.splice(atIndex, 0, aNode);
                aNode.parent = self;
            }
            if (applyOnGrid && column && column.grid) {
                column.grid.applyColumnsNodes();
            }
        }

        Object.defineProperty(this, 'insertColumnNode', {
            get: function () {
                return insertColumnNode;
            }
        });

        Object.defineProperty(this, 'childrenNodes', {
            get: function () {
                return children.slice(0, children.length);
            }
        });

        Object.defineProperty(this, 'depthRemainder', {
            get: function () {
                return depthRemainder;
            },
            set: function (aValue) {
                depthRemainder = aValue;
                if (aValue > 0) {
                    nodeView.element.setAttribute('rowspan', `${aValue + 1}`);
                } else {
                    nodeView.element.removeAttribute('rowspan');
                }
            }
        });

        Object.defineProperty(this, 'leavesCount', {
            get: function () {
                return leavesCount;
            },
            set: function (aValue) {
                leavesCount = aValue;
                if (aValue > 1) {
                    nodeView.element.setAttribute('colspan', `${aValue}`);
                } else {
                    nodeView.element.removeAttribute('colspan');
                }
            }
        });

        Object.defineProperty(this, 'leaf', {
            get: function () {
                return children.length === 0;
            }
        });

        Object.defineProperty(this, 'name', {
            get: function () {
                return name;
            },
            set: function (aValue) {
                name = aValue;
            }
        });

        Object.defineProperty(this, 'background', {
            get: function () {
                return nodeView.background;
            },
            set: function (aValue) {
                if (nodeView.background !== aValue) {
                    nodeView.background = aValue;
                    column.headers.forEach(nv => {
                        nv.background = aValue;
                    });
                }
            }
        });

        Object.defineProperty(this, 'foreground', {
            get: function () {
                return nodeView.foreground;
            },
            set: function (aValue) {
                if (nodeView.foreground !== aValue) {
                    nodeView.foreground = aValue;
                    column.headers.forEach(nv => {
                        nv.foreground = aValue;
                    });
                }
            }
        });

        Object.defineProperty(this, 'font', {
            get: function () {
                return nodeView.font;
            },
            set: function (aValue) {
                if (nodeView.font !== aValue) {
                    nodeView.font = aValue;
                    column.headers.forEach(nv => {
                        nv.font = aValue;
                    });
                }
            }
        });

        Object.defineProperty(this, 'minWidth', {
            get: function () {
                return column.minWidth;
            },
            set: function (aValue) {
                column.minWidth = aValue;
            }
        });

        Object.defineProperty(this, 'width', {
            get: function () {
                return column.width;
            },
            set: function (aValue) {
                column.width = aValue;
            }
        });

        Object.defineProperty(this, 'maxWidth', {
            get: function () {
                return column.maxWidth;
            },
            set: function (aValue) {
                column.maxWidth = aValue;
            }
        });

        Object.defineProperty(this, 'field', {
            get: function () {
                return column.field;
            },
            set: function (aValue) {
                column.field = aValue;
            }
        });

        Object.defineProperty(this, 'title', {
            get: function () {
                return nodeView.text;
            },
            set: function (aValue) {
                if (nodeView.text !== aValue) {
                    nodeView.text = aValue;
                    column.headers.forEach(nv => {
                        nv.text = aValue;
                    });
                }
            }
        });

        Object.defineProperty(this, 'resizable', {
            get: function () {
                return nodeView.resizable;
            },
            set: function (aValue) {
                if (nodeView.resizable !== aValue) {
                    nodeView.resizable = aValue;
                    column.headers.forEach(nv => {
                        nv.resizable = aValue;
                    });
                }
            }
        });

        Object.defineProperty(this, 'moveable', {
            get: function () {
                return nodeView.moveable;
            },
            set: function (aValue) {
                if (nodeView.moveable !== aValue) {
                    nodeView.moveable = aValue;
                    column.headers.forEach(nv => {
                        nv.moveable = aValue;
                    });
                }
            }
        });

        Object.defineProperty(this, 'visible', {
            get: function () {
                return column.visible;
            },
            set: function (aValue) {
                column.visible = aValue;
            }
        });

        Object.defineProperty(this, 'readonly', {
            get: function () {
                return column.readonly;
            },
            set: function (aValue) {
                column.readonly = aValue;
            }
        });

        Object.defineProperty(this, 'sortable', {
            get: function () {
                return column.sortable;
            },
            set: function (aValue) {
                column.sortable = aValue;
            }
        });

        Object.defineProperty(this, 'sortField', {
            get: function () {
                return column.sortField;
            },
            set: function (aValue) {
                column.sortField = aValue;
            }
        });

        Object.defineProperty(this, 'onRender', {
            get: function () {
                return column.onRender;
            },
            set: function (aValue) {
                column.onRender = aValue;
            }
        });

        Object.defineProperty(this, 'onSelect', {
            get: function () {
                return column.onSelect;
            },
            set: function (aValue) {
                column.onSelect = aValue;
            }
        });

        function sort() {
            column.sort();
        }

        Object.defineProperty(this, 'sort', {
            get: function () {
                return sort;
            }
        });

        function sortDesc() {
            column.sortDesc();
        }

        Object.defineProperty(this, 'sortDesc', {
            get: function () {
                return sortDesc;
            }
        });

        function unsort() {
            column.unsort();
        }

        Object.defineProperty(this, 'unsort', {
            get: function () {
                return unsort;
            }
        });

        Object.defineProperty(this, 'renderer', {
            configurable: true,
            get: function () {
                return column ? column.renderer : null;
            },
            set: function (aWidget) {
                if (column) {
                    column.renderer = aWidget;
                }
            }
        });

        Object.defineProperty(this, 'editor', {
            configurable: true,
            get: function () {
                return column ? column.editor : null;
            },
            set: function (aWidget) {
                if (column) {
                    column.editor = aWidget;
                }
            }
        });
    }
}

export default ColumnNode;