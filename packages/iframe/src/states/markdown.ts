/**
 * resolved markdown, such as replace relative path of image as public url
 */

import { $input } from './general'
import { $filePath } from './github'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { $owner, $repo } from './general'
import { $branch } from './github'
import { getProcessor } from 'utils/markdown'

const pwd$ = $filePath.pipe(map((filePath) => filePath?.substring(0, filePath.lastIndexOf('/') + 1) as string))

const processor$ = combineLatest([$owner, $repo, $branch, pwd$]).pipe(
  map(([owner, repo, branch, pwd]) => getProcessor({ owner, repo, branch, pwd }))
)

const markdownChildren$ = new BehaviorSubject<any>(null)

combineLatest([$input, processor$]).subscribe(([input, processor]) => {
  const { result } = processor.processSync(input)
  //@ts-ignore
  const children = result.props.children
  markdownChildren$.next(children)
})

export default markdownChildren$
