/* app.js -  The TownGL main application code
* Copyright (C) 2014 Paulo Pinto
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 2 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the
* Free Software Foundation, Inc., 59 Temple Place - Suite 330,
* Boston, MA 02111-1307, USA.
*/

function UTIL_TO_RADIANS(angleDeg) {
    return angleDeg * Math.PI / 180;
}

function createScene(scene, nodesToUpdate) {
    // Floor
    var floor = createFloor();
    
    var m = new THREE.Matrix4();
    m.makeTranslation(0, -1, 0);
    
    floor.applyMatrix(m);
    scene.add(floor);

    // Road
    var road = createDisk(9, 11, 25);

    m = new THREE.Matrix4();
    m.makeTranslation(0, -0.9, 0);
    
    var rt = new THREE.Matrix4();
    rt.makeRotationX(UTIL_TO_RADIANS(90));
    
    m.multiply(rt);
    road.applyMatrix(m);    
    
    scene.add(road);
    
    
    // First building
    m = new THREE.Matrix4();
    m.makeTranslation(10, 3.1, -17);

    var building = createBuilding(0x00ff00, m);
    scene.add(building);
    
    // Second building
    m = new THREE.Matrix4();
    m.makeTranslation(-15, 3.1, -10);
    
    building = createBuilding(0xff0000, m);
    scene.add(building);

    // Third building
    m = new THREE.Matrix4();
    m.makeTranslation(13, 3.1, 8);
    
    building = createBuilding(0x0000ff, m);
    scene.add(building);
    
    // normal tunnel
    var tunnel = createTunnel();
    m = new THREE.Matrix4();
    m.makeTranslation(-6, 0.1, 8);
    m.scale(new THREE.Vector3(0.5, 2, 0.5));
    
    var r = new THREE.Matrix4();
    r.makeRotationY(UTIL_TO_RADIANS(60));
    
    m.multiply(r);
    tunnel.applyMatrix(m);
    
    scene.add(tunnel);
    
    
    
    
    // arc tunnel
    tunnel = createArcTunnel ();
    m = new THREE.Matrix4();
    m.makeTranslation(0, -0.5, -9.5);
    m.scale(new THREE.Vector3(1, 0.5, 0.5));
    
    var r = new THREE.Matrix4();
    r.makeRotationY(UTIL_TO_RADIANS(90));
    
    m.multiply(r);
    tunnel.applyMatrix(m);
    
    scene.add(tunnel);
    
    // first windmill
    var windmill = createWindmill(nodesToUpdate);
    m = new THREE.Matrix4();
    m.makeTranslation(5, -0.2, 13);
    windmill.applyMatrix(m);
    
    scene.add(windmill);
    
    // second windmill
    windmill = createWindmill(nodesToUpdate);
    m = new THREE.Matrix4();
    m.makeTranslation(15, -0.2, -15);
    windmill.applyMatrix(m);
    
    scene.add(windmill);    
    
}


/**
 * Creates a building in the given color and dimensions.
 * @param {number} color the building color in hexadecimal
 * @param {THREE.Matrix4} Local matrix to apply to the building
 * @returns {THREE.Mesh} A building mesh with the given color and orientation
 */
function createBuilding(color, m) {
    var geometry = new THREE.CubeGeometry(2, 8, 2);
    var material = new THREE.MeshBasicMaterial({color: color});
    var cube = new THREE.Mesh(geometry, material);
    cube.applyMatrix(m);
    
    return cube;
}


/**
 * Creates a tunnel in the given color and dimensions.
 * @returns {THREE.Mesh} A mesh representing a tunnel
 */
function createTunnel() {
    // left side
    var group = new THREE.Object3D();
    var geometry = new THREE.CubeGeometry(1.0, 1.0, 5.0);
    var material = new THREE.MeshBasicMaterial({color: 0xfff000});
    var mesh = new THREE.Mesh(geometry, material);
    
    var transform = new THREE.Matrix4();
    transform.makeTranslation(-5, 0, 0);
    mesh.applyMatrix(transform);

    group.add(mesh);

    // right side    
    geometry = new THREE.CubeGeometry(1.0, 1.0, 5.0);
    mesh = new THREE.Mesh(geometry, material);
    
    transform = new THREE.Matrix4();
    transform.makeTranslation(5, 0, 0);
    mesh.applyMatrix(transform);
    group.add(mesh);
    
    // top
    geometry = new THREE.CubeGeometry(11, 0.10, 5);
    mesh = new THREE.Mesh(geometry, material);
    
    transform = new THREE.Matrix4();
    transform.makeTranslation(0, 0.55, 0);
    mesh.applyMatrix(transform);
    group.add(mesh);

    return group;
}

