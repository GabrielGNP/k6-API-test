import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend } from 'k6/metrics';

// ===== CUSTOM METRICS =====
const api1Duration = new Trend('products_api1_duration');
const api2Duration = new Trend('products_api2_duration');
const api5Duration = new Trend('products_api5_duration');
const api6Duration = new Trend('products_api6_duration');

// ===== CONFIGURACIÓN =====
const optionsGeneral = {
  executor: 'constant-vus',
  vus: 10,
  duration: '10s',
};

export const options = {
  scenarios: {
    API1: {
      ...optionsGeneral,
      exec: 'API1_GetAllProductsList',
      startTime: '0s'
    },
    API2: {
      ...optionsGeneral,
      exec: 'API2_PostToAllProductsList',
      startTime: '10s'
    },
    API5: {
      ...optionsGeneral,
      exec: 'API5_PostSearchProduct',
      startTime: '20s'
    },
    API6: {
      ...optionsGeneral,
      exec: 'API6_PostSearchProductWithoutParam',
      startTime: '30s'
    },
  },
  /*
  thresholds: {
    'products_api1_duration': ['p(95)<500'],
    'products_api2_duration': ['p(95)<500'],
    'products_api5_duration': ['p(95)<500'],
    'products_api6_duration': ['p(95)<500']
  }
  */
};

const base_url = 'https://automationexercise.com/api';

// ===== FUNCIONES POR CASO =====

export function API1_GetAllProductsList() {
  const start = Date.now();
  const url = `${base_url}/productsList`;
  const res = http.get(url, { 
    tags: { name: 'Products_API1' }
  });

  api1Duration.add(Date.now() - start);

  check(res, {
    '(Products/API1)-----------------------------------------------': () => true === true,
    '(Products/API1) status is 200': (res) => res.status === 200,
    '(Products/API1) Respuesta body incluye products': (res) => res.body.includes(`"products":`),
    '(Products/API1) products > 0': (res) => JSON.parse(res.body).products.length > 0,
    '(Products/API1) Tiempo de solicitud < 500ms': (res) => res.timings.duration < 500
  });
  sleep(1);
}

export function API2_PostToAllProductsList() {
  const start = Date.now();
  const url = `${base_url}/productsList`;
  const res = http.post(url, "This request method is not supported", {
    tags: { name: 'Products_API2' }
  });

  api2Duration.add(Date.now() - start);

  check(res, {
    '(Products/API2)-----------------------------------------------': () => true === true,
    '(Products/API2) status is 405': (res) => res.status === 405,
    '(Products/API2) Respuesta body: "This request method is not supported"': (res) => res.body.includes(`"This request method is not supported"`),
    '(Products/API2) Tiempo de solicitud < 500ms': (res) => res.timings.duration < 500
  });
  sleep(1);
}

export function API5_PostSearchProduct() {
  const start = Date.now();
  const url = `${base_url}/searchProduct`;
  const payload = 'search_product=top';
  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    tags: { name: 'Products_API5' }
  });

  api5Duration.add(Date.now() - start);

  check(res, {
    '(Products/API5)-----------------------------------------------': () => true === true,
    '(Products/API5) status is 200': (res) => res.status === 200,
    '(Products/API5) Respuesta body incluye products': (res) => res.body.includes(`"products"`),
    '(Products/API5) products > 0': (res) => JSON.parse(res.body).products.length > 0,
    '(Products/API5) Tiempo de solicitud < 500ms': (res) => res.timings.duration < 500
  });
  sleep(1);
}

export function API6_PostSearchProductWithoutParam() {
  const start = Date.now();
  const url = `${base_url}/searchProduct`;

  // Enviar request sin parámetro search_product
  const payload = JSON.stringify({});
  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'Products_API6' }
  });

  api6Duration.add(Date.now() - start);

  check(res, {
    '(Products/API6)-----------------------------------------------': () => true === true,
    '(Products/API6) status 400': (r) => r.status === 400,
    '(Products/API6) error message present': (r) => r.body.includes('Bad request'),
    '(Products/API6) response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
