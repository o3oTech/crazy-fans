import { GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import React, { useState } from "react";
import {
  PerspectiveCamera,
  Scene,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  ShapeGeometry,
} from "three";
import { PixelRatio } from "react-native";
import fontJson from "./fonts/Microsoft_YaHei_Regular.json";
import boardResource from "./assets/board.png";
import { View, Spinner, Center } from "native-base";
// import { Asset } from "expo-asset";
const font = new THREE.FontLoader().parse(fontJson);

const ratio = PixelRatio.get();

export default function App(props) {
  const [loading, setLoading] = useState(false);
  const { text } = props;
  let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [text]);

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <Center style={{ flex: 1 }}>
          <Spinner color="gray.900" />
        </Center>
      )}
      {!loading && (
        <GLView
          style={{ flex: 1 }}
          onContextCreate={async (gl) => {
            const { drawingBufferWidth: width, drawingBufferHeight: height } =
              gl;
            const sceneColor = 0x6ad6f0;

            // Create a WebGLRenderer without a DOM element
            const renderer = new Renderer({ gl });
            renderer.setSize(width, height);
            renderer.setClearColor(sceneColor);

            const camera = new PerspectiveCamera(50, width / height, 0.1, 2000);
            camera.position.z = 10;

            // const asset = Asset.fromModule(boardResource);
            // await asset.downloadAsync();

            const scene = new Scene();
            const cube = new ImageMesh();
            scene.add(cube);

            const textMesh = new TextMesh(text || "");
            textMesh.position.set(-0.4, 0.4, 1);
            scene.add(textMesh);

            const render = () => {
              timeout = requestAnimationFrame(render);
              renderer.render(scene, camera);
              gl.endFrameEXP();
            };
            render();
          }}
        />
      )}
    </View>
  );
}

class ImageMesh extends Mesh {
  constructor() {
    super(
      new PlaneGeometry(ratio, ratio, 1),
      new MeshBasicMaterial({
        map: new TextureLoader().load(boardResource),
        // color: 0xff0000,
      })
    );
  }
}

class TextMesh extends Mesh {
  constructor(text) {
    super(
      new ShapeGeometry(font.generateShapes(text, 0.2)),
      new MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8,
        // side: THREE.DoubleSide,
      })
    );
  }
}
