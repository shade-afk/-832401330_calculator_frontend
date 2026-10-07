/**
 * API client for the separated calculator backend.
 *
 * Every function returns a promise and talks to the backend over HTTP/JSON.
 * No calculation happens here — results always come from the backend.
 */
const CalculatorApi = (function () {
  'use strict';

  const baseUrl = APP_CONFIG.API_BASE_URL;
  const timeout = APP_CONFIG.REQUEST_TIMEOUT;

  /**
   * Perform a fetch with a timeout and unified error handling.
   *
   * @param {string} path      API path, e.g. "/api/calculate".
   * @param {object} [options] fetch options.
   * @returns {Promise<object>} parsed JSON body.
   */
  async function request(path, options) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(baseUrl + path, Object.assign({
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      }, options || {}));

      let body = null;
      try {
        body = await response.json();
      } catch (parseError) {
        body = null;
      }

      if (!response.ok) {
        const message = (body && body.message) || ('请求失败 (HTTP ' + response.status + ')');
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }
      return body || {};
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请确认后端服务已启动');
      }
      if (error instanceof TypeError) {
        throw new Error('无法连接后端服务，请确认后端已启动且地址正确');
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    /**
     * Ask the backend to evaluate an expression.
     * @param {string} expression
     * @returns {Promise<{id:number, expression:string, result:number, createdAt:string}>}
     */
    calculate: function (expression) {
      return request('/api/calculate', {
        method: 'POST',
        body: JSON.stringify({ expression: expression }),
      });
    },

    /**
     * Fetch the persisted calculation history.
     * @returns {Promise<Array<object>>}
     */
    getHistory: function () {
      return request('/api/history').then(function (body) {
        return body.history || [];
      });
    },

    /**
     * Delete a single history record.
     * @param {number} id
     */
    deleteHistory: function (id) {
      return request('/api/history/' + id, { method: 'DELETE' });
    },

    /**
     * Delete every history record.
     */
    clearHistory: function () {
      return request('/api/history', { method: 'DELETE' });
    },

    /**
     * Check whether the backend service is reachable.
     * @returns {Promise<boolean>}
     */
    health: function () {
      return request('/api/health').then(function () { return true; });
    },
  };
})();

window.CalculatorApi = CalculatorApi;
