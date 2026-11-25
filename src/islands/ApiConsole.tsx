import { useCallback, useMemo, useRef, useState } from 'react'
import type { ApiDict } from '../i18n/island'

type ApiT = ApiDict

export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export type Recipe = {
  id: string
  method: Method
  path: string
  title: string
  note: string
  auth: 'none' | 'token' | 'strip'
  body?: unknown
  resolvePath?: (ctx: Context) => string
  capture?: (data: any, ctx: Context) => Partial<Context>
  expect?: string
}

/**
 * Lo que una receta puede dejarle a la siguiente.
 *
 * La consola sirve a varios proyectos, así que aquí caben los identificadores
 * de todos: lo que no usa un proyecto se queda en null y no estorba.
 */
export type Context = {
  token: string | null
  productSlug: string | null
  variantId: string | null
  conversationId: string | null
}

type Outcome = {
  recipeId: string
  status: number | 'red'
  ms: number
  url: string
  method: Method
  sentAuth: boolean
  body: string
  error?: string
}


const statusTone = (status: number | 'red') => {
  if (status === 'red') return 'text-rose-alert'
  if (status < 300) return 'text-signal'
  if (status < 400) return 'text-wire'
  if (status < 500) return 'text-ember'
  return 'text-rose-alert'
}

const pretty = (value: unknown, truncated: string) => {
  const text = JSON.stringify(value, null, 2) ?? 'null'
  return text.length > 2600 ? `${text.slice(0, 2600)}\n${truncated}` : text
}

