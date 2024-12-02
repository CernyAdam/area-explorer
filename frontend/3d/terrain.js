import { 
    BoxBufferGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
  } from "https://cdn.skypack.dev/three@0.132.2";

//Create a scene
const container = document.querySelector('#initial-scene');
const scene = new Scene();
const fov = 35; // Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

scene.background = new Color('lightgrey');
const camera = new PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 10); //moves the camera back


/* Tree.js sample code as per https://discoverthreejs.com/book/first-steps/first-scene/ */
    // create a geometry
    const geometry = new BoxBufferGeometry(2, 2, 2);

    // create a default (white) Basic material
    const material = new MeshBasicMaterial({ color: 'purple' });

    // create a Mesh containing the geometry and material
    const cube = new Mesh(geometry, material);
    //add rotation to the cube

    cube.rotation.set(-0.5, -0.1, 0.8);
    // add the mesh to the scene
    scene.add(cube);

    // create the renderer
    const renderer = new WebGLRenderer();

    // next, set the renderer to the same size as our container element
    renderer.setSize(container.clientWidth, container.clientHeight);

    // finally, set the pixel ratio so that our scene will look good on HiDPI displays
    renderer.setPixelRatio(window.devicePixelRatio);

    // add the automatically created <canvas> element to the page
    container.append(renderer.domElement);

    // render, or 'create a still image', of the scene
    renderer.render(scene, camera);

