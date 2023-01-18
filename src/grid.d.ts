import Widget from 'kenga/widget'
import KeyEvent from 'kenga/events/key-event'
import FocusEvent from 'kenga/events/focus-event'
import BlurEvent from 'kenga/events/blur-event'
import ItemEvent from 'kenga/events/item-event'
import WidgetEvent from 'kenga/events/widget-event'
import SortEvent from './events/sort-event'
import Column from './column'
import ColumnNode from './columns/column-node'

export default class Grid extends Widget {
  readonly columns: Column[]
  readonly selectionLead: any
  readonly selected: any[]
  readonly selectedCount: number
  stickySelection: boolean
  readonly rows: any[]
  readonly viewRows: any[]
  readonly treeIndicatorColumn: Column
  readonly columnNodesCount: number
  readonly columnsCount: number
  showHorizontalLines: boolean
  showVerticalLines: boolean
  showOddRowsInOtherColor: boolean
  rowsHeight: number
  linesColor: string
  renderingThrottle: number
  renderingPadding: number
  headerRowsHeight: number
  headerVisible: boolean
  header: ColumnNode[]
  columnsChevron: HTMLElement
  frozenColumns: number
  frozenRows: number
  draggableRows: boolean
  onHeaderChanged: (evt: WidgetEvent) => void
  onRender: (dataRow: any, viewCell: HTMLTableCellElement, viewRowIndex?: number, text?: string) => void
  onRowRender: (dataRow: any, viewRow: HTMLTableRowElement, viewRowIndex?: number) => void
  data: any[]
  field: string
  parentField: string
  childrenField: string
  indent: number
  cursorProperty: string
  editable: boolean
  deletable: boolean
  insertable: boolean
  focusedRow: number
  focusedColumn: number
  hasSelected: boolean
  insert(item: any): void
  deleteSelected(): void
  removed(items: any[]): void
  added(items: any[]): void
  changed(items: any[]): void
  isSelected(item: any): boolean
  setCursorOn(item: any, needRedraw?: boolean): void
  select(items: any[], needRedraw?: boolean): void
  selectAll(needRedraw?: boolean): void
  unselect(items: any[], needRedraw?: boolean): void
  unselectAll(needRedraw?: boolean): void
  depthOf(item: any): number
  expanded(item: any): boolean
  expandedChanged(): void
  expand(item: any | any[]): void
  collapse(item: any | any[]): void
  toggle(item: any | any[]): void
  isLeaf(item: any): boolean
  pathTo(item: any): any[]
  goTo(item: any, needToSelect?: boolean): boolean
  clearColumnsNodes(needRedraw?: boolean): void
  applyColumnsNodes(): void
  removeColumnNode(aNode: ColumnNode): boolean
  removeColumnNodeAt(anIndex: number): boolean
  addColumnNode(aNode: ColumnNode): void
  insertColumnNode(anIndex: number, aNode: ColumnNode): void
  showColumnsMenuRelativeTo(element: HTMLElement, horizontal?: boolean): void
  getColumnNode(anIndex: number): ColumnNode
  insertBeforeColumnNode(aNode: ColumnNode, insertBefore: ColumnNode): void
  insertAfterColumnNode(aNode: ColumnNode, insertAfter: ColumnNode): void
  redraw(): void
  redrawHeaders(): void
  redrawFooters(): void
  getColumn(anIndex: number): Column
  getCell(aRow: number, aCol: number): HTMLTableCellElement
  focusCell(aRow: number, aCol: number): void
  startEditing(blank?: boolean): void
  abortEditing(): void
  completeEditing(): void
  sort(): void
  addSortedColumn(column: Column): void
  removeSortedColumn(column: Column): void
  unsort(): void
  addExpandHandler(handler: (evt: ItemEvent) => void): { removeHandler: () => void }
  onExpand: (evt: ItemEvent) => void
  addCollapseHandler(handler: (evt: ItemEvent) => void): { removeHandler: () => void }
  onCollapse: (evt: ItemEvent) => void
  addSortHandler(handler: (evt: SortEvent) => void): { removeHandler: () => void }
  onSort: (evt: SortEvent) => void
  addSelectHandler(handler: (evt: ItemEvent) => void): { removeHandler: () => void }
  addFocusHandler(handler: (evt: FocusEvent) => void): { removeHandler: () => void }
  addFocusLostHandler(handler: (evt: BlurEvent) => void): { removeHandler: () => void }
  addKeyReleaseHandler(handler: (evt: KeyEvent) => void): { removeHandler: () => void }
  addKeyPressHandler(handler: (evt: KeyEvent) => void): { removeHandler: () => void }
  addKeyTypeHandler(handler: (evt: KeyEvent) => void): { removeHandler: () => void }
}
