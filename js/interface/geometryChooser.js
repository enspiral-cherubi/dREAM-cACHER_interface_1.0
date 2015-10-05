
THREE.geometryChooser = function (sentiment) {
  if (sentiment > 0.75) {
    var argument = Math.round((sentiment - 0.5))
    return new THREE.SphereGeometry(150, argument, argument);
  } else if (sentiment > 0.5) {
    return new THREE.OctahedronGeometry(150, 1)
  } else if (sentiment > 0) {
    return new THREE.TetrahedronGeometry(150, 1);
  } else if (sentiment > -0.5) {
    return new THREE.TorusKnotGeometry(37.67, getRandom(150,200), 4, 3, 7.52, 7.83, getRandom(4,20))
  } else if (sentiment > -0.75) {
    return new THREE.TorusKnotGeometry(37.67, 200, Math.round(getRandom(10,100)), 2, getRandom(4,20), getRandom(4,20), 5.25)
  } else {
    return new THREE.TorusKnotGeometry(37.67, 200, 59, 2, getRandom(4,20), getRandom(4,20), 1)
  }
}




// things that can change how the object looks:
// mesh
// color
// rotation



// // arguments between 5 and 150
// geometry = new THREE.SphereGeometry(150, 5, 5);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// // just the one setting
// geometry = new THREE.OctahedronGeometry(150, 1);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// // just the one setting
// geometry = new THREE.TetrahedronGeometry(150, 1);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);


// really bad dreams:
// // this looks awesome
// var geom = new THREE.TorusKnotGeometry(37.67, 200, getRandom(10,100).floor, 2, getRandom(4,20), getRandom(4,20), 5.25);

// // also looks cool
// var geom = new THREE.TorusKnotGeometry(37.67, 200, 59, 2, getRandom(4,20), getRandom(4,20), 1)


// // medium-bad dream
// var geom = new THREE.TorusKnotGeometry(37.67, getRandom(150,200), 4, 3, 7.52, 7.83, getRandom(4,20))



// geometry = new THREE.TorusKnotGeometry(37.67, 200, 59, 2, 5.1, 7.83, 5.25);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// geometry = new THREE.TorusKnotGeometry(37.67, 200, 59, 2, 3.28, 7.83, 5.25);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// bad dreams:

// geometry = new THREE.TorusKnotGeometry(37.67, 200, 8, 2, 2.67, 4.95, 3.12);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// geometry = new THREE.TorusKnotGeometry(104.53, 128.25, 64, 2, 1.61, 15, 1);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// geometry = new THREE.TorusKnotGeometry(104.53, 117.47, 13, 2, 5.86, 2.37, 1);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// geometry = new THREE.TorusKnotGeometry(37.67, 200, 8, 2, 2.67, 4.95, 5.7);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);


// medium dreams

// geometry = new THREE.TorusKnotGeometry(37.67, 200, 8, 2, 7.52, 7.83, 11.77);
// material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
// mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);