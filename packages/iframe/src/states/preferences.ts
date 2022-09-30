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
  highlight: string
  readonly createdAt: number | string
  cover: string
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
    url: 'https://github.com/pengson-wang/markdown-css-themes/blob/main/themes/github.css',
    highlight: 'github.css',
    cover: '#26181b',
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

export function enablePlugin(id?: string | null) {
  selectedPlugin$.next(id ?? null)
}

export function createPlugin({ name, url, cover, highlight }: Pick<PluginProps, 'name' | 'url' | 'cover' | 'highlight'>) {
  const plugin = { id: md5(url), name, url, cover, highlight: highlight, createdAt: Date.now() }
  plugins$.next({ ...plugins$.value, [plugin.id]: plugin })
  return plugin.id
}

interface ImportOptions {
  replaceExists?: boolean
}

export function importPlugins(
  plugins: Record<string, Pick<PluginProps, 'id' | 'name' | 'url' | 'cover' | 'highlight'>>,
  options?: ImportOptions
) {
  const myPlugins: Record<string, PluginProps> = {}
  for (const id in plugins) {
    myPlugins[id] = { ...plugins[id], createdAt: Date.now() }
  }
  if (options?.replaceExists) {
    plugins$.next({ ...plugins$.value, ...myPlugins })
  } else {
    plugins$.next({ ...myPlugins, ...plugins$.value })
  }
}

export function getPlugin(id: string) {
  return plugins$.getValue()[id]
}

function updatePlugins(plugins: Record<string, PluginProps>) {
  plugins$.next(plugins)
}

export function updatePlugin(id: string, { name, url, cover, highlight }: Pick<PluginProps, 'name' | 'url' | 'cover' | 'highlight'>) {
  const plugin = { ...getPlugin(id), ...{ name, url, cover, highlight, updatedAt: Date.now() } }
  updatePlugins({ ...plugins$.getValue(), [id]: plugin })
}

export function removePlugin(id: string) {
  const plugins = plugins$.getValue()
  const plugin = plugins[id]
  if (plugin && !plugin.builtin) {
    const all = plugins$.getValue()
    delete all[id]
    updatePlugins(all)
    if (selectedPlugin$.getValue() === id) {
      enablePlugin(null)
    }
  }
}
