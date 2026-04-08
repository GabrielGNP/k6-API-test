/**
 * Common checks reutilizables para todos los tests
 * 
 * Ejemplo de uso en un test:
 * import { commonChecks } from '../helpers/checks.js';
 * 
 * check(res, {
 *   ...commonChecks.success200(res),
 *   'Custom check': (r) => r.body.includes('expected data')
 * });
 */

export const commonChecks = {
  /**
   * Validar status 200 OK
   */
  success200: (res) => ({
    'Status is 200': (r) => r.status === 200,
    'Response body not empty': (r) => r.body && r.body.length > 0,
    'Content-Type present': (r) => 'content-type' in r.headers,
    'Response time < 500ms': (r) => r.timings.duration < 500,
  }),

  /**
   * Validar status 201 Created
   */
  success201: (res) => ({
    'Status is 201': (r) => r.status === 201,
    'Response body not empty': (r) => r.body && r.body.length > 0,
    'Response time < 500ms': (r) => r.timings.duration < 500,
  }),

  /**
   * Validar status 400 Bad Request
   */
  badRequest400: (res) => ({
    'Status is 400': (r) => r.status === 400,
    'Error message present': (r) => r.body.includes('error') || r.body.includes('Bad request'),
    'Response time < 500ms': (r) => r.timings.duration < 500,
  }),

  /**
   * Validar status 404 Not Found
   */
  notFound404: (res) => ({
    'Status is 404': (r) => r.status === 404,
    'Response time < 500ms': (r) => r.timings.duration < 500,
  }),

  /**
   * Validar status 405 Method Not Allowed
   */
  methodNotAllowed405: (res) => ({
    'Status is 405': (r) => r.status === 405,
    'Error message present': (r) => r.body.includes('This request method is not supported'),
    'Response time < 500ms': (r) => r.timings.duration < 500,
  }),

  /**
   * Validar respuesta JSON básica
   */
  isValidJSON: (res) => ({
    'Response is valid JSON': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch (e) {
        return false;
      }
    },
  }),
};

/**
 * Validar múltiples checks en una respuesta
 */
export function validateResponse(res, expectedStatus = 200) {
  return {
    [`Status ${expectedStatus}`]: (r) => r.status === expectedStatus,
    'Content-Type present': (r) => 'content-type' in r.headers,
    'Response body not empty': (r) => r.body && r.body.length > 0,
    'Response time < 500ms': (r) => r.timings.duration < 500,
  };
}
