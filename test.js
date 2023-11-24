const express = require("express");
const app2 = express();
const path = require("path");

const router = express.Router();
router.get("/sign-in", (req, res) => {
  /**
 * #swagger.tags = ["Sign In"]
 * "[ApiExplorerSettings(IgnoreApi = true)]"
 */
console.log("in the get sign in code");
res.sendFile("sign-in.html", { root: path.join(__dirname, "./public") });
});



app2.use("/", router);

// app2.listen(3000, )

app2.listen(443, () => {
  console.log("Testing the server");
});


module.exports = app2;