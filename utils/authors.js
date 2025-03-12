
// Define your categories mapping
const authorMap = {
    jerker: {
      name: "Jerker",
      slug: "jerker",
      color: "green", // Example color for 'space'
      image: "jerker.jpg",
      bio: "Jerker brinner för brädpspel och kortspel av olika slag, allt från lite enklare spel som For Sale till tungviktare som War of the Ring. Favoritspelet med barnen och familjer än 7 Wonders."
    },
    test: {
      name: "TEst",
      slug: "test",
      color: "blue", // Example color for 'cows'
      image: "test.jpg"
    },
    test2: {
      name: "TEst2",
      slug: "test-2",
      color: "orange", // Example color for 'cleaning'
      image: "test2.jpg"
    },
  };
  
  // Function to get category data (name, slug, color) by category name
  export const getAuthorData = (authorName) => {
    // Check if the category exists in the map, otherwise return a default value
    return authorMap[authorName] || {
      name: authorName, // Default name to the category name
      slug: authorName.toLowerCase().replace(/\s+/g, '-'), // Default slug: lowercase with hyphens
      color: "purple", // Default color: gray
      image: "test3.jpg"
    };
  };
  
  // Function to map all categories in an array to their custom data
  export const mapAuthors = (authors) => {
    return authors.map((author) => getAuthorData(author));
  };

  export const getAuthors = () => {
    return authorMap;
  };