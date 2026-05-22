# Handoff Checklist — Remate Virtual Agrícola (Uruguay)

Este documento detalla el estado técnico actual, los flujos críticos de la plataforma y el protocolo de despliegue para garantizar una entrega sin fricciones al equipo de producción.

---

## 🏛️ Estatus de Arquitectura & Código

### 1. Núcleo React 19 & Next.js 14/15
- [x] **90% Server Components (RSC):** Páginas y vistas principales se procesan en el servidor (`page.tsx`, `layout.tsx`).
- [x] **Client Isolation:** Componentes dinámicos interactivos aislados (`BidPanel`, `CountdownTimer`, `RealtimeLotSubscriber`, `SearchFilters`, `LotGrid`).
- [x] **React 19 Hooks:** Implementación exhaustiva de `useActionState` para formularios de pujas, `useFormStatus` para botones y `useOptimistic` para retroalimentación instantánea del precio actual en pantalla.
- [x] **CERO useEffect de Estado:** La sincronización de ofertas e intervalos se resuelve exclusivamente mediante suscripciones Supabase Realtime y Server Actions de revalidación.

### 2. Base de Datos & Transaccionalidad
- [x] **RPC `place_bid` atómica:** Implementada en PostgreSQL con `SELECT FOR UPDATE` para bloquear la fila del lote e impedir race conditions en milisegundos finales.
- [x] **Prevención de Notificaciones Duplicadas:** Trigger en `bids` con cláusula `WHERE NOT EXISTS` en `enqueue_outbid_notification` para deduplicación de alertas.
- [x] **Búsqueda Fuzzy Full-Text:** Configurada nativamente en español sobre la columna generada `fts` con índices `gin(fts)` en PostgreSQL.
- [x] **Integridad Física:** Claves foráneas con `ON DELETE CASCADE` de bids hacia lots.

### 3. Integración de Servicios
- [x] **Mercado Pago SDK v2:** Integración transaccional con Mercado Pago en `checkout.ts` y webhook asíncrono `/api/webhooks/mercadopago` que concilia deudas automáticamente.
- [x] **Resend & Twilio:** Despachadores de emails y alertas por WhatsApp (+598 UY normalizados) configurados en la cola de notificaciones.
- [x] **Analytics en Middleware:** Inyección asíncrona de páginas vistas sin penalización del LCP utilizando `event.waitUntil()` en Vercel Edge Runtime.
- [x] **Catálogo PDF Server-Side:** Generación de PDF por streaming en el endpoint `/lote/catalogo/[album]` para mantener el bundle cliente liviano.

---

## 🔧 Variables de Entorno Obligatorias

Asegúrese de configurar el archivo `.env.local` con las siguientes credenciales:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Authentication
ADMIN_USER="admin"
ADMIN_PASS="contraseña_segura"
ADMIN_SECRET="secret_HMAC_key_de_al_menos_64_caracteres_de_largo"

# Resend & Twilio
RESEND_API_KEY="re_..."
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1..."

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
```

---

## 🚀 Protocolo de Despliegue en 3 Pasos

1. **Base de Datos:**
   - Abra el Editor SQL en la consola de Supabase.
   - Copie el contenido del archivo `supabase/setup.sql` y ejecútelo. Esto creará las 6 tablas, RPCs, vistas materializadas y cargará 20 lotes con 16 pujas distribuidas de prueba.

2. **Servidor Vercel:**
   - Importe su repositorio en Vercel.
   - Configure todas las variables de entorno detalladas arriba.
   - Despliegue. El archivo `vercel.json` configurará automáticamente los cron jobs periódicos de 1 minuto para el cierre de lotes y despacho de notificaciones.

3. **Multi-Tenant (Branding):**
   - Para añadir nuevos escritorios de remates o marcas asociadas, ejecute `./scripts/new-client.sh` e inserte la configuración generada en `lib/branding.ts`.
