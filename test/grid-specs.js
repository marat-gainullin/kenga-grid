/* global expect */
/* global NaN */

import '../src/layout.css';
import '../src/theme.css';

import Logger from 'septima-utils/logger';
import Grid from '../src/grid';
import ColumnNode from '../src/columns/column-node';
import MarkerColumnNode from '../src/columns/nodes/marker-service-node';
import CheckBoxColumnNode from '../src/columns/nodes/check-box-service-node';
import RadioButtonColumnNode from '../src/columns/nodes/radio-button-service-node';
import OrderNumServiceColumnNode from '../src/columns/nodes/order-num-service-node';

describe('Grid Api', () => {

    function expectColumns(instance) {
        expect(instance.headerLeft.columnsCount).toEqual(instance.frozenLeft.columnsCount);
        expect(instance.headerLeft.columnsCount).toEqual(instance.bodyLeft.columnsCount);
        expect(instance.headerLeft.columnsCount).toEqual(instance.footerLeft.columnsCount);
        expect(instance.headerRight.columnsCount).toEqual(instance.frozenRight.columnsCount);
        expect(instance.headerRight.columnsCount).toEqual(instance.bodyRight.columnsCount);
        expect(instance.headerRight.columnsCount).toEqual(instance.footerRight.columnsCount);
    }

    it('Header.Split.Plain', () => {
        const instance = new Grid();
        const marker = new MarkerColumnNode();
        const check = new CheckBoxColumnNode();
        const radio = new RadioButtonColumnNode();
        const name = new ColumnNode();
        const birth = new ColumnNode();
        const payed = new ColumnNode();
        instance.addColumnNode(marker);
        instance.addColumnNode(check);
        instance.addColumnNode(radio);
        instance.addColumnNode(name);
        instance.addColumnNode(birth);
        instance.addColumnNode(payed);
        expect(instance.headerRight.columnsCount).toEqual(instance.columnsCount);
        expect(instance.headerLeft.columnsCount).toEqual(0);
        expect(instance.headerRight.columnsCount).toEqual(6);
        expectColumns(instance);
        instance.frozenColumns = 1;
        expect(instance.headerLeft.columnsCount).toEqual(1);
        expect(instance.headerRight.columnsCount).toEqual(5);
        expectColumns(instance);
        instance.frozenColumns = 2;
        expect(instance.headerLeft.columnsCount).toEqual(2);
        expect(instance.headerRight.columnsCount).toEqual(4);
        expectColumns(instance);
        instance.frozenColumns = 3;
        expect(instance.headerLeft.columnsCount).toEqual(3);
        expect(instance.headerRight.columnsCount).toEqual(3);
        expectColumns(instance);
        instance.frozenColumns = 4;
        expect(instance.headerLeft.columnsCount).toEqual(4);
        expect(instance.headerRight.columnsCount).toEqual(2);
        expectColumns(instance);
        instance.frozenColumns = 5;
        expect(instance.headerLeft.columnsCount).toEqual(5);
        expect(instance.headerRight.columnsCount).toEqual(1);
        expectColumns(instance);
        instance.frozenColumns = 6;
        expect(instance.headerLeft.columnsCount).toEqual(6);
        expect(instance.headerRight.columnsCount).toEqual(0);
        instance.frozenColumns = 7;
        expect(instance.frozenColumns).toEqual(6);
        instance.frozenColumns = -1;
        expect(instance.frozenColumns).toEqual(6);
    });
    it('Header.Split.TwoLayers.1', () => {
        const instance = new Grid();
        const marker = new MarkerColumnNode();
        const marker1 = new MarkerColumnNode();
        marker1.addColumnNode(marker);
        const check = new CheckBoxColumnNode();
        const check1 = new CheckBoxColumnNode();
        check1.addColumnNode(check);
        const radio = new RadioButtonColumnNode();
        const radio1 = new RadioButtonColumnNode();
        radio1.addColumnNode(radio);
        const name = new ColumnNode();
        const name1 = new ColumnNode();
        name1.addColumnNode(name);
        const birth = new ColumnNode();
        const birth1 = new ColumnNode();
        birth1.addColumnNode(birth);
        const payed = new ColumnNode();
        const payed1 = new ColumnNode();
        payed1.addColumnNode(payed);

        instance.header = [
            marker1,
            check1,
            radio1,
            name1,
            birth1,
            payed1
        ];

        expect(instance.headerRight.columnsCount).toEqual(instance.columnsCount);
        expect(instance.headerLeft.columnsCount).toEqual(0);
        expect(instance.headerRight.columnsCount).toEqual(6);
        instance.frozenColumns = 1;
        expect(instance.headerLeft.columnsCount).toEqual(1);
        expect(instance.headerRight.columnsCount).toEqual(5);
        instance.frozenColumns = 2;
        expect(instance.headerLeft.columnsCount).toEqual(2);
        expect(instance.headerRight.columnsCount).toEqual(4);
        instance.frozenColumns = 3;
        expect(instance.headerLeft.columnsCount).toEqual(3);
        expect(instance.headerRight.columnsCount).toEqual(3);
        instance.frozenColumns = 4;
        expect(instance.headerLeft.columnsCount).toEqual(4);
        expect(instance.headerRight.columnsCount).toEqual(2);
        instance.frozenColumns = 5;
        expect(instance.headerLeft.columnsCount).toEqual(5);
        expect(instance.headerRight.columnsCount).toEqual(1);
        instance.frozenColumns = 6;
        expect(instance.headerLeft.columnsCount).toEqual(6);
        expect(instance.headerRight.columnsCount).toEqual(0);
        instance.frozenColumns = 7;
        expect(instance.frozenColumns).toEqual(6);
        instance.frozenColumns = -1;
        expect(instance.frozenColumns).toEqual(6);
    });
    it('Header.Split.TwoLayers.2', () => {
        const instance = new Grid();
        document.body.appendChild(instance.element);

        const service = new ColumnNode();
        service.title = 'service';

        const marker = new MarkerColumnNode();
        service.addColumnNode(marker);
        const check = new CheckBoxColumnNode();
        service.addColumnNode(check);
        const radio = new RadioButtonColumnNode();
        service.addColumnNode(radio);

        const semantic = new ColumnNode();
        semantic.title = 'semantic';

        const name = new ColumnNode();
        name.title = 'name';
        semantic.addColumnNode(name);
        const birth = new ColumnNode();
        birth.title = 'birth';
        semantic.addColumnNode(birth);
        const payed = new ColumnNode();
        payed.title = 'payed';
        semantic.addColumnNode(payed);

        instance.addColumnNode(service);
        instance.addColumnNode(semantic);

        expect(instance.headerRight.columnsCount).toEqual(instance.columnsCount);
        expect(instance.headerLeft.columnsCount).toEqual(0);
        expect(instance.headerRight.columnsCount).toEqual(6);
        instance.frozenColumns = 1;
        expect(instance.headerLeft.columnsCount).toEqual(1);
        expect(instance.headerRight.columnsCount).toEqual(5);
        instance.frozenColumns = 2;
        expect(instance.headerLeft.columnsCount).toEqual(2);
        expect(instance.headerRight.columnsCount).toEqual(4);
        instance.frozenColumns = 3;
        expect(instance.headerLeft.columnsCount).toEqual(3);
        expect(instance.headerRight.columnsCount).toEqual(3);
        instance.frozenColumns = 4;
        expect(instance.headerLeft.columnsCount).toEqual(4);
        expect(instance.headerRight.columnsCount).toEqual(2);
        instance.frozenColumns = 5;
        expect(instance.headerLeft.columnsCount).toEqual(5);
        expect(instance.headerRight.columnsCount).toEqual(1);
        instance.frozenColumns = 6;
        expect(instance.headerLeft.columnsCount).toEqual(6);
        expect(instance.headerRight.columnsCount).toEqual(0);
        instance.frozenColumns = 7;
        expect(instance.frozenColumns).toEqual(6);
        instance.frozenColumns = -1;
        expect(instance.frozenColumns).toEqual(6);
        document.body.removeChild(instance.element);
    });
    it('Header.Split.TwoLayers.3', () => {
        const instance = new Grid();
        document.body.appendChild(instance.element);

        const marker = new MarkerColumnNode();
        instance.addColumnNode(marker);
        const check = new CheckBoxColumnNode();
        instance.addColumnNode(check);
        const radio = new RadioButtonColumnNode();
        instance.addColumnNode(radio);

        const semantic = new ColumnNode();
        semantic.title = 'semantic';

        const name = new ColumnNode();
        name.title = 'name';
        semantic.addColumnNode(name);
        const birth = new ColumnNode();
        birth.title = 'birth';
        semantic.addColumnNode(birth);
        const payed = new ColumnNode();
        payed.title = 'payed';
        semantic.addColumnNode(payed);

        instance.addColumnNode(semantic);

        expect(instance.headerRight.columnsCount).toEqual(instance.columnsCount);
        expect(instance.headerLeft.columnsCount).toEqual(0);
        expect(instance.headerRight.columnsCount).toEqual(6);
        instance.frozenColumns = 1;
        expect(instance.headerLeft.columnsCount).toEqual(1);
        expect(instance.headerRight.columnsCount).toEqual(5);
        instance.frozenColumns = 2;
        expect(instance.headerLeft.columnsCount).toEqual(2);
        expect(instance.headerRight.columnsCount).toEqual(4);
        instance.frozenColumns = 3;
        expect(instance.headerLeft.columnsCount).toEqual(3);
        expect(instance.headerRight.columnsCount).toEqual(3);
        instance.frozenColumns = 4;
        expect(instance.headerLeft.columnsCount).toEqual(4);
        expect(instance.headerRight.columnsCount).toEqual(2);
        instance.frozenColumns = 5;
        expect(instance.headerLeft.columnsCount).toEqual(5);
        expect(instance.headerRight.columnsCount).toEqual(1);
        instance.frozenColumns = 6;
        expect(instance.headerLeft.columnsCount).toEqual(6);
        expect(instance.headerRight.columnsCount).toEqual(0);
        instance.frozenColumns = 7;
        expect(instance.frozenColumns).toEqual(6);
        instance.frozenColumns = -1;
        expect(instance.frozenColumns).toEqual(6);

        document.body.removeChild(instance.element);
    });

    const plainSamples = [];
    ((() => {
        const moment = new Date();
        const dataSize = 10;
        while (plainSamples.length < dataSize) {
            plainSamples.push({
                marker: true,
                check: plainSamples.length % 2 === 0,
                radio: false,
                name: `title${plainSamples.length}`,
                birth: new Date(moment.valueOf() + plainSamples.length * 10),
                payed: true
            });
        }
    })());

    it('Rows.Frozen Columns.Frozen', () => {
        const instance = new Grid();
        instance.width = instance.height = 250;
        instance.frozenRows = 2;
        document.body.appendChild(instance.element);

        const marker = new MarkerColumnNode();
        instance.addColumnNode(marker);
        const check = new CheckBoxColumnNode();
        instance.addColumnNode(check);
        const radio = new RadioButtonColumnNode();
        instance.addColumnNode(radio);

        const semantic = new ColumnNode();
        semantic.title = 'semantic';

        const name = new ColumnNode();
        name.field = name.title = 'name';

        semantic.addColumnNode(name);
        const birth = new ColumnNode();
        birth.editor = null;
        birth.field = birth.title = 'birth';
        birth.width = 170;
        birth.visible = false;
        semantic.addColumnNode(birth);
        const payed = new ColumnNode();
        payed.field = payed.title = 'payed';
        semantic.addColumnNode(payed);

        instance.addColumnNode(semantic);

        instance.frozenColumns = 4;

        instance.data = plainSamples;

        expect(instance.frozenLeft.rowsCount).toEqual(2);
        expect(instance.frozenRight.rowsCount).toEqual(2);
        expect(instance.bodyLeft.rowsCount).toEqual(5);// 5 instead of 8 because of virtual nature of grid
        expect(instance.bodyRight.rowsCount).toEqual(5);

        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.bodyLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(2);
        expect(instance.bodyRight.columnsCount).toEqual(2);

        document.body.removeChild(instance.element);
    });
    it('Rows.Sorting', () => {
        const instance = new Grid();
        instance.width = instance.height = 250;
        instance.frozenRows = 2;
        document.body.appendChild(instance.element);

        const marker = new MarkerColumnNode();
        instance.addColumnNode(marker);
        const check = new CheckBoxColumnNode();
        instance.addColumnNode(check);
        const radio = new RadioButtonColumnNode();
        instance.addColumnNode(radio);

        const semantic = new ColumnNode();
        semantic.title = 'semantic';

        const name = new ColumnNode();
        name.field = name.title = 'name';

        semantic.addColumnNode(name);
        const birth = new ColumnNode();
        birth.editor = null;
        birth.field = birth.title = 'birth';
        birth.width = 170;
        birth.visible = false;
        semantic.addColumnNode(birth);
        const payed = new ColumnNode();
        payed.field = payed.title = 'payed';
        semantic.addColumnNode(payed);

        instance.addColumnNode(semantic);

        instance.frozenColumns = 4;

        instance.data = plainSamples;

        birth.sort();
        birth.sortDesc();
        birth.unsort();
        birth.sort();
        birth.sortDesc();
        instance.unsort();

        expect(instance.frozenLeft.rowsCount).toEqual(2);
        expect(instance.frozenRight.rowsCount).toEqual(2);
        expect(instance.bodyLeft.rowsCount).toEqual(5);// 5 instead of 8 because of virtual nature of grid
        expect(instance.bodyRight.rowsCount).toEqual(5);

        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.bodyLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(2);
        expect(instance.bodyRight.columnsCount).toEqual(2);

        document.body.removeChild(instance.element);
    });
    it('Rows.Rendering', () => {
        const instance = new Grid();
    });
    it('Rows.Dragging', () => {
        const instance = new Grid();
        instance.width = instance.height = 300;
        instance.frozenRows = 2;
        document.body.appendChild(instance.element);

        const nmb = new OrderNumServiceColumnNode();
        instance.addColumnNode(nmb);
        const marker = new MarkerColumnNode();
        instance.addColumnNode(marker);
        const check = new CheckBoxColumnNode();
        instance.addColumnNode(check);
        const radio = new RadioButtonColumnNode();
        instance.addColumnNode(radio);

        const semantic = new ColumnNode();
        semantic.title = 'semantic';

        const name = new ColumnNode();
        name.field = name.title = 'name';

        semantic.addColumnNode(name);
        const birth = new ColumnNode();
        birth.editor = birth.renderer = null;
        birth.field = birth.title = 'birth';
        birth.width = 170;
        birth.visible = false;
        semantic.addColumnNode(birth);
        const payed = new ColumnNode();
        payed.field = payed.title = 'payed';
        semantic.addColumnNode(payed);

        instance.addColumnNode(semantic);

        instance.frozenColumns = 4;

        instance.data = treeSamples;
        instance.parentField = 'parent';
        instance.childrenField = 'children';

        instance.draggableRows = true;
        instance.onDragBefore = (row, before) => {
            Logger.info(`Drag of row: ${row}; before: ${before}`);
        };
        instance.onDragInto = (row, into) => {
            Logger.info(`Drag of row: ${row}; into: ${into}`);
        };
        instance.onDragAfter = (row, after) => {
            Logger.info(`Drag of row: ${row}; after: ${after}`);
        };
        instance.onDropBefore = (row, before) => {
            Logger.info(`Drop of row: ${row}; before: ${before}`);
        };
        instance.onDropInto = (row, into) => {
            Logger.info(`Drop of row: ${row}; into: ${into}`);
        };
        instance.onDropAfter = (row, after) => {
            Logger.info(`Drop of row: ${row}; after: ${after}`);
        };

        expect(instance.frozenLeft.rowsCount).toEqual(2);
        expect(instance.frozenRight.rowsCount).toEqual(2);
        expect(instance.bodyLeft.rowsCount).toEqual(6);// 6 instead of 8 because of grid virtualization
        expect(instance.bodyRight.rowsCount).toEqual(6);

        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.bodyLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(3);
        expect(instance.bodyRight.columnsCount).toEqual(3);

        document.body.removeChild(instance.element);
    });
    var treeSamples = [];
    ((() => {
        const maxDepth = 2;
        const childrenCount = 5;
        function generateChildren(parent, deepness) {
            if (deepness < maxDepth) {
                deepness++;
                parent.children = [];
                for (let c = 0; c < childrenCount; c++) {
                    const child = {
                        marker: true,
                        check: treeSamples.length % 2 === 0,
                        radio: false,
                        name: `${parent.name}:${c}`,
                        birth: new Date(moment.valueOf() + plainSamples.length * 10),
                        payed: true
                    };
                    child.parent = parent;
                    parent.children.push(child);
                    treeSamples.push(child);
                    generateChildren(child, deepness);
                }
            }
        }

        var moment = new Date();
        const rootsCount = 10;
        let r = 0;
        while (r < rootsCount) {
            const sample = {
                marker: true,
                check: treeSamples.length % 2 === 0,
                radio: false,
                name: `title ${r}`,
                birth: new Date(moment.valueOf() + treeSamples.length * 10),
                payed: true
            };
            treeSamples.push(sample);
            if (r === 4) {
                treeSamples.cursor = sample;
            }
            generateChildren(sample, 0);
            r++;
        }
    })());
    it('Rows.Tree', () => {
        const instance = new Grid();
        instance.width = instance.height = 250;
        instance.frozenRows = 2;
        document.body.appendChild(instance.element);

        const nmb = new OrderNumServiceColumnNode();
        instance.addColumnNode(nmb);
        const marker = new MarkerColumnNode();
        instance.addColumnNode(marker);
        const check = new CheckBoxColumnNode();
        instance.addColumnNode(check);
        const radio = new RadioButtonColumnNode();
        instance.addColumnNode(radio);

        const semantic = new ColumnNode();
        semantic.title = 'semantic';

        const name = new ColumnNode();
        name.field = name.title = 'name';

        semantic.addColumnNode(name);
        const birth = new ColumnNode();
        birth.editor = null;
        birth.field = birth.title = 'birth';
        birth.width = 170;
        birth.visible = false;
        semantic.addColumnNode(birth);
        const payed = new ColumnNode();
        payed.field = payed.title = 'payed';
        semantic.addColumnNode(payed);

        instance.addColumnNode(semantic);

        instance.frozenColumns = 4;

        instance.data = treeSamples;
        instance.parentField = 'parent';
        instance.childrenField = 'children';

        birth.sort();
        birth.sortDesc();
        birth.unsort();
        birth.sort();
        birth.sortDesc();
        instance.unsort();

        expect(instance.frozenLeft.rowsCount).toEqual(2);
        expect(instance.frozenRight.rowsCount).toEqual(2);
        expect(instance.bodyLeft.rowsCount).toEqual(5);// 5 instead of 8 because of virtual nature of grid
        expect(instance.bodyRight.rowsCount).toEqual(5);

        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.bodyLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(3);
        expect(instance.bodyRight.columnsCount).toEqual(3);

        document.body.removeChild(instance.element);
    });
    it('Columns.Performance', () => {
        const instance = new Grid();
    });
    it('Editing.Inline', () => {
        const instance = new Grid();
        instance.width = instance.height = 300;
        instance.frozenRows = 2;
        document.body.appendChild(instance.element);

        const nmb = new OrderNumServiceColumnNode();
        instance.addColumnNode(nmb);
        const marker = new MarkerColumnNode();
        instance.addColumnNode(marker);
        const check = new CheckBoxColumnNode();
        instance.addColumnNode(check);
        const radio = new RadioButtonColumnNode();
        instance.addColumnNode(radio);

        const semantic = new ColumnNode();
        semantic.title = 'semantic';

        const name = new ColumnNode();
        name.field = name.title = 'name';

        semantic.addColumnNode(name);
        const birth = new ColumnNode();
        birth.editor = birth.renderer = null;
        birth.field = birth.title = 'birth';
        birth.width = 170;
        birth.visible = false;
        semantic.addColumnNode(birth);
        const payed = new ColumnNode();
        payed.field = payed.title = 'payed';
        semantic.addColumnNode(payed);

        instance.addColumnNode(semantic);

        instance.frozenColumns = 4;

        instance.data = treeSamples;
        instance.parentField = 'parent';
        instance.childrenField = 'children';

        birth.sort();
        birth.sortDesc();
        birth.unsort();
        birth.sort();
        birth.sortDesc();
        instance.unsort();

        expect(instance.frozenLeft.rowsCount).toEqual(2);
        expect(instance.frozenRight.rowsCount).toEqual(2);
        expect(instance.bodyLeft.rowsCount).toEqual(6);// 6 instead of 8 because of grid virtualization
        expect(instance.bodyRight.rowsCount).toEqual(6);

        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.bodyLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(3);
        expect(instance.bodyRight.columnsCount).toEqual(3);

        document.body.removeChild(instance.element);
    });
    it('Editing.Popup', () => {
        const instance = new Grid();
    });
    it('Events', () => {
        const instance = new Grid();
    });
});
