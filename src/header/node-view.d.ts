import Column from '../column'
import ColumnNode from '../columns/column-node'

export default class NodeView {
  readonly element: HTMLTableCellElement
  readonly title: string
  readonly mover: HTMLElement
  readonly resizer: HTMLElement
  text: string
  readonly column: Column
  readonly columnNode: ColumnNode
  resizable: boolean
  moveable: boolean
  sortable: boolean
}
