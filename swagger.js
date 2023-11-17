const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Notes API",
    description: "Manages users notes",
  },
  // host: "note-capture.onrender.com",
  host: "localhost:3000/doc",
  // schemes: ["https"],
  schemes: ["http"],
};

// const outputFile = './path/swagger-output.json';
const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./app.js");
});
