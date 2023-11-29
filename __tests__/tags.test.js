const tagsController = require("../controllers/tags");

describe("Test tags controller functions", function() {
    test("responds to /", () => {
        function testTagRoot(input) {this.text = input};
        const req = {};
        const res = {text: ""} // ,
            // send: testTagRoot
    });
});

// getTags, getTag, createTag, updateTag, deleteTag