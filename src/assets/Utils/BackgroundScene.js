import * as THREE from "three";

export default class BackgroundScene {
  constructor(canvasRef, uniforms, shaderInfo) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.animation = undefined;

    // NOTE: Camera params;
    this.aspect = undefined;

    // NOTE: Additional components.
    this._uniforms = uniforms;

    // NOTE: Page elements
    this._canvas = canvasRef;

    // NOTE: Scene elements
    this.geometry = undefined;
    this.material = undefined;
    this.mesh = undefined;
    this._shader = shaderInfo;
  }

  initialize() {
    this._uniforms.u_resolution.value = new THREE.Vector2(
      this._canvas.clientWidth,
      this._canvas.clientHeight
    );

    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene.add(this.camera);

    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.material = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: this._shader.vertexShader,
      fragmentShader:
        this._shader.fragmentShader.defaultCode +
        this._shader.fragmentShader.viewCode,
    });
    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
    this._canvas.appendChild(this.renderer.domElement);

    this.animation = requestAnimationFrame(this.animate.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = this._canvas.clientWidth / this._canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
  }

  animate(time) {
    // NOTE: Update uniform data on each render.
    this._uniforms["u_time"].value = time / 100;
    this.renderer.render(this.scene, this.camera);
    this.animation = requestAnimationFrame(this.animate.bind(this));
  }

  cleanUpScene() {
    cancelAnimationFrame(this.animation);
    this._canvas.removeChild(this.renderer.domElement);
    this.renderer.dispose();
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    // this.controls.dispose();
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
    window.removeEventListener("resize", this.onWindowResize);
  }
}
