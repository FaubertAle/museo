import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

export default class SceneInit {
  constructor(canvasRef, uniforms, shaderInfo) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.camera2D = undefined;
    this.camera3D = undefined;
    this.snapCamera = undefined;
    this.renderer = undefined;
    this.animation = undefined;

    // NOTE: Camera params;
    this.fov = 45;
    this.nearPlane = 0.1;
    this.farPlane = 5;
    this.aspect = undefined;

    // NOTE: Additional components.
    this.controls = undefined;
    this._uniforms = uniforms;
    this.activeCamera = true;
    this.activeModel = true;
    this.loader = undefined;

    // NOTE: Page elements
    this._canvas = canvasRef;
    this.pointer = { x: 0, y: 0 };

    // NOTE: Scene elements
    this.geometry = undefined;
    this.geometry2D = undefined;
    this.geometry3D = undefined;
    this.model = undefined;
    this.material = undefined;
    this.mesh = undefined;
    this._shader = shaderInfo;
  }

  initialize() {
    this.aspect = this._canvas.clientWidth / this._canvas.clientHeight;
    this._uniforms.u_resolution.value = new THREE.Vector2(
      this._canvas.clientWidth,
      this._canvas.clientHeight
    );

    this.scene = new THREE.Scene();

    this.scene.background = new THREE.CubeTextureLoader()
      .setPath("Textures/cubeMaps/")
      .load([
        "posx.jpg",
        "negx.jpg",
        "posy.jpg",
        "negy.jpg",
        "posz.jpg",
        "negz.jpg",
      ]);
    
    this.camera2D = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.geometry2D = new THREE.PlaneGeometry(2, 2);

    this.camera3D = new THREE.PerspectiveCamera(
      this.fov,
      this.aspect,
      this.nearPlane,
      this.farPlane,
    );
    this.camera3D.position.z = 3.5;
    this.geometry3D = new THREE.IcosahedronGeometry(1, 2);

    this.loader = new GLTFLoader();
    this.loader.load(
      "Models/planoInclinado.glb",
      (gltf) => {
        // gltf.scene.scale.set(.01, .01, .01);
        this.model = gltf.scene.children[0].geometry;
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    this._canvas.addEventListener("mousedown", this.handlerClic.bind(this));
    this._canvas.addEventListener("mouseup", this.handlerClic.bind(this));
    this._canvas.addEventListener("mousemove", this.savePointerData.bind(this));
    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.material = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: this._shader.vertexShader,
      fragmentShader:
        this._shader.fragmentShader.defaultCode +
        this._shader.fragmentShader.viewCode,
    });

    this.camera = this.camera2D;
    this.scene.add(this.camera);
    this.geometry = this.geometry2D;

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
    
    this._canvas.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera3D, this.renderer.domElement);
    this.controls.enableDamping = true; //Movimiento de camara suave
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 5;
    this.controls.maxPolarAngle = Math.PI;

    this.animation = requestAnimationFrame(this.animate.bind(this));
  }

  savePointerData(e) {
    if (this._uniforms.u_clic.value) {
      this.pointer.x = e.offsetX / this._canvas.clientWidth;
      this.pointer.y = 1 - e.offsetY / this._canvas.clientHeight;
      this._uniforms.u_pointer.value = new THREE.Vector2(
        this.pointer.x,
        this.pointer.y
      );
    }
  }

  handlerClic(e) {
    this._uniforms.u_clic.value = !this._uniforms.u_clic.value;
    this.savePointerData(e);
  }

  animate(time) {
    // NOTE: Update uniform data on each render.
    this._uniforms["u_time"].value = time / 100;
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    this.animation = requestAnimationFrame(this.animate.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = this._canvas.clientWidth / this._canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
  }

  setInputValue = (e, name) => {
    this._uniforms[name].value = e;
  };

  switchCamera(){
    this.activeCamera = !this.activeCamera;
    this.camera = this.activeCamera? this.camera2D: this.camera3D;
    this.geometry = this.activeCamera? this.geometry2D: this.geometry3D;
    this.mesh.geometry = this.geometry;
  }

  switchModel(){
    this.activeModel = !this.activeModel;
    this.geometry = this.activeModel? this.geometry3D: this.model;
    this.mesh.geometry = this.geometry;
  }

  getCanvas(){
    return [this._canvas.clientWidth, this._canvas.clientHeight];
  }

  snapRender(){
    this.snapCamera = this.camera;
    this.renderer.render(this.scene, this.snapCamera);
    return this.renderer.domElement.toDataURL("image/jpg");
  }

  cleanUpScene() {
    cancelAnimationFrame(this.animation);
    this._canvas.removeChild(this.renderer.domElement);
    this.renderer.dispose();
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    this.scene.traverse((obj) => {
      if (obj.isMesh) {
        // Liberar geometrías
        obj.geometry.dispose();
        // Liberar materiales
        if (obj.material.isMaterial) {
          obj.material.dispose();
        } else if (Array.isArray(obj.material)) {
          obj.material.forEach((material) => material.dispose());
        }
      }
    });
    this._canvas.removeEventListener("mousedown", this.handlerClic);
    this._canvas.removeEventListener("mouseup", this.handlerClic);
    this._canvas.removeEventListener("mousemove", this.savePointerData);
    window.removeEventListener("resize", this.onWindowResize);
  }
}