export default function ApiConsole({
  apiBase,
  recipes,
  t,
}: {
  apiBase: string
  recipes: Recipe[]
  t: ApiT
}) {
  const [outcomes, setOutcomes] = useState<Outcome[]>([])
  const [running, setRunning] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const ctxRef = useRef<Context>({
    token: null,
    productSlug: null,
    variantId: null,
    conversationId: null,
  })
  const [hasSession, setHasSession] = useState(false)

  const byId = useMemo(() => {
    const map = new Map<string, Outcome>()
    for (const outcome of outcomes) map.set(outcome.recipeId, outcome)
    return map
  }, [outcomes])

  const run = useCallback(async (recipe: Recipe) => {
    const ctx = ctxRef.current
    setRunning(recipe.id)

    const path = recipe.resolvePath ? recipe.resolvePath(ctx) : recipe.path
    const url = `${apiBase}${path}`
    const headers: Record<string, string> = { Accept: 'application/json' }
    const sentAuth = recipe.auth === 'token' && Boolean(ctx.token)
    if (sentAuth) headers.Authorization = `Bearer ${ctx.token}`

    let body: string | undefined
    if (recipe.body) {
      headers['Content-Type'] = 'application/json'
      const payload =
        recipe.id === 'add' ? { ...(recipe.body as object), variantId: ctx.variantId } : recipe.body
      body = JSON.stringify(payload)
    }

    const started = performance.now()
    try {
      const response = await fetch(url, { method: recipe.method, headers, body })
      const ms = Math.round(performance.now() - started)
      const text = await response.text()
      let parsed: unknown = text
      try {
        parsed = JSON.parse(text)
      } catch {
        /* la respuesta no era JSON; se muestra tal cual */
      }

      if (recipe.capture && response.ok) {
        const next = recipe.capture(parsed, ctx)
        ctxRef.current = { ...ctx, ...next }
        if (next.token !== undefined) setHasSession(Boolean(next.token))
      }

      setOutcomes((prev) => [
        ...prev.filter((o) => o.recipeId !== recipe.id),
        {
          recipeId: recipe.id,
          status: response.status,
          ms,
          url,
          method: recipe.method,
          sentAuth,
          body: pretty(parsed, t.truncated),
        },
      ])
      setOpenId(recipe.id)
    } catch (error) {
      setOutcomes((prev) => [
        ...prev.filter((o) => o.recipeId !== recipe.id),
        {
          recipeId: recipe.id,
          status: 'red',
          ms: Math.round(performance.now() - started),
          url,
          method: recipe.method,
          sentAuth,
          body: '',
          error: error instanceof Error ? error.message : t.unreachable,
        },
      ])
      setOpenId(recipe.id)
    } finally {
      setRunning(null)
    }
  }, [apiBase, t])

  const runAll = useCallback(async () => {
    for (const recipe of recipes) {
      await run(recipe)
    }
  }, [run, recipes])

  const reset = useCallback(() => {
    ctxRef.current = { token: null, productSlug: null, variantId: null, conversationId: null }
    setOutcomes([])
    setOpenId(null)
    setHasSession(false)
  }, [])

  return (
    <div className="panel overflow-hidden">
      <div className="panel-head flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-ink-300">
          <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
          <span className="text-ink-100">{t.title}</span>
          <span className="hidden text-ink-600 sm:inline">{apiBase}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 font-mono text-[0.7rem] ${
              hasSession
                ? 'border-signal/40 bg-signal/10 text-signal'
                : 'border-ink-700 text-ink-400'
            }`}
          >
            {t.session} {hasSession ? t.active : t.inactive}
          </span>
          <button
            type="button"
            onClick={runAll}
            disabled={running !== null}
            className="rounded-md bg-signal px-3 py-1.5 font-mono text-xs font-semibold text-ink-950 transition-opacity disabled:opacity-50"
          >
            {running ? t.running : t.runAll(recipes.length)}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-ink-700 px-3 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:border-ink-400 hover:text-ink-100"
          >
            {t.clear}
          </button>
        </div>
      </div>

      <ol className="divide-y divide-ink-800">
        {recipes.map((recipe, index) => {
          const outcome = byId.get(recipe.id)
          const isOpen = openId === recipe.id
          const expected =
            outcome && recipe.expect && String(outcome.status) === recipe.expect

          return (
            <li key={recipe.id}>
              <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="w-6 shrink-0 font-mono text-xs text-ink-600">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span
                  className={`w-14 shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-[0.7rem] font-semibold ${
                    recipe.method === 'GET'
                      ? 'bg-wire/15 text-wire'
                      : 'bg-ember/15 text-ember'
                  }`}
                >
                  {recipe.method}
                </span>

                <code className="min-w-0 flex-1 truncate font-mono text-xs text-ink-200">
                  {recipe.resolvePath
                    ? recipe.resolvePath(ctxRef.current)
                    : recipe.path}
                </code>

                {outcome && (
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : recipe.id)}
                    className="flex items-center gap-2 font-mono text-xs"
                  >
                    <span className={statusTone(outcome.status)}>
                      {outcome.status === 'red' ? t.noNetwork : outcome.status}
                    </span>
                    <span className="text-ink-600">{outcome.ms} ms</span>
                    {expected && <span className="text-signal">{t.expected}</span>}
                    <span className="text-ink-600">{isOpen ? '▾' : '▸'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => run(recipe)}
                  disabled={running !== null}
                  className="rounded-md border border-ink-700 px-2.5 py-1 font-mono text-[0.7rem] text-ink-300 transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
                >
                  {running === recipe.id ? '…' : t.run}
                </button>
              </div>

              <p className="px-4 pb-3 pl-[5.5rem] text-xs leading-relaxed text-ink-400">
                <span className="text-ink-200">{recipe.title}.</span> {recipe.note}
              </p>

              {isOpen && outcome && (
                <div className="border-t border-ink-800 bg-ink-950/60 px-4 py-3">
                  <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.7rem] text-ink-600">
                    <span>{outcome.url}</span>
                    <span>
                      Authorization: {outcome.sentAuth ? t.authSent : t.authNotSent}
                    </span>
                  </div>
                  {outcome.error ? (
                    <p className="font-mono text-xs leading-relaxed text-rose-alert">
                      {outcome.error}
                      <span className="mt-2 block text-ink-400">{t.errorHelp}</span>
                    </p>
                  ) : (
                    <pre className="max-h-72 overflow-auto font-mono text-[0.72rem] leading-relaxed text-ink-300">
                      <code>{outcome.body}</code>
                    </pre>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
