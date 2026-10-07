/**
 * Main front-end application logic.
 *
 * Responsibilities:
 *  - manage the expression input (keypad + keyboard);
 *  - request calculations from the backend (never calculate locally);
 *  - render results and error messages;
 *  - render, refresh and delete calculation history from the backend.
 */
(function () {
  'use strict';

  const dom = {
    expression: document.getElementById('expression'),
    result: document.getElementById('result'),
    message: document.getElementById('message'),
    keys: document.getElementById('keys'),
    historyList: document.getElementById('history-list'),
    historyEmpty: document.getElementById('history-empty'),
    refreshHistory: document.getElementById('refresh-history'),
    clearHistory: document.getElementById('clear-history'),
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('status-text'),
  };

  /* ---------------------------------------------------------------- utils */

  /** Show an inline message; type is 'error' | 'success' | ''. */
  function showMessage(text, type) {
    dom.message.textContent = text || '';
    dom.message.className = 'message' + (type ? ' ' + type : '');
  }

  /** Append text at the end of the expression input. */
  function appendToExpression(text) {
    dom.expression.value += text;
    dom.expression.focus();
  }

  /** Remove the last character of the expression input. */
  function backspace() {
    dom.expression.value = dom.expression.value.slice(0, -1);
    dom.expression.focus();
  }

  /** Reset the whole calculator view. */
  function clearAll() {
    dom.expression.value = '';
    dom.result.textContent = '—';
    showMessage('', '');
    dom.expression.focus();
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------------------ calculate */

  /** Send the current expression to the backend and display its result. */
  async function calculate() {
    const expression = dom.expression.value.trim();
    if (!expression) {
      showMessage('请输入表达式', 'error');
      return;
    }

    showMessage('计算中…', '');
    try {
      const data = await CalculatorApi.calculate(expression);
      dom.result.textContent = data.result;
      showMessage('计算成功（结果由后端返回）', 'success');
      await loadHistory();
    } catch (error) {
      dom.result.textContent = '—';
      showMessage(error.message, 'error');
    }
  }

  /* -------------------------------------------------------------- history */

  /** Load history from the backend and render it. */
  async function loadHistory() {
    try {
      const history = await CalculatorApi.getHistory();
      renderHistory(history);
      setStatus(true);
    } catch (error) {
      showMessage(error.message, 'error');
      setStatus(false);
    }
  }

  /** Render the history list. */
  function renderHistory(history) {
    dom.historyList.innerHTML = '';

    if (!history || history.length === 0) {
      dom.historyEmpty.classList.remove('hidden');
      return;
    }
    dom.historyEmpty.classList.add('hidden');

    history.forEach(function (record) {
      const item = document.createElement('li');
      item.className = 'history-item';
      item.innerHTML =
        '<div>' +
        '<button class="replay" title="重新填入表达式">↺</button>' +
        '<span class="expr">' + escapeHtml(record.expression) + '</span>' +
        '<div class="meta">#' + record.id + ' · ' + escapeHtml(record.createdAt) + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span class="value">= ' + escapeHtml(record.result) + '</span>' +
        '<button class="delete" title="删除该记录">✕</button>' +
        '</div>';

      item.querySelector('.replay').addEventListener('click', function () {
        dom.expression.value = record.expression;
        dom.expression.focus();
      });

      item.querySelector('.delete').addEventListener('click', function () {
        deleteRecord(record.id);
      });

      dom.historyList.appendChild(item);
    });
  }

  /** Delete a single record then refresh from the backend. */
  async function deleteRecord(id) {
    try {
      await CalculatorApi.deleteHistory(id);
      showMessage('已删除记录 #' + id, 'success');
      await loadHistory();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }

  /** Delete every record then refresh from the backend. */
  async function clearHistory() {
    if (!window.confirm('确定要清空全部历史记录吗？')) {
      return;
    }
    try {
      await CalculatorApi.clearHistory();
      showMessage('已清空历史记录', 'success');
      await loadHistory();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }

  /* ---------------------------------------------------------- status dot */

  function setStatus(online) {
    dom.statusDot.className = 'dot ' + (online ? 'online' : 'offline');
    dom.statusText.textContent = online ? '后端服务已连接' : '后端服务不可用';
  }

  async function checkStatus() {
    try {
      await CalculatorApi.health();
      setStatus(true);
    } catch (error) {
      setStatus(false);
    }
  }

  /* ------------------------------------------------------------- events */

  function bindEvents() {
    dom.keys.addEventListener('click', function (event) {
      const button = event.target.closest('button');
      if (!button) {
        return;
      }
      const action = button.dataset.action;
      if (action === 'clear') {
        clearAll();
      } else if (action === 'backspace') {
        backspace();
      } else if (action === 'equals') {
        calculate();
      } else if (button.dataset.value) {
        appendToExpression(button.dataset.value);
      }
    });

    dom.expression.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        calculate();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        clearAll();
      }
    });

    dom.refreshHistory.addEventListener('click', loadHistory);
    dom.clearHistory.addEventListener('click', clearHistory);
  }

  /* --------------------------------------------------------------- init */

  function init() {
    bindEvents();
    checkStatus();
    loadHistory();
    dom.expression.focus();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
