import React, { Suspense, useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, Gltf, Html, useProgress, Environment } from '@react-three/drei';
import { Layers, Grid, Sun, Camera, RotateCw, Image as ImageIcon, Box } from 'lucide-react';
import * as THREE from 'three';

// Global JSX namespace augmentation for R3F elements
// We need to ensure these are picked up by TypeScript as valid JSX elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      gridHelper: any;
      axesHelper: any;
      primitive: any;
      mesh: any;
      color: any;
    }
  }
}

export interface ViewerRef {
  resetCamera: () => void;
  captureScreenshot: () => void;
}

interface Viewer3DProps {
  fileUrl: string;
  backgroundColor?: string;
  hideControls?: boolean;
}

const ENV_PRESETS: Record<string, string> = {
  'city': 'City',
  'studio': 'Studio',
  'sunset': 'Sunset',
  'dawn': 'Dawn',
  'night': 'Night',
  'forest': 'Forest'
};

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white font-bold bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
          {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

// Inner component to handle scene logic and interactions
const SceneContent = ({ 
  fileUrl, 
  settings, 
  controlsRef 
}: { 
  fileUrl: string, 
  settings: { wireframe: boolean, grid: boolean, axes: boolean, autoRotate: boolean, environment: string },
  controlsRef: React.MutableRefObject<any>
}) => {
  const gltfRef = useRef<THREE.Group>(null);
  
  // Handle Wireframe toggling
  useEffect(() => {
    if (gltfRef.current) {
      gltfRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          // We need to clone material to avoid affecting the cached model for other views if any
          // But for simple toggle, direct mutation is often sufficient in single view
          child.material.wireframe = settings.wireframe;
        }
      });
    }
  }, [settings.wireframe, fileUrl]);

  return (
    <>
      <Stage 
        environment={settings.environment as any} 
        intensity={0.6} 
        contactShadow={{ resolution: 1024, scale: 10, blur: 2, opacity: 0.5, color: '#000000' }}
        adjustCamera={1.2}
      >
        <Gltf 
           ref={gltfRef}
           src={fileUrl} 
        />
      </Stage>
      
      {settings.grid && <gridHelper args={[20, 20, 0x888888, 0x444444]} position={[0, -0.01, 0]} />}
      {settings.axes && <axesHelper args={[5]} />}
      
      <OrbitControls 
        ref={controlsRef} 
        autoRotate={settings.autoRotate} 
        autoRotateSpeed={1.5}
        makeDefault 
      />
    </>
  );
};

const Viewer3D = forwardRef<ViewerRef, Viewer3DProps>(({ fileUrl, backgroundColor = '#f9fafb', hideControls = false }, ref) => {
  const controlsRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Viewer State
  const [settings, setSettings] = useState({
    wireframe: false,
    grid: false,
    axes: false,
    autoRotate: false,
    environment: 'city'
  });

  const [showEnvMenu, setShowEnvMenu] = useState(false);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      controlsRef.current?.reset();
    },
    captureScreenshot: () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.setAttribute('download', 'model-screenshot.png');
        link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
        link.click();
      }
    }
  }));

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative w-full h-full group select-none">
      <Canvas 
        ref={canvasRef}
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 150], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }} // Required for screenshots
      >
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={<Loader />}>
          <SceneContent fileUrl={fileUrl} settings={settings} controlsRef={controlsRef} />
        </Suspense>
      </Canvas>

      {!hideControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          {/* Environment Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowEnvMenu(!showEnvMenu)}
              className={`p-2 rounded-md shadow-lg transition-colors ${showEnvMenu ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              title="Lighting Environment"
            >
              <Sun className="w-5 h-5" />
            </button>
            {showEnvMenu && (
              <div className="absolute right-full mr-2 top-0 bg-white rounded-md shadow-xl py-1 w-32 overflow-hidden border border-gray-100">
                {Object.entries(ENV_PRESETS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSettings(s => ({ ...s, environment: key }));
                      setShowEnvMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${settings.environment === key ? 'text-primary font-medium bg-blue-50' : 'text-gray-700'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Wireframe */}
          <button 
            onClick={() => toggleSetting('wireframe')}
            className={`p-2 rounded-md shadow-lg transition-colors ${settings.wireframe ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            title="Toggle Wireframe"
          >
            <Layers className="w-5 h-5" />
          </button>

          {/* Toggle Grid */}
          <button 
            onClick={() => toggleSetting('grid')}
            className={`p-2 rounded-md shadow-lg transition-colors ${settings.grid ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            title="Toggle Grid"
          >
            <Grid className="w-5 h-5" />
          </button>

          {/* Toggle Auto-Rotate */}
          <button 
            onClick={() => toggleSetting('autoRotate')}
            className={`p-2 rounded-md shadow-lg transition-colors ${settings.autoRotate ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            title="Auto Rotate"
          >
            <RotateCw className="w-5 h-5" />
          </button>

           {/* Screenshot */}
           <button 
            onClick={() => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    const link = document.createElement('a');
                    link.download = 'screenshot.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }
            }}
            className="bg-white text-gray-700 hover:bg-gray-50 p-2 rounded-md shadow-lg transition-colors"
            title="Take Screenshot"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Reset Camera */}
          <button 
            onClick={() => controlsRef.current?.reset()}
            className="bg-white text-gray-700 hover:bg-gray-50 p-2 rounded-md shadow-lg transition-colors"
            title="Reset Camera"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
});

Viewer3D.displayName = 'Viewer3D';

export default Viewer3D;