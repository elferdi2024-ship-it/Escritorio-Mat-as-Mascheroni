// filepath: d:/PROYECTOS/REMATE CAMPO/scripts/test-supabase.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer y parsear .env.local manualmente
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const matchUrl = line.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)$/);
      const matchKey = line.match(/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)$/);
      if (matchUrl) supabaseUrl = matchUrl[1].trim();
      if (matchKey) supabaseKey = matchKey[1].trim();
    }
  }
} catch (e) {
  console.error('Error leyendo .env.local:', e);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan las variables de entorno de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log(`🔌 Conectando a Supabase en: ${supabaseUrl}...`);
  
  const start = Date.now();
  
  try {
    // 1. Probar consulta básica
    console.log('📡 1. Ejecutando consulta de prueba básica a la tabla "lots"...');
    const { data: lots, error: lotsError } = await supabase
      .from('lots')
      .select('id, title')
      .limit(1);

    const end1 = Date.now();
    console.log(`⏱️ Tiempo de respuesta básica: ${end1 - start}ms`);

    if (lotsError) {
      console.error('❌ Error consultando la tabla "lots":', lotsError);
    } else {
      console.log('✅ Consulta exitosa a la tabla "lots". Datos devueltos:', lots);
    }

    // 2. Probar tabla de bids
    console.log('\n📡 2. Consultando la tabla "bids"...');
    const start2 = Date.now();
    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select('id')
      .limit(1);
    
    console.log(`⏱️ Tiempo de respuesta "bids": ${Date.now() - start2}ms`);
    if (bidsError) {
      console.error('❌ Error consultando la tabla "bids":', bidsError);
    } else {
      console.log('✅ Consulta exitosa a "bids".');
    }

    // 3. Probar si la base de datos responde
    console.log('\n📡 3. Ejecutando consulta de salud pura (raw)...');
    const start3 = Date.now();
    const { data: health, error: healthError } = await supabase
      .rpc('get_bid_increment', { p_starting_price: 100 });
    
    console.log(`⏱️ Tiempo de respuesta RPC: ${Date.now() - start3}ms`);
    if (healthError) {
      console.error('❌ Error ejecutando RPC "get_bid_increment":', healthError);
    } else {
      console.log('✅ RPC funcionando correctamente. Incremento para US$ 100:', health);
    }

  } catch (err) {
    console.error('💥 Excepción catastrófica en la conexión:', err);
  }
}

testConnection();
