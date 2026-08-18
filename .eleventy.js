const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // 年齢計算フィルター
  eleventyConfig.addFilter("calcAge", function(birthday) {
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  });

  // 日付フォーマットフィルター
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy/MM/dd") => {
    // Eleventyが渡すdateが文字列でもDateでも対応
    const date = typeof dateObj === "string"
      ? DateTime.fromISO(dateObj)
      : DateTime.fromJSDate(dateObj);
    return date.setZone("Asia/Tokyo").toFormat(format);
  });

  // 馬コレクション
  eleventyConfig.addCollection("horses", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/horses/*.md");
  });

  // 会員限定ページ
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob([
      "src/pages/timeline/*.md",
      "src/pages/members/*.md"
    ]);
  });

  // レイアウト
  eleventyConfig.addLayoutAlias("base", "_includes/layouts/base.njk");
  eleventyConfig.addLayoutAlias("horse", "_includes/layouts/horse.html");
  eleventyConfig.addLayoutAlias("timeline", "_includes/layouts/timeline.html");
  // パス
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/scripts");


  // Eleventy設定
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "data",
      output: "public"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "md", "njk"]
  };
};
