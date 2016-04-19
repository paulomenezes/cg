var camera = {
	C: { x: 1, y: 1, z: 2 },
	N: { x: -1, y: -1, z: -1 },
	V: { x: 0, y: 0, z: 1 },
	d: 1,
	hX: 1,
	hY: 1
};

function coordenadaVista (ponto) {
	// ortogonalizar V
	var prod = produtoEscalar(camera.V, camera.N) / produtoEscalar(camera.N, camera.N);
	var vLinha = new Point(camera.V.x - prod * camera.N.x, camera.V.y - prod * camera.N.y, camera.V.z - prod * camera.N.z);
	// U = N x V'
	var U = {
		x: camera.N.y * camera.V.z - camera.N.z * camera.V.y, 
		y: camera.N.z * camera.V.x - camera.N.x * camera.V.z, 
		z: camera.N.x * camera.V.y - camera.N.y * camera.V.x
	};
	// Normalização
	var alpha = {
		x: normalizar(U),
		y: normalizar(vLinha),
		z: normalizar(camera.N)
	};
	var matrizTransformacao = [
		[alpha.x.x, alpha.x.y, alpha.x.z],
		[alpha.y.x, alpha.y.y, alpha.y.z],
		[alpha.z.x, alpha.z.y, alpha.z.z]
	];

	var subPonto = subtracaoPontos(camera.C, ponto);
	return multiplicarMatriz(matrizTransformacao, [[subPonto.x],[subPonto.y],[subPonto.z]]);
}

//var ponto = new Point(1, -3, -5);
//console.log(coordenadaVista(ponto));

function draw (data) {
	try {
		var vertices = [];
		var triangulos = [];

		var data = data.split('\n');
		var vLen = data[0].split(' ')[0];
		var tLen = data[0].split(' ')[1];

		for (var i = 1; i <= parseInt(vLen); i++) {
			vertices.push(data[i].split(' '));
		}

		for (var i = parseInt(vLen) + 1; i < data.length - 1; i++) {
			triangulos.push(data[i].split(' '));
		}

		/*var minX = parseFloat(vertices[0][0]);
		var maxX = parseFloat(vertices[0][0]);

		var minY = parseFloat(vertices[0][1]);
		var maxY = parseFloat(vertices[0][1]);

		for (var i = 0; i < vertices.length; i++) {
			if (parseFloat(vertices[i][0]) > maxX) maxX = parseFloat(vertices[i][0]);
			if (parseFloat(vertices[i][0]) < minX) minX = parseFloat(vertices[i][0]);
			
			if (parseFloat(vertices[i][1]) > maxY) maxY = parseFloat(vertices[i][1]);
			if (parseFloat(vertices[i][1]) < minY) minY = parseFloat(vertices[i][1]);
		}*/

		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, 500, 500);

		for (var i = 0; i < triangulos.length; i++) {
			var verticesTriangulo = [
				[vertices[triangulos[i][0] - 1][0], vertices[triangulos[i][0] - 1][1]], 
				[vertices[triangulos[i][1] - 1][0], vertices[triangulos[i][1] - 1][1]], 
				[vertices[triangulos[i][2] - 1][0], vertices[triangulos[i][2] - 1][1]]
			];

			for (var j = 0; j < verticesTriangulo.length; j++) {
				/*var Xn = ((parseFloat(verticesTriangulo[j][0]) - minX) / (maxX - minX)) * (500 - 1);
				var Yn = ((parseFloat(verticesTriangulo[j][1]) - minY) / (maxY - minY)) * (500 - 1);
				var Zn = ((parseFloat(verticesTriangulo[j][2]) - minY) / (maxY - minY)) * (500 - 1);*/

				var vista = coordenadaVista(new Point(verticesTriangulo[j][0], verticesTriangulo[j][1], verticesTriangulo[j][2]));
				console.log(vista);
				
				ctx.beginPath();
				ctx.fillStyle = '#FFF';
				ctx.fillRect(vista.x, vista.y, 1, 1); 
				ctx.stroke();
			}
		}
	} catch (error) {
		alert('Arquivo inválido');
	}
}