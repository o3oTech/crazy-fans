import { GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import * as React from "react";
import {
  PerspectiveCamera,
  Scene,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  ShapeGeometry,
} from "three";
import fontJson from "./fonts/Microsoft_YaHei_Regular.json";

const font = new THREE.FontLoader().parse(fontJson);

export default function App() {
  let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={async (gl) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0x6ad6f0;

        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);

        const camera = new PerspectiveCamera(50, width / height, 0.1, 2000);
        camera.position.z = 10;

        const scene = new Scene();

        const cube = new ImageMesh();
        scene.add(cube);

        const text = new TextMesh();
        text.position.set(-0.7, 0, 1);
        scene.add(text);

        const render = () => {
          timeout = requestAnimationFrame(render);
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        render();
      }}
    />
  );
}

class ImageMesh extends Mesh {
  constructor() {
    super(
      new PlaneGeometry(3, 3, 1),
      new MeshBasicMaterial({
        map: new TextureLoader().load(
          require("./assets/FloorsCheckerboard_S_Diffuse.jpg")
        ),
        // color: 0xff0000,
      })
    );
  }
}

class TextMesh extends Mesh {
  constructor() {
    super(
      new ShapeGeometry(font.generateShapes("中国人", 0.35)),
      new MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      })
    );
  }
}
