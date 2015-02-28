/*jslint nomen: true */

NODE_INDEX = 0;
PATH_INDEX = 1;
PORT_INDEX = 2;

PORT = process.argv[PORT_INDEX]

require('./App').listen(PORT);
console.log("Server Started!");
