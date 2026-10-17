import type { Recipe } from '../islands/ApiConsole'
import type { Role } from '../islands/DemoFrame'

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

const FOREIGN_ORDER_ID = '3f2b9a1c-7d84-4e26-9b05-2a6c18f4e7d3'

const marketplaceRecipes: Recipe[] = [
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

const marketplaceRoles: Role[] = [
  {
    id: 'comprador',
    label: 'Comprador',
    account: 'comprador@demo.marketplace.mx',
    blurb:
      'Entras como alguien que viene a comprar artesanía. El catálogo, el carrito y el checkout son los de verdad.',
    tryThis: [
      'Busca "talavera" y mete algo al carrito.',
      'Pasa por el checkout y paga con el proveedor de prueba.',
      'Marca el pedido como recibido y deja una reseña.',
      'Abre el chat del pedido y escríbele a la tienda.',
    ],
  },
  {
    id: 'vendedor',
    label: 'Vendedor',
    account: 'vendedor@demo.marketplace.mx',
    blurb:
      'El panel de una tienda aprobada. Publica piezas, fija el costo de envío y despacha lo que te compren.',
    tryThis: [
      'Publica un producto con una variante y su stock.',
      'Ajusta las tarifas de envío por kilo y el mínimo para envío gratis.',
      'Marca una venta como enviada y mira cómo se libera el pago.',
      'Contesta el mensaje que dejó el comprador.',
    ],
  },
  {
    id: 'admin',
    label: 'Administrador',
    account: 'admin@demo.marketplace.mx',
    blurb:
      'La vista de la plataforma: qué tiendas entran, cuáles se suspenden y qué quedó escrito en la bitácora.',
    tryThis: [
      'Aprueba una tienda de la cola de pendientes.',
      'Revisa la bitácora: cada acción quedó registrada con quién y cuándo.',
      'Resuelve una aclaración a favor del comprador.',
    ],
  },
]

const CITAS_WEB = (import.meta.env.PUBLIC_CITAS_WEB ?? 'http://localhost:3000').replace(/\/$/, '')

const citasRoles: Role[] = [
  {
    id: 'paciente',
    label: 'Paciente',
    account: 'paciente@demo.citas.mx',
    blurb:
      'Entras como alguien que busca consulta. El catálogo de doctores, el mapa y la agenda son los de verdad.',
    tryThis: [
      'Abre Doctores y cambia a la vista de mapa.',
      'Toca un marcador y agenda desde ahí.',
      'Mira tus citas: hay pasadas, una cancelada y dos próximas.',
      'Lee tu historial médico, con signos vitales y una alergia registrada.',
    ],
  },
  {
    id: 'doctor',
    label: 'Doctor',
    account: 'doctor@demo.citas.mx',
    blurb: 'La consulta del otro lado: lo agendado, los horarios y lo que se escribe de cada paciente.',
    tryThis: [
      'Revisa las citas que te agendaron.',
      'Abre el historial de un paciente y escribe una consulta.',
      'Ajusta tus horarios disponibles.',
    ],
  },
  {
    id: 'admin',
    label: 'Administrador',
    account: 'admin@demo.citas.mx',
    blurb: 'La vista de la clínica: usuarios, doctores y las estadísticas del conjunto.',
    tryThis: ['Mira las estadísticas.', 'Revisa el padrón de usuarios y doctores.'],
  },
]

const citasRecipes: Recipe[] = [
  {
    id: 'citas-salud',
    method: 'GET',
    path: '/health',
    title: 'Preguntar si la API vive',
    note: 'Ruta pública, sin sesión.',
    auth: 'none',
  },
  {
    id: 'citas-doctores',
    method: 'GET',
    path: '/api/doctors',
    title: 'Listar doctores',
    note: 'Cada uno trae latitud y longitud: es lo que el mapa dibuja. Las coordenadas admiten nulo, y entonces ese consultorio no aparece.',
    auth: 'none',
  },
  {
    id: 'citas-401',
    method: 'GET',
    path: '/api/appointments',
    title: 'Pedir las citas sin sesión',
    note: 'El guard corta antes de que la petición toque la base.',
    auth: 'strip',
    expect: '401',
  },
  {
    id: 'citas-sesion',
    method: 'POST',
    path: '/api/demo/session',
    title: 'Pedir una sesión de paciente',
    note: 'Sin contraseña, y solo porque corre con DEMO_MODE encendido. Apagado, este endpoint no existe: responde 404.',
    auth: 'none',
    body: { role: 'paciente' },
    capture: (data) => ({ token: data?.token ?? null }),
  },
  {
    id: 'citas-mias',
    method: 'GET',
    path: '/api/appointments',
    title: 'Pedir las citas, ya con sesión',
    note: 'Mismo endpoint que falló hace dos pasos. Ahora responde, con citas en varios estados.',
    auth: 'token',
  },
  {
    id: 'citas-admin-403',
    method: 'GET',
    path: '/api/admin/stats',
    title: 'Asomarse al panel de la clínica',
    note: 'La sesión es de paciente y el panel pide rol de administrador. El guard corta en la puerta.',
    auth: 'token',
    expect: '403',
  },
]

const CHAT_WEB = (import.meta.env.PUBLIC_CHAT_WEB ?? 'http://localhost:5107').replace(/\/$/, '')

const chatRoles: Role[] = [
  {
    id: 'usuario',
    label: 'Usuario',
    account: 'usuario@demo.chat.mx',
    blurb:
      'El chat entero: dos conversaciones con historia, un documento ya leído, y respuestas que llegan token a token.',
    tryThis: [
      'Escribe algo y mira cómo se pinta mientras llega, no de golpe.',
      'Vuelve a preguntar y dale a Parar a media respuesta: lo que alcanzó a escribirse se queda.',
      'Abre la primera conversación: trae un documento adjunto que el modelo puede leer.',
      'Adjunta un PDF o un .md tuyo y pregúntale por su contenido.',
    ],
  },
  {
    id: 'administrador',
    label: 'Administrador',
    account: 'admin@demo.chat.mx',
    blurb: 'La pantalla del dinero: lo gastado en el periodo, el tope, y el costo de cada conversación.',
    tryThis: [
      'Mira cuántos tokens de entrada y de salida lleva el periodo.',
      'Mira el precio por millón del modelo: ese número es el que alimenta el tope de gasto.',
    ],
  },
]

const chatRecipes: Recipe[] = [
  {
    id: 'chat-salud',
    method: 'GET',
    path: '/health',
    title: 'Preguntar si la API vive',
    note: 'Ruta pública, sin sesión.',
    auth: 'none',
  },
  {
    id: 'chat-modelos',
    method: 'GET',
    path: '/api/models',
    title: 'Qué modelos hay y a qué precio',
    note: 'Pública a propósito: la pantalla de entrada dice con qué se está hablando antes de pedirle a nadie que cree una cuenta. El precio por millón que devuelve aquí es el mismo con el que se cobra cada turno y con el que se frena el tope de gasto.',
    auth: 'none',
  },
  {
    id: 'chat-sesion',
    method: 'POST',
    path: '/api/demo/session',
    title: 'Entrar sin contraseña',
    note: 'El bypass de la demostración, con cuatro candados: la bandera DEMO_MODE, el dominio del correo, la columna is_demo y una comprobación más antes de firmar nada.',
    body: { role: 'usuario' },
    auth: 'none',
    capture: (data) => ({ token: data?.token ?? null }),
  },
  {
    id: 'chat-conversaciones',
    method: 'GET',
    path: '/api/conversations',
    title: 'Listar conversaciones',
    note: 'Cada una trae cuántos mensajes lleva y cuánto ha costado, contado de sus propias filas.',
    auth: 'token',
    capture: (data) => ({ conversationId: String(data?.conversations?.[0]?.id ?? '') || null }),
  },
  {
    id: 'chat-adjuntos',
    method: 'GET',
    path: '/api/conversations/:id/attachments',
    title: 'Los documentos de esa conversación',
    resolvePath: (ctx) => `/api/conversations/${ctx.conversationId ?? '0'}/attachments`,
    note: 'Dice cuánto TEXTO arrastra cada uno, no cuánto pesa el archivo: ese texto viaja al modelo en cada turno, así que es lo que se paga una y otra vez.',
    auth: 'token',
  },
  {
    id: 'chat-consumo',
    method: 'GET',
    path: '/api/usage',
    title: 'Lo gastado en el periodo',
    note: 'El tope se revisa ANTES de llamar al modelo, no después. Un bucle aquí no es un error de log: es una factura.',
    auth: 'token',
  },
]

export const playgrounds: Playground[] = [

  {
    slug: 'marketplace',
    nombre: 'Marketplace multivendedor',
    resumen: 'Catálogo, carrito, checkout, pagos al vendedor y chat en vivo.',
    demoWeb: (import.meta.env.PUBLIC_DEMO_WEB ?? 'http://localhost:5102').replace(/\/$/, ''),
    apiBase: (import.meta.env.PUBLIC_DEMO_API ?? 'http://localhost:3102').replace(/\/$/, ''),
    roles: marketplaceRoles,
    recipes: marketplaceRecipes,
    nota: 'Los datos son de juguete y se reinician solos cada hora. No hay cobros reales: el proveedor de pagos es uno falso que firma sus propios webhooks.',
  },
  {
    slug: 'citas',
    nombre: 'Citas médicas',
    resumen: 'Agenda clínica con mapa de consultorios, historial y tres roles.',
    demoWeb: CITAS_WEB,
    apiBase: CITAS_WEB,
    roles: citasRoles,
    recipes: citasRecipes,
    nota: 'Pacientes, doctores y citas inventados. Los datos se reinician solos cada hora, y nadie recibe correos de verdad.',
  },
  {
    slug: 'chat',
    nombre: 'Chat con IA',
    resumen: 'Respuestas token a token, cancelables, con documentos adjuntos y el costo contado.',
    demoWeb: CHAT_WEB,
    apiBase: CHAT_WEB,
    roles: chatRoles,
    recipes: chatRecipes,
    nota: 'Contesta Gemini de verdad, con un tope de gasto que se revisa antes de cada llamada y un límite de peticiones por minuto. Se reinicia solo cada hora, así que lo que escribas no se queda.',
  },
]
