import type { Recipe } from '../islands/ApiConsole'
import type { Role } from '../islands/DemoFrame'
import type { Lang } from '../i18n/ui'

export type Playground = {
  slug: string
  nombre: string
  resumen: string
  demoWeb: string
  apiBase: string
  roles: Role[]
  recipes: Recipe[]
  nota: string
}

// Localized string / string-array. The recipe functions (resolvePath, capture)
// and the ids/methods/paths are language-neutral and stay shared; only the
// visible copy is translated, then flattened by `getPlaygrounds(lang)`.
type L = { es: string; en: string }
type LArr = { es: string[]; en: string[] }

type SrcRole = Omit<Role, 'label' | 'blurb' | 'tryThis'> & {
  label: L
  blurb: L
  tryThis: LArr
}
type SrcRecipe = Omit<Recipe, 'title' | 'note'> & { title: L; note: L }
type SrcPlayground = Omit<Playground, 'nombre' | 'resumen' | 'nota' | 'roles' | 'recipes'> & {
  nombre: L
  resumen: L
  nota: L
  roles: SrcRole[]
  recipes: SrcRecipe[]
}

const FOREIGN_ORDER_ID = '3f2b9a1c-7d84-4e26-9b05-2a6c18f4e7d3'

const marketplaceRecipes: SrcRecipe[] = [
  {
    id: 'categories',
    method: 'GET',
    path: '/api/categories',
    title: { es: 'Listar categorías', en: 'List categories' },
    note: {
      es: 'Ruta pública. Sin sesión, sin encabezados especiales.',
      en: 'Public route. No session, no special headers.',
    },
    auth: 'none',
  },
  {
    id: 'search',
    method: 'GET',
    path: '/api/products?q=talavera&limit=3',
    title: { es: 'Buscar "talavera"', en: 'Search "talavera"' },
    note: {
      es: 'Búsqueda de texto completo en PostgreSQL. La columna de búsqueda es generada y pasa por unaccent, así que "piñata" y "pinata" caen en el mismo lugar.',
      en: 'Full-text search in PostgreSQL. The search column is generated and runs through unaccent, so "piñata" and "pinata" land in the same place.',
    },
    auth: 'none',
    capture: (data) => ({ productSlug: data?.items?.[0]?.slug ?? null }),
  },
  {
    id: 'product',
    method: 'GET',
    path: '/api/products/:slug',
    title: { es: 'Abrir la ficha del primer resultado', en: 'Open the first result' },
    note: {
      es: 'El slug sale de la respuesta anterior: la consola encadena peticiones reales.',
      en: 'The slug comes from the previous response: the console chains real requests.',
    },
    auth: 'none',
    resolvePath: (ctx) => `/api/products/${ctx.productSlug ?? 'sin-resultado'}`,
    capture: (data) => ({ variantId: data?.variants?.[0]?.id ?? null }),
  },
  {
    id: 'cart-401',
    method: 'GET',
    path: '/api/cart',
    title: { es: 'Pedir el carrito sin sesión', en: 'Ask for the cart with no session' },
    note: {
      es: 'El guard corta antes de que la petición toque la base de datos.',
      en: 'The guard cuts in before the request touches the database.',
    },
    auth: 'strip',
    expect: '401',
  },
  {
    id: 'login',
    method: 'POST',
    path: '/api/demo/session',
    title: { es: 'Pedir una sesión de comprador', en: 'Ask for a buyer session' },
    note: {
      es: 'La demostración entrega la sesión sin contraseña, y solo porque corre con DEMO_MODE encendido. En la API normal ese endpoint no existe: responde 404.',
      en: "The demo hands out the session with no password, and only because it runs with DEMO_MODE on. In the normal API that endpoint doesn't exist: it returns 404.",
    },
    auth: 'none',
    body: { role: 'comprador' },
    capture: (data) => ({ token: data?.tokens?.accessToken ?? null }),
  },
  {
    id: 'cart',
    method: 'GET',
    path: '/api/cart',
    title: { es: 'Pedir el carrito, ya con sesión', en: 'Ask for the cart, now with a session' },
    note: {
      es: 'Mismo endpoint que falló hace dos pasos. Ahora responde, y el total trae el envío por separado.',
      en: 'Same endpoint that failed two steps ago. Now it answers, and the total breaks out shipping separately.',
    },
    auth: 'token',
  },
  {
    id: 'add',
    method: 'POST',
    path: '/api/cart/items',
    title: { es: 'Agregar una pieza al carrito', en: 'Add an item to the cart' },
    note: {
      es: 'El precio se congela al momento de agregar. Si la tienda sube el precio después, se cobra el menor de los dos.',
      en: "The price is frozen when you add it. If the store raises the price later, you're charged the lower of the two.",
    },
    auth: 'token',
    body: { quantity: 1 },
    resolvePath: () => '/api/cart/items',
  },
  {
    id: 'seller-403',
    method: 'GET',
    path: '/api/seller/sales',
    title: { es: 'Asomarse al panel de vendedor', en: 'Peek at the seller panel' },
    note: {
      es: 'La sesión es de comprador y el panel pide rol de vendedor. El guard corta en la puerta, antes del handler.',
      en: 'The session is a buyer’s and the panel requires the seller role. The guard cuts at the door, before the handler.',
    },
    auth: 'token',
    expect: '403',
  },
  {
    id: 'order-404',
    method: 'GET',
    path: '/api/orders/:ajeno',
    title: { es: 'Pedir un pedido que no es tuyo', en: "Ask for an order that isn't yours" },
    note: {
      es: 'Aquí sí hay recurso de por medio, y la respuesta es 404. Un pedido de otra persona contesta lo mismo que un id inventado: un 403 delataría que ese pedido existe.',
      en: "Here there is a resource, and the answer is 404. Someone else's order replies the same as a made-up id: a 403 would reveal that the order exists.",
    },
    auth: 'token',
    resolvePath: () => `/api/orders/${FOREIGN_ORDER_ID}`,
    expect: '404',
  },
]

