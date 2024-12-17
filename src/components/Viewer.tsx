import React, { Suspense } from 'react';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import {
    GizmoHelper,
    GizmoViewport,
    Grid,
    OrbitControls,
    PivotControls,
    Splat,
    useGLTF,
} from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';

import { useTheme } from '../context/ThemeContext';
import Skybox from './Skybox';

interface Model {
    url: string;
    name: string;
    type: 'splat' | 'obj' | 'fbx' | 'glb';
}
interface ModelsProps {
    model: Model;
    showHelpers: boolean;
}

interface ViewerProps {
    models: Model[];
    canvasRef: React.RefObject<HTMLCanvasElement>;
    showHelpers: boolean;
}

const Viewer: React.FC<ViewerProps> = ({ models, canvasRef, showHelpers }) => {
    const { theme } = useTheme();

    return (
        <Canvas
            ref={canvasRef}
            gl={{ preserveDrawingBuffer: true }}
            camera={{ position: [0, 2, 4] }}
        >
            <ambientLight />
            {models.map((model, index) => (
                <Models key={index} model={model} showHelpers={showHelpers} />
            ))}
            {showHelpers && (
                <GizmoHelper alignment="bottom-right" margin={[60, 60]} renderPriority={1}>
                    <GizmoViewport
                        axisColors={
                            theme === 'dark' ? ['#fff', '#fff', '#fff'] : ['#000', '#000', '#000']
                        }
                        labelColor={theme === 'dark' ? 'black' : 'white'}
                    />
                </GizmoHelper>
            )}
            {showHelpers && (
                <Grid
                    position={[0, 0.01, 0]}
                    args={[10, 10]}
                    cellSize={0.5}
                    cellThickness={0.75}
                    cellColor={theme === 'light' ? '#333' : '#ddd'}
                    sectionSize={5}
                    sectionThickness={2}
                    sectionColor={theme === 'light' ? '#333' : '#ddd'}
                    fadeDistance={25}
                    fadeStrength={2}
                    followCamera={false}
                    infiniteGrid={true}
                />
            )}
            <Skybox type="HDRI" />
            <OrbitControls
                makeDefault
                maxPolarAngle={Math.PI / 1.6}
                minDistance={1}
                maxDistance={30}
                enablePan={true}
            />
        </Canvas>
    );
};

export default Viewer;

function Box() {
    return (
        <mesh>
            <boxGeometry />
            <meshStandardMaterial />
        </mesh>
    );
}

// FBX Model component
function FbxModel({ url }: { url: string }) {
    const fbx = useLoader(FBXLoader, url);
    return <primitive object={fbx} scale={0.01} />;
}

// OBJ Model component
function ObjModel({ url }: { url: string }) {
    const obj = useLoader(OBJLoader, url);
    return <primitive object={obj} scale={0.5} />;
}
// GLB Model component
function GlbModel({ url }: { url: string }) {
    const gltf = useGLTF(url);
    return <primitive object={gltf.scene} />;
}

function Models({ model, showHelpers }: ModelsProps) {
    return (
        <Suspense fallback={<Box />}>
            <PivotControls anchor={[0, 1, 0]} annotations={true} visible={showHelpers}>
                {model.type === 'splat' && (
                    <Splat alphaTest={0.1} position={[0, 0, 0]} src={model.url} />
                )}
                {model.type === 'fbx' && <FbxModel url={model.url} />}
                {model.type === 'obj' && <ObjModel url={model.url} />}
                {model.type === 'glb' && <GlbModel url={model.url} />}
            </PivotControls>
        </Suspense>
    );
}
