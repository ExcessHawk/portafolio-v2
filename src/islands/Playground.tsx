import { useRef, useState, type KeyboardEvent } from 'react'
import { getPlaygrounds } from '../data/playgrounds'
import { island } from '../i18n/island'
import type { Lang } from '../i18n/ui'
import ApiConsole from './ApiConsole'
import DemoFrame from './DemoFrame'

export default function Playground({ lang = 'es' }: { lang?: Lang }) {
  const playgrounds = getPlaygrounds(lang)
  const t = island[lang]
  const [slug, setSlug] = useState(playgrounds[0]!.slug)
  const actual = playgrounds.find((p) => p.slug === slug) ?? playgrounds[0]!
  const varios = playgrounds.length > 1

  // El rol `tablist` obliga a un modelo de teclado: las flechas mueven la
  // selección y el foco a la vez (selección sigue al foco). Sin esto, un lector
  // de pantalla anuncia "pestaña" pero las flechas no hacen nada.
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({})

  const onTabKey = (event: KeyboardEvent, index: number) => {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % playgrounds.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (index - 1 + playgrounds.length) % playgrounds.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = playgrounds.length - 1
    else return
    event.preventDefault()
    const nextSlug = playgrounds[next]!.slug
    setSlug(nextSlug)
    tabsRef.current[nextSlug]?.focus()
  }

  const panelId = 'playground-panel'
  const tabId = (s: string) => `playground-tab-${s}`

  return (
    <div className="space-y-5">
      <div
        className="flex flex-wrap items-center gap-2"
        role={varios ? 'tablist' : undefined}
        aria-label={varios ? t.pg.tablistLabel : undefined}
      >
        <span className="mr-1 font-mono text-xs text-ink-500">{t.pg.project}</span>

        {playgrounds.map((proyecto, index) => {
          const activo = proyecto.slug === actual.slug
          return (
            <button
              key={proyecto.slug}
              ref={(node) => {
                tabsRef.current[proyecto.slug] = node
              }}
              type="button"
              role={varios ? 'tab' : undefined}
              id={varios ? tabId(proyecto.slug) : undefined}
              aria-selected={varios ? activo : undefined}
              aria-controls={varios ? panelId : undefined}
              tabIndex={varios ? (activo ? 0 : -1) : undefined}
              onClick={() => setSlug(proyecto.slug)}
              onKeyDown={varios ? (event) => onTabKey(event, index) : undefined}
              className={`rounded-lg border px-3.5 py-2 text-left font-mono text-xs transition-colors ${
                activo
                  ? 'border-signal/40 bg-signal/10 text-signal'
                  : 'border-ink-700 text-ink-300 hover:border-ink-400 hover:text-ink-100'
              }`}
            >
              <span className="flex items-center gap-2">
                {activo && <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />}
                {proyecto.nombre}
              </span>
            </button>
          )
        })}

        <span className="font-mono text-xs text-ink-400">{t.pg.more}</span>
      </div>

      <div
        id={panelId}
        role={varios ? 'tabpanel' : undefined}
        aria-labelledby={varios ? tabId(actual.slug) : undefined}
        className="space-y-5"
      >
        <p className="max-w-2xl text-sm leading-relaxed text-ink-400">{actual.resumen}</p>

        {/* La clave remonta ambos al cambiar de proyecto: una sesión abierta o
            una respuesta en pantalla no deben sobrevivir al cambio. */}
        <DemoFrame
          key={`marco-${actual.slug}`}
          demoWeb={actual.demoWeb}
          roles={actual.roles}
          nota={actual.nota}
          nombre={actual.nombre}
          t={t.demo}
        />

        <div className="pt-11">
          <h3 className="mb-3 text-balance text-2xl font-semibold text-ink-100">
            {t.pg.belowHeading}
          </h3>
          <p className="mb-6 max-w-2xl leading-relaxed text-ink-400">{t.pg.belowLead(actual.recipes.length)}</p>

          <ApiConsole
            key={`consola-${actual.slug}`}
            apiBase={actual.apiBase}
            recipes={actual.recipes}
            t={t.api}
          />
        </div>
      </div>
    </div>
  )
}