const marketplaceRoles: SrcRole[] = [
  {
    id: 'comprador',
    label: { es: 'Comprador', en: 'Buyer' },
    account: 'comprador@demo.marketplace.mx',
    blurb: {
      es: 'Entras como alguien que viene a comprar artesanía. El catálogo, el carrito y el checkout son los de verdad.',
      en: 'You come in as someone shopping for handicrafts. The catalog, the cart and the checkout are the real ones.',
    },
    tryThis: {
      es: [
        'Busca "talavera" y mete algo al carrito.',
        'Pasa por el checkout y paga con el proveedor de prueba.',
        'Marca el pedido como recibido y deja una reseña.',
        'Abre el chat del pedido y escríbele a la tienda.',
      ],
      en: [
        'Search "talavera" and add something to the cart.',
        'Go through checkout and pay with the test provider.',
        'Mark the order as received and leave a review.',
        'Open the order chat and message the store.',
      ],
    },
  },
  {
    id: 'vendedor',
    label: { es: 'Vendedor', en: 'Seller' },
    account: 'vendedor@demo.marketplace.mx',
    blurb: {
      es: 'El panel de una tienda aprobada. Publica piezas, fija el costo de envío y despacha lo que te compren.',
      en: 'The panel of an approved store. Publish items, set shipping cost, and fulfill what people buy.',
    },
    tryThis: {
      es: [
        'Publica un producto con una variante y su stock.',
        'Ajusta las tarifas de envío por kilo y el mínimo para envío gratis.',
        'Marca una venta como enviada y mira cómo se libera el pago.',
        'Contesta el mensaje que dejó el comprador.',
      ],
      en: [
        'Publish a product with a variant and its stock.',
        'Set the per-kilo shipping rates and the free-shipping threshold.',
        'Mark a sale as shipped and watch the payout release.',
        'Reply to the message the buyer left.',
      ],
    },
  },
  {
    id: 'admin',
    label: { es: 'Administrador', en: 'Admin' },
    account: 'admin@demo.marketplace.mx',
    blurb: {
      es: 'La vista de la plataforma: qué tiendas entran, cuáles se suspenden y qué quedó escrito en la bitácora.',
      en: "The platform view: which stores get in, which get suspended, and what's written in the audit log.",
    },
    tryThis: {
      es: [
        'Aprueba una tienda de la cola de pendientes.',
        'Revisa la bitácora: cada acción quedó registrada con quién y cuándo.',
        'Resuelve una aclaración a favor del comprador.',
      ],
      en: [
        'Approve a store from the pending queue.',
        'Check the audit log: every action is recorded with who and when.',
        "Resolve a dispute in the buyer's favor.",
      ],
    },
  },
]

const CITAS_WEB = (import.meta.env.PUBLIC_CITAS_WEB ?? 'http://localhost:3000').replace(/\/$/, '')

