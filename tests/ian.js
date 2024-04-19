const getTitleAndCheckMatch = () => {
// Get the current title of the page
const currentTitle = document.title;

// Check if the current title matches "Space & Beyond | Testim.io demo"
const isMatch = currentTitle === "Space & Beyond | Testim.io demo";

return isMatch;
};

exportsTest.getTitleAndCheckMatch = getTitleAndCheckMatch;
