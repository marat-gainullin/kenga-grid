/* global expect */
/* global NaN */

import '../src/layout.css';
import '../src/theme.css';
import 'kenga-menu/layout.css';
import 'kenga-menu/theme.css';

import Logger from 'septima-utils/logger';
import Grid from '../src/grid';
import ColumnNode from '../src/columns/column-node';
import MarkerColumnNode from '../src/columns/nodes/marker-service-node';
import CheckBoxColumnNode from '../src/columns/nodes/check-box-service-node';
import RadioButtonColumnNode from '../src/columns/nodes/radio-button-service-node';
import OrderNumServiceColumnNode from '../src/columns/nodes/order-num-service-node';
import NumberField from 'kenga-fields/number-field';

describe('Grid Api', () => {

    function expectColumns(instance) {
        expect(instance.frozenLeft.columnsCount).toEqual(instance.frozenLeft.columnsCount);
        expect(instance.frozenLeft.columnsCount).toEqual(instance.bodyLeft.columnsCount);
        expect(instance.frozenLeft.columnsCount).toEqual(instance.footerLeft.columnsCount);
        expect(instance.frozenRight.columnsCount).toEqual(instance.frozenRight.columnsCount);
        expect(instance.frozenRight.columnsCount).toEqual(instance.bodyRight.columnsCount);
        expect(instance.frozenRight.columnsCount).toEqual(instance.footerRight.columnsCount);
    }

    it('Header.Split.Plain', () => {
        const instance = new Grid();
        instance.renderingPadding = 0;
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
        expect(instance.frozenRight.columnsCount).toEqual(instance.columnsCount);
        expect(instance.frozenLeft.columnsCount).toEqual(0);
        expect(instance.frozenRight.columnsCount).toEqual(6);
        expectColumns(instance);
        instance.frozenColumns = 1;
        expect(instance.frozenLeft.columnsCount).toEqual(1);
        expect(instance.frozenRight.columnsCount).toEqual(5);
        expectColumns(instance);
        instance.frozenColumns = 2;
        expect(instance.frozenLeft.columnsCount).toEqual(2);
        expect(instance.frozenRight.columnsCount).toEqual(4);
        expectColumns(instance);
        instance.frozenColumns = 3;
        expect(instance.frozenLeft.columnsCount).toEqual(3);
        expect(instance.frozenRight.columnsCount).toEqual(3);
        expectColumns(instance);
        instance.frozenColumns = 4;
        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(2);
        expectColumns(instance);
        instance.frozenColumns = 5;
        expect(instance.frozenLeft.columnsCount).toEqual(5);
        expect(instance.frozenRight.columnsCount).toEqual(1);
        expectColumns(instance);
        instance.frozenColumns = 6;
        expect(instance.frozenLeft.columnsCount).toEqual(6);
        expect(instance.frozenRight.columnsCount).toEqual(0);
        instance.frozenColumns = 7;
        expect(instance.frozenColumns).toEqual(6);
        instance.frozenColumns = -1;
        expect(instance.frozenColumns).toEqual(6);
    });
    it('Header.Split.TwoLayers.1', () => {
        const instance = new Grid();
        instance.renderingPadding = 0;
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

        expect(instance.frozenRight.columnsCount).toEqual(instance.columnsCount);
        expect(instance.frozenLeft.columnsCount).toEqual(0);
        expect(instance.frozenRight.columnsCount).toEqual(6);
        instance.frozenColumns = 1;
        expect(instance.frozenLeft.columnsCount).toEqual(1);
        expect(instance.frozenRight.columnsCount).toEqual(5);
        instance.frozenColumns = 2;
        expect(instance.frozenLeft.columnsCount).toEqual(2);
        expect(instance.frozenRight.columnsCount).toEqual(4);
        instance.frozenColumns = 3;
        expect(instance.frozenLeft.columnsCount).toEqual(3);
        expect(instance.frozenRight.columnsCount).toEqual(3);
        instance.frozenColumns = 4;
        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(2);
        instance.frozenColumns = 5;
        expect(instance.frozenLeft.columnsCount).toEqual(5);
        expect(instance.frozenRight.columnsCount).toEqual(1);
        instance.frozenColumns = 6;
        expect(instance.frozenLeft.columnsCount).toEqual(6);
        expect(instance.frozenRight.columnsCount).toEqual(0);
        instance.frozenColumns = 7;
        expect(instance.frozenColumns).toEqual(6);
        instance.frozenColumns = -1;
        expect(instance.frozenColumns).toEqual(6);
    });
    it('Header.Split.TwoLayers.2', () => {
        const instance = new Grid();
        instance.renderingPadding = 0;
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

        expect(instance.frozenRight.columnsCount).toEqual(instance.columnsCount);
        expect(instance.frozenLeft.columnsCount).toEqual(0);
        expect(instance.frozenRight.columnsCount).toEqual(6);
        instance.frozenColumns = 1;
        expect(instance.frozenLeft.columnsCount).toEqual(1);
        expect(instance.frozenRight.columnsCount).toEqual(5);
        instance.frozenColumns = 2;
        expect(instance.frozenLeft.columnsCount).toEqual(2);
        expect(instance.frozenRight.columnsCount).toEqual(4);
        instance.frozenColumns = 3;
        expect(instance.frozenLeft.columnsCount).toEqual(3);
        expect(instance.frozenRight.columnsCount).toEqual(3);
        instance.frozenColumns = 4;
        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(2);
        instance.frozenColumns = 5;
        expect(instance.frozenLeft.columnsCount).toEqual(5);
        expect(instance.frozenRight.columnsCount).toEqual(1);
        instance.frozenColumns = 6;
        expect(instance.frozenLeft.columnsCount).toEqual(6);
        expect(instance.frozenRight.columnsCount).toEqual(0);
        instance.frozenColumns = 7;
        expect(instance.frozenColumns).toEqual(6);
        instance.frozenColumns = -1;
        expect(instance.frozenColumns).toEqual(6);
        document.body.removeChild(instance.element);
    });
    it('Header.Split.TwoLayers.3', () => {
        const instance = new Grid();
        instance.renderingPadding = 0;
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

        expect(instance.frozenRight.columnsCount).toEqual(instance.columnsCount);
        expect(instance.frozenLeft.columnsCount).toEqual(0);
        expect(instance.frozenRight.columnsCount).toEqual(6);
        instance.frozenColumns = 1;
        expect(instance.frozenLeft.columnsCount).toEqual(1);
        expect(instance.frozenRight.columnsCount).toEqual(5);
        instance.frozenColumns = 2;
        expect(instance.frozenLeft.columnsCount).toEqual(2);
        expect(instance.frozenRight.columnsCount).toEqual(4);
        instance.frozenColumns = 3;
        expect(instance.frozenLeft.columnsCount).toEqual(3);
        expect(instance.frozenRight.columnsCount).toEqual(3);
        instance.frozenColumns = 4;
        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(2);
        instance.frozenColumns = 5;
        expect(instance.frozenLeft.columnsCount).toEqual(5);
        expect(instance.frozenRight.columnsCount).toEqual(1);
        instance.frozenColumns = 6;
        expect(instance.frozenLeft.columnsCount).toEqual(6);
        expect(instance.frozenRight.columnsCount).toEqual(0);
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
                amount: plainSamples.length,
                payed: true
            });
        }
    })());

    it('Rows.Frozen Columns.Frozen', () => {
        const instance = new Grid();
        instance.width = instance.height = 250;
        instance.frozenRows = 2;
        instance.renderingPadding = 1;
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
        expect(instance.bodyLeft.rowsCount).toEqual(8);// 8 out of 8 because of virtual nature of grid and because of renderingPadding
        expect(instance.bodyRight.rowsCount).toEqual(8);

        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.bodyLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(2);
        expect(instance.bodyRight.columnsCount).toEqual(2);

        document.body.removeChild(instance.element);
    });
    it('Rows.Sorting', () => {
        const instance = new Grid();
        instance.renderingPadding = 0;
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
    xit('Rows.Rendering', () => {
        const instance = new Grid();
    });
    it('Rows.Dragging', () => {
        const instance = new Grid();
        instance.renderingPadding = 0;
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
                        payed: true,
                        amount: deepness
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
                payed: true,
                amount: r
            };
            treeSamples.push(sample);
            if (r === 4) {
                treeSamples.cursor = sample;
            }
            generateChildren(sample, 0);
            r++;
        }
    })());
    it('Rows.Tree after columns', () => {
        const instance = new Grid();
        instance.renderingPadding = 0;
        instance.width = instance.height = 240;
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
        expect(instance.bodyLeft.rowsCount).toEqual(4);// 4 instead of 8 because of virtual nature of grid
        expect(instance.bodyRight.rowsCount).toEqual(4);

        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.bodyLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(3);
        expect(instance.bodyRight.columnsCount).toEqual(3);

        document.body.removeChild(instance.element);
    });
    it('Rows.Tree before columns', () => {
        const instance = new Grid();
        instance.renderingPadding = 0;
        instance.width = instance.height = 240;
        instance.frozenRows = 2;
        
        instance.data = treeSamples;
        instance.parentField = 'parent';
        instance.childrenField = 'children';

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

        birth.sort();
        birth.sortDesc();
        birth.unsort();
        birth.sort();
        birth.sortDesc();
        instance.unsort();

        expect(instance.frozenLeft.rowsCount).toEqual(2);
        expect(instance.frozenRight.rowsCount).toEqual(2);
        expect(instance.bodyLeft.rowsCount).toEqual(4);// 4 instead of 8 because of virtual nature of grid
        expect(instance.bodyRight.rowsCount).toEqual(4);

        expect(instance.frozenLeft.columnsCount).toEqual(4);
        expect(instance.bodyLeft.columnsCount).toEqual(4);
        expect(instance.frozenRight.columnsCount).toEqual(3);
        expect(instance.bodyRight.columnsCount).toEqual(3);

        document.body.removeChild(instance.element);
    });
    xit('Columns.Performance', () => {
        const instance = new Grid();
    });
    it('Editing.Inline', () => {
        const instance = new Grid();
        instance.width = instance.height = 300;
        instance.renderingPadding = 0;
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

        const amount = new ColumnNode();
        amount.field = amount.title = 'amount';
        amount.editor = new NumberField();
        instance.addColumnNode(amount);

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
        expect(instance.frozenRight.columnsCount).toEqual(4);
        expect(instance.bodyRight.columnsCount).toEqual(4);

        //document.body.removeChild(instance.element);
    });
    xit('Editing.Popup', () => {
        const instance = new Grid();
    });
    xit('Events', () => {
        const instance = new Grid();
    });
});