/**
 * Creates a building in the given color and dimensions.
 * @returns {THREE.Mesh} A mesh representing a floor colored in blue
 */
function createFloor() {
    var geometry = new THREE.PlaneGeometry(100, 100, 0);
    var material = new THREE.MeshBasicMaterial({color: 0x334D7F, side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(geometry, material);
    
    var transform = new THREE.Matrix4();
    transform.makeRotationX(- Math.PI / 2);
    
    mesh.applyMatrix(transform);
    
    return mesh;
}

/**
 * @param {array} nodesToUpdate Contains the sails node, so that it is updatable
 * Creates a windmill 
 * @returns {THREE.Mesh} A mesh representing a windmill
 */
function createWindmill(nodesToUpdate) {
    // base
    var group = new THREE.Object3D();
    var geometry = new THREE.CylinderGeometry(1, 1, 1.5);
    var material = new THREE.MeshBasicMaterial({color: 0x088A08});
    var mesh = new THREE.Mesh(geometry, material);
    
    group.add(mesh);

    // roof
    geometry = new THREE.CylinderGeometry(0, 1.0, 0.5);
    material = new THREE.MeshBasicMaterial({color: 0xff0000});
    mesh = new THREE.Mesh(geometry, material);
    
    var transform = new THREE.Matrix4();
    transform.makeTranslation(0, 1, 0);
    mesh.applyMatrix(transform);
    group.add(mesh);
    
    // sails
    mesh = createSails();
    
    transform = new THREE.Matrix4();
    transform.makeTranslation(0, 0.7, 1);
    mesh.applyMatrix(transform);
    group.add(mesh);    
    
    nodesToUpdate.push(mesh);
    return group;
}

 
/**
 * Draws a 2D disk in a way similar to gluDisk.
 * @param {number} innerRadius The extent where the disk starts
 * @param {number} outerRadius The extent where the disk ends
 * @param {number} slices How many triangles to use for the respective rendering
 * @return {THREE.Mesh} A disk mesh using black as default material color
 */
function createDisk (innerRadius, outerRadius, slices) {
    var step = 2 * Math.PI / slices;
    var geometry = new THREE.Geometry();

    for (var i = 0; i < slices; i++) {
        var angle = i * step;
        

        geometry.vertices.push(new THREE.Vector3 (outerRadius * Math.cos(angle), outerRadius * Math.sin(angle), 0));
        geometry.vertices.push(new THREE.Vector3 (innerRadius * Math.cos(angle), innerRadius * Math.sin(angle), 0));
        
        angle = (i + 1) * step;

        geometry.vertices.push(new THREE.Vector3 (outerRadius * Math.cos(angle), outerRadius * Math.sin(angle), 0));
        geometry.vertices.push(new THREE.Vector3 (innerRadius * Math.cos(angle), innerRadius * Math.sin(angle), 0));
        
        var base = i * 4;
        geometry.faces.push( new THREE.Face3( base, base + 1, base + 2 ) );
        geometry.faces.push( new THREE.Face3( base + 2, base + 1, base + 3 ) );
    }
    geometry.computeBoundingSphere();
    
    var material = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});

    
    return new THREE.Mesh(geometry, material);;
}

/**
 * Draws a tunnel in an arch format.
 * @return {THREE.Mesh} A tunnel mesh using yellow as default material color
 */
function createArcTunnel () {
    var group = new THREE.Object3D();
    
    // front arch
    group.add(createArc(2.5));
  
      // back arch
    group.add(createArc(-2.5));
    
    // roof
    group.add(createRoof());
    
    // left base
    var geometry = new THREE.CubeGeometry(1.0, 1.0, 5.0);
    var material = new THREE.MeshBasicMaterial({color: 0xfff000});
    var mesh = new THREE.Mesh(geometry, material);
    
    var transform = new THREE.Matrix4();
    transform.makeTranslation(-5, 0, 0);
    mesh.applyMatrix(transform);

    group.add(mesh);    
 
     // right base
    geometry = new THREE.CubeGeometry(1.0, 1.0, 5.0);
    mesh = new THREE.Mesh(geometry, material);
    
    transform = new THREE.Matrix4();
    transform.makeTranslation(5, 0, 0);
    mesh.applyMatrix(transform);

    group.add(mesh);     
    return group;
}


/**
 * Draws an arc
 * @param {number} depth The z position where to place the arc.
 * @return {THREE.Mesh} An mesh representing the arc using yellow as default material color
 */
