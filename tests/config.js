/**
 * Configuración compartida para todos los tests K6
 * 
 * Exports:
 *   - baseUrl: URL base de la API
 *   - optionsGeneral: Configuración general reutilizable
 */

export const config = {
  baseUrl: 'https://automationexercise.com/api',
  apiTimeout: 30000,
  connectTimeout: 10000,
  maxRedirects: 5,
};

export const optionsGeneral = {
  executor: 'constant-vus',
  vus: 10,
  duration: '10s',
};

/**
 * Ejemplo de uso en un archivo de test:
 * 
 * import { config, optionsGeneral } from '../config/config.js';
 * 
 * const base_url = config.baseUrl;
 * 
 * export const options = {
 *   scenarios: {
 *     API1: {
 *       ...optionsGeneral,
 *       exec: 'testFunction',
 *       startTime: '0s'
 *     }
 *   }
 * };
 */
