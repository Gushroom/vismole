// Define threejs globals
let scene, renderer, camera, controls, axes, grids;

// Define light
const light = new THREE.AmbientLight( 0x404040, 4 );

// Define some color constants
const RED = 0xFF0000;
const GREEN = 0x00FF00;
const BLUE = 0x0000FF;
const LIGHTRED = 0xFFCCCB;
const LIGHTGREEN = 0x90ee90;
const LIGHTBLUE = 0xADD8E6;

// Define texture of atoms and bonds
const atomTexture = new THREE.TextureLoader().load("src/atom-texture.png");
const singleBondTexture = new THREE.TextureLoader().load("src/single-bond.png");

// Set path to source URL containing molecule info
// Should support web URL, not just path to local file
let sourceURL = 'src/src-model.json'

// Enable cache for loader to work correctly
THREE.Cache.enabled = true;

// Create loader to load in source file containing molecule info
const loader = new THREE.FileLoader();

loader.setResponseType("json");

loader.load(
	// resource URL
	sourceURL,

	// onLoad callback
	function ( data ) {
        // Extract array of atoms from source file
        function _get_atom_type(source){

            let tempArray = [];

            for (let i = 0; i < source.items.length; i++){
                tempArray.push(source.items[i].type);
            }

            return tempArray;

        }

        let atomsArray = _get_atom_type(data);

        // Extract array of atom positions from source file
        function _get_atom_position(source){

            let tempArray = [];

            for(let i = 0; i < source.items.length; i++){
                tempArray.push(source.items[i].x);
                tempArray.push(source.items[i].y);
                tempArray.push(source.items[i].z);
            }

            return tempArray;
        
        }

        let atomPosition = Float32Array.from( _get_atom_position(data) );

        // Extract bond info from source file
        function _get_bond_info(source){

            let tempArray = [];

            for(let i = 0; i < source.bonds.length; i++){
                tempArray.push(source.bonds[i]);
            }

            return tempArray;

        }

        let bondInfo = _get_bond_info(data);

        function _def_mole(){

            // Defines a group, it is a collection of atoms and bonds, pretty much like what molecules are in real life.
            const mole = new THREE.Group();


            // One of the parameters needed for drawing, defines each atom's position
            const structure = new THREE.BufferGeometry();

            // Parameters required to draw bonds
            let bondGeometry;
            let bondMaterial;

            // Calls a helper to color atoms
            let atomColors = _atom_to_color(atomsArray);


            structure.addAttribute( 'position', new THREE.Float32BufferAttribute( atomPosition, 3 ) );
            structure.addAttribute( 'color', new THREE.BufferAttribute( atomColors, 3, true ) );
            structure.computeBoundingSphere();

            // This was originally its own function, customize color and size
            // now if we need atoms to be displayed in different size we use vertexshader
            let atomsMaterial = new THREE.PointsMaterial({
                size: 1.8, 
                vertexColors: true,
                map: atomTexture, 
                transparent:true, 
                opacity: 1, 
                alphaTest: 0.5
            });

            // One call prepares all atoms in the mole
            let atoms = new THREE.Points(structure, atomsMaterial);

            // Adding atoms to group
            mole.add(atoms);

            // Implement bonds
            for(let pair = 0; pair < bondInfo.length; pair++){ // loop through bonded pairs

                switch(bondInfo[pair][0]){
                    // There can be all sorts of bonds, or even just true/false works
                    case 1: 
                        // console.log(_atom_to_vertices(bondInfo[pair][1], bondInfo[pair][2])); // to see exactly where bonds are drawn
                        bondGeometry = new MeshLine();
                        bondGeometry.setPoints( _atom_to_vertices(+bondInfo[pair][1], +bondInfo[pair][2]) );

                        bondMaterial = new MeshLineMaterial({
                            color: BLUE, 
                            lineWidth: 0.1,
                            useAlphaMap: true,
                            alphaMap: singleBondTexture,
                            transparent: true,
                            opacity: 1
                        });

                        bond = new THREE.Mesh(bondGeometry, bondMaterial);
                        mole.add(bond);

                        break;

                    case 2:
                        // console.log(_atom_to_vertices(bondInfo[pair][1], bondInfo[pair][2])); // to see exactly where bonds are drawn
                        bondGeometry = new MeshLine();
                        bondGeometry.setPoints( _atom_to_vertices(+bondInfo[pair][1], +bondInfo[pair][2]) );

                        bondMaterial = new MeshLineMaterial({
                            color: GREEN, 
                            lineWidth: 0.1,
                            useAlphaMap: true,
                            alphaMap: singleBondTexture,
                            transparent: true,
                            opacity: 1
                        });

                        bond = new THREE.Mesh(bondGeometry, bondMaterial);
                        mole.add(bond);

                        break;

                    case 3:
                        // console.log(_atom_to_vertices(bondInfo[pair][1], bondInfo[pair][2])); // to see exactly where bonds are drawn
                        bondGeometry = new MeshLine();
                        bondGeometry.setPoints( _atom_to_vertices(+bondInfo[pair][1], +bondInfo[pair][2]) );

                        bondMaterial = new MeshLineMaterial({
                            color: RED, 
                            lineWidth: 0.1,
                            useAlphaMap: true,
                            alphaMap: singleBondTexture,
                            transparent: true,
                            opacity: 1
                        });

                        bond = new THREE.Mesh(bondGeometry, bondMaterial);
                        mole.add(bond);

                        break;

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
            TODO:
                This function needs expand to cover more atoms
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
            // Atoms are indexed from 1, but array indices are form 0
            let start = (atom1-1) * 3;
            let end = (atom2-1) * 3;

            /* 
                The whole concept here is Vector3.fromArray(array, index) gets index, index++, index+2 in to x, y, z, respectively
                when atom1 is the 0th atom in the array of positions, the x, y, z will be atomPosition[0-2]
            */
            startVertices = new THREE.Vector3();
            startVertices.fromArray(atomPosition, start);

            endVertices = new THREE.Vector3;
            endVertices.fromArray(atomPosition, end);

            points.push(startVertices);
            points.push(endVertices);

            return points;

        }

        // Add mole to screen
        let mole = _def_mole();

        scene.add(mole);

	},

	// onProgress callback
	function ( xhr ) {

        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        
	},

	// onError callback
	function ( err ) {

        console.error( 'An error occured' );
        
    }
    
);


// Initialize threejs renderer
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

    scene.add(light);
    scene.add(axes);
    scene.add(grids);

    
    camera.position.set(10, 10, 10);
    controls.update();

    document.getElementById("webgl-output").appendChild(renderer.domElement);

}

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}