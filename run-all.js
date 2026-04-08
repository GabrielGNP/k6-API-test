/**
 * K6 Test Orchestrator
 * 
 * Orquestador central que importa tests desde archivos separados y los ejecuta:
 * - Products (API1, API2, API5, API6): 0-40s
 * - Brands (API3, API4): 40-60s
 * - Auth (API8, API9, API10): 60-90s
 * 
 * Total: 90 segundos (9 APIs × 10s cada una)
 * 
 * Ventajas:
 *   ✅ Sin duplicación de código
 *   ✅ Single source of truth (cambios en un solo lugar)
 *   ✅ Ejecución centralizada con métricas consolidadas
 * 
 * Uso:
 *   k6 run run-all.js
 *   k6 run run-all.js --vus 20 --duration 15s
 *   k6 run run-all.js -o json=results.json
 */

// ===== IMPORTAR funciones desde archivos separados =====
import {
  API1_GetAllProductsList,
  API2_PostToAllProductsList,
  API5_PostSearchProduct,
  API6_PostSearchProductWithoutParam
} from './tests/products/products.js';

import {
  API3_GetAllBrandsList,
  API4_PutBrandsList
} from './tests/brands/brands.js';

import {
  API8_PostVerifyLoginWithoutEmail,
  API9_DeleteToVerifyLogin,
  API10_PostToVerifyLoginWithInvalidDetails
} from './tests/auth/auth.js';

// ===== CONFIGURACIÓN GENERAL =====
const optionsGeneral = {
  executor: 'constant-vus',
  vus: 10,
  duration: '10s',
};

export const options = {
  scenarios: {
    // === PRODUCTS ===
    ProductsAPI1: {
      ...optionsGeneral,
      exec: 'ProductsAPI1_GetAllProductsList',
      startTime: '0s'
    },
    ProductsAPI2: {
      ...optionsGeneral,
      exec: 'ProductsAPI2_PostToAllProductsList',
      startTime: '10s'
    },
    ProductsAPI5: {
      ...optionsGeneral,
      exec: 'ProductsAPI5_PostSearchProduct',
      startTime: '20s'
    },
    ProductsAPI6: {
      ...optionsGeneral,
      exec: 'ProductsAPI6_PostSearchProductWithoutParam',
      startTime: '30s'
    },

    // === BRANDS ===
    BrandsAPI3: {
      ...optionsGeneral,
      exec: 'BrandsAPI3_GetAllBrandsList',
      startTime: '40s'
    },
    BrandsAPI4: {
      ...optionsGeneral,
      exec: 'BrandsAPI4_PutBrandsList',
      startTime: '50s'
    },

    // === AUTH ===
    AuthAPI8: {
      ...optionsGeneral,
      exec: 'AuthAPI8_PostVerifyLoginWithoutEmail',
      startTime: '60s'
    },
    AuthAPI9: {
      ...optionsGeneral,
      exec: 'AuthAPI9_DeleteToVerifyLogin',
      startTime: '70s'
    },
    AuthAPI10: {
      ...optionsGeneral,
      exec: 'AuthAPI10_PostToVerifyLoginWithInvalidDetails',
      startTime: '80s'
    },
  },

  /*
  thresholds: {
    'products_api1_duration': ['p(95)<500'],
    'products_api2_duration': ['p(95)<500'],
    'products_api5_duration': ['p(95)<500'],
    'products_api6_duration': ['p(95)<500'],
    'brands_api3_duration': ['p(95)<500'],
    'brands_api4_duration': ['p(95)<500'],
    'auth_api8_duration': ['p(95)<500'],
    'auth_api9_duration': ['p(95)<500'],
    'auth_api10_duration': ['p(95)<500']
  }
  */
};

// ===== RE-EXPORTAR funciones importadas con nombres que coincidan con scenarios =====
export {
  API1_GetAllProductsList as ProductsAPI1_GetAllProductsList,
  API2_PostToAllProductsList as ProductsAPI2_PostToAllProductsList,
  API5_PostSearchProduct as ProductsAPI5_PostSearchProduct,
  API6_PostSearchProductWithoutParam as ProductsAPI6_PostSearchProductWithoutParam,
  API3_GetAllBrandsList as BrandsAPI3_GetAllBrandsList,
  API4_PutBrandsList as BrandsAPI4_PutBrandsList,
  API8_PostVerifyLoginWithoutEmail as AuthAPI8_PostVerifyLoginWithoutEmail,
  API9_DeleteToVerifyLogin as AuthAPI9_DeleteToVerifyLogin,
  API10_PostToVerifyLoginWithInvalidDetails as AuthAPI10_PostToVerifyLoginWithInvalidDetails
};
