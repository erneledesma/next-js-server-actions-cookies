/**
 * Página principal - Demo de Server Actions con Cookies
 *
 * Esta página demuestra el patrón de Server Component + Client Component
 * para el manejo de cookies en Next.js:
 *
 * 1. El Server Component (esta página) lee las cookies en el servidor
 * 2. Pasa las cookies como props al Client Component
 * 3. El Client Component usa Server Actions para modificar cookies
 * 4. Las modificaciones revalidan la página automáticamente
 *
 * Ventajas de este patrón:
 * - Las cookies se leen de forma segura en el servidor
 * - No se exponen datos sensibles al cliente
 * - La UI se mantiene sincronizada automáticamente
 * - Mejor rendimiento (menos JavaScript en el cliente)
 */

import { getAllCookies } from "./actions/cookie-actions"
import { CookieManager } from "@/components/cookie-manager"
import { Toaster } from "@/components/ui/toaster"

/**
 * Componente de página principal (Server Component por defecto)
 *
 * Este componente se ejecuta en el servidor y puede:
 * - Leer cookies de forma segura
 * - Acceder a bases de datos
 * - Realizar operaciones sensibles
 *
 * @returns JSX con la estructura de la página
 */
export default async function Page() {
  // Leer todas las cookies en el servidor
  // Esto se ejecuta en cada petición y proporciona datos frescos
  const cookies = await getAllCookies()

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Encabezado de la página */}
        <div className="space-y-2">
          <h1 className="font-bold text-4xl tracking-tight">Demo de Server Actions con Cookies</h1>
          <p className="text-muted-foreground text-lg">
            Ejemplo práctico de cómo manejar cookies usando Server Actions en Next.js 16
          </p>
        </div>

        {/* Tarjeta informativa con características */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <h2 className="mb-2 font-semibold text-sm">Características:</h2>
          <ul className="space-y-1 text-muted-foreground text-sm">
            <li>✓ Crear cookies con Server Actions</li>
            <li>✓ Leer cookies desde el servidor</li>
            <li>✓ Eliminar cookies de forma segura</li>
            <li>✓ Cookies httpOnly para mayor seguridad</li>
            <li>✓ Revalidación automática de la página</li>
          </ul>
        </div>

        {/* Componente cliente con la funcionalidad interactiva */}
        {/* Las cookies se pasan como props desde el servidor */}
        <CookieManager initialCookies={cookies} />
      </div>

      {/* Componente para mostrar notificaciones toast */}
      <Toaster />
    </main>
  )
}
