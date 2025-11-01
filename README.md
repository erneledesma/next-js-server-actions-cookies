# Demo de Server Actions con Cookies en Next.js

Esta aplicación demuestra cómo utilizar **Server Actions** de Next.js para manejar cookies de forma segura y eficiente.

## 📋 Características

- ✅ **Crear cookies** con configuración personalizada
- ✅ **Leer cookies** desde el servidor
- ✅ **Eliminar cookies** de forma segura
- ✅ **Cookies httpOnly** para mayor seguridad
- ✅ **Revalidación automática** de la página
- ✅ **Interfaz intuitiva** con feedback visual

## 🏗️ Arquitectura

### Patrón Server Component + Client Component

\`\`\`
┌─────────────────────────────────────┐
│   Server Component (page.tsx)      │
│   - Lee cookies en el servidor     │
│   - Pasa datos como props          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Client Component (cookie-manager)  │
│  - Interfaz interactiva            │
│  - Llama a Server Actions          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Server Actions (cookie-actions)   │
│   - Operaciones seguras en servidor│
│   - Revalidación automática        │
└─────────────────────────────────────┘
\`\`\`

## 📁 Estructura de Archivos

\`\`\`
app/
├── actions/
│   └── cookie-actions.ts    # Server Actions para cookies
├── page.tsx                 # Página principal (Server Component)
components/
└── cookie-manager.tsx       # Componente cliente interactivo
\`\`\`

## 🔧 Server Actions Disponibles

### `setCookie(name: string, value: string)`
Crea una nueva cookie con las siguientes opciones:
- **httpOnly**: `true` - Protección contra XSS
- **path**: `/` - Disponible en toda la app
- **maxAge**: 7 días - Expiración automática

\`\`\`typescript
await setCookie("theme", "dark")
\`\`\`

### `getCookie(name: string)`
Lee el valor de una cookie específica:

\`\`\`typescript
const theme = await getCookie("theme")
// Retorna: "dark" o null
\`\`\`

### `deleteCookie(name: string)`
Elimina una cookie del navegador:

\`\`\`typescript
await deleteCookie("theme")
\`\`\`

### `getAllCookies()`
Obtiene todas las cookies disponibles:

\`\`\`typescript
const cookies = await getAllCookies()
// Retorna: [{ name: "theme", value: "dark" }, ...]
\`\`\`

## 🔐 Seguridad

### Cookies httpOnly
Las cookies se configuran con `httpOnly: true`, lo que significa:
- ✅ No son accesibles desde JavaScript del cliente
- ✅ Protección contra ataques XSS
- ✅ Solo el servidor puede leer/modificar las cookies

### Server Actions
Todas las operaciones se ejecutan en el servidor:
- ✅ No se expone lógica sensible al cliente
- ✅ Validación en el servidor
- ✅ Mayor control sobre las operaciones

## 🚀 Cómo Funciona

### 1. Lectura Inicial (Server Component)
\`\`\`typescript
// app/page.tsx
const cookies = await getAllCookies()
return <CookieManager initialCookies={cookies} />
\`\`\`

### 2. Interacción del Usuario (Client Component)
\`\`\`typescript
// components/cookie-manager.tsx
const handleSetCookie = async () => {
  await setCookie(cookieName, cookieValue)
  // La página se revalida automáticamente
}
\`\`\`

### 3. Revalidación Automática
\`\`\`typescript
// app/actions/cookie-actions.ts
export async function setCookie(name: string, value: string) {
  cookieStore.set({ name, value, httpOnly: true })
  revalidatePath("/") // ← Actualiza la página automáticamente
}
\`\`\`

## 💡 Casos de Uso

### Preferencias de Usuario
\`\`\`typescript
await setCookie("theme", "dark")
await setCookie("language", "es")
await setCookie("fontSize", "large")
\`\`\`

### Sesiones y Autenticación
\`\`\`typescript
await setCookie("session_token", "abc123...")
await setCookie("user_id", "12345")
\`\`\`

### Configuración de la Aplicación
\`\`\`typescript
await setCookie("sidebar_collapsed", "true")
await setCookie("notifications_enabled", "false")
\`\`\`

## 🎯 Ventajas de este Patrón

1. **Seguridad**: Las cookies se manejan en el servidor
2. **Rendimiento**: Menos JavaScript en el cliente
3. **Sincronización**: Revalidación automática de datos
4. **Simplicidad**: No necesitas gestionar estado complejo
5. **Type-safe**: TypeScript en todo el flujo

## 📚 Recursos Adicionales

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js Cookies API](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [Revalidación en Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

## 🛠️ Tecnologías Utilizadas

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **shadcn/ui** - Componentes de UI
- **Server Actions** - Mutaciones del servidor

---

Desarrollado como ejemplo educativo de Server Actions en Next.js 🚀
