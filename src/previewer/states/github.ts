import { ReplaySubject, combineLatest, BehaviorSubject } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'
import { $path, $owner, $repo } from './general'
import { getBranches, Branch } from 'previewer/services/github'

const owner = new BehaviorSubject<string>('')
$owner.subscribe(owner)
const repo = new BehaviorSubject<string>('')
$repo.subscribe(repo)

const $branches = new ReplaySubject<Branch[]>(1)

combineLatest([owner, repo])
  .pipe(
    filter(([owner, repo]) => !!owner && !!repo),
    map(([owner, repo]) => `${owner}/${repo}`)
  )
  .subscribe((op) => {
    ;(async () => {
      try {
        const branches = await getBranches(op)
        $branches.next(branches)
      } catch (err) {
        console.error('failed to list branches')
        console.error(err)
      }
    })()
  })

// const $tree = new ReplaySubject<Map<string, TreeNode>>(1)

// ;(async () => {
//   const tree = await getTree()
//   const map = new Map(tree.map((node) => [node.path, node]))
//   $tree.next(map)
// })()

interface NameTree {
  [p: string]: NameTree
}

const $branchNames = $branches.pipe(
  filter((branches) => Boolean(branches) && branches.length > 0),
  map((branches) => branches.map((branch) => branch.name)),
  tap((names) => {
    console.log(`branch list:\n`)
    console.log(names)
  }),
  map((names) =>
    names.reduce((a, c) => {
      const segments = c.split('/').filter((p) => p)
      let current = a
      for (let segName of segments) {
        if (!current[segName]) {
          current[segName] = {}
        }
        current = current[segName]
      }
      return a
    }, {} as NameTree)
  ),
  tap((nameTree) => console.log(nameTree))
)

// file path is the path without branch
const $branch = combineLatest([$branchNames, $path]).pipe(
  tap(([branchNames, path]) => {
    console.log('Start log $branch...\nbranchNames:\n')
    console.log(branchNames)
    console.log(`path=${path}`)
    console.log('End log $branch')
  }),
  map(([branchNames, path]) => {
    // find the longest match from branch name to path, and that's is the current working branch

    const pathSegs = path.split('/').filter((p) => p)
    let i = 0

    let branchSegs: string[] = []
    let nameTree = branchNames
    while (nameTree[pathSegs[i]]) {
      branchSegs.push(pathSegs[i])
      i++
    }
    return branchSegs.join('/')
  })
)

const $fileRelativePath = combineLatest([$path, $branch]).pipe(map(([path, branch]) => path.replace(`${branch}/`, '')))

const $filePath = combineLatest([$path, $branch]).pipe(map(([path, branch]) => path.replace(`${branch}`, '')))

export { $branchNames, $branch, $fileRelativePath, $filePath }
