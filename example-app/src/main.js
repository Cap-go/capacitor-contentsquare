import './style.css';
import { ContentsquarePlugin, CurrencyCode } from '@capgo/capacitor-contentsquare';

const output = document.getElementById('plugin-output');
const statusBadge = document.getElementById('status-badge');
const optInButton = document.getElementById('opt-in');
const optOutButton = document.getElementById('opt-out');
const screenButton = document.getElementById('send-screen');
const transactionButton = document.getElementById('send-transaction');
const dynamicVarButton = document.getElementById('send-dynamic-var');

const setOutput = (value) => {
  output.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
};

const setStatus = (state) => {
  statusBadge.textContent = state;
  statusBadge.dataset.enabled = String(state === 'Opted in');
};

optInButton.addEventListener('click', async () => {
  try {
    await ContentsquarePlugin.optIn();
    setStatus('Opted in');
    setOutput('Called optIn()');
  } catch (error) {
    setOutput(`Error: ${error?.message ?? error}`);
  }
});

optOutButton.addEventListener('click', async () => {
  try {
    await ContentsquarePlugin.optOut();
    setStatus('Opted out');
    setOutput('Called optOut()');
  } catch (error) {
    setOutput(`Error: ${error?.message ?? error}`);
  }
});

screenButton.addEventListener('click', async () => {
  try {
    await ContentsquarePlugin.sendScreenName('Example - Home');
    setOutput('Sent screenview: Example - Home');
  } catch (error) {
    setOutput(`Error: ${error?.message ?? error}`);
  }
});

transactionButton.addEventListener('click', async () => {
  try {
    await ContentsquarePlugin.sendTransaction({
      transactionValue: 19.99,
      transactionCurrency: CurrencyCode.EUR,
      transactionId: `example-${Date.now()}`,
    });
    setOutput('Sent example transaction.');
  } catch (error) {
    setOutput(`Error: ${error?.message ?? error}`);
  }
});

dynamicVarButton.addEventListener('click', async () => {
  try {
    await ContentsquarePlugin.sendDynamicVar({
      dynVarKey: 'environment',
      dynVarValue: 'example-app',
    });
    setOutput('Sent dynamic variable: environment=example-app');
  } catch (error) {
    setOutput(`Error: ${error?.message ?? error}`);
  }
});

setStatus('Waiting for consent');
