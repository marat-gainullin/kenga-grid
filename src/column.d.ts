import Widget from 'kenga/widget'
import NodeView from './header/node-view'
import ColumnNode from './columns/column-node'

export default class Column {
  /**
   * Multiple 'col' elements for the single column, because of grid sections.
   */
  readonly elements: HTMLElement[]
  /**
   * Multiple 'headers' for the single column, because of splitted column nodes.
   */
  readonly headers: HTMLElement[]
  /**
   * Typically, we need only leaf column's header.
   * Leaf nodes' columns can have only single header, by nature.
   */
  readonly header: NodeView
  readonly node: ColumnNode

  field: string
  sortField: string
  sort(): void
  sortDesc(): void
  unsort(): void
  getValue(aItem: any): any
  setValue(aItem: any, value: any)

  padding: number
  width: number
  minWidth: number
  maxWidth: number
  visible: boolean
  readonly: boolean
  sortable: boolean
  switchable: boolean

  renderer: Widget
  editor: Widget

  onShow: (source: Column) => void
  onHide: (source: Column) => void
  onResize: (source: Column, oldWidth: number, newWidth: number) => void
  onRender: (dataRow: any, viewCell: HTMLTableCellElement, viewRowIndex?: number, text?: string) => void
  onHeaderRender: (view: NodeView, viewCell: HTMLTableCellElement) => void
}
