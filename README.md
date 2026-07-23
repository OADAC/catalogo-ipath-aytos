# iPath · Catálogo municipal público en GitHub Pages

Versión estática del catálogo iPath preparada para abrirse directamente mediante un enlace público de GitHub Pages.

Las imágenes y el vídeo se cargan desde el Release de GitHub:

- **Release:** `assetsipath`
- **Tag:** `catalogoipath`
- **Assets esperados:** 51 archivos individuales

## Acceso directo

Esta edición no contiene pantalla de acceso, contraseña, sesión local ni redirecciones. El visitante entra directamente en `index.html`.

Se mantienen medidas disuasorias de presentación: marca visual de CUEVA, bloqueo de impresión, bloqueo del arrastre y del menú contextual sobre recursos visuales, cortina al abandonar la pestaña y solicitud de no indexación.

Estas medidas no pueden impedir técnicamente una captura realizada por el sistema operativo o por otro dispositivo.

## Condición del Release

1. El Release debe estar publicado, no en borrador.
2. El repositorio del Release debe ser público.
3. Cada imagen y vídeo debe figurar como archivo individual, no dentro de un ZIP.
4. Los nombres deben coincidir con `release-assets-manifest.json`.

## Archivos que debes subir

Sube directamente a la raíz del repositorio todos los archivos de este paquete. No necesitas subir la carpeta `assets`.

## Activación

En GitHub: `Settings` → `Pages` → `Deploy from a branch` → rama `main` → carpeta `/ (root)` → `Save`.

Después abre primero `release-check.html` y, a continuación, la URL raíz del catálogo.
