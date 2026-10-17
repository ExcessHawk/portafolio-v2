import { useState } from 'react'
import { playgrounds } from '../data/playgrounds'
import ApiConsole from './ApiConsole'
import DemoFrame from './DemoFrame'

export default function Playground() {
  const [slug, setSlug] = useState(playgrounds[0]!.slug)
  const actual = playgrounds.find((p) => p.slug === slug) ?? playgrounds[0]!
  const varios = playgrounds.length > 1

  return (
    <div className="space-y-5">
      <div
        className="flex flex-wrap items-center gap-2"
        role={varios ? 'tablist' : undefined}
        aria-label={varios ? 'Proyecto a probar' : undefined}
      >
        <span className="mr-1 font-mono text-xs text-ink-500">proyecto</span>

        {playgrounds.map((proyecto) => {
          const activo = proyecto.slug === actual.slug
          return (
            <button
              key={proyecto.slug}
              type="button"
              role={varios ? 'tab' : undefined}
              aria-selected={varios ? activo : undefined}
              onClick={() => setSlug(proyecto.slug)}
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

        <span className="font-mono text-xs text-ink-600">
          los demás entran aquí conforme se terminan
        </span>
      </div>

      <p className="max-w-2xl text-sm leading-relaxed text-ink-400">{actual.resumen}</p>

      {/* La clave remonta ambos al cambiar de proyecto: una sesión abierta o
          una respuesta en pantalla no deben sobrevivir al cambio. */}
      <DemoFrame
        key={`marco-${actual.slug}`}
        demoWeb={actual.demoWeb}
        roles={actual.roles}
        nota={actual.nota}
      />

      <div className="pt-11">
        <h3 className="mb-3 text-balance text-2xl font-semibold text-ink-100">
          Y esto es lo que pasa por debajo
        </h3>
        <p className="mb-6 max-w-2xl leading-relaxed text-ink-400">
          Un iframe enseña el frontend. Esta consola enseña el backend:{' '}
          {actual.recipes.length} peticiones reales contra la misma API, encadenadas, con la
          respuesta tal como llega. Incluidas las que fallan a propósito.
        </p>

        <ApiConsole
          key={`consola-${actual.slug}`}
          apiBase={actual.apiBase}
          recipes={actual.recipes}
        />
      </div>
    </div>
  )
}
