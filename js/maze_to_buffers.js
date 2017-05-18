/*
 * corner1A, corner1B are the 2 non-axis coordinates in the first corner
 * corner2A, corner2B are the 2 non-axis coordinates in the second corner (opposite of first)
 * corner1U, corner1V, corner2U, corner2V are the UV coordinates at the corners
 * axis is as follows: 0 -> x, 1 -> y, 2 -> z
 * offset is the value of the coordinate on that axis
 * normDirection is the normal direction, as follows:
 *   0 -> up, 1 -> east, 2 -> north, 3 -> west, 4 -> south
 * textureFlag is whether the texture is floor(0) or wall (1)
 *
 * vertexBuffer attributes as follows:
 * [ x, y, z, u, v, normDirection, textureFlag ]
 */
function constructSquare(vertBuffer, idxBuffer, corner1A, corner1B, corner1U, corner1V,
	corner2A, corner2B, corner2U, corner2V, axis, offset, normDir, textureFlag) {
	var startIndex = vertBuffer.length / 7;
	// Add 4 square vertices to vertex buffer
	if (axis === 0) { // constant x axis
		vertBuffer.push.apply(vertBuffer, [offset, corner1A, corner1B, corner1U, corner1V, normDir, textureFlag]);
		vertBuffer.push.apply(vertBuffer, [offset, corner1A, corner2B, corner1U, corner2V, normDir, textureFlag]);
		vertBuffer.push.apply(vertBuffer, [offset, corner2A, corner1B, corner2U, corner1V, normDir, textureFlag]);
		vertBuffer.push.apply(vertBuffer, [offset, corner2A, corner2B, corner2U, corner2V, normDir, textureFlag]);
	} else if (axis === 1) { // constant y axis
		vertBuffer.push.apply(vertBuffer, [corner1A, offset, corner1B, corner1U, corner1V, normDir, textureFlag]);
		vertBuffer.push.apply(vertBuffer, [corner1A, offset, corner2B, corner1U, corner2V, normDir, textureFlag]);
		vertBuffer.push.apply(vertBuffer, [corner2A, offset, corner1B, corner2U, corner1V, normDir, textureFlag]);
		vertBuffer.push.apply(vertBuffer, [corner2A, offset, corner2B, corner2U, corner2V, normDir, textureFlag]);
	} else { // constant z axis
		vertBuffer.push.apply(vertBuffer, [corner1A, corner1B, offset, corner1U, corner1V, normDir, textureFlag]);
		vertBuffer.push.apply(vertBuffer, [corner1A, corner2B, offset, corner1U, corner2V, normDir, textureFlag]);
		vertBuffer.push.apply(vertBuffer, [corner2A, corner1B, offset, corner2U, corner1V, normDir, textureFlag]);
		vertBuffer.push.apply(vertBuffer, [corner2A, corner2B, offset, corner2U, corner2V, normDir, textureFlag]);
	}
	// Add 2 sets of 3 triangle indices to index buffer
	idxBuffer.push.apply(idxBuffer, [
		startIndex, startIndex + 2, startIndex + 1,			// TRIANGLE 1
		startIndex + 1, startIndex + 2, startIndex + 3		// TRIANGLE 2
	]);
}

function neighborData(maze, row, col) {
	var eastNeighbor = false;
	var northNeighbor = false;
	var westNeighbor = false;
	var southNeighbor = false;

	if (col === (maze.sizeX - 1) || maze.data[col + 1][row] === 1) {
		eastNeighbor = true;
	}

	if (row === (maze.sizeY - 1) || maze.data[col][row + 1] === 1) {
		northNeighbor = true;
	}

	if (col === 0 || maze.data[col - 1][row] === 1) {
		westNeighbor = true;
	}

	if (row === 0 || maze.data[col][row - 1] === 1) {
		southNeighbor = true;
	}

	// console.log("neighborData for row: " + row + ", col: " + col);
	// console.log("east? " + eastNeighbor + " ... north? " + northNeighbor);
	// console.log("west? " + westNeighbor + " ... south? " + southNeighbor);

	return {
		eastNeighbor: eastNeighbor,
		northNeighbor: northNeighbor,
		westNeighbor: westNeighbor,
		southNeighbor: southNeighbor
	};
}

