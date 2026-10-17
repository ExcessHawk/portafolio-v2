import { useCallback, useMemo, useRef, useState } from 'react'

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

type Recipe = {
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

type Context = {
  token: string | null
  productSlug: string | null
  variantId: string | null
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

const API_BASE = (
  import.meta.env.PUBLIC_DEMO_API ?? 'http://localhost:3102'
).replace(/\/$/, '')


const FOREIGN_ORDER_ID = '3f2b9a1c-7d84-4e26-9b05-2a6c18f4e7d3'

const recipes: Recipe[] = [
  {
    id: 'categories',
    method: 'GET',
    path: '/api/categories',
    title: 'Listar categorías',
    note: 'Ruta pública. Sin sesión, sin encabezados especiales.',
    auth: 'none',
  },
  {
    id: 'search',
    method: 'GET',
    path: '/api/products?q=talavera&limit=3',
    title: 'Buscar "talavera"',
    note: 'Búsqueda de texto completo en PostgreSQL. La columna de búsqueda es generada y pasa por unaccent, así que "piñata" y "pinata" caen en el mismo lugar.',
    auth: 'none',
    capture: (data) => ({
      productSlug: data?.items?.[0]?.slug ?? null,
    }),
  },
  {
    id: 'product',
    method: 'GET',
    path: '/api/products/:slug',
    title: 'Abrir la ficha del primer resultado',
    note: 'El slug sale de la respuesta anterior: la consola encadena peticiones reales.',
    auth: 'none',
    resolvePath: (ctx) => `/api/products/${ctx.productSlug ?? 'sin-resultado'}`,
    capture: (data) => ({
      variantId: data?.variants?.[0]?.id ?? null,
    }),
  },
  {
    id: 'cart-401',
    method: 'GET',
    path: '/api/cart',
    title: 'Pedir el carrito sin sesión',
    note: 'El guard corta antes de que la petición toque la base de datos.',
    auth: 'strip',
    expect: '401',
  },
  {
    id: 'login',
    method: 'POST',
    path: '/api/demo/session',
    title: 'Pedir una sesión de comprador',
    note: 'La demostración entrega la sesión sin contraseña, y solo porque corre con DEMO_MODE encendido. En la API normal ese endpoint no existe: responde 404.',
    auth: 'none',
    body: { role: 'comprador' },
    capture: (data) => ({ token: data?.tokens?.accessToken ?? null }),
  },
  {
    id: 'cart',
    method: 'GET',
    path: '/api/cart',
    title: 'Pedir el carrito, ya con sesión',
    note: 'Mismo endpoint que falló hace dos pasos. Ahora responde, y el total trae el envío por separado.',
    auth: 'token',
  },
  {
    id: 'add',
    method: 'POST',
    path: '/api/cart/items',
    title: 'Agregar una pieza al carrito',
    note: 'El precio se congela al momento de agregar. Si la tienda sube el precio después, se cobra el menor de los dos.',
    auth: 'token',
    body: { quantity: 1 },
    resolvePath: () => '/api/cart/items',
  },
  {
    id: 'seller-403',
    method: 'GET',
    path: '/api/seller/sales',
    title: 'Asomarse al panel de vendedor',
    note: 'La sesión es de comprador y el panel pide rol de vendedor. El guard corta en la puerta, antes del handler.',
    auth: 'token',
    expect: '403',
  },
  {
    id: 'order-404',
    method: 'GET',
    path: '/api/orders/:ajeno',
    title: 'Pedir un pedido que no es tuyo',
    note: 'Aquí sí hay recurso de por medio, y la respuesta es 404. Un pedido de otra persona contesta lo mismo que un id inventado: un 403 delataría que ese pedido existe.',
    auth: 'token',
    resolvePath: () => `/api/orders/${FOREIGN_ORDER_ID}`,
    expect: '404',
  },
]

const statusTone = (status: number | 'red') => {
  if (status === 'red') return 'text-rose-alert'
  if (status < 300) return 'text-signal'
  if (status < 400) return 'text-wire'
  if (status < 500) return 'text-ember'
  return 'text-rose-alert'
}

const pretty = (value: unknown) => {
  const text = JSON.stringify(value, null, 2) ?? 'null'
  return text.length > 2600 ? `${text.slice(0, 2600)}\n… (recortado)` : text
}

export default function ApiConsole() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([])
  const [running, setRunning] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const ctxRef = useRef<Context>({ token: null, productSlug: null, variantId: null })
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
    const url = `${API_BASE}${path}`
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
          body: pretty(parsed),
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
          error:
            error instanceof Error
              ? error.message
              : 'No se pudo alcanzar la API de demostración.',
        },
      ])
      setOpenId(recipe.id)
    } finally {
      setRunning(null)
    }
  }, [])

  const runAll = useCallback(async () => {
    for (const recipe of recipes) {
      await run(recipe)
    }
  }, [run])

  const reset = useCallback(() => {
    ctxRef.current = { token: null, productSlug: null, variantId: null }
    setOutcomes([])
    setOpenId(null)
    setHasSession(false)
  }, [])

  return (
    <div className="panel overflow-hidden">
      <div className="panel-head flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-ink-300">
          <span className="size-2 rounded-full bg-signal" aria-hidden="true" />
          <span className="text-ink-100">consola de API</span>
          <span className="hidden text-ink-600 sm:inline">{API_BASE}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 font-mono text-[0.7rem] ${
              hasSession
                ? 'border-signal/40 bg-signal/10 text-signal'
                : 'border-ink-700 text-ink-400'
            }`}
          >
            sesión {hasSession ? 'activa' : 'sin iniciar'}
          </span>
          <button
            type="button"
            onClick={runAll}
            disabled={running !== null}
            className="rounded-md bg-signal px-3 py-1.5 font-mono text-xs font-semibold text-ink-950 transition-opacity disabled:opacity-50"
          >
            {running ? 'corriendo…' : 'Correr los 9 pasos'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-ink-700 px-3 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:border-ink-400 hover:text-ink-100"
          >
            Limpiar
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
                      {outcome.status === 'red' ? 'sin red' : outcome.status}
                    </span>
                    <span className="text-ink-600">{outcome.ms} ms</span>
                    {expected && <span className="text-signal">esperado</span>}
                    <span className="text-ink-600">{isOpen ? '▾' : '▸'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => run(recipe)}
                  disabled={running !== null}
                  className="rounded-md border border-ink-700 px-2.5 py-1 font-mono text-[0.7rem] text-ink-300 transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
                >
                  {running === recipe.id ? '…' : 'correr'}
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
                      Authorization: {outcome.sentAuth ? 'Bearer …' : 'no enviado'}
                    </span>
                  </div>
                  {outcome.error ? (
                    <p className="font-mono text-xs leading-relaxed text-rose-alert">
                      {outcome.error}
                      <span className="mt-2 block text-ink-400">
                        La demostración vive en un servidor aparte. Si está dormida o tu red la
                        bloquea, esta consola lo dice en vez de fingir una respuesta.
                      </span>
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
