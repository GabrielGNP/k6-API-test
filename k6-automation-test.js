import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend } from 'k6/metrics';

const api1Duration = new Trend('api1_duration');
const api2Duration = new Trend('api2_duration');
const api3Duration = new Trend('api3_duration');
const api4Duration = new Trend('api4_duration');
const api5Duration = new Trend('api5_duration');
const api6Duration = new Trend('api6_duration');
const api8Duration = new Trend('api8_duration');
const api9Duration = new Trend('api9_duration');
const api10Duration = new Trend('api10_duration');


const optionsGeneral = {
    // executor: 'per-vu-iterations',
    executor: 'constant-vus',
    vus: 10,
    duration: '10s',
    // iterations: 20  
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
    API3: {
        ...optionsGeneral,
        exec: 'API3_GetAllBrandsList',
        startTime: '20s'
    },
    API4: {
        ...optionsGeneral,
        exec: 'API4_PutBrandsList',
        startTime: '30s'
    },
    API5: {
        ...optionsGeneral,
        exec: 'API5_PostSearchProduct',
        startTime: '40s'
    },
    API6: {
        ...optionsGeneral,
        exec: 'API6_PostSearchProductWithoutParam',
        startTime: '50s'
    },
    API8: {
        ...optionsGeneral,
        exec: 'API8_PostVerifyLoginWithoutEmail',
        startTime: '60s'
    },
    API9: {
        ...optionsGeneral,
        exec: 'API9_DeleteToVerifyLogin',
        startTime: '70s'
    },
    API10: {
        ...optionsGeneral,
        exec: 'API10_PostToVerifyLoginWithInvalidDetails',
        startTime: '80s'
    },
  },
//   thresholds: {
//     'api1_duration': ['p(95)<500'], 
//     'api2_duration': ['p(95)<500'],  
//     'api3_duration': ['p(95)<500'],
//     'api4_duration': ['p(95)<500'],
//     'api5_duration': ['p(95)<500'],
//     'api6_duration': ['p(95)<500'],
//     'api8_duration': ['p(95)<500'],
//     'api9_duration': ['p(95)<500'],
//     'api10_duration': ['p(95)<500']
//   }
};


const base_url = 'https://automationexercise.com/api';

export function API1_GetAllProductsList(){
    const start = Date.now();
    const url = `${base_url}/productsList`;
    let res = http.get(url, { 
        tags: { name: 'API1' }
    });

    api1Duration.add(Date.now() - start);  

    check(res, { 
        '(API1)----------------------------------------': () => true === true,
        '(API1) status is 200': (res) => res.status === 200,
        '(API1) Respuesta body incluye products':(res)=>res.body.includes(`"products":`),
        '(API1) products > 0':(res)=>JSON.parse(res.body).products.length > 0,
        '(API1) Tiempo de solicitud < 500ms':(res)=>res.timings.duration < 500
    });
    sleep(1);
}
export function API2_PostToAllProductsList(){
    const start = Date.now();
    const url = `${base_url}/productsList`;
    let res = http.post(url, "This request method is not supported", { 
        tags: { name: 'API2' }
    });

    api2Duration.add(Date.now() - start);  

    check(res, { 
        '(API2)----------------------------------------': () => true === true,
        '(API2) status is 405': (res) => res.status === 405,
        '(API2) Respuesta body: "This request method is not supported"':(res)=>res.body.includes(`"This request method is not supported"`),
        '(API2) Tiempo de solicitud < 500ms':(res)=>res.timings.duration < 500
    });
    sleep(1);
}
export function API3_GetAllBrandsList(){
    const start = Date.now();
    const url = `${base_url}/brandsList`;
    let res = http.get(url, { 
        tags: { name: 'API3' }
    });

    api3Duration.add(Date.now() - start);  

    check(res, { 
        '(API3)----------------------------------------': () => true === true,
        '(API3) status is 200': (res) => res.status === 200,
        '(API3) Respuesta body incluye brands':(res)=>res.body.includes(`"brands":`),
        '(API3) brands > 0':(res)=>JSON.parse(res.body).brands.length > 0,
        '(API3) Tiempo de solicitud < 500ms':(res)=>res.timings.duration < 500
    });
    sleep(1);
}
export function API4_PutBrandsList() {
    const start = Date.now();
    const url = `${base_url}/brandsList`;
    const res = http.put(url, null, { 
        tags: { name: 'API4' }
    });
    
    api4Duration.add(Date.now() - start);  

    check(res, {
        '(API4)----------------------------------------': () => true === true,
        '(API4) status 405': (r) => r.status === 405,
        '(API4) response contains error message': (r) => r.body.includes('This request method is not supported') || r.status === 405,
        '(API4) response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    sleep(1);
}
export function API5_PostSearchProduct(){
    const start = Date.now();
    const url = `${base_url}/searchProduct`;
    const payload = 'search_product=top';
    let res = http.post(url, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, { 
        tags: { name: 'API5' }
    });

    api5Duration.add(Date.now() - start);  

    check(res, { 
        '(API5)----------------------------------------': () => true === true,
        '(API5) status is 200': (res) => res.status === 200,
        '(API5) Respuesta body incluye products':(res)=>res.body.includes(`"products"`),
        '(API5) products > 0':(res)=>JSON.parse(res.body).products.length > 0,
        '(API5) Tiempo de solicitud < 500ms':(res)=>res.timings.duration < 500
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
    tags: { name: 'API6' }
  });
  
  api6Duration.add(Date.now() - start);  // Registrar tiempo en métrica
  
  check(res, {
    '(API6)----------------------------------------': () => true === true,
    '(API6) status 400': (r) => r.status === 400,
    '(API6) error message present': (r) => r.body.includes('Bad request'),
    '(API6) response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
export function API8_PostVerifyLoginWithoutEmail() {
  const start = Date.now();
  const url = `${base_url}/verifyLogin`;
  
  // Enviar solo password sin email
  const payload = 'password=1234';
  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    tags: { name: 'API8' }
  });
  
  api8Duration.add(Date.now() - start);  // Registrar tiempo en métrica
  
  check(res, {
    '(API8)----------------------------------------': () => true === true,
    '(API8) status 400': (r) => r.status === 400,
    '(API8) error message present': (r) => r.body.includes('Bad request') && r.body.includes('email or password parameter is missing'),
    '(API8) response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
export function API9_DeleteToVerifyLogin() {
  const start = Date.now();
  const url = `${base_url}/verifyLogin`;
  
  // Enviar DELETE request (método no soportado)
  const res = http.del(url, null, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    tags: { name: 'API9' }
  });
  
  api9Duration.add(Date.now() - start);  // Registrar tiempo en métrica
  
  check(res, {
    '(API9)----------------------------------------': () => true === true,
    '(API9) status 405': (r) => r.status === 405,
    '(API9) response message "This request method is not supported"': (r) => r.body.includes('This request method is not supported'),
    '(API9) response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
export function API10_PostToVerifyLoginWithInvalidDetails() {
  const start = Date.now();
  const url = `${base_url}/verifyLogin`;
  
  // Enviar POST con email y password inválidos
  const payload = 'email=invalid@test.com&password=wrongpassword';
  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    tags: { name: 'API10' }
  });
  
  api10Duration.add(Date.now() - start);  // Registrar tiempo en métrica
  
  check(res, {
    '(API10)----------------------------------------': () => true === true,
    '(API10) status 404': (r) => r.status === 404,
    '(API10) response message "User not found!"': (r) => r.body.includes('User not found'),
    '(API10) response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
