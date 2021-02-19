let num_tiles;   // # of tiles to cover width of plane
let tile_width;  // individual width of each tile
let pattern_choice // Choice for current pattern

function setup() {
    createCanvas(500, 500);
    angleMode(DEGREES);
    noLoop();
    background(255);

    num_tiles = 10;
    tile_width = width / num_tiles;
    // console.log('tile_width: ', tile_width);
    pattern_choice = "filled_quarter_circles";
    // pattern_choice = "triangles";

}

function keyPressed() {
    switch (key) {
        case 'r':
            redraw();
            tile_arr = [];
            break;
        case 's':
            saveCanvas(pattern_choice);
            break;
    }
}

function draw() {
    background(255);
    draw_tiles();
}

function draw_tiles() {
    // Draw all tiles
    for (let i = 0; i < num_tiles; i++) {
        for (let j = 0; j < num_tiles; j++) {
            // Push current orientation
            push();
            let tile_pos = createVector(j * tile_width + tile_width / 2,
                                        i * tile_width + tile_width / 2);
            draw_individual_tile(pattern_choice, tile_pos.x, tile_pos.y);
            pop(); // Pop after translation 
        }
    }
}

let tile_arr = []; // Used for patterns where prev. choice matters
let choice;
function draw_individual_tile(pattern, cx, cy) {
    // Draw an individual tile

    // Translate so that the origin is the center of the tile
    translate(cx, cy);
    angleMode(DEGREES);
     
    // Draw pattern
    switch (pattern) {
        case "triangles":
            rotate(90 * floor(Math.random() * 4));
            fill(0);
            triangle(-tile_width / 2, tile_width / 2,
                    tile_width / 2, tile_width / 2,
                    -tile_width / 2, -tile_width / 2);
            break;
        case "quarter_circles":
            rotate(90 * floor(Math.random() * 4));
            noFill();
            strokeWeight(3);
            arc(-tile_width / 2, -tile_width / 2, 
                 tile_width, tile_width, 0, 90);
            arc(tile_width / 2, tile_width / 2, 
                 tile_width, tile_width, 180, 270);
            break;
        case "test":
            break;
        
        case "filled_quarter_circles":
            colorMode(HSB);
            let seed1 = map(cx, 0, width, 230, 360);
            let seed2 = map(cy, 0, height, 45, 180);
            let c1 = color(seed2, 100, 100, 1);
            // let c1 = color('bla);
            let c2 = color(seed1, 100, 100, 1);
            // let c2 = color('black');
            color_pal = [c1, c2]
            rectMode(CORNER);
            noStroke();

            // Tiling ruleset
            let rules = {
                0: [1, 2],
                1: [0, 3],
                2: [0, 3],
                3: [1, 2]
            }
            let choice;
            if (tile_arr.length > 0 && tile_arr.length < num_tiles) {
                // On first row, check prev_tile to left
                let prev_tile = tile_arr[tile_arr.length-1];
                // console.log('prev_tile', prev_tile);
                choice = random(rules[prev_tile]);
            }
            else if (tile_arr.length >= num_tiles) {
                // After first row, check tile above
                let above_tile = tile_arr[tile_arr.length-num_tiles];
                // console.log('tile above', above_tile);
                choice = random(rules[above_tile]);
            }
            else {
                // Starting tile
                // console.log("First tile");
                choice = floor(Math.random() * 4);
            }

            // Defining patterns for each tile type
            if (choice == 0) {
                fill(color_pal[0]);
                square(-tile_width / 2, -tile_width / 2,
                       tile_width);
                       
                fill(color_pal[1]);
                arc(-tile_width / 2, -tile_width / 2, 
                    tile_width, tile_width, 0, 90);
                arc(tile_width / 2, tile_width / 2, 
                    tile_width, tile_width, 180, 270);
            }
            else if (choice == 1) {
                fill(color_pal[0]);
                square(-tile_width / 2, -tile_width / 2,
                       tile_width);

                fill(color_pal[1]);
                arc(-tile_width / 2, tile_width / 2,
                     tile_width, tile_width, 270, 360);
                arc(tile_width / 2, -tile_width / 2, 
                    tile_width, tile_width, 90, 180);
            }
            else if (choice == 2) {
                fill(color_pal[1]);
                square(-tile_width / 2, -tile_width / 2,
                       tile_width);

                fill(color_pal[0]);
                arc(-tile_width / 2, -tile_width / 2, 
                    tile_width, tile_width, 0, 90);
                arc(tile_width / 2, tile_width / 2, 
                    tile_width, tile_width, 180, 270);
            }
            else if (choice == 3) {
                fill(color_pal[1]);
                square(-tile_width / 2, -tile_width / 2,
                       tile_width);

                fill(color_pal[0]);
                arc(-tile_width / 2, tile_width / 2,
                     tile_width, tile_width, 270, 360);
                arc(tile_width / 2, -tile_width / 2, 
                    tile_width, tile_width, 90, 180);
            }
            tile_arr.push(choice);
            // console.log(tile_arr);
            break;
    }
}

function cos_col(t, a, b, c, d) {
    // console.log('a: ', a);
    // console.log('b: ', b);
    // console.log('c: ', c);
    // console.log('d: ', d);
    angleMode(RADIANS);
    // return a + b * cos(2 * PI * (c * t + d));
    let result = createVector(null, null, null);
    result.x = a.x + b.x * cos(2 * PI * (c.x * t + d.x));
    result.y = a.y + b.y * cos(2 * PI * (c.y + t * d.y));
    result.z = a.z + b.z * cos(2 * PI * (c.z + t * d.z));
    angleMode(DEGREES);
    return createVector(map(result.x, 0, 1, 0, 255),
                 map(result.y, 0, 1, 0, 255),
                 map(result.y, 0, 1, 0, 255));
}