/**
 * Server Actions para el manejo de cookies en Next.js
 *
 * Este archivo contiene todas las funciones del servidor (Server Actions)
 * necesarias para crear, leer, actualizar y eliminar cookies de forma segura.
 *
 * Características:
 * - Todas las funciones se ejecutan en el servidor (directiva "use server")
 * - Uso de la API nativa de Next.js para cookies
 * - Revalidación automática de rutas después de modificaciones
 * - Cookies configuradas con httpOnly para mayor seguridad
 */

"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

/**
 * Establece una nueva cookie en el navegador del usuario
 *
 * @param name - Nombre de la cookie a crear
 * @param value - Valor que se almacenará en la cookie
 * @returns Objeto con el estado de éxito y mensaje descriptivo
 *
 * @example
 * ```tsx
 * await setCookie("theme", "dark")
 * ```
 *
 * Configuración de la cookie:
 * - httpOnly: true - La cookie no es accesible desde JavaScript del cliente (mayor seguridad)
 * - path: "/" - La cookie está disponible en todas las rutas de la aplicación
 * - maxAge: 7 días - La cookie expira automáticamente después de 7 días
 */
export async function setCookie(name: string, value: string) {
  // Obtener el store de cookies (debe ser await en Next.js 16+)
  const cookieStore = await cookies()

  // Establecer cookie con opciones de seguridad
  cookieStore.set({
    name: name,
    value: value,
    httpOnly: true, // Protege contra ataques XSS
    path: "/", // Disponible en toda la app
    maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
  })

  // Revalidar la ruta actual para reflejar los cambios inmediatamente
  revalidatePath("/")

  return { success: true, message: `Cookie "${name}" guardada con valor: ${value}` }
}

/**
 * Lee el valor de una cookie específica
 *
 * @param name - Nombre de la cookie a leer
 * @returns El valor de la cookie o null si no existe
 *
 * @example
 * ```tsx
 * const theme = await getCookie("theme")
 * console.log(theme) // "dark" o null
 * ```
 */
export async function getCookie(name: string) {
  // Obtener el store de cookies
  const cookieStore = await cookies()

  // Buscar la cookie específica por nombre
  const cookie = cookieStore.get(name)

  // Retornar el valor o null si no existe
  return cookie ? cookie.value : null
}

/**
 * Elimina una cookie del navegador del usuario
 *
 * @param name - Nombre de la cookie a eliminar
 * @returns Objeto con el estado de éxito y mensaje descriptivo
 *
 * @example
 * ```tsx
 * await deleteCookie("theme")
 * ```
 *
 * Nota: La cookie se elimina inmediatamente y la página se revalida
 * para reflejar los cambios en la UI
 */
export async function deleteCookie(name: string) {
  // Obtener el store de cookies
  const cookieStore = await cookies()

  // Eliminar la cookie por nombre
  cookieStore.delete(name)

  // Revalidar la ruta para actualizar la UI
  revalidatePath("/")

  return { success: true, message: `Cookie "${name}" eliminada` }
}

/**
 * Obtiene todas las cookies disponibles en la petición actual
 *
 * @returns Array de objetos con nombre y valor de cada cookie
 *
 * @example
 * ```tsx
 * const allCookies = await getAllCookies()
 * // [{ name: "theme", value: "dark" }, { name: "lang", value: "es" }]
 * ```
 *
 * Útil para:
 * - Mostrar todas las cookies en una interfaz de administración
 * - Debugging y desarrollo
 * - Sincronización inicial del estado del cliente
 */
export async function getAllCookies() {
  // Obtener el store de cookies
  const cookieStore = await cookies()

  // Obtener todas las cookies como array
  const allCookies = cookieStore.getAll()

  // Mapear a un formato más simple (solo nombre y valor)
  return allCookies.map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
  }))
}
