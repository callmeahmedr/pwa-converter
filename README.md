# PWA Converter
This project allows you to easily convert any static website into a Progressive Web App (PWA). Simply clone the repository and include the `pwa.js` script in your website's HTML.

## How to Use
1. Clone the repository into your project:

    ```bash
    git clone https://github.com/callmeahmedr/pwa-converter.git
    ```

2. Copy the `pwa/` folder and `service-worker.js` into your website's root directory.

3. Add the following script tag to your HTML file(s):

    ```html
    <script src="/pwa/pwa.js"></script>
    ```

4. Customize the `manifest.json` file and icons in the `pwa/` folder as needed.

## Customizing the Manifest
The `manifest.json` file can be customized to match your website's branding and requirements:

- **`name`:** Full name of your app.
- **`short_name`:** A shorter version of the name.
- **`start_url`:** The entry point for your app.
- **`display`:** How the app is displayed (e.g., standalone, fullscreen).
- **`background_color`:** The background color for the splash screen.
- **`theme_color`:** The color of the app's title bar.

Replace the default icons with your own by adding them to the `icons/` directory and updating the paths in `manifest.json`.

## Deployment
To deploy your PWA:

1. Make sure the `dist/` folder is in your website's root directory.
2. Add the script tag to your HTML.
3. The PWA will now work on your site!

## License
This project is licensed under the MIT License.
