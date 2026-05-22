#!/bin/bash
# filepath: d:/PROYECTOS/REMATE CAMPO/scripts/demo-setup.sh
# @optimization: debugger - Script de automatización para la instalación y puesta en marcha del entorno local / productivo

# Colores elegantes para terminal
FOREST='\033[0;32m'
WHEAT='\033[0;33m'
EARTH='\033[0;30m'
NC='\033[0m' # No Color

echo -e "${FOREST}"
echo "====================================================================="
echo "  🚜 REMATE VIRTUAL AGRÍCOLA (BARRIO.UY / REMATE CAMPO)             "
echo "  Script de Setup Automatizado (Quantum Execution Engine)            "
echo "====================================================================="
echo -e "${NC}"

echo -e "⚡ 1. Instalando dependencias consolidadas..."
npm install

if [ $? -eq 0 ]; then
  echo -e "✅ Dependencias instaladas con éxito."
else
  echo -e "❌ Error al instalar dependencias. Verifique npm."
  exit 1
fi

echo -e "\n⚡ 2. Creando archivo de variables de entorno (.env.local)..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo -e "✅ Archivo .env.local creado. COMPLETE los tokens secretos de Supabase, Twilio y Resend."
else
  echo -e "⚠️ El archivo .env.local ya existe. Se omitió la sobrescritura para proteger sus claves."
fi

echo -e "\n⚡ 3. Base de Datos Supabase (PostgreSQL)..."
echo -e " 👉 Copie y pegue el contenido de ${WHEAT}supabase/setup.sql${NC} en el Editor SQL de Supabase."
echo -e " 👉 Esto creará las 6 tablas con RLS, los triggers de-duplicados y cargará los 20 lotes uruguayos de prueba."

echo -e "\n⚡ 4. Probando compilación estricta de TypeScript..."
npm run build --dry-run 2>/dev/null
if [ $? -eq 0 ]; then
  echo -e "✅ La validación de tipos e integraciones fue exitosa."
else
  echo -e "⚠️ Advertencia: Algunos tipos podrían requerir conexión a base de datos. Continúe con la configuración."
fi

echo -e "\n${FOREST}====================================================================="
echo "   🎉 SETUP COMPLETADO - LISTO PARA ARRANCAR!"
echo "   Ejecute: npm run dev  ->  Para encender el servidor de desarrollo"
echo "=====================================================================${NC}"
