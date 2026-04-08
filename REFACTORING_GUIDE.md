# K6 Tests - Estructura Refactorizada

Esta es la nueva estructura de tests K6, **organizados por grupo funcional** en lugar de un único archivo monolítico.

## 📁 Estructura de directorios

```
K6/
├── tests/
│   ├── config.js                 # Configuración compartida
│   ├── products/
│   │   └── products.js          # Tests de Products (API1, API2, API5, API6)
│   ├── brands/
│   │   └── brands.js            # Tests de Brands (API3, API4)
│   ├── auth/
│   │   └── auth.js              # Tests de Auth (API8, API9, API10)
│   └── helpers/
│       └── checks.js            # Checks reutilizables
├── run-all.js                    # Orquestador: IMPORTA todos los tests (sin duplicación)
├── k6-automation-test.js         # [DEPRECATED] Archivo antiguo
└── k6-tests.md                   # Definición de tests (actualizado con Status)
```

## 🚀 Cómo usar

### Opción 1: Ejecutar TODOS los grupos (Recomendado)

```bash
# Ejecutar todos los tests (90 segundos total: 9 APIs × 10s cada una)
k6 run run-all.js

# Con output JSON
k6 run run-all.js -o json=results.json

# Con parámetros custom
k6 run run-all.js --vus 20 --duration 15s
```

### Opción 2: Ejecutar UN solo grupo

```bash
# Solo tests de Products
k6 run tests/products/products.js

# Solo tests de Brands
k6 run tests/brands/brands.js

# Solo tests de Auth
k6 run tests/auth/auth.js
```

### Opción 3: Modificar configuración en tiempo de ejecución

```bash
# Cambiar número de VUs (usuarios virtuales)
k6 run run-all.js --vus 50

# Cambiar duración
k6 run run-all.js --duration 30s

# Ejecutar con limite de requests por segundo
k6 run run-all.js --rps 100

# Generar reporte HTML
k6 run run-all.js -o html=reporte.html
```

## 📊 Salida esperada

Cuando ejecutas `k6 run run-all.js`, verás métricas por grupo:

```
     data_received..................: 145 kB   1.6 kB/s
     data_sent.......................: 8.2 kB  90 B/s
     http_req_blocked................: avg=12.5ms  min=1.2ms   med=11.3ms  max=45.6ms p(90)=22.1ms p(95)=28.4ms
     http_req_connecting.............: avg=0ms    min=0ms     med=0ms     max=0ms    p(90)=0ms    p(95)=0ms
     http_req_duration...............: avg=145ms  min=89ms    med=142ms   max=238ms  p(90)=195ms  p(95)=212ms
     http_req_failed.................: 0%      ✓ 0     ✗ 0
     http_req_receiving..............: avg=2.1ms  min=0.3ms   med=1.9ms   max=12.1ms p(90)=3.8ms  p(95)=4.5ms
     http_req_sending................: avg=0.2ms  min=0.1ms   med=0.2ms   max=1.2ms  p(90)=0.3ms  p(95)=0.4ms
     http_req_tls_handshaking........: avg=0ms    min=0ms     med=0ms     max=0ms    p(90)=0ms    p(95)=0ms
     http_req_waiting................: avg=143ms  min=87ms    med=140ms   max=236ms  p(90)=192ms  p(95)=210ms
     http_reqs.......................: 90      1.0 req/s
     iteration_duration..............: avg=1.15s  min=1.09s   med=1.14s   max=1.24s  p(90)=1.21s  p(95)=1.22s
     iterations.....................: 90      1.0 itr/s

   ✓ products_api1_duration........: avg=145ms p(95)=210ms
   ✓ products_api2_duration........: avg=142ms p(95)=205ms
   ✓ products_api5_duration........: avg=148ms p(95)=215ms
   ✓ products_api6_duration........: avg=151ms p(95)=220ms
   ✓ brands_api3_duration..........: avg=146ms p(95)=212ms
   ✓ brands_api4_duration..........: avg=149ms p(95)=218ms
   ✓ auth_api8_duration............: avg=152ms p(95)=225ms
   ✓ auth_api9_duration............: avg=155ms p(95)=228ms
   ✓ auth_api10_duration...........: avg=158ms p(95)=232ms
```

## 🎯 Ventajas de esta estructura

### Antes (Monolítico)
```javascript
// k6-automation-test.js - TODOS los tests en UN archivo
export function API1_GetAllProductsList() { ... }
export function API2_PostToAllProductsList() { ... }
export function API3_GetAllBrandsList() { ... }
export function API8_PostVerifyLoginWithoutEmail() { ... }
export function API9_DeleteToVerifyLogin() { ... }
// ... 400+ líneas en un solo archivo
```

