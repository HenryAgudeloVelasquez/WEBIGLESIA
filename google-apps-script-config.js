/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT 2 - CONFIGURACIÓN WEB, SEO Y CONTACTOS PASTORALES
 * ==============================================================================
 * 
 * Este script administra el SEGUNDO archivo de Google Sheets independiente:
 * "Configuracion Web & SEO - En su Gracia"
 * 
 * PESTAÑAS EXACTAS QUE DEBE TENER ESTA HOJA:
 * 1. SEO_Paginas
 * 2. WhatsApp_Por_Pagina
 * 3. Contacto_Pastoral
 * 4. Horarios_Bendicion
 * 
 * INSTRUCCIONES DE DESPLIEGUE:
 * 1. En tu segundo Google Sheets, ve a: Extensiones > Apps Script.
 * 2. Pega este código completo reemplazando el contenido existente.
 * 3. Haz clic en "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 4. Tipo: "Aplicación web" (Web app):
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone)
 * 5. Copia la URL (termina en /exec) y pégala en `environment.ts` en `googleSheetsConfigUrl`.
 * ==============================================================================
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetParam = e && e.parameter ? e.parameter.sheet : null;

    if (sheetParam) {
      const data = getSheetData(ss, sheetParam);
      return jsonResponse({ success: true, sheet: sheetParam, data: data });
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        seo: getSheetData(ss, 'SEO_Paginas', parseSeo),
        whatsapp: getSheetData(ss, 'WhatsApp_Por_Pagina', parseWhatsApp),
        contact: getSingleRowData(ss, 'Contacto_Pastoral', parseContact),
        schedules: getSheetData(ss, 'Horarios_Bendicion', parseSchedule)
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
// Lectura de Datos
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
// Parsers Específicos
// -----------------------------------------------------------------------------

function parseSeo(item) {
  if (item.page) item.page = String(item.page).toLowerCase().trim();
  return item;
}

function parseWhatsApp(item) {
  if (item.page) item.page = String(item.page).toLowerCase().trim();
  if (item.phone) item.phone = String(item.phone).replace(/\D/g, ''); // Deja solo dígitos
  return item;
}

function parseContact(item) {
  return item;
}

function parseSchedule(item) {
  return item;
}

// -----------------------------------------------------------------------------
// Salida JSON
// -----------------------------------------------------------------------------

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
