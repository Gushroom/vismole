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


let jsonInput = {
    "items": [
        {"label": "1", "type": "1", "parent": null, "path": "world/1/1", "x": 0.0, "y": 0.0, "z": 0.0}, 
        {"label": "2", "type": "2", "parent": null, "path": "world/1/2", "x": 0.7555, "y": 0.5876, "z": 0.0}, 
        {"label": "3", "type": "1", "parent": null, "path": "world/1/3", "x": 1.5111, "y": 0.0, "z": 0.0}, 
        {"label": "4", "type": "1", "parent": null, "path": "world/2/4", "x": 0.0, "y": 0.0, "z": 3.3686}, 
        {"label": "5", "type": "2", "parent": null, "path": "world/2/5", "x": 0.7555, "y": 0.5876, "z": 3.3686}, 
        {"label": "6", "type": "1", "parent": null, "path": "world/2/6", "x": 1.5111, "y": 0.0, "z": 3.3686}, 
        {"label": "7", "type": "1", "parent": null, "path": "world/3/7", "x": 0.0, "y": 0.0, "z": 6.7372}, 
        {"label": "8", "type": "2", "parent": null, "path": "world/3/8", "x": 0.7555, "y": 0.5876, "z": 6.7372}, 
        {"label": "9", "type": "1", "parent": null, "path": "world/3/9", "x": 1.5111, "y": 0.0, "z": 6.7372}], 
        "bonds": [[1, "1", "2"], [1, "2", "3"], [1, "4", "5"], [1, "5", "6"], [1, "7", "8"], [1, "8", "9"]]
};

// get useful data for drawing from JSON input
function _get_atom_type(thisMole){
    let tempArray = [];
    for (let i = 0; i < thisMole.items.length; i++){
        tempArray.push(thisMole.items[i].type);
    }
    return tempArray;
}
let atomsArray = _get_atom_type(jsonInput);
function _get_atom_position(thisMole){
    let tempArray = [];
    for(let i = 0; i < thisMole.items.length; i++){
        tempArray.push(thisMole.items[i].x);
        tempArray.push(thisMole.items[i].y);
        tempArray.push(thisMole.items[i].z);
    }
    return tempArray;

}
let atomPosition = Float32Array.from( _get_atom_position(jsonInput) );
function _get_bond_info(thisMole){
    let tempArray = [];
    for(let i = 0; i < thisMole.bonds.length; i++){
        tempArray.push(thisMole.bonds[i]);
    }
    return tempArray;
}
let bondInfo = _get_bond_info(jsonInput);


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

    // Debug info
    console.log(atomsArray);
    console.log(atomPosition);
    console.log(bondInfo);

    let mole = _def_mole();
    mole.position.set(2, 2, 2);
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

    // Defines a group, it is a collection of atoms and bonds, pretty much like what molecules are in real life.
    let mole = new THREE.Group();

    // One of the parameters needed for drawing, defines each atom's position
    const structure = new THREE.BufferGeometry();

    /*  
        Get data from input for use, if we move the global definition of atomPositon down here,
        we can use different JSON inputs for different moles
    */
    let vertices = atomPosition;

    // Calls a helper to color atoms
    let atomColors = _atom_to_color(atomsArray);


    structure.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    structure.addAttribute( 'color', new THREE.BufferAttribute( atomColors, 3, true ) );
    structure.computeBoundingSphere();

    // This was originally its own function, customize color and size
    // now if we need atoms to be displayed in different size we use vertexshader
    let atomsMaterial = new THREE.PointsMaterial({
        size:2, 
        vertexColors: true,
        map: TEXTURE, 
        transparent:true, 
        opacity: 1, 
        alphaTest: 0.5
    });

    // One call prepares all atoms in the mole
    let atoms = new THREE.Points(structure, atomsMaterial);
    // and draw them
    mole.add(atoms);

    // Implement bonds
    for(let pair = 0; pair < bondInfo.length; pair++){ // loop through bonded pairs
        switch(bondInfo[pair][0]){
            // There can be all sorts of bonds, or even just true/false works
            case 1: 
                // console.log(_atom_to_vertices(bondInfo[pair][0], bondInfo[pair][1])); // to see exactly where bonds are drawn
                bondGeometry = new THREE.BufferGeometry().setFromPoints(_atom_to_vertices(+bondInfo[pair][1], +bondInfo[pair][2]));
                // Material can be replaced by source texture pictures, now they just differ in color
                bondMaterial = new THREE.LineBasicMaterial({color: LIGHTBLUE});
                bond = new THREE.Line(bondGeometry, bondMaterial);
                mole.add(bond);
                break;
            case 2:
                // console.log(_atom_to_vertices(bondInfo[pair][0], bondInfo[pair][1])); // to see exactly where bonds are drawn
                bondGeometry = new THREE.BufferGeometry().setFromPoints(_atom_to_vertices(+bondInfo[pair][1], +bondInfo[pair][2]));
                bondMaterial = new THREE.LineBasicMaterial({color: LIGHTGREEN});
                bond = new THREE.Line(bondGeometry, bondMaterial);
                mole.add(bond);
                break;
            case 3:
                // console.log(_atom_to_vertices(bondInfo[pair][0], bondInfo[pair][1])); // to see exactly where bonds are drawn
                bondGeometry = new THREE.BufferGeometry().setFromPoints(_atom_to_vertices(+bondInfo[pair][1], +bondInfo[pair][2]));
                bondMaterial = new THREE.LineBasicMaterial({color: LIGHTRED});
                bond = new THREE.Line(bondGeometry, bondMaterial);
                mole.add(bond);
            default:
                // There are no bonds in the pair
                // Actually I don't think that will ever be the case
                break;
        }
    }

    return mole;
}

/*
    Define atoms' color based on CPK color index
    This function will expand to cover more atoms
    I'd love to see how these index map to atoms
    like "1" = "h", "2" = "o" etc.
*/
function _atom_to_color(){
    let vertexColors = [];
    // Similar to atomPostion, the array of atoms can be specified here, so we get to draw different moles
    for(let i = 0; i < atomsArray.length; i++){
        switch(atomsArray[i]){
            case "1":
                vertexColors.push(0xFF);
                vertexColors.push(0xFF);
                vertexColors.push(0xFF);
                break;

            case "2":
                vertexColors.push(0xFF);
                vertexColors.push(0x0D);
                vertexColors.push(0x0D);
                break;
            case "3":
                vertexColors.push(0x90);
                vertexColors.push(0x90);
                vertexColors.push(0x90);
                break;
            default:
                vertexColors.push(0xFF);
                vertexColors.push(0x14);
                vertexColors.push(0x93);
                break;
        }
    }

    vertexColors = Uint8Array.from(vertexColors);

    return vertexColors;
}

/*
    returns an array with two Vector3, which represent two atoms a bond will connect
    THREE's line geometry asks for an array
*/
function _atom_to_vertices(atom1, atom2){
    let points = [];
    let start = (atom1-1) * 3;
    let end = (atom2-1) * 3;

    /* 
        The whole concept here is Vector3.fromArray(array, index) gets index, index++, index+2 in to x, y, z, respectively
        when atom1 is the 0th atom in the array of positions, the x, y, z will be atomPosition[0-2]
        maybe I should name atoms from 0 as well...
    */
    vertices1 = new THREE.Vector3();
    vertices1.fromArray(atomPosition, start);
    vertices2 = new THREE.Vector3;
    vertices2.fromArray(atomPosition, end);
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

