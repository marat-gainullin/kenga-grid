# Kenga virtual grid
Kenga interactive virtual grid. Frozen rows and columns, treegrid, hierarchical header, etc.

## Install
To install `kenga-grid` package to your project, type the following command:
`npm install kenga-grid --save`

## Using
To use grid, you can write something like this: 

```
const g = new Grid();
g.data = orders;
const numColNode = new OrderNumServiceColumnNode();
const selectColNode = new CheckServiceColumnNode();
g.addColumnNode(numColNode);
g.addColumnNode(selectColNode);

const colCustomerName = new ColumnNode();
colCustomerName.field = 'customer.name';
g.addColumnNode(colCustomerName);
const colCustomerPhone = new ColumnNode();
colCustomerPhone.field = 'customer.phone';
g.addColumnNode(colCustomerPhone);
const colPaidOrder = new ColumnNode();
colPaidOrder.field = 'paid';
g.addColumnNode(colPaidOrder);
```

`Grid` contains useful methods like `Grid.goTo(aDataRow)`, `Grid.select(aDataRow)`, `Grid.unselect(aDataRow)`

## Architecture
`Grid` is a data bound widget, pesenting and editing data rows array.
Grid have data binding properties `data` and `field`.

`field` property consists of property path pointing to data rows array that should be presented and edited by the grid.
If `field` is not assigned, then value of `data` property is treated as data rows array.

Grid supports multi column sorting, multi line hierarchical columns headers, vritual scrolling, frozen columns and rows and so on.

It can be turned into tree grid if you assign `parentField` and `childrenField` properties.
It assigns special cursor property of data rows array to last selected data row.

Cursor property name can be customized with grid's `cursorProperty`.
