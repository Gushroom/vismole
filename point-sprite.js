// console.log("atom-sim.js imported successfully"); // Debugging
// Define threejs globals
// There might be a way to define them as constants, I will explore more if that's a better practice
let scene, renderer, camera, controls, axes, grids;
// Define atom attribute globals
let atomGeom, material;

// Initialize threejs globals
function init(){
    // Init scene
    scene = new THREE.Scene();

    // Init renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));// Toggle between dark and bright background?
    renderer.setSize(window.innerWidth, window.innerHeight);// Different size? Now it occupies the entire window

    // Init perspective camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth, window.innerHeight, 0.1, 1000);// Explore better settings?
    // Init orbit control for moving camera
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Init axes
    axes = new THREE.AxesHelper(20);// Length of the axes' arm
    // Init grids
    grids = new THREE.GridHelper(10, 10);// (size, divisons)

}


// Create objects
function createAtom(size, transparent, opacity, vertexColors, sizeAttenuation, colorValue, vertexColorValue){
    geom = new THREE.Geometry();
    material = new THREE.PointsMaterial({
        size: 4,
        transparent: false, 
        opacity: 0.6,
        vertexColors: true,
        sizeAttenuation: true,
        color: new THREE.Color(0x00FF00)
    });

    let i, j, k;
    for(i = 0; i < 5; i++){
        for(j = 0; j < 5; j++){
            for(k = 0; k < 5; k++){
                let atom = new THREE.Vector3(i, j, k);
            }
        }
    }

    atomGeom.vertices.push(geom);

    let color = new THREE.Color(0x00FF00);
    atomGeom.color.push(color);
    // The module below needs to be seprated
    particle = new THREE.points(atomGeom, material);
    particle.name = "cube";
    scene.add(particle);

}

   
function setUp(){
    // Position and direction of the camera
    camera.position.set(20, 20, 20);

    controls.update();
    // camera.lookAt(scene.position)

    // add the output of the render to html
    document.getElementById("webgl-output").appendChild(renderer.domElement);
}

// Display, and animate outputs
function animate(){
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}
/*
function GUI(){
    // GUI options goes here
}
*/
/*
function getData(src){
    // Get and data from backend
}
*/