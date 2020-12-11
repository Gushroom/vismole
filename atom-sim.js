// console.log("atom-sim.js imported successfully"); // Debug src import
// Define threejs globals
// There might be a way to define them as constants, I will explore more if that's a better practice
let scene, renderer, camera, controls, axes, grids;
// Define light
const LIGHT = new THREE.AmbientLight( 0x404040, 4 );
// Define some color constants
const RED = 0xFF0000;
const GREEN = 0x00FF00;
const BLUE = 0x0000FF;
const LIGHTRED = 0xFFCCCB;
const LIGHTGREEN = 0x90ee90;
const LIGHTBLUE = 0xADD8E6;
// Define texture of atoms
const TEXTURE = new THREE.TextureLoader().load("src/atom-texture.png");

// Define Structures used here
let atomsArray = ["c", "h", "h", "h", "h"];
let atomPosition = new Float32Array([
    0.000000, 0.000000, 0.000000,
    0.000000, 0.000000, 1.089000, 
    1.026719, 0.000000, -0.363000,
    -0.513360, -0.889165, -0.363000, 
    -0.513360, 0.889165, -0.363000
]);
let bondInfo = [
    [0, 1, 'cov'],
    [0, 2, 'cov'],
    [0, 3, 'cov'],
    [0, 4, 'cov'],
    [0, 5, 'cov']
];

// Initialize threejs globals
function init(){
    // Init scene
    scene = new THREE.Scene();
    // Init renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color(0x000000));// Toggle between dark and bright background?
    renderer.setSize(window.innerWidth, window.innerHeight);// Different size? Now it occupies the entire window

    // Init perspective camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    // Init orbit control for moving camera
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Init axes
    axes = new THREE.AxesHelper(10);// Length of the axes' arm
    
    // Init grids
    grids = new THREE.GridHelper(20, 20);// (size, divisons)

}

function add_to_scene(){
    scene.add(LIGHT);
    scene.add(axes);
    scene.add(grids);

    let mole = _def_mole(); // This line will be replaced to read from GUI
    mole.position.set(2, 2, 2);// This line will be replaced to read from GUI or used to draw mutiple molecules 
    scene.add(mole);

    camera.position.set(10, 10, 10);
    controls.update();

    document.getElementById("webgl-output").appendChild(renderer.domElement);
}

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}
/*
    Define molecule based on library or build with given formula
*/
function _def_mole(){

    let mole = new THREE.Group();
    const structure = new THREE.BufferGeometry();
    let vertices = atomPosition;
    let atomColors = _atom_to_color(atomsArray);

    structure.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    structure.addAttribute('color', new THREE.BufferAttribute(atomColors, 3, true));
    structure.computeBoundingSphere();

    let atomsMaterial = new THREE.PointsMaterial({
        size:2, 
        vertexColors: true,
        map: TEXTURE, 
        transparent:true, 
        opacity: 1, 
        alphaTest: 0.5
    });

    let atoms = new THREE.Points(structure, atomsMaterial);

    mole.add(atoms);

    for(let pair = 0; pair < bondInfo.length; pair++){
        switch(bondInfo[pair][2]){
            case "cov":
                console.log(_atom_to_vertices(bondInfo[pair][0], bondInfo[pair][1]));
                bondGeometry = new THREE.BufferGeometry().setFromPoints(_atom_to_vertices(bondInfo[pair][0], bondInfo[pair][1]));
                bondMaterial = new THREE.LineBasicMaterial({color: LIGHTBLUE});
                bondGeometry.computeBoundingSphere();
                bond = new THREE.Line(bondGeometry, bondMaterial);
                mole.add(bond);
                break;
            default:
                break;
        }
    }

    return mole;
}

/*
    Define atoms' color based on CPK color index
*/

function _atom_to_color(){
    let vertexColors = [];
    for(let i = 0; i < atomsArray.length; i++){
        switch(atomsArray[i]){
            case "c":
                vertexColors.push(0xC8);
                vertexColors.push(0xC8);
                vertexColors.push(0xC8);
                break;
            case "h":
                vertexColors.push(0xFF);
                vertexColors.push(0xFF);
                vertexColors.push(0xFF);
                break;
            default:
                vertexColors.push(0xFF);
                vertexColors.push(0x14);
                vertexColors.push(0x93);
        }
    }
    vertexColors = Uint8Array.from(vertexColors);
    return vertexColors;
}

/*
    returns an array with two Vector3, which represent two atoms a bond will connect
*/
function _atom_to_vertices(atom1, atom2){
    let points = [];
    let start = atom1 * 3;
    let end = atom2 * 3;

    vertices1 = new THREE.Vector3(atomPosition[start], atomPosition[start++], atomPosition[start+2]);
    vertices2 = new THREE.Vector3(atomPosition[end], atomPosition[end++], atomPosition[end+2]);
    points.push(vertices1);
    points.push(vertices2);

    return points;
}
/* 
    Ajax call to load json file
    currently not working
*/
function get_input(filename){
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
    };
    request.open("GET", "filename", true);
    request.send();
}