const citasRoles: SrcRole[] = [
  {
    id: 'paciente',
    label: { es: 'Paciente', en: 'Patient' },
    account: 'paciente@demo.citas.mx',
    blurb: {
      es: 'Entras como alguien que busca consulta. El catálogo de doctores, el mapa y la agenda son los de verdad.',
      en: 'You come in as someone looking for a consultation. The doctor directory, the map and the scheduler are the real ones.',
    },
    tryThis: {
      es: [
        'Abre Doctores y cambia a la vista de mapa.',
        'Toca un marcador y agenda desde ahí.',
        'Mira tus citas: hay pasadas, una cancelada y dos próximas.',
        'Lee tu historial médico, con signos vitales y una alergia registrada.',
      ],
      en: [
        'Open Doctors and switch to the map view.',
        'Tap a marker and book from there.',
        'Check your appointments: there are past ones, a canceled one, and two upcoming.',
        'Read your medical record, with vitals and a recorded allergy.',
      ],
    },
  },
  {
    id: 'doctor',
    label: { es: 'Doctor', en: 'Doctor' },
    account: 'doctor@demo.citas.mx',
    blurb: {
      es: 'La consulta del otro lado: lo agendado, los horarios y lo que se escribe de cada paciente.',
      en: "The consultation from the other side: what's booked, the schedule, and what's written about each patient.",
    },
    tryThis: {
      es: [
        'Revisa las citas que te agendaron.',
        'Abre el historial de un paciente y escribe una consulta.',
        'Ajusta tus horarios disponibles.',
      ],
      en: [
        'Review the appointments booked with you.',
        "Open a patient's record and write a consultation.",
        'Adjust your available hours.',
      ],
    },
  },
  {
    id: 'admin',
    label: { es: 'Administrador', en: 'Admin' },
    account: 'admin@demo.citas.mx',
    blurb: {
      es: 'La vista de la clínica: usuarios, doctores y las estadísticas del conjunto.',
      en: 'The clinic view: users, doctors and the overall stats.',
    },
    tryThis: {
      es: ['Mira las estadísticas.', 'Revisa el padrón de usuarios y doctores.'],
      en: ['Look at the stats.', 'Review the roster of users and doctors.'],
    },
  },
]

const citasRecipes: SrcRecipe[] = [
  {
    id: 'citas-salud',
    method: 'GET',
    path: '/health',
    title: { es: 'Preguntar si la API vive', en: 'Ask whether the API is alive' },
    note: { es: 'Ruta pública, sin sesión.', en: 'Public route, no session.' },
    auth: 'none',
  },
  {
    id: 'citas-doctores',
    method: 'GET',
    path: '/api/doctors',
    title: { es: 'Listar doctores', en: 'List doctors' },
    note: {
      es: 'Cada uno trae latitud y longitud: es lo que el mapa dibuja. Las coordenadas admiten nulo, y entonces ese consultorio no aparece.',
      en: "Each one carries latitude and longitude: that's what the map draws. Coordinates allow null, and then that office doesn't appear.",
    },
    auth: 'none',
  },
  {
    id: 'citas-401',
    method: 'GET',
    path: '/api/appointments',
    title: { es: 'Pedir las citas sin sesión', en: 'Ask for the appointments with no session' },
    note: {
      es: 'El guard corta antes de que la petición toque la base.',
      en: 'The guard cuts in before the request touches the database.',
    },
    auth: 'strip',
    expect: '401',
  },
  {
    id: 'citas-sesion',
    method: 'POST',
    path: '/api/demo/session',
    title: { es: 'Pedir una sesión de paciente', en: 'Ask for a patient session' },
    note: {
      es: 'Sin contraseña, y solo porque corre con DEMO_MODE encendido. Apagado, este endpoint no existe: responde 404.',
      en: "No password, and only because it runs with DEMO_MODE on. Off, this endpoint doesn't exist: it returns 404.",
    },
    auth: 'none',
    body: { role: 'paciente' },
    capture: (data) => ({ token: data?.token ?? null }),
  },
  {
    id: 'citas-mias',
    method: 'GET',
    path: '/api/appointments',
    title: { es: 'Pedir las citas, ya con sesión', en: 'Ask for the appointments, now with a session' },
    note: {
      es: 'Mismo endpoint que falló hace dos pasos. Ahora responde, con citas en varios estados.',
      en: 'Same endpoint that failed two steps ago. Now it answers, with appointments in several states.',
    },
    auth: 'token',
  },
  {
    id: 'citas-admin-403',
    method: 'GET',
    path: '/api/admin/stats',
    title: { es: 'Asomarse al panel de la clínica', en: 'Peek at the clinic panel' },
    note: {
      es: 'La sesión es de paciente y el panel pide rol de administrador. El guard corta en la puerta.',
      en: "The session is a patient's and the panel requires the admin role. The guard cuts at the door.",
    },
    auth: 'token',
    expect: '403',
  },
]

