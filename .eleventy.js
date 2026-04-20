module.exports = function(eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("src");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("uploads");
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy({ "favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "favicon.png": "favicon.png" });
  eleventyConfig.addPassthroughCopy({ "logo-light.svg": "logo-light.svg" });
  eleventyConfig.addPassthroughCopy({ "logo-dark.svg": "logo-dark.svg" });
  eleventyConfig.addPassthroughCopy({ "apple-touch-icon.png": "apple-touch-icon.png" });
  eleventyConfig.addPassthroughCopy({ "og-image.png": "og-image.png" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });

  // Collections
  eleventyConfig.addCollection("portfolio", function(collection) {
    return collection.getFilteredByGlob("portfolio/*.md");
  });
  eleventyConfig.addCollection("services", function(collection) {
    return collection.getFilteredByGlob("services/*.md");
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
