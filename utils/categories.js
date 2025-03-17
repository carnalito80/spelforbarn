// green: "text-emerald-700",
// blue: "text-blue-600",
// orange: "text-orange-700",
// purple: "text-purple-600",
// pink: "text-pink-600"

// Define your categories mapping
const categoryMap = {
    familjespel: {
      title: "Familjespel",
      slug: "familjespel",
      color: "green", // Example color for 'space'
    },
    fyra: {
      title: "4år+",
      slug: "4aringar",
      color: "blue", // Example color for 'cows'
    },
    tio: {
      title: "10år+",
      slug: "10aringar",
      color: "orange", // Example color for 'cleaning'
    },
  };
  
  // Function to get category data (title, slug, color) by category name
  export const getCategoryData = (categoryName) => {
    // Check if the category exists in the map, otherwise return a default value
    return categoryMap[categoryName] || {
      title: categoryName, // Default title to the category name
      slug: categoryName.toLowerCase().replace(/\s+/g, '-'), // Default slug: lowercase with hyphens
      color: "purple", // Default color: gray
    };
  };
  
  // Function to map all categories in an array to their custom data
  export const mapCategories = (categories) => {
    return categories.map((category) => getCategoryData(category));
  };

 export const getCategoryName = (slug) => {
    for (const key in categoryMap) {
        if (categoryMap[key].slug === slug) {
            return categoryMap[key].title;
        }
    }
    return slug; // 
}