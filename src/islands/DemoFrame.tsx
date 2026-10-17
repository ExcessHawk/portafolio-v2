import { useEffect, useRef, useState } from 'react'

export type Role = {
  id: 'comprador' | 'vendedor' | 'admin'
  label: string
  account: string
  blurb: string
  tryThis: string[]
}


export default function DemoFrame({
  demoWeb,
  roles,
  nota,
}: {
  demoWeb: string
  roles: Role[]
  nota: string
}) {
  const [role, setRole] = useState<Role>(roles[0]!)
  const [started, setStarted] = useState(false)
  const [slow, setSlow] = useState(false)
  const [nonce, setNonce] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const src = `${demoWeb}/demo?rol=${role.id}&n=${nonce}`

  useEffect(() => {
    if (!started) return
    setSlow(false)
    timerRef.current = setTimeout(() => setSlow(true), 9000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [started, role.id, nonce])

  const onLoaded = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setSlow(false)
  }

  const start = (next: Role) => {
    setRole(next)
    setStarted(true)
    setNonce((n) => n + 1)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <aside className="space-y-4">
        <div className="panel overflow-hidden">
          <p className="panel-head px-4 py-2.5 font-mono text-xs text-ink-300">entrar como</p>
          <ul className="divide-y divide-ink-800">
            {roles.map((item) => {
              const active = item.id === role.id && started
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => start(item)}
                    className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors ${
                      active ? 'bg-signal/10' : 'hover:bg-ink-850'
                    }`}
                  >
                    <span
                      className={`font-mono text-sm ${active ? 'text-signal' : 'text-ink-100'}`}
                    >
                      {item.label}
                    </span>
                    <span className="font-mono text-[0.7rem] text-ink-500">{item.account}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="panel p-4">
          <p className="mb-2 font-mono text-xs text-ink-300">qué probar</p>
          <p className="mb-3 text-xs leading-relaxed text-ink-400">{role.blurb}</p>
          <ul className="space-y-2">
            {role.tryThis.map((step) => (
              <li key={step} className="flex gap-2 text-xs leading-relaxed text-ink-300">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                {step}
              </li>
            ))}
          </ul>
        </div>

        <p className="rounded-lg border border-ink-800 bg-ink-900 p-3 text-[0.7rem] leading-relaxed text-ink-500">
{nota}
        </p>
      </aside>

      <div className="panel overflow-hidden">
        <div className="panel-head flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-rose-alert/70" />
              <span className="size-2.5 rounded-full bg-ember/70" />
              <span className="size-2.5 rounded-full bg-signal/70" />
            </span>
            <code className="truncate font-mono text-[0.7rem] text-ink-500">
              {demoWeb}/demo?rol={role.id}
            </code>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNonce((n) => n + 1)}
              disabled={!started}
              className="rounded border border-ink-700 px-2.5 py-1 font-mono text-[0.7rem] text-ink-300 transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
            >
              Reiniciar
            </button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-ink-700 px-2.5 py-1 font-mono text-[0.7rem] text-ink-300 transition-colors hover:border-signal hover:text-signal"
            >
              Pestaña nueva ↗
            </a>
          </div>
        </div>

        <div className="relative aspect-[16/11] w-full bg-ink-950">
          {started ? (
            <iframe
              key={`${role.id}-${nonce}`}
              src={src}
              title={`Demostración del marketplace como ${role.label.toLowerCase()}`}
              onLoad={onLoaded}
              loading="lazy"
              className="size-full border-0"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-5 px-6 text-center">
              <p className="max-w-md text-balance text-lg leading-relaxed text-ink-200">
                La aplicación completa corre aquí dentro. Escoge con qué par de ojos quieres verla.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {roles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => start(item)}
                    className="rounded-lg bg-signal px-4 py-2 font-mono text-sm font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="font-mono text-[0.7rem] text-ink-600">
                Sin registro, sin contraseña, sin tarjeta.
              </p>
            </div>
          )}

          {started && slow && (
            <div className="absolute inset-x-0 bottom-0 border-t border-ink-700 bg-ink-900/95 px-4 py-3 text-xs leading-relaxed text-ink-300">
              El servidor de demostración está tardando. Suele ser que estaba dormido y está
              levantando la base de datos.{' '}
              <a href={src} target="_blank" rel="noopener noreferrer" className="text-signal underline underline-offset-4">
                Ábrelo en una pestaña
              </a>{' '}
              si prefieres no esperar aquí.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
