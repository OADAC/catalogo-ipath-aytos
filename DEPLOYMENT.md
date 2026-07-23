# Publicación directa en GitHub Pages

## 1. Repositorio y Release

El repositorio debe ser público para que el catálogo y los adjuntos del Release puedan abrirse sin autenticación.

```text
Nombre del Release: assetsipath
Tag: catalogoipath
```

## 2. Archivos que debes subir

Sube todo el contenido de este paquete directamente a la raíz del repositorio. No subas la carpeta contenedora ni la carpeta local `assets`.

No deben existir archivos de autenticación como `login.html`, `login.js`, `login.css` o `access-config.js`.

## 3. Activar Pages

1. Abre `Settings`.
2. Entra en `Pages`.
3. Elige `Deploy from a branch`.
4. Selecciona `main`.
5. Selecciona `/ (root)`.
6. Pulsa `Save`.

## 4. Prueba

Abre `https://TU-USUARIO.github.io/TU-REPOSITORIO/release-check.html` y después la raíz del catálogo. Debe mostrarse directamente, sin pantalla de acceso.