const CHAT_WEB = (import.meta.env.PUBLIC_CHAT_WEB ?? 'http://localhost:5107').replace(/\/$/, '')

const chatRoles: SrcRole[] = [
  {
    id: 'usuario',
    label: { es: 'Usuario', en: 'User' },
    account: 'usuario@demo.chat.mx',
    blurb: {
      es: 'El chat entero: dos conversaciones con historia, un documento ya leído, y respuestas que llegan token a token.',
      en: 'The whole chat: two conversations with history, a document already read, and responses that arrive token by token.',
    },
    tryThis: {
      es: [
        'Escribe algo y mira cómo se pinta mientras llega, no de golpe.',
        'Vuelve a preguntar y dale a Parar a media respuesta: lo que alcanzó a escribirse se queda.',
        'Abre la primera conversación: trae un documento adjunto que el modelo puede leer.',
        'Adjunta un PDF o un .md tuyo y pregúntale por su contenido.',
      ],
      en: [
        'Type something and watch it paint as it arrives, not all at once.',
        'Ask again and hit Stop mid-answer: whatever made it to the screen stays.',
        'Open the first conversation: it has an attachment the model can read.',
        'Attach a PDF or a .md of your own and ask about its contents.',
      ],
    },
  },
  {
    id: 'administrador',
    label: { es: 'Administrador', en: 'Admin' },
    account: 'admin@demo.chat.mx',
    blurb: {
      es: 'La pantalla del dinero: lo gastado en el periodo, el tope, y el costo de cada conversación.',
      en: "The money screen: what's been spent this period, the cap, and the cost of each conversation.",
    },
    tryThis: {
      es: [
        'Mira cuántos tokens de entrada y de salida lleva el periodo.',
        'Mira el precio por millón del modelo: ese número es el que alimenta el tope de gasto.',
      ],
      en: [
        'See how many input and output tokens the period has run up.',
        "See the model's price per million: that number is what feeds the spending cap.",
      ],
    },
  },
]

const chatRecipes: SrcRecipe[] = [
  {
    id: 'chat-salud',
    method: 'GET',
    path: '/health',
    title: { es: 'Preguntar si la API vive', en: 'Ask whether the API is alive' },
    note: { es: 'Ruta pública, sin sesión.', en: 'Public route, no session.' },
    auth: 'none',
  },
  {
    id: 'chat-modelos',
    method: 'GET',
    path: '/api/models',
    title: { es: 'Qué modelos hay y a qué precio', en: 'What models there are, and at what price' },
    note: {
      es: 'Pública a propósito: la pantalla de entrada dice con qué se está hablando antes de pedirle a nadie que cree una cuenta. El precio por millón que devuelve aquí es el mismo con el que se cobra cada turno y con el que se frena el tope de gasto.',
      en: "Public on purpose: the entry screen says what you're talking to before asking anyone to create an account. The price per million it returns here is the same one that bills each turn and that stops the spending cap.",
    },
    auth: 'none',
  },
  {
    id: 'chat-sesion',
    method: 'POST',
    path: '/api/demo/session',
    title: { es: 'Entrar sin contraseña', en: 'Sign in without a password' },
    note: {
      es: 'El bypass de la demostración, con cuatro candados: la bandera DEMO_MODE, el dominio del correo, la columna is_demo y una comprobación más antes de firmar nada.',
      en: 'The demo bypass, with four locks: the DEMO_MODE flag, the email domain, the is_demo column, and one more check before anything is signed.',
    },
    body: { role: 'usuario' },
    auth: 'none',
    capture: (data) => ({ token: data?.token ?? null }),
  },
  {
    id: 'chat-conversaciones',
    method: 'GET',
    path: '/api/conversations',
    title: { es: 'Listar conversaciones', en: 'List conversations' },
    note: {
      es: 'Cada una trae cuántos mensajes lleva y cuánto ha costado, contado de sus propias filas.',
      en: 'Each one carries how many messages it has and how much it has cost, counted from its own rows.',
    },
    auth: 'token',
    capture: (data) => ({ conversationId: String(data?.conversations?.[0]?.id ?? '') || null }),
  },
  {
    id: 'chat-adjuntos',
    method: 'GET',
    path: '/api/conversations/:id/attachments',
    title: { es: 'Los documentos de esa conversación', en: 'The documents in that conversation' },
    resolvePath: (ctx) => `/api/conversations/${ctx.conversationId ?? '0'}/attachments`,
    note: {
      es: 'Dice cuánto TEXTO arrastra cada uno, no cuánto pesa el archivo: ese texto viaja al modelo en cada turno, así que es lo que se paga una y otra vez.',
      en: "It says how much TEXT each one drags along, not the file size: that text travels to the model every turn, so it's what you pay for again and again.",
    },
    auth: 'token',
  },
  {
    id: 'chat-consumo',
    method: 'GET',
    path: '/api/usage',
    title: { es: 'Lo gastado en el periodo', en: "What's been spent this period" },
    note: {
      es: 'El tope se revisa ANTES de llamar al modelo, no después. Un bucle aquí no es un error de log: es una factura.',
      en: "The cap is checked BEFORE calling the model, not after. A loop here isn't a logging bug: it's an invoice.",
    },
    auth: 'token',
  },
]

