// Strings for the React islands (Playground / DemoFrame / ApiConsole).
// This module is bundled into the client, so functions are fine here — unlike
// props passed from Astro, nothing is JSON-serialized.

import type { Lang } from './ui'

export type IslandDict = {
  pg: {
    project: string
    more: string
    tablistLabel: string
    belowHeading: string
    belowLead: (n: number) => string
  }
  demo: {
    signInAs: string
    whatToTry: string
    reset: string
    newTab: string
    emptyTitle: string
    noCard: string
    slowPre: string
    slowLink: string
    slowPost: string
    frameTitle: (project: string, role: string) => string
  }
  api: {
    title: string
    session: string
    active: string
    inactive: string
    runAll: (n: number) => string
    running: string
    clear: string
    run: string
    expected: string
    noNetwork: string
    authSent: string
    authNotSent: string
    errorHelp: string
    unreachable: string
    truncated: string
  }
}

export type DemoDict = IslandDict['demo']
export type ApiDict = IslandDict['api']

export const island: Record<Lang, IslandDict> = {
  es: {
    pg: {
      project: 'proyecto',
      more: 'los demás entran aquí conforme se terminan',
      tablistLabel: 'Proyecto a probar',
      belowHeading: 'Y esto es lo que pasa por debajo',
      belowLead: (n) =>
        `Un iframe enseña el frontend. Esta consola enseña el backend: ${n} peticiones reales contra la misma API, encadenadas, con la respuesta tal como llega. Incluidas las que fallan a propósito.`,
    },
    demo: {
      signInAs: 'entrar como',
      whatToTry: 'qué probar',
      reset: 'Reiniciar',
      newTab: 'Pestaña nueva ↗',
      emptyTitle: 'La aplicación completa corre aquí dentro. Escoge con qué par de ojos quieres verla.',
      noCard: 'Sin registro, sin contraseña, sin tarjeta.',
      slowPre:
        'El servidor de demostración está tardando. Suele ser que estaba dormido y está levantando la base de datos. ',
      slowLink: 'Ábrelo en una pestaña',
      slowPost: ' si prefieres no esperar aquí.',
      frameTitle: (project, role) => `Demostración de ${project} como ${role}`,
    },
    api: {
      title: 'consola de API',
      session: 'sesión',
      active: 'activa',
      inactive: 'sin iniciar',
      runAll: (n) => `Correr los ${n} pasos`,
      running: 'corriendo…',
      clear: 'Limpiar',
      run: 'correr',
      expected: 'esperado',
      noNetwork: 'sin red',
      authSent: 'Bearer …',
      authNotSent: 'no enviado',
      errorHelp:
        'La demostración vive en un servidor aparte. Si está dormida o tu red la bloquea, esta consola lo dice en vez de fingir una respuesta.',
      unreachable: 'No se pudo alcanzar la API de demostración.',
      truncated: '… (recortado)',
    },
  },

  en: {
    pg: {
      project: 'project',
      more: 'the rest show up here as they ship',
      tablistLabel: 'Project to try',
      belowHeading: 'And this is what happens underneath',
      belowLead: (n) =>
        `An iframe shows the frontend. This console shows the backend: ${n} real requests against the same API, chained, with the response exactly as it arrives. Including the ones that fail on purpose.`,
    },
    demo: {
      signInAs: 'sign in as',
      whatToTry: 'what to try',
      reset: 'Reset',
      newTab: 'New tab ↗',
      emptyTitle: 'The whole app runs in here. Choose whose eyes you want to see it through.',
      noCard: 'No sign-up, no password, no card.',
      slowPre:
        'The demo server is taking a while. Usually it was asleep and is spinning the database back up. ',
      slowLink: 'Open it in a tab',
      slowPost: ' if you’d rather not wait here.',
      frameTitle: (project, role) => `${project} demo as ${role}`,
    },
    api: {
      title: 'API console',
      session: 'session',
      active: 'active',
      inactive: 'not started',
      runAll: (n) => `Run all ${n} steps`,
      running: 'running…',
      clear: 'Clear',
      run: 'run',
      expected: 'expected',
      noNetwork: 'no network',
      authSent: 'Bearer …',
      authNotSent: 'not sent',
      errorHelp:
        'The demo lives on a separate server. If it is asleep or your network blocks it, this console says so instead of faking a response.',
      unreachable: 'Could not reach the demo API.',
      truncated: '… (truncated)',
    },
  },
}
