import { BehaviorSubject, combineLatest } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, filter, take } from 'rxjs/operators'
import { $fromMsg } from './general'
import { Msg } from 'shared'
import md5 from 'md5'

export interface PluginProps {
  readonly id: string
  readonly builtin?: boolean
  name: string
  url: string
  readonly createdAt: number | string
  cover?: string
  updatedAt?: number | string
}

export type SelectedPlugin = string

export interface PreferencesProps {
  plugins: Record<string, PluginProps>
  selectedPlugin: SelectedPlugin
}

const builtInPlugins: Record<string, PluginProps> = {
  github: {
    id: 'github',
    builtin: true,
    name: 'github',
    url: 'https://raw.githubusercontent.com/pengson-wang/markdown-css-themes/main/themes/github.css',
    cover: '#000',
    createdAt: '2022/07/10',
  },
}

const plugins$ = new BehaviorSubject<Record<string, PluginProps>>(builtInPlugins)
const selectedPlugin$ = new BehaviorSubject<string | null>('wx')

export const pluginsObservable = plugins$.asObservable()
export const selectedPluginObservable = selectedPlugin$.asObservable()

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

export function enablePlugin(id?: string) {
  selectedPlugin$.next(id ?? null)
}

export function createPlugin({ name, url, cover }: Pick<PluginProps, 'name' | 'url' | 'cover'>) {
  const plugin = { id: md5(url), name, url, cover, createdAt: Date.now() }
  plugins$.next({ ...plugins$.value, [plugin.id]: plugin })
}

export function getPlugin(id: string) {
  return plugins$.getValue()[id]
}

function updatePlugins(plugins: Record<string, PluginProps>) {
  plugins$.next(plugins)
}

export function updatePlugin(id: string, { name, url }: Pick<PluginProps, 'name' | 'url'>) {
  const plugin = { ...getPlugin(id), ...{ name, url, updatedAt: Date.now() } }
  updatePlugins({ ...plugins$.getValue(), [id]: plugin })
}

export function removePlugin(id: string) {
  const plugins = plugins$.getValue()
  const plugin = plugins[id]
  if (plugin && !plugin.builtin) {
    const all = plugins$.getValue()
    delete all[id]
    updatePlugins(all)
  }
}
