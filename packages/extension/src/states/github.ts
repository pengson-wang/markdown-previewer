import { ReplaySubject } from 'rxjs'
import { getTree, getBranches, TreeNode, Branch } from 'services/github'

const $branches = new ReplaySubject<Branch[]>(1)

;(async () => {
  try {
    const branches = await getBranches()
    $branches.next(branches)
  } catch (err) {
    console.warn('Failed to get the branch list')
  }
})()

const $tree = new ReplaySubject<Map<string, TreeNode>>(1)

;(async () => {
  const tree = await getTree()
  const map = new Map(tree.map((node) => [node.path, node]))
  $tree.next(map)
})()

export { $tree, $branches }
