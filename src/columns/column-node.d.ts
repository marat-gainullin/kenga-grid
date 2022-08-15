import Widget from 'kenga/widget'
import Column from '../column'
import NodeView from '../header/node-view'

export default class ColumnNode {
  name: string
  renderer: Widget
  editor: Widget
  column: Column
  parent: ColumnNode
  readonly chlidren: ColumnNode[]
  copy(): ColumnNode
  view: NodeView
  width: number
  minWidth: number
  maxWidth: number
  field: string
  sortField: string
  title: string
  resizable: boolean
  moveable: boolean
  visible: boolean
  readonly: boolean
  sortable: boolean
  switchable: boolean
  removeColumnNode(aNode: ColumnNode, applyOnGrid?: boolean): boolean
  removeColumnNodeAt(atIndex: number, applyOnGrid?: boolean): boolean
  addColumnNode(aNode: ColumnNode, applyOnGrid?: boolean): void
  insertColumnNode(atIndex: number, aNode: ColumnNode, applyOnGrid?: boolean): void
  sort(): void
  sortDesc(): void
  unsort(): void

  onShow: (source: Column) => void
  onHide: (source: Column) => void
  onResize: (source: Column, oldWidth: number, newWidth: number) => void
  onRender: (dataRow: any, viewCell: HTMLTableCellElement, viewRowIndex?: number, text?: string) => void
  onHeaderRender: (view: NodeView, viewCell: HTMLTableCellElement) => void
}
