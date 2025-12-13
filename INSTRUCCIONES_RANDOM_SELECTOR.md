# Instrucciones para el Componente RandomNumberSelector

## 📁 Ubicación Actual de los Archivos

Los archivos del componente están ubicados en:

```
src/components/
├── RandomNumberSelector.jsx          (Componente principal)
├── RandomNumberSelector.css          (Estilos del componente)
└── RandomNumberSelector.test.jsx      (Tests unitarios)
```

## 🚀 Cómo Integrar el Componente en la Aplicación

### Opción 1: Agregar al componente App.jsx

1. **Edita `src/App.jsx`:**

```jsx
import './App.css'
import Welcome from './components/Welcome'
import RandomNumberSelector from './components/RandomNumberSelector'  // Agregar esta línea

function App() {
  return (
    <div className="App">
      <Welcome />
      <RandomNumberSelector />  {/* Agregar este componente */}
    </div>
  )
}

export default App
```

2. **Ajusta los estilos en `src/App.css` si es necesario** para el espaciado entre componentes.

### Opción 2: Crear una nueva ruta/página

Si quieres que el componente esté en una página separada, necesitarías:

1. Instalar React Router:
```bash
npm install react-router-dom
```

2. Configurar rutas en `src/main.jsx` o crear un archivo de rutas.

## 📦 Para Deployment

### Los archivos ya están en la ubicación correcta

Los archivos están en `src/components/`, que es la ubicación estándar para componentes React. Cuando ejecutes:

```bash
npm run build
```

Vite automáticamente:
- Incluirá el componente en el bundle si está importado
- Optimizará el código
- Generará los archivos en `dist/` listos para S3

### Si NO quieres incluir el componente en el build actual

Si el componente no está importado en ningún lugar, Vite NO lo incluirá en el bundle final. Esto significa que:

- ✅ Los archivos pueden quedarse en `src/components/`
- ✅ No afectarán el tamaño del bundle actual
- ✅ Cuando los importes en el futuro, se incluirán automáticamente

## 🧪 Ejecutar Tests del Componente

Para probar el componente de forma independiente:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo los tests del RandomNumberSelector
npm test RandomNumberSelector

# Ejecutar tests en modo watch
npm run test:watch
```

## 📝 Características del Componente

- ✅ Permite establecer número de inicio y fin
- ✅ Genera números aleatorios dentro del rango
- ✅ Validación de entrada (inicio < fin)
- ✅ Muestra error si el rango es inválido
- ✅ Botón de reinicio
- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ Tests completos incluidos

## 🔄 Flujo de Deployment

1. **Desarrollo local:**
   - Los archivos están en `src/components/`
   - Importa el componente donde lo necesites
   - Prueba localmente con `npm run dev`

2. **Build:**
   - Ejecuta `npm run build`
   - Vite incluirá el componente si está importado
   - Los archivos se generan en `dist/`

3. **Deployment:**
   - CodeBuild ejecutará el build automáticamente
   - Los artefactos se generan en `dist/`
   - CodePipeline despliega a S3

## ⚠️ Nota Importante

El componente **NO está incluido** en la aplicación actual porque no está importado en `App.jsx`. Esto significa:

- No afecta el tamaño del bundle actual
- No aparece en la web
- Está listo para usar cuando lo necesites
- Solo necesitas importarlo donde quieras usarlo

