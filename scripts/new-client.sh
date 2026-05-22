#!/bin/bash
# filepath: d:/PROYECTOS/REMATE CAMPO/scripts/new-client.sh
# @optimization: debugger - Script de automatización multi-tenant para crear nuevos clientes, assets de branding y variables HSL

# Colores elegantes para terminal
FOREST='\033[0;32m'
WHEAT='\033[0;33m'
NC='\033[0m'

echo -e "${FOREST}"
echo "====================================================================="
echo "  🚜 MULTI-TENANT SAAS: REGISTRO DE NUEVO CLIENTE (BRANDING)         "
echo "====================================================================="
echo -e "${NC}"

# Pedir parámetros si no se pasaron
if [ -z "$1" ] || [ -z "$2" ]; then
  echo -e "Uso: ./new-client.sh <slug-cliente> <\"Nombre del Cliente\"> <celular-contacto> <correo-contacto> <color-forest-hex>"
  echo -e "Ejemplo: ./new-client.sh remates-del-norte \"Remates del Norte\" 099888777 contacto@norte.com.uy \"#1b4332\""
  echo -e "\nIngrese los datos interactivamente:"
  read -p "1. Slug del cliente (ej: remates-patria): " SLUG
  read -p "2. Nombre completo (ej: Escritorio Patria): " NAME
  read -p "3. Celular uruguayo (ej: 099234567): " PHONE
  read -p "4. Correo electrónico: " EMAIL
  read -p "5. Color primario Hex (ej: #1e3a8a): " COLOR_FOREST
else
  SLUG=$1
  NAME=$2
  PHONE=$3
  EMAIL=$4
  COLOR_FOREST=$5
fi

# Validar inputs mínimos
if [ -z "$SLUG" ] || [ -z "$NAME" ]; then
  echo "❌ El slug y nombre del cliente son obligatorios. Abortando."
  exit 1
fi

COLOR_WHEAT=${COLOR_WHEAT:-"#e8b86d"}
COLOR_EARTH=${COLOR_EARTH:-"#3a2f1f"}
COLOR_CREAM=${COLOR_CREAM:-"#faf7f0"}

echo -e "\n⚡ 1. Creando carpetas de assets públicos para la marca..."
mkdir -p "public/brands/${SLUG}"

# Generar un logotipo SVG de ejemplo para que la aplicación no rompa por falta de archivos
echo -e "⚡ 2. Generando logotipo SVG de muestra en public/brands/${SLUG}/logo.svg..."
cat <<EOL > "public/brands/${SLUG}/logo.svg"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="100%" height="100%">
  <rect width="100%" height="100%" fill="none"/>
  <text x="20" y="60" font-family="'Outfit', sans-serif" font-weight="900" font-size="32" fill="${COLOR_FOREST}">${NAME}</text>
  <circle cx="360" cy="50" r="15" fill="${COLOR_WHEAT}"/>
</svg>
EOL

echo -e "✅ Assets creados."

echo -e "\n⚡ 3. Copie este bloque de configuración en ${WHEAT}lib/branding.ts${NC}:"
echo -e "${WHEAT}"
cat <<EOL
  '${SLUG}': {
    name: '${NAME}',
    shortName: '${SLUG}',
    phone: '${PHONE}',
    whatsapp: '598${PHONE:1}',
    email: '${EMAIL}',
    colors: {
      forest: '${COLOR_FOREST}',
      forestDark: '${COLOR_FOREST}dd', // Opacidad sutil
      wheat: '${COLOR_WHEAT}',
      earth: '${COLOR_EARTH}',
      cream: '${COLOR_CREAM}',
    },
    logo: '/brands/${SLUG}/logo.svg',
    favicon: '/favicon.ico',
    domain: '${SLUG}.remate-campo.app',
  },
EOL
echo -e "${NC}"

echo -e "====================================================================="
echo -e " 🎉 NUEVA MARCA CONFIGURADA!"
echo -e " Configure su dominio en Vercel o encienda con NEXT_PUBLIC_BRAND=${SLUG} npm run dev"
echo -e "====================================================================="
