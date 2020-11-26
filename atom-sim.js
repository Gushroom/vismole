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
const atomTexture = new THREE.TextureLoader().load("atom-texture.png");

// Initialize threejs globals
function init(){
    // Init scene
    scene = new THREE.Scene();
    // Init renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color(0x000000));// Toggle between dark and bright background?
    renderer.setSize(window.innerWidth, window.innerHeight);// Different size? Now it occupies the entire window

    // Init perspective camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);// Explore better settings?
    // Init orbit control for moving camera
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Init axes
    axes = new THREE.AxesHelper(10);// Length of the axes' arm
    /* 
        Init grids
        Upgrade needed, grid needs to be 3d
    */
    grids = new THREE.GridHelper(20, 20);// (size, divisons)

}

function addElements(){
    scene.add(LIGHT);
    scene.add(axes);
    scene.add(grids);

    let o0 = createAtom(1.5, LIGHTGREEN);
    let h0 = createAtom(0.8, LIGHTBLUE);
    let h1 = createAtom(0.8, LIGHTBLUE);
    /*
        Below are hard-coded positions, to debug createAtom()
        Nah, seeing a molecule is so satisfying
    */
    o0.position.set(2, 2, 2);
    h0.position.set(2.25, 1.9, 2);
    h1.position.set(1.75, 1.9, 2);
    scene.add(o0);
    scene.add(h0);
    scene.add(h1);

    placeMol(16, 5, 5, 5);

    camera.position.set(10, 10, 10);
    controls.update();

    document.getElementById("webgl-output").appendChild(renderer.domElement);
}

function animate(){
    // Refresh output
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}
/*
    Each call to this function produce an instance of an particular atom
    Atom:
        color(respective or absolute);
        size(respective or absolute);
        maybe position? (currently handled at makeMol)

*/ 
function createAtom(/* atomId, */size, color){
    /*
        (I suppose)In real practice, this function will grab the id from 
        the array created by elementsFlow(), which contains all input particles we need to draw
        all attributes to an atom will be packed into the array element
        for now, it will just run on different pre-set attributes
    */

   let atomGeometry = new THREE.Vector3(2, 2, 2); 
   let atomPos = new THREE.Geometry();
   atomPos.vertices.push(atomGeometry);
   let atomMaterial = new THREE.PointsMaterial({size:size, color: color, map: atomTexture, transparent:true, opacity: 0.8});

   let atom = new THREE.Points(atomPos, atomMaterial);

   return atom;
}

/*
    Position different atoms and group them, make correct molecules
    Question is: do I need a library of all existing molecules?
    Solution I thought about:
        One makeMol have a cache-like library for freqently used molecules
        Another takes a definition as parameter and construct the molecule
    Below is the first approach, construct molecules based on their id
*/
function makeMolbyId(moleId){
    // Define molecule
    mole = new THREE.Group();
    // Identify target molecule
    switch(moleId){
        case 16:
        // The actual make process can be put in different functions
            // Place atoms
            let startPos = new THREE.Vector3(3, 3, 3);
            let c = createAtom(1, LIGHTRED);
            mole.add(c, startPos);
            break;
        default:
            console.log("Molecule requested not found in library");
            // mole = makeMolbyStruct()
    }
    return mole;
}

function makeMolbyStruct(structure, atom/* atom will be an array that holds all atoms needed */){
    // Magic
    return mole;
    // No magic
    // console.log("Nah, can't make it for ya");
}
/*
    Place molecules made by makeMol and put molecules on right position
*/
function placeMol(moleId, xPos, yPos, zPos){
    makeMol(moleId).position.set(xPos, yPos, zPos);
    scene.add(makeMol(moleId));
}
function inputFlow(/* Some way to read input flow*/){
    // let particle = FileReader.readAsArrayBuffer();

}