function createArc (depth) {
    var elems = 19;

    var lastXTop = 5.5;
    var lastYTop = 0.5;
    var lastXBottom = 4.5;
    var lastYBottom = 0.5;
    
    var geometry = new THREE.Geometry();

    for (var i = 0; i < elems; i++) {
        var angle = UTIL_TO_RADIANS(10.0 * (i + 1));
       
        geometry.vertices.push(new THREE.Vector3 (lastXBottom, lastYBottom, depth));
        geometry.vertices.push(new THREE.Vector3 (lastXTop, lastYTop, depth));
        
        var x = 5.5 * Math.cos(angle);
        var y = 0.5 + 5.5 * Math.sin(angle);

        geometry.vertices.push(new THREE.Vector3 (x, y, depth));
        
        lastXTop = x;
        lastYTop = y;
        
        x = 4.5 * Math.cos(angle);
        y = 0.5 + 4.5 * Math.sin(angle);

        geometry.vertices.push(new THREE.Vector3 (x, y, depth));
                
        lastXBottom = x;
        lastYBottom = y;
        
        var base = i * 4;
        geometry.faces.push( new THREE.Face3( base + 1, base, base + 3 ) );
        geometry.faces.push( new THREE.Face3( base + 2, base + 1, base + 3 ) );
    }
    geometry.computeBoundingSphere();
    
    var material = new THREE.MeshBasicMaterial({color: 0xfff000, side: THREE.DoubleSide});
    return new THREE.Mesh(geometry, material);;
}

/**
 * Draws a roof for the arc
 * @param {number} depth The z position where to place the arc.
 * @return {THREE.Mesh} An mesh representing the arc using yellow as default material color
 */
function createRoof() {
    var elems = 19;
    var lastX = 5.5;
    var lastY = 0.5;
    var geometry = new THREE.Geometry();

    for (var i = 0; i < elems; i++) {
        var angle = UTIL_TO_RADIANS(10.0 * (i + 1));
       
        geometry.vertices.push(new THREE.Vector3 (lastX, lastY, 2.5));
        geometry.vertices.push(new THREE.Vector3 (lastX, lastY, -2.5));
        
        var x = 5.5 * Math.cos(angle);
        var y = 0.5 + 5.5 * Math.sin(angle);

        geometry.vertices.push(new THREE.Vector3 (x, y, -2.5));
        geometry.vertices.push(new THREE.Vector3 (x, y, 2.5));
                
        lastX = x;
        lastY = y;
        
        var base = i * 4;
        geometry.faces.push( new THREE.Face3( base + 1, base, base + 3 ) );
        geometry.faces.push( new THREE.Face3( base + 2, base + 1, base + 3 ) );
    }
    geometry.computeBoundingSphere();
    
    var material = new THREE.MeshBasicMaterial({color: 0xfff000, side: THREE.DoubleSide});
    return new THREE.Mesh(geometry, material);;
}

/**
 * Draws the windmill sails
 * @param {number} depth The z position where to place the arc.
 * @return {THREE.Mesh} An mesh representing the windmill sails using yellow as default material color
 */
function createSails() {
    var length = 0.75;
    var elems = 12;
    
    var group = new THREE.Object3D();
    var geometry = new THREE.Geometry();
    var geometryLines = new THREE.Geometry();
    var maxAngle = 2 * Math.PI;
    var angleSlice = maxAngle / elems;
    for (var base = 0, angle = 0; angle < maxAngle ; angle += angleSlice, base += 3) {
        var x = length * Math.cos(angle);
        var y = length * Math.sin(angle);    
        geometry.vertices.push(new THREE.Vector3 (x, y, 0));
        geometry.vertices.push(new THREE.Vector3 (0, 0, 0));
        
        geometryLines.vertices.push(new THREE.Vector3 (x, y, 0));
        
        angle += angleSlice;
        x = length * Math.cos(angle);
        y = length * Math.sin(angle);

        geometry.vertices.push(new THREE.Vector3 (x, y, 0));
        geometry.faces.push( new THREE.Face3( base, base + 1, base + 2 ) );
        
        geometryLines.vertices.push(new THREE.Vector3 (x, y, 0));
    }    
    geometry.computeBoundingSphere();
    geometryLines.vertices.push(new THREE.Vector3 (length * Math.cos(angle), length * Math.sin(angle), 0));
    
    var material = new THREE.MeshBasicMaterial({color: 0xfff000, side: THREE.DoubleSide});
    group.add(new THREE.Mesh(geometry, material));
 
    var line = new THREE.Line( geometryLines, new THREE.LineBasicMaterial( { color: 0xfff000, linewidth: 2 } ) );
    group.add(line);
    
    return group;
}