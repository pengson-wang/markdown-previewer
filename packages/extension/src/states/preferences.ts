import { BehaviorSubject, combineLatest } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, filter, take } from 'rxjs/operators'
import { $fromMsg } from './general'
import { Msg } from 'shared'

export interface PluginProps {
  readonly id: string
  readonly builtin?: boolean
  name: string
  url: string
  readonly createdAt: number | string
  updatedAt?: number | string
}

export type SelectedPlugin = string

export interface PreferencesProps {
  plugins: Record<string, PluginProps>
  selectedPlugin: SelectedPlugin
}

const builtInPlugins: Record<string, PluginProps> = {
  wx: {
    id: 'wx',
    builtin: true,
    name: 'wx format',
    url: 'https://raw.githubusercontent.com/pengson-wang/markdown-renderers/main/examples/gfm-renderer.umd.js',
    createdAt: '2022/07/10',
  },
}

export const plugins$ = new BehaviorSubject<Record<string, PluginProps>>(builtInPlugins)
export const selectedPlugin$ = new BehaviorSubject<string | null>('wx')

const loadedPrefenences$ = $fromMsg.pipe(
  filter(({ type: [, category] }) => category === Msg.Category.Preferences),
  filter(({ content }) => content !== null),
  map(({ content }) => content as PreferencesProps),
  distinctUntilChanged(),
  shareReplay(1),
  take(1)
)

loadedPrefenences$.subscribe((preferences) => {
  plugins$.next({ ...preferences.plugins, ...plugins$.value })
  selectedPlugin$.next(preferences.selectedPlugin ?? selectedPlugin$.value)
})

export const preferences$ = combineLatest([plugins$, selectedPlugin$]).pipe(
  map(([plugins, selectedPlugin]) => ({ plugins, selectedPlugin } as PreferencesProps)),
  distinctUntilChanged(),
  shareReplay(2)
)
