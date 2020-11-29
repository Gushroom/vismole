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
    
    // Init grids
    grids = new THREE.GridHelper(20, 20);// (size, divisons)

}

function addtoScene(){
    scene.add(LIGHT);
    scene.add(axes);
    scene.add(grids);

    let mole = defStructure("methane"); // This line will be replaced to read from GUI
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
function defMole(moleId, structure/* A tree or linkedlist node that contains necessary info */){
    let mole = new THREE.Group();
    let struct = new THREE.Geometry();
    switch(moleId){
        case "line":
            // A case for learning and debugging
            for(let i = 0; i < 10; i++){
                if(i % 2 == 0){
                    let line = new THREE.Vector3(i, 0, 0);
                    struct.vertices.push(line);
                    let atom = new THREE.Points(struct, defAtoms(2, LIGHTGREEN));
                    mole.add(atom);
                } 
                else{
                    let struct1 = new THREE.Geometry();
                    let line1 = new THREE.Vector3(i, 0, 0);
                    struct1.vertices.push(line1);
                    let atom = new THREE.Points(struct1, defAtoms(2, LIGHTRED));
                    mole.add(atom);
                }
            }
            console.log("line");
            break;
        case "box":
            // An abolished case for learning and debugging
            console.log("box");
            break;
        case "methane":
            /*
                The most active example, draws a methane with angles
                Code below uses a linkedlist-like approach:
                c -> h0 -> h1 -> h2 -> h3
                which means, c doesnt know where h1 is, only h0 knows
                Another approach will be tree-like:
                c -> h0, c -> h1, c -> h2, c -> h3
                this way makes it easier to draw bonds, and more complex molecules
                but I dont have the data to try it
                It is not hard to implement based on what I have below
            */
            const startPos = new THREE.Vector3( 0, 0, 0 );
            struct.vertices.push(startPos);
            // Push the first vertex(list head) into structure geometry
            // console.log("first position added");

            /*
                The following few lines find positions for other atoms
                based on their predecessor, and push infomation into structure geometry
            */
            const secondPos = new THREE.Vector3( 0, 0, 2 );
            struct.vertices.push(secondPos);
            // console.log("second position added");
            
            let angle = 109.5;
            const thirdPos = secondPos.clone().applyMatrix4( new THREE.Matrix4().makeRotationX(angle * ( Math.PI / 180 )) );
            struct.vertices.push(thirdPos);
            // console.log("third position added");

            const fourthPos = thirdPos.clone().applyMatrix4( new THREE.Matrix4().makeRotationZ(120 * ( Math.PI / 180 )) );
            struct.vertices.push(fourthPos);
            // console.log("fourth position added");
            
            const fifthPos = fourthPos.clone().applyMatrix4( new THREE.Matrix4().makeRotationZ(120 * ( Math.PI / 180 )) );
            struct.vertices.push(fifthPos);
            // console.log("fifth position added");

            // Specify how atoms look like
            let atom = new THREE.Points(struct, defAtoms(2, LIGHTGREEN));
            mole.add(atom);
            
            // console.log(struct.vertices);
            console.log("methane created");
            break;

        default:
            console.log("Request not found");
            // mole = structHelper(structure);
    }

    return mole;
}

/*
    Draw atoms based on request
    generate one kind of atom per call
*/
function defAtoms(size, color /* atomId will replace these two */ ){
    let atom = new THREE.PointsMaterial({
        size:size, 
        color: color, 
        map: atomTexture, 
        transparent:true, 
        opacity: 1, 
        alphaTest: 0.5
    });
    return atom;
}

function inputFlow(fileName){
    // Reads input file here and return a tree or a linkedlist
    // return moleInfo
}
