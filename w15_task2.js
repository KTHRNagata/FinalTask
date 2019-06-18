function main()
{
    //var volume = new KVS.SingleCubeData();
    //var volume = new KVS.CreateHydrogenData( 64, 64, 64 );
    var volume = new KVS.LobsterData();
    var screen = new KVS.THREEScreen();
    var mesh;

    screen.init(volume, {
      width: window.innerWidth * 0.8,
      height: window.innerHeight,
      targetDom: document.getElementById('display'),
      enableAutoResize: false
    });
    setup();
    screen.loop();

    function setup()
    {
        var color = new KVS.Vec3( 0, 0, 0 );
        var box = new KVS.BoundingBox();
        box.setColor( color );
        box.setWidth( 2 );

        var smin = volume.min_value;
        var smax = volume.max_value;
        var isovalue = KVS.Mix( smin, smax, 0.5 );
	var boxr_value = KVS.Mix( smin, smax, 0 );
	var boxg_value = KVS.Mix( smin, smax, 0 );
	var boxb_value = KVS.Mix( smin, smax, 0 );
        var isosurface = new KVS.Isosurface();
        isosurface.setIsovalue( isovalue );

        document.getElementById('label').innerHTML = "Isovalue: " + Math.round( isovalue );
	document.getElementById('label_boxr').innerHTML = "R_value: " + Math.round( boxr_value );
	document.getElementById('label_boxg').innerHTML = "G_value: " + Math.round( boxg_value );
	document.getElementById('label_boxb').innerHTML = "B_value: " + Math.round( boxb_value );

        var line = KVS.ToTHREELine( box.exec( volume ) );
        mesh = KVS.ToTHREEMesh( isosurface.exec( volume ) , new THREE.MeshLambertMaterial);
        screen.scene.add( line );
        screen.scene.add( mesh );

        document.getElementById('isovalue')
            .addEventListener('mousemove', function() {
                var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
                document.getElementById('label').innerHTML = "Isovalue: " + Math.round( isovalue );
            });

        document.getElementById('change-isovalue-button')
            .addEventListener('click', function() {
                screen.scene.remove( mesh );
                var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
                var isosurface = new KVS.Isosurface();
                isosurface.setIsovalue( isovalue );
                mesh = KVS.ToTHREEMesh( isosurface.exec( volume ), new THREE.MeshLambertMaterial );
                screen.scene.add( mesh );
            });

	//add
	document.getElementById('boxr_value')

            .addEventListener('mousemove', function() {
		screen.scene.remove( line );
		var boxr = +document.getElementById('boxr_value').value;
		var boxg = +document.getElementById('boxg_value').value;
		var boxb = +document.getElementById('boxb_value').value;
		var boxr_value = KVS.Mix( smin, smax, boxr );
                document.getElementById('label_boxr').innerHTML = "R_value: " + Math.round( boxr_value );
		color = new KVS.Vec3( boxr, boxg, boxb );
		box = new KVS.BoundingBox();
		box.setColor( color );
		box.setWidth( 2 );
		line = KVS.ToTHREELine( box.exec( volume ) );
		screen.scene.add( line );
            });

	document.getElementById('boxg_value')
            .addEventListener('mousemove', function() {
		screen.scene.remove( line );
		var boxr = +document.getElementById('boxr_value').value;
		var boxg = +document.getElementById('boxg_value').value;
		var boxb = +document.getElementById('boxb_value').value;
		var boxg_value = KVS.Mix( smin, smax, boxg );
                document.getElementById('label_boxg').innerHTML = "G_value: " + Math.round( boxg_value );
		color = new KVS.Vec3( boxr, boxg, boxb );
		box = new KVS.BoundingBox();
		box.setColor( color );
		box.setWidth( 2 );
		line = KVS.ToTHREELine( box.exec( volume ) );
		screen.scene.add( line );
            });
	
	document.getElementById('boxb_value')
            .addEventListener('mousemove', function() {
		screen.scene.remove( line );
		var boxr = +document.getElementById('boxr_value').value;
		var boxg = +document.getElementById('boxg_value').value;
		var boxb = +document.getElementById('boxb_value').value;
		var boxb_value = KVS.Mix( smin, smax, boxb );
                document.getElementById('label_boxb').innerHTML = "B_value: " + Math.round( boxb_value );
		color = new KVS.Vec3( boxr, boxg, boxb );
		box = new KVS.BoundingBox();
		box.setColor( color );
		box.setWidth( 2 );
		line = KVS.ToTHREELine( box.exec( volume ) );
		screen.scene.add( line );
            });	

	document.getElementById('lam_gouraud-button')
            .addEventListener('click', function() {
		screen.scene.remove(mesh);
		var vert_shader = document.getElementById('lam_gouraud.vert').text;
		var frag_shader = document.getElementById('lam_gouraud.frag').text;
		var reflection_model = "Lambert";
		var material = new THREE.ShaderMaterial({
		    vertexColors: THREE.VertexColors,
		    vertexShader: vert_shader,
		    fragmentShader: frag_shader,
		    defines: {
			Lambert: reflection_model == "Lambert",
			Phong: reflection_model == "Phong",
		    },
		    uniforms: {
			light_position: { type: 'v3', value: screen.light.position },
			camera_position: { type: 'v3', value: screen.camera.position },
		    }
		});
		var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
		var isosurface = new KVS.Isosurface();
		isosurface.setIsovalue(isovalue);
		mesh = KVS.ToTHREEMesh(isosurface.exec(volume),material);
		screen.scene.add(mesh);
            });
	
	document.getElementById('lam_phong-button')
            .addEventListener('click', function() {
		screen.scene.remove(mesh);
		var vert_shader = document.getElementById('lam_phong.vert').text;
		var frag_shader = document.getElementById('lam_phong.frag').text;
		var reflection_model = "Lambert";
		var material = new THREE.ShaderMaterial({
		    vertexColors: THREE.VertexColors,
		    vertexShader: vert_shader,
		    fragmentShader: frag_shader,
		    defines: {
			Lambert: reflection_model == "Lambert",
			Phong: reflection_model == "Phong",
		    },
		    uniforms: {
			light_position: { type: 'v3', value: screen.light.position },
			camera_position: { type: 'v3', value: screen.camera.position },
		    }
		});
		var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
		var isosurface = new KVS.Isosurface();
		isosurface.setIsovalue(isovalue);
		mesh = KVS.ToTHREEMesh(isosurface.exec(volume),material);
		screen.scene.add(mesh);
            });
			
	document.getElementById('phong_gouraud-button')
            .addEventListener('click', function() {
		screen.scene.remove(mesh);
		var vert_shader = document.getElementById('phong_gouraud.vert').text;
		var frag_shader = document.getElementById('phong_gouraud.frag').text;
		var reflection_model = "Phong";
		var material = new THREE.ShaderMaterial({
		    vertexColors: THREE.VertexColors,
		    vertexShader: vert_shader,
		    fragmentShader: frag_shader,
		    defines: {
			Lambert: reflection_model == "Lambert",
			Phong: reflection_model == "Phong",
		    },
		    uniforms: {
			light_position: { type: 'v3', value: screen.light.position },
			camera_position: { type: 'v3', value: screen.camera.position },
		    }
		});
		var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
		var isosurface = new KVS.Isosurface();
		isosurface.setIsovalue(isovalue);
		mesh = KVS.ToTHREEMesh(isosurface.exec(volume),material);
		screen.scene.add(mesh);
            });
	
	document.getElementById('phong_phong-button')
            .addEventListener('click', function() {
		screen.scene.remove(mesh);
		var vert_shader = document.getElementById('phong_phong.vert').text;
		var frag_shader = document.getElementById('phong_phong.frag').text;
		var reflection_model = "Phong";
		var material = new THREE.ShaderMaterial({
		    vertexColors: THREE.VertexColors,
		    vertexShader: vert_shader,
		    fragmentShader: frag_shader,
		    defines: {
			Lambert: reflection_model == "Lambert",
			Phong: reflection_model == "Phong",
		    },
		    uniforms: {
			light_position: { type: 'v3', value: screen.light.position },
			camera_position: { type: 'v3', value: screen.camera.position },
		    }
		});
		var value = +document.getElementById('isovalue').value;
                var isovalue = KVS.Mix( smin, smax, value );
		var isosurface = new KVS.Isosurface();
		isosurface.setIsovalue(isovalue);
		mesh = KVS.ToTHREEMesh(isosurface.exec(volume),material);
		screen.scene.add(mesh);
            });

        screen.draw();
    }
}


function changeIsovalue() {

}
