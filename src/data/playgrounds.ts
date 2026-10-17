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
]
