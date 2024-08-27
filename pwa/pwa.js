/**
 * pwa.js - Script for handling Progressive Web App (PWA) features
 * 
 * This script performs the following functions:
 * 1. Injects the manifest.json into the HTML head to define PWA properties.
 * 2. Registers a service worker to enable offline capabilities and caching.
 * 3. Handles the installation prompt for the PWA, including showing a custom install button.
 * 
 * Author: Muhammad Ahmed (https://github.com/callmeahmedr/)
 * Open source project: https://github.com/callmeahmedr/pwa-converter
 */

(function () {
    // Inject the manifest.json into the HTML head
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/pwa/manifest.json'; // Path to the manifest file
    document.head.appendChild(manifestLink);

    // Register the service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js') // Path to the service worker
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
        e.preventDefault(); // Prevent the default install prompt
        deferredPrompt = e; // Save the event for later use

        // Create an Install PWA button with an icon
        const installButton = document.createElement('div');
        installButton.style.position = 'fixed'; // Position it fixed
        installButton.style.bottom = '10px'; // Distance from bottom
        installButton.style.left = '10px'; // Position on the left side
        installButton.style.zIndex = '1000'; // Layering above other elements
        installButton.style.width = '60px'; // Width of the button
        installButton.style.height = '60px'; // Height of the button
        installButton.style.borderRadius = '50%'; // Make it fully rounded
        installButton.style.backgroundColor = '#c1ff72'; // Blue background color
        installButton.style.display = 'flex'; // Flexbox for alignment
        installButton.style.alignItems = 'center'; // Center items vertically
        installButton.style.justifyContent = 'center'; // Center items horizontally
        installButton.style.cursor = 'pointer'; // Pointer cursor on hover
        installButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Add shadow for better visibility
        installButton.style.position = 'fixed'; // Position relative for tooltip positioning

        // Create an image element for the icon
        const icon = document.createElement('img');
        icon.src = '/pwa/icons/install-icon.png'; // Path to your icon image
        icon.alt = 'Install'; // Alt text for accessibility
        icon.style.width = '30px'; // Width of the icon
        icon.style.height = '30px'; // Height of the icon

        // Append the icon to the button
        installButton.appendChild(icon);

        // Create a tooltip element
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Install Web App!'; // Tooltip text
        tooltip.style.position = 'absolute'; // Absolute positioning for the tooltip
        tooltip.style.bottom = '15px'; // Position above the button
        tooltip.style.left = '70px'; // Position to the right of the button
        tooltip.style.backgroundColor = '#333'; // Dark background color
        tooltip.style.color = '#fff'; // White text color
        tooltip.style.padding = '5px 10px'; // Padding
        tooltip.style.borderRadius = '4px'; // Rounded corners
        tooltip.style.fontSize = '12px'; // Font size
        tooltip.style.whiteSpace = 'nowrap'; // Prevent text wrapping
        tooltip.style.opacity = '0'; // Initially hidden
        tooltip.style.transition = 'opacity 0.3s'; // Fade in effect

        // Append the tooltip to the button
        installButton.appendChild(tooltip);

        // Append the button to the body
        document.body.appendChild(installButton);

        // Add hover effects
        installButton.addEventListener('mouseover', () => {
            installButton.style.backgroundColor = '#b5e17d'; // Darker blue on hover
            tooltip.style.opacity = '1'; // Show tooltip
        });

        installButton.addEventListener('mouseout', () => {
            installButton.style.backgroundColor = '#c1ff72'; // Original blue color
            tooltip.style.opacity = '0'; // Hide tooltip
        });

        // Show the install prompt when the button is clicked
        installButton.addEventListener('click', () => {
            installButton.style.display = 'none'; // Hide the button
            deferredPrompt.prompt(); // Show the install prompt

            // Check what the user chose
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null; // Reset the deferred prompt variable
            });
        });
    });
})();