const sources: SrcPlayground[] = [
  {
    slug: 'marketplace',
    nombre: { es: 'Marketplace multivendedor', en: 'Multi-vendor marketplace' },
    resumen: {
      es: 'Catálogo, carrito, checkout, pagos al vendedor y chat en vivo.',
      en: 'Catalog, cart, checkout, seller payouts and live chat.',
    },
    demoWeb: (import.meta.env.PUBLIC_DEMO_WEB ?? 'http://localhost:5102').replace(/\/$/, ''),
    apiBase: (import.meta.env.PUBLIC_DEMO_API ?? 'http://localhost:3102').replace(/\/$/, ''),
    roles: marketplaceRoles,
    recipes: marketplaceRecipes,
    nota: {
      es: 'Los datos son de juguete y se reinician solos cada hora. No hay cobros reales: el proveedor de pagos es uno falso que firma sus propios webhooks.',
      en: 'The data is throwaway and resets itself every hour. No real charges: the payment provider is a fake that signs its own webhooks.',
    },
  },
  {
    slug: 'citas',
    nombre: { es: 'Citas médicas', en: 'Medical appointments' },
    resumen: {
      es: 'Agenda clínica con mapa de consultorios, historial y tres roles.',
      en: 'A clinic scheduler with a map of offices, records, and three roles.',
    },
    demoWeb: CITAS_WEB,
    apiBase: CITAS_WEB,
    roles: citasRoles,
    recipes: citasRecipes,
    nota: {
      es: 'Pacientes, doctores y citas inventados. Los datos se reinician solos cada hora, y nadie recibe correos de verdad.',
      en: 'Made-up patients, doctors and appointments. The data resets itself every hour, and nobody gets real emails.',
    },
  },
  {
    slug: 'chat',
    nombre: { es: 'Chat con IA', en: 'AI chat' },
    resumen: {
      es: 'Respuestas token a token, cancelables, con documentos adjuntos y el costo contado.',
      en: 'Token-by-token responses, cancelable, with attachments and the cost counted.',
    },
    demoWeb: CHAT_WEB,
    apiBase: CHAT_WEB,
    roles: chatRoles,
    recipes: chatRecipes,
    nota: {
      es: 'Contesta Gemini de verdad, con un tope de gasto que se revisa antes de cada llamada y un límite de peticiones por minuto. Se reinicia solo cada hora, así que lo que escribas no se queda.',
      en: 'Real Gemini answers, with a spending cap checked before every call and a per-minute rate limit. It resets itself every hour, so what you type stays nowhere.',
    },
  },
]

const flatRole = (r: SrcRole, lang: Lang): Role => ({
  id: r.id,
  label: r.label[lang],
  account: r.account,
  blurb: r.blurb[lang],
  tryThis: r.tryThis[lang],
})

const flatRecipe = (r: SrcRecipe, lang: Lang): Recipe => ({
  ...r,
  title: r.title[lang],
  note: r.note[lang],
})

export function getPlaygrounds(lang: Lang): Playground[] {
  return sources.map((p) => ({
    slug: p.slug,
    nombre: p.nombre[lang],
    resumen: p.resumen[lang],
    demoWeb: p.demoWeb,
    apiBase: p.apiBase,
    roles: p.roles.map((r) => flatRole(r, lang)),
    recipes: p.recipes.map((r) => flatRecipe(r, lang)),
    nota: p.nota[lang],
  }))
}
