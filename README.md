# McLaren F1 Interactive Experience

A touch-enabled 3D interactive experience featuring a McLaren F1 race car for CES 2025.

## Features

- **3D Interactive Model**: Fully explorable McLaren F1 car with gesture controls
- **Touch-Optimized**: Tap-to-rotate, pinch-to-zoom, drag-to-spin
- **Information Hotspots**: Interactive learning modules anchored to car components
- **Lead Generation**: QR code integration for mobile engagement
- **Kiosk Security**: Password-protected, locked-down tablet experience

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser to `http://localhost:5174`

4. Enter password: `mclaren2025`

## Controls

- **Rotate**: Click and drag or single finger drag
- **Zoom**: Mouse wheel or pinch gesture
- **Reset**: Double-click anywhere
- **Hotspots**: Click on pulsing dots to learn more
- **QR Code**: Click orange button in bottom-right

## Project Structure

```
src/
├── components/
│   ├── 3D/
│   │   ├── Scene.jsx          # Main 3D scene setup
│   │   ├── F1Car.jsx          # 3D car model (placeholder)
│   │   └── Hotspots.jsx       # Interactive hotspot system
│   ├── UI/
│   │   └── QRCode.jsx         # Lead generation QR code
│   └── Kiosk/
│       ├── PasswordGate.jsx   # Access control
│       └── IdleReset.jsx      # Auto-reset functionality
├── data/
│   └── hotspots.json          # Hotspot configuration
└── hooks/
    └── useGestures.js         # Custom touch gestures
```

## Configuration

### Hotspots
Edit `src/data/hotspots.json` to modify hotspot positions and content.

### Password
Change the password in `src/components/Kiosk/PasswordGate.jsx` (line 7).

### Idle Timer
Adjust timeout in `src/App.jsx` (default: 60 seconds).

## Next Steps

1. **Replace placeholder car**: Import actual McLaren F1 GLB model
2. **Add real content**: Replace placeholder text with Deloitte/McLaren content
3. **Styling**: Apply brand colors and fonts
4. **Performance**: Optimize for tablet hardware
5. **Testing**: Cross-device compatibility testing

## Tech Stack

- **Vite + React 18**: Fast development and optimized builds
- **React Three Fiber**: Declarative 3D with Three.js
- **@react-three/drei**: Pre-built 3D components
- **@use-gesture/react**: Touch gesture handling
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations

## Browser Support

- iOS Safari (iPad)
- Chrome (Android tablets)
- Modern tablet browsers with WebGL support