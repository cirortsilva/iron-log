// IRON LOG — Service Worker
// Roda em processo separado do browser.
// Recebe mensagem com o delay, agenda a notificação via setTimeout,
// e a dispara independentemente de o app estar aberto ou não.

let _notifTimeout = null;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('message', event => {
  const { type, delay } = event.data || {};

  if (type === 'SCHEDULE_NOTIFICATION') {
    clearTimeout(_notifTimeout);
    _notifTimeout = setTimeout(() => {
      self.registration.showNotification('IRON LOG — Descanso concluído!', {
        body: '💪 2:30 encerrados. Hora da próxima série!',
        tag: 'rest-timer',
        renotify: true,
        requireInteraction: false,
        silent: false,
      });
    }, delay * 1000); // delay em segundos → ms
  }

  if (type === 'CANCEL_NOTIFICATION') {
    clearTimeout(_notifTimeout);
    _notifTimeout = null;
  }
});

// Toque na notificação abre/foca o app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        if (clients.length) return clients[0].focus();
        return self.clients.openWindow('/');
      })
  );
});
