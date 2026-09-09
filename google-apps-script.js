/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - API DE DATOS PARA "PORTAL WEB EN SU GRACIA"
 * ==============================================================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Crea una hoja en Google Sheets con las siguientes pestañas exactas:
 *    - Eventos
 *    - Predicas
 *    - Devocional
 *    - Canciones
 *    - Servicios
 *    - Kids_Historias
 *    - Kids_Versiculos
 *    - Kids_Trivia
 *    - Lema_Iglesia
 * 
 * 2. Ve a: Extensiones > Apps Script.
 * 3. Borra el código existente y pega este archivo completo.
 * 4. Haz clic en "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 5. Selecciona tipo "Aplicación web" (Web app):
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone)
 * 6. Copia la URL generada (termina en /exec) y pégala en:
 *    `src/environments/environment.ts` y `environment.production.ts`
 * ==============================================================================
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetParam = e && e.parameter ? e.parameter.sheet : null;

    // Si se pide una pestaña individual (ej: ?sheet=Eventos)
    if (sheetParam) {
      const data = getSheetData(ss, sheetParam);
      return jsonResponse({ success: true, sheet: sheetParam, data: data });
    }

    // Por defecto devuelve todas las secciones consolidadas
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        events: getSheetData(ss, 'Eventos', parseEvent),
        sermons: getSheetData(ss, 'Predicas', parseSermon),
        devotional: getSingleRowData(ss, 'Devocional', parseDevotional),
        choirSongs: getSheetData(ss, 'Canciones', parseChoirSong),
        ministries: getSheetData(ss, 'Servicios', parseMinistry),
        kidsStories: getSheetData(ss, 'Kids_Historias', parseGeneric),
        memoryVerses: getSheetData(ss, 'Kids_Versiculos', parseMemoryVerse),
        kidsTrivia: getSheetData(ss, 'Kids_Trivia', parseTrivia),
        motto: getSingleRowData(ss, 'Lema_Iglesia', parseGeneric)
      }
    };

    return jsonResponse(response);
  } catch (error) {
    return jsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

// -----------------------------------------------------------------------------
// Lectura de Hojas y Transformación
// -----------------------------------------------------------------------------

function getSheetData(ss, sheetName, itemParser) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0].map(h => String(h).trim());
  const results = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    // Salta filas que estén completamente vacías en sus primeras columnas
    if (!row[0] && !row[1]) continue;

    let item = {};
    headers.forEach((header, index) => {
      let val = row[index];
      if (val !== undefined && val !== null) {
        if (typeof val === 'string') {
          val = val.trim();
        }
      }
      item[header] = val;
    });

    if (itemParser) {
      item = itemParser(item, i);
    }

    results.push(item);
  }

  return results;
}

function getSingleRowData(ss, sheetName, itemParser) {
  const list = getSheetData(ss, sheetName, itemParser);
  return list.length > 0 ? list[0] : null;
}

// -----------------------------------------------------------------------------
// Parsers Específicos por Tipo
// -----------------------------------------------------------------------------

function parseEvent(item, index) {
  if (!item.id) item.id = 'event-' + index;
  item.featured = String(item.featured).toLowerCase() === 'true' || item.featured === true;
  return item;
}

function parseSermon(item, index) {
  if (!item.id) item.id = 'sermon-' + index;
  if (typeof item.tags === 'string') {
    item.tags = item.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
  } else if (!Array.isArray(item.tags)) {
    item.tags = [];
  }
  return item;
}

function parseDevotional(item, index) {
  if (!item.id) item.id = 'devotional-' + index;
  if (typeof item.reflection === 'string') {
    // Permite separar párrafos con || o saltos de línea dobles
    if (item.reflection.indexOf('||') !== -1) {
      item.reflection = item.reflection.split('||').map(p => p.trim()).filter(p => p.length > 0);
    } else {
      item.reflection = item.reflection.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);
    }
  } else if (!Array.isArray(item.reflection)) {
    item.reflection = [String(item.reflection || '')];
  }
  return item;
}

function parseChoirSong(item, index) {
  if (!item.id) item.id = 'song-' + index;
  return item;
}

function parseMinistry(item, index) {
  if (!item.id) item.id = 'ministry-' + index;
  if (typeof item.benefits === 'string') {
    item.benefits = item.benefits.split('||').map(b => b.trim()).filter(b => b.length > 0);
  } else if (!Array.isArray(item.benefits)) {
    item.benefits = [];
  }
  return item;
}

function parseMemoryVerse(item, index) {
  item.id = Number(item.id) || index;
  return item;
}

function parseTrivia(item, index) {
  item.id = Number(item.id) || index;
  item.correctAnswer = Number(item.correctAnswer) || 0;
  if (typeof item.options === 'string') {
    item.options = item.options.split('||').map(o => o.trim()).filter(o => o.length > 0);
  } else if (!Array.isArray(item.options)) {
    item.options = [];
  }
  return item;
}

function parseGeneric(item) {
  return item;
}

// -----------------------------------------------------------------------------
// Salida JSON con Cabeceras
// -----------------------------------------------------------------------------

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
