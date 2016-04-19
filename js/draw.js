var camera = {
	C: { x: 0, y: -500, z: 500 },
	N: { x: 10, y: 10, z: 200 },
	V: { x: 0, y: 0, z: 10 },
	d: 80,
	hX: 1,
	hY: 1
};

var vertices = [];
var triangulos = [];

function $ (element) {
	return document.querySelector(element);
}

function update () {
	camera = {
		C: {
			x: parseFloat($("#cameraCX").value),
			y: parseFloat($("#cameraCY").value),
			z: parseFloat($("#cameraCZ").value),
		},
		N: {
			x: parseFloat($("#cameraNX").value),
			y: parseFloat($("#cameraNY").value),
			z: parseFloat($("#cameraNZ").value),
		},
		V: {
			x: parseFloat($("#cameraVX").value),
			y: parseFloat($("#cameraVY").value),
			z: parseFloat($("#cameraVZ").value),
		},
		d: parseFloat($("#cameraD").value),
		hX: parseFloat($("#cameraHX").value),
		hY: parseFloat($("#cameraHY").value)
	};

	draw();
}

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
	console.log(U);
	// Normalização
	var alpha = {
		x: normalizar(U),
		y: normalizar(vLinha),
		z: normalizar(camera.N)
	};
	console.log(alpha);
	var matrizTransformacao = [
		[alpha.x.x, alpha.x.y, alpha.x.z],
		[alpha.y.x, alpha.y.y, alpha.y.z],
		[alpha.z.x, alpha.z.y, alpha.z.z]
	];

	var subPonto = subtracaoPontos(camera.C, ponto);
	return multiplicarMatriz(matrizTransformacao, [[subPonto.x],[subPonto.y],[subPonto.z]]);
}

function draw (data) {
	try {
		if (data) {
			var data = data.split('\n');
			var vLen = data[0].split(' ')[0];
			var tLen = data[0].split(' ')[1];

			for (var i = 1; i <= parseInt(vLen); i++) {
				vertices.push(data[i].split(' '));
			}

			for (var i = parseInt(vLen) + 1; i < data.length - 1; i++) {
				triangulos.push(data[i].split(' '));
			}
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
				[vertices[triangulos[i][0] - 1][0], vertices[triangulos[i][0] - 1][1], vertices[triangulos[i][0] - 1][2]], 
				[vertices[triangulos[i][1] - 1][0], vertices[triangulos[i][1] - 1][1], vertices[triangulos[i][1] - 1][2]], 
				[vertices[triangulos[i][2] - 1][0], vertices[triangulos[i][2] - 1][1], vertices[triangulos[i][2] - 1][2]]
			];

			for (var j = 0; j < verticesTriangulo.length; j++) {
				/*var Xn = ((parseFloat(verticesTriangulo[j][0]) - minX) / (maxX - minX)) * (500 - 1);
				var Yn = ((parseFloat(verticesTriangulo[j][1]) - minY) / (maxY - minY)) * (500 - 1);
				var Zn = ((parseFloat(verticesTriangulo[j][2]) - minY) / (maxY - minY)) * (500 - 1);*/

				
				var vista = coordenadaVista(new Point(verticesTriangulo[j][0], verticesTriangulo[j][1], verticesTriangulo[j][2]));
				
				var Xs = (camera.d / camera.hX) * (vista[0][0] / vista[2][0]);
				var Ys = (camera.d / camera.hY) * (vista[1][0] / vista[2][0]);
				
				ctx.beginPath();
				ctx.fillStyle = '#FFF';
				ctx.fillRect(Xs, Ys, 1, 1); 
				ctx.stroke();
			}
		}
	} catch (error) {
		alert('Arquivo inválido');
	}
}