function addWallCube(vertBuffer, idxBuffer, row, col, neighbors) {
	// TOP FACE (constant z)
	// constructSquare(vertBuffer, idxBuffer, col * 1.0, row * 1.0, 0.0, 0.0, 
	// 	(col + 1) * 1.0, (row + 1) * 1.0, 1.0, 1.0, 2, 1.0, 0.0, 1.0);

	// WEST FACE (constant x)
	if (!neighbors.westNeighbor) {
		constructSquare(vertBuffer, idxBuffer, (row + 1) * 1.0, 0.0, 0.0, 0.0, 
			row * 1.0, 1.0, 1.0, 1.0, 0, col * 1.0, 3.0, 1.0);
	}
	// EAST FACE (constant x)
	if (!neighbors.eastNeighbor) {
		constructSquare(vertBuffer, idxBuffer, row * 1.0, 0.0, 0.0, 0.0, 
			(row + 1) * 1.0, 1.0, 1.0, 1.0, 0, (col + 1) * 1.0, 1.0, 1.0);
	}

	// SOUTH FACE (constant y)
	if (!neighbors.southNeighbor) {
		constructSquare(vertBuffer, idxBuffer, col * 1.0, 0.0, 0.0, 0.0, 
			(col + 1) * 1.0, 1.0, 1.0, 1.0, 1, row * 1.0, 4.0, 1.0);
	}
	// NORTH FACE (constant y)
	if (!neighbors.northNeighbor) {
		constructSquare(vertBuffer, idxBuffer, (col + 1) * 1.0, 0.0, 0.0, 0.0, 
			col * 1.0, 1.0, 1.0, 1.0, 1, (row + 1) * 1.0, 2.0, 1.0);
	}
}

function addFloorPlane(vertBuffer, idxBuffer, row, col) {
	constructSquare(vertBuffer, idxBuffer, col * 1.0, row * 1.0, 0.0, 0.0, 
		(col + 1) * 1.0, (row + 1) * 1.0, 1.0, 1.0, 2, 0.0, 0.0, 0.0);
}

function addSkybox(vertBuffer, idxBuffer, x, y) {
	// TOP OF BOX (constant z)
	constructSquare(vertBuffer, idxBuffer, -1.0, y + 1.0, 0.0, 0.0, 
			x + 1.0, -1.0, 1.0, 1.0, 2, 2.0, 0.0, 2.0);

	// BOTTOM OF BOX (constant z)
	constructSquare(vertBuffer, idxBuffer, -1.0, -1.0, 0.0, 0.0, 
			x + 1.0, y + 1.0, 1.0, 1.0, 2, -1.0, 0.0, 2.0);

	// EAST SIDE OF BOX (constant x)
	constructSquare(vertBuffer, idxBuffer, y + 1.0, -1.0, 0.0, 0.0, 
			-1.0, 2.0, 1.0, 1.0, 0, x + 1.0, 0.0, 2.0);

	// WEST SIDE OF BOX (constant x)
	constructSquare(vertBuffer, idxBuffer, -1.0, -1.0, 0.0, 0.0, 
			y + 1.0, 2.0, 1.0, 1.0, 0, -1.0, 0.0, 2.0);

	// NORTH SIDE OF BOX (constant y)
	constructSquare(vertBuffer, idxBuffer, -1.0, -1.0, 0.0, 0.0, 
			x + 1.0, 2.0, 1.0, 1.0, 1, y + 1.0, 0.0, 2.0);

	// SOUTH SIDE OF BOX (constant y)
	constructSquare(vertBuffer, idxBuffer, x + 1.0, -1.0, 0.0, 0.0, 
			-1.0, 2.0, 1.0, 1.0, 1, -1.0, 0.0, 2.0);
}

/*
 * mazeToBuffers takes a maze object and returns
 * an object with the vertex/index buffers for the
 * geometry in the maze. These can be accessed with
 * the fields vertexBuffer and indexBuffer
 */
function mazeToBuffers(maze) {
	var vertexBuffer = [];
	var indexBuffer = [];
	for (var row = 0; row < maze.sizeY; row++) {
		for (var col = 0; col < maze.sizeX; col++) {
			if (maze.data[col][row] === 1) { // WALL
				var neighbors = neighborData(maze, row, col);
				addWallCube(vertexBuffer, indexBuffer, row, col, neighbors);
			} else { // FLOOR
				addFloorPlane(vertexBuffer, indexBuffer, row, col);
			}
		}
	}
	addSkybox(vertexBuffer, indexBuffer, maze.sizeX, maze.sizeY);
	return {
		vertexBuffer: vertexBuffer,
		indexBuffer: indexBuffer
	};
}