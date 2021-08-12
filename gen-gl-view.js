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
// import fontJson from "./fonts/optimer_regular.typeface.json";
import fontJson from "./fonts/zcool_xiaowei.typeface.json";
import boardResource from "./assets/board.png";
import {
  Spinner,
  Center,
  KeyboardAvoidingView,
  Button,
  useToast,
} from "native-base";
import * as MediaLibrary from "expo-media-library";

const font = new THREE.FontLoader().parse(fontJson);

const ratio = PixelRatio.get();

export default function App(props) {
  const { text } = props;
  const [loading, setLoading] = useState(false);
  const [gl, setGL] = useState();
  const toast = useToast();
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

  const handleSave = async () => {
    if (!gl) {
      return;
    }
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const { localUri } = await GLView.takeSnapshotAsync(gl, {
      format: "png",
      rect: {
        x: (width - 328 * ratio) / 2,
        y: (height - 254 * ratio) / 2,
        width: 328 * ratio,
        height: 254 * ratio,
      },
    });
    await MediaLibrary.saveToLibraryAsync(localUri);
    toast.show({
      title: "保存成功！",
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      h={{
        base: "600px",
        lg: "auto",
      }}
    >
      {loading && (
        <Center style={{ flex: 1 }}>
          <Spinner color="gray.900" />
        </Center>
      )}
      {!loading && (
        <>
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

              const camera = new PerspectiveCamera(
                50,
                width / height,
                0.1,
                2000
              );
              camera.position.z = 10;
              const scene = new Scene();
              const cube = new ImageMesh();
              cube.scale.x = (328 * ratio) / 200;
              cube.scale.y = (254 * ratio) / 200;
              scene.add(cube);
              camera.lookAt(scene.position);

              const textMesh = new TextMesh(text || "");
              textMesh.position.set(-0.48, 0.48, 1);
              scene.add(textMesh);

              const render = () => {
                timeout = requestAnimationFrame(render);
                renderer.render(scene, camera);
                gl.endFrameEXP();
              };
              render();
              setGL(gl);
            }}
          />
          <Button onPress={handleSave}>保存到相册</Button>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

class ImageMesh extends Mesh {
  constructor() {
    super(
      new PlaneGeometry(1, 1, 1),
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
      new ShapeGeometry(font.generateShapes(text, 0.24)),
      new MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 1,
        // side: THREE.DoubleSide,
      })
    );
  }
}
