/**
 * Componente Cliente para gestionar cookies mediante Server Actions
 *
 * Este componente proporciona una interfaz de usuario para:
 * - Crear nuevas cookies con nombre y valor personalizados
 * - Visualizar todas las cookies existentes
 * - Eliminar cookies individuales
 *
 * Características:
 * - Componente cliente ("use client") para interactividad
 * - Integración con Server Actions para operaciones seguras
 * - Feedback visual mediante toasts
 * - Estados de carga para mejor UX
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { setCookie, deleteCookie } from "@/app/actions/cookie-actions"
import { useToast } from "@/hooks/use-toast"

/**
 * Props del componente CookieManager
 */
interface CookieManagerProps {
  /** Array de cookies iniciales leídas desde el servidor */
  initialCookies: Array<{ name: string; value: string }>
}

/**
 * Componente principal para la gestión de cookies
 *
 * @param initialCookies - Cookies leídas en el servidor y pasadas como props
 *
 * @example
 * ```tsx
 * // En un Server Component
 * const cookies = await getAllCookies()
 * return <CookieManager initialCookies={cookies} />
 * ```
 */
export function CookieManager({ initialCookies }: CookieManagerProps) {
  // Estado para el nombre de la cookie (con valor por defecto)
  const [cookieName, setCookieName] = useState("user_preference")

  // Estado para el valor de la cookie
  const [cookieValue, setCookieValue] = useState("")

  // Estado de carga para deshabilitar botones durante operaciones
  const [isLoading, setIsLoading] = useState(false)

  // Hook para mostrar notificaciones toast
  const { toast } = useToast()

  /**
   * Maneja el envío del formulario para crear una nueva cookie
   *
   * Validaciones:
   * - Verifica que ambos campos estén completos
   * - Muestra mensajes de error o éxito mediante toasts
   * - Limpia el campo de valor después de guardar exitosamente
   */
  const handleSetCookie = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que los campos no estén vacíos
    if (!cookieName || !cookieValue) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    // Activar estado de carga
    setIsLoading(true)

    try {
      // Llamar al Server Action para guardar la cookie
      const result = await setCookie(cookieName, cookieValue)

      // Mostrar mensaje de éxito
      toast({
        title: "Éxito",
        description: result.message,
      })

      // Limpiar el campo de valor para la próxima entrada
      setCookieValue("")
    } catch (error) {
      // Manejar errores y mostrar mensaje al usuario
      toast({
        title: "Error",
        description: "No se pudo guardar la cookie",
        variant: "destructive",
      })
    } finally {
      // Desactivar estado de carga
      setIsLoading(false)
    }
  }

  /**
   * Maneja la eliminación de una cookie específica
   *
   * @param name - Nombre de la cookie a eliminar
   *
   * Nota: La página se revalida automáticamente después de eliminar,
   * por lo que la lista de cookies se actualiza sin necesidad de
   * gestionar el estado local
   */
  const handleDeleteCookie = async (name: string) => {
    // Activar estado de carga
    setIsLoading(true)

    try {
      // Llamar al Server Action para eliminar la cookie
      const result = await deleteCookie(name)

      // Mostrar mensaje de éxito
      toast({
        title: "Éxito",
        description: result.message,
      })
    } catch (error) {
      // Manejar errores y mostrar mensaje al usuario
      toast({
        title: "Error",
        description: "No se pudo eliminar la cookie",
        variant: "destructive",
      })
    } finally {
      // Desactivar estado de carga
      setIsLoading(false)
    }
  }

  /**
   * Determina si una cookie contiene información sensible
   * y debe ser ocultada de la interfaz de usuario
   *
   * @param name - Nombre de la cookie
   * @returns true si la cookie es sensible, false en caso contrario
   *
   * Cookies sensibles que se ocultan:
   * - JWT tokens (_vercel_jwt, auth_token, etc)
   * - Session tokens
   * - API keys y credenciales
   */
  const isSensitiveCookie = (name: string): boolean => {
    const sensitivePrefixes = [
      "_vercel_jwt",
      "_vercel",
      "auth_token",
      "session",
      "jwt",
      "token",
      "api_key",
      "secret",
      "credential",
    ]
    return sensitivePrefixes.some((prefix) => name.toLowerCase().includes(prefix.toLowerCase()))
  }

  /**
   * Obtiene una representación segura del valor de la cookie
   *
   * @param name - Nombre de la cookie
   * @param value - Valor de la cookie
   * @returns El valor original o una versión enmascarada si es sensible
   *
   * Para cookies sensibles, muestra:
   * - Primeros 10 caracteres
   * - "..." en el medio
   * - Último carácter
   * - Longitud total entre paréntesis
   */
  const getSafeCookieValue = (name: string, value: string): string => {
    if (!isSensitiveCookie(name)) {
      return value
    }

    // Para tokens sensibles, mostrar solo información básica
    if (value.length > 20) {
      const start = value.substring(0, 10)
      const end = value.substring(value.length - 1)
      return `${start}...${end} (${value.length} caracteres)`
    }

    return "***" + value.substring(0, 3).padEnd(value.length, "*")
  }

  return (
    <div className="space-y-6">
      {/* Card para crear nuevas cookies */}
      <Card>
        <CardHeader>
          <CardTitle>Crear Cookie</CardTitle>
          <CardDescription>Usa un Server Action para establecer una nueva cookie</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetCookie} className="space-y-4">
            {/* Campo para el nombre de la cookie */}
            <div className="space-y-2">
              <Label htmlFor="cookieName">Nombre de la Cookie</Label>
              <Input
                id="cookieName"
                value={cookieName}
                onChange={(e) => setCookieName(e.target.value)}
                placeholder="user_preference"
              />
            </div>

            {/* Campo para el valor de la cookie */}
            <div className="space-y-2">
              <Label htmlFor="cookieValue">Valor</Label>
              <Input
                id="cookieValue"
                value={cookieValue}
                onChange={(e) => setCookieValue(e.target.value)}
                placeholder="dark_mode"
              />
            </div>

            {/* Botón de envío con estado de carga */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cookie"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Card para mostrar cookies existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Cookies Actuales</CardTitle>
          <CardDescription>Cookies leídas desde el servidor usando Server Actions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mostrar mensaje si no hay cookies */}
          {initialCookies.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay cookies guardadas</p>
          ) : (
            // Lista de cookies con opción de eliminar
            <div className="space-y-2">
              {initialCookies.map((cookie) => {
                const isSensitive = isSensitiveCookie(cookie.name)
                const displayValue = getSafeCookieValue(cookie.name, cookie.value)

                return (
                  <div
                    key={cookie.name}
                    className={`flex items-center justify-between rounded-lg border p-3 ${isSensitive ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" : ""}`}
                  >
                    {/* Información de la cookie */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{cookie.name}</p>
                        {isSensitive && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            Sensible
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${isSensitive ? "text-amber-700 dark:text-amber-300 font-mono" : "text-muted-foreground"}`}>
                        {displayValue}
                      </p>
                      {isSensitive && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                          Este token está protegido. No se muestra el valor completo por seguridad.
                        </p>
                      )}
                    </div>

                    {/* Botón para eliminar la cookie */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCookie(cookie.name)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
