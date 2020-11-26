let scene;
let renderer;

let camera;

let controls;

function init() {
    // document.write("01-01 successfully imported."); // debug only

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

    controls = new THREE.OrbitControls( camera, renderer.domElement );

    let axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // Sphere attributes
    let sphereGeometry = new THREE.SphereGeometry(0.2, 5, 5);
    let sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        wireframe: true
    });
    
    // A function to dupelicate same mesh
    let i, j, k;
    for(i = 0; i < 10; i++){
        for(j = 0; j < 10; j++){
            for(k = 0; k < 10; k++){
                dupeSphere(i, j, k, sphereGeometry, sphereMaterial);
            }
        }
        // console.log(i); // for debugging
    }

    // Create a sphere
    // sphere.position.set(10,10,10);
    // scene.add(sphere);
    
    // Position and direction of the camera
    camera.position.set(20, 20, 20);

    controls.update();
    // camera.lookAt(scene.position);

    // add the output of the render to html
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // Render the scene
    // requestAnimationFrame( animate );

}

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);


}
    

function dupeSphere(xPos, yPos, zPos, geo, mat) {
    let sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(xPos, yPos, zPos);
    scene.add(sphere);
}