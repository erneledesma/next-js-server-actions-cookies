# Guía de Seguridad - Next.js Server Actions Demo

## Vulnerabilidades Identificadas y Corregidas

### Contexto
Este proyecto fue actualizado debido a vulnerabilidades críticas encontradas en Next.js 16.0.0, especialmente críticas para aplicaciones que utilizan Server Actions.

---

## CVEs Corregidas

### 1. **CVE-2026-27978: CSRF Vulnerability en Server Actions** ⚠️ CRÍTICA
- **Descripción**: Una vulnerabilidad CSRF donde `origin: null` era tratado como un origen faltante, permitiendo bypasses en Server Actions.
- **Impacto**: Attackers podrían ejecutar Server Actions sin validación CSRF adecuada.
- **Afectados**: Next.js 16.0.0 - 16.1.6
- **Correción**: Actualizar a 16.1.7 o superior
- **Nuestro Fix**: Actualizado a 16.2.5

### 2. **CVE-2026-44576: Cache Poisoning en React Server Components**
- **Descripción**: Envenenamiento de caché debido a particionamiento incorrecto de respuestas en RSCs.
- **Impacto**: Posible exposición de datos en caché o manipulación de datos servidos.
- **Afectados**: Next.js 16.0.0 - 16.2.4
- **Correción**: Actualizar a 16.2.5 o superior

### 3. **CVE-2026-44582: Cache Poisoning vía colisiones _rsc**
- **Descripción**: Envenenamiento de caché a través de colisiones de valores de cache-busting en `_rsc`.
- **Impacto**: Posible manipulación del caché de React Server Components.
- **Afectados**: Next.js 16.0.0 - 16.2.4
- **Correción**: Actualizar a 16.2.5 o superior

### 4. **CVE-2026-44574 y CVE-2026-44575**
- **Descripción**: Vulnerabilidades adicionales de seguridad en Next.js 16.0.0+
- **Afectados**: Next.js 16.0.0+
- **Correción**: Actualizar a 16.2.5 o superior

---

## Cambios Realizados

### Archivo: `package.json`
```diff
- "next": "16.0.0",
+ "next": "16.2.5",
```

### Pasos para aplicar las correcciones:

1. **Eliminar lockfile e instalar dependencias nuevamente**
   ```bash
   rm -rf pnpm-lock.yaml node_modules
   pnpm install
   ```

2. **Verificar la versión instalada**
   ```bash
   pnpm list next
   ```

3. **Realizar un build local**
   ```bash
   pnpm build
   ```

4. **Deployar en Vercel**
   ```bash
   git add -A
   git commit -m "chore: update Next.js to 16.2.5 (fix security vulnerabilities)"
   git push origin main
   ```

---

## Mejores Prácticas de Seguridad para Server Actions

### 1. **Validación CSRF (ya corregida en 16.2.5)**
- Next.js 16.2.5 incluye la corrección para CSRF en Server Actions
- Asegúrate de que tu origin sea válido en header de peticiones

### 2. **Validación de Cookies**
En `app/actions/cookie-actions.ts`:
```typescript
// ✅ CORRECTO: Usar 'use server' directiva
'use server'

import { cookies } from 'next/headers'

export async function setCookie(name: string, value: string) {
  // ✅ Las cookies se validan automáticamente en el servidor
  const cookieStore = await cookies()
  cookieStore.set(name, value, {
    httpOnly: true,      // ✅ Protege contra XSS
    secure: process.env.NODE_ENV === 'production', // ✅ HTTPS only en producción
    sameSite: 'strict',  // ✅ Protege contra CSRF
    maxAge: 60 * 60 * 24 // ✅ 24 horas
  })
}
```

### 3. **Validación de Entrada**
```typescript
// ✅ CORRECTO: Validar nombres de cookies
const validCookieNames = /^[a-zA-Z0-9_-]+$/
if (!validCookieNames.test(name)) {
  throw new Error('Invalid cookie name')
}
```

### 4. **Sanitización de Valores**
```typescript
// ✅ CORRECTO: Evitar inyección de valores
export async function getCookie(name: string) {
  if (!name || name.length > 50) {
    throw new Error('Cookie name too long')
  }
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value || null
}
```

---

## Testing de Seguridad

### Verificar que CSRF está protegido:
```bash
# El siguiente comando debe fallar con origen null
curl -X POST http://localhost:3000/api/action \
  -H "Origin: null" \
  -H "Content-Type: application/json"
```

### Verificar cookies seguras:
```bash
pnpm dev
# En DevTools > Application > Cookies
# Debería mostrar:
# - HttpOnly: ✓ (no accesible desde JavaScript)
# - Secure: ✓ (solo HTTPS en producción)
# - SameSite: Strict
```

---

## Monitoreo Futuro

### 1. **Mantener Next.js actualizado**
- Suscribirse a: https://github.com/vercel/next.js/releases
- Usar herramientas como Dependabot

### 2. **Auditoría Regular**
```bash
# Auditar vulnerabilidades
pnpm audit

# Auditar solo vulnerabilidades críticas
pnpm audit --severity=high
```

### 3. **Configuración de Vercel**
- Habilitar "Automatic Security Updates" en Settings
- Revisar logs de seguridad regularmente

---

## Referencias

- [Next.js Security Advisories](https://github.com/vercel/next.js/security/advisories)
- [OWASP - CSRF Prevention](https://owasp.org/www-community/attacks/csrf)
- [MDN - Secure Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [CVE-2026-27978 Details](https://nvd.nist.gov/vuln/detail/CVE-2026-27978)

---

## Preguntas Frecuentes

**P: ¿Necesito hacer cambios en mi código?**
R: No, la actualización es directa. Sin embargo, revisa las mejores prácticas anteriores.

**P: ¿Esto afecta el build en Vercel?**
R: No, ahora debería funcionar sin problemas. El build validará la seguridad automáticamente.

**P: ¿Debo regenerar mis pnpm-lock.yaml?**
R: Sí, ejecuta `pnpm install` para actualizar el lockfile.

---

**Última actualización**: 2026-07-14
**Estado**: ✅ Seguro para producción en versión 16.2.5+