**Problemas:**
- ❌ Difícil de mantener en proyectos grandes
- ❌ No se pueden ejecutar tests de un endpoint específico
- ❌ Cambios en un endpoint afectan todo el archivo
- ❌ Difícil agregar nuevo endpoint (400+ líneas)

### Ahora (Modular + Sin duplicación)
```
tests/
├── products/products.js     # Solo products (API1, API2, API5, API6) — source of truth
├── brands/brands.js         # Solo brands (API3, API4) — source of truth
└── auth/auth.js            # Solo auth (API8, API9, API10) — source of truth

run-all.js                  # Orquestador (IMPORTA desde source, sin duplicación)
```

**Beneficios:**
- ✅ **DRY (Don't Repeat Yourself)**: Una sola fuente de verdad
- ✅ **Mantenibilidad**: cambios en `tests/products/products.js` = automáticamente reflejados
- ✅ **Escalabilidad**: agregar endpoint es agregar a su grupo
- ✅ **Ejecución selectiva**: ejecuta solo lo que necesitas
- ✅ **Métricas claras**: cada grupo reporta sus propias métricas
- ✅ **No hay duplicación**: `run-all.js` es ~50 líneas, no 500+
- ✅ **Facilidad**: cuando el proyecto crezca, es obvio dónde agregar

## 🔌 Cómo agregar un nuevo endpoint

### Ejemplo: Agregar API11 de Products

**1. Abrir** [tests/products/products.js](tests/products/products.js)

**2. Agregar métrica:**
```javascript
const api11Duration = new Trend('products_api11_duration');
```

**3. Agregar scenario en `options`:**
```javascript
export const options = {
  scenarios: {
    // ... otros
    API11: {
      ...optionsGeneral,
      exec: 'API11_MyNewTest',
      startTime: '40s'  // Ajustar según número de tests
    },
  },
};
```

**4. Agregar función exportada:**
```javascript
export function API11_MyNewTest() {
  const start = Date.now();
  const url = `${base_url}/myEndpoint`;
  const res = http.get(url, {
    tags: { name: 'Products_API11' }
  });

  api11Duration.add(Date.now() - start);

  check(res, {
    '(Products/API11)-------': () => true === true,
    '(Products/API11) status': (r) => r.status === 200,
  });
  sleep(1);
}
```

**5. Actualizar `run-all.js`:**
- Importar la nueva función
- Agregar scenario
- Re-exportar con alias

```javascript
// Agregar a la importación
import {
  API1_GetAllProductsList,
  API2_PostToAllProductsList,
  API5_PostSearchProduct,
  API6_PostSearchProductWithoutParam,
  API11_MyNewTest  // ← NUEVO
} from './tests/products/products.js';

// Agregar scenario
ProductsAPI11: {
  ...optionsGeneral,
  exec: 'ProductsAPI11_MyNewTest',
  startTime: '40s'
},

// Agregar re-export
API11_MyNewTest as ProductsAPI11_MyNewTest
```

✅ **Ventaja:** El cambio en `tests/products/products.js` se refleja automáticamente en `run-all.js`

## 📖 Patrón de Importación en run-all.js

### ✅ Patrón correcto (SIN duplicación)

```javascript
// run-all.js - Importa desde los archivos de grupo
import { API1_GetAllProductsList } from './tests/products/products.js';

export const options = {
  scenarios: {
    ProductsAPI1: { exec: 'ProductsAPI1_GetAllProductsList', ... }
  }
};

export { API1_GetAllProductsList as ProductsAPI1_GetAllProductsList };
```

**Ventajas:**
- Single source of truth (funciones definidas una sola vez)
- Cambios automáticos (editar = reflejado al instante)
- DRY (Don't Repeat Yourself)

### ❌ Patrón anterior (CON duplicación)

```javascript
// ❌ NO HACER ESTO - run-all.js redefine la función
export function ProductsAPI1_GetAllProductsList() {
  // ... código DUPLICADO (existe también en tests/products/products.js)
  // ... cambios aquí NO se reflejan en tests/products/products.js
}
```

**Problemas:**
- Dos fuentes de verdad
- Cambios desincronizados
- Mantenimiento complicado

## 🔍 Debugging

### Ejecutar un solo test
```bash
# Ejecutar solo un scenario
k6 run tests/products/products.js --scenarios API1
```

### Ver logs detallados
```bash
# Con output verbose
k6 run tests/products/products.js -v

# Con output JSON para análisis
k6 run tests/products/products.js -o json=debug.json
```

##  Más información

- [K6 Documentación oficial](https://k6.io/docs/)
- [K6 Script API](https://k6.io/docs/javascript-api/)
- [K6 Scenarios](https://k6.io/docs/getting-started/running-k6/#defining-scenarios)
