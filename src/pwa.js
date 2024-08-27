// src/pwa.js

(function() {
    // Automatically inject the manifest.json into the HTML head
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Register the service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }

    // Handle the PWA installation prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        const installButton = document.createElement('button');
        installButton.textContent = 'Install PWA';
        installButton.style.position = 'fixed';
        installButton.style.bottom = '10px';
        installButton.style.right = '10px';
        installButton.style.zIndex = '1000';
        document.body.appendChild(installButton);

        installButton.addEventListener('click', () => {
            installButton.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    });
})();
