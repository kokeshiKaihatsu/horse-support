module.exports = function(eleventyConfig) {

  // 1. 静的ファイル（画像やadmin画面）を public にコピー
  eleventyConfig.addPassthroughCopy("public");

  // 2. CMSが生成する Markdown を Eleventy の入力にする
  eleventyConfig.addCollection("horses", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/horses/*.md");
  });

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/posts/*.md");
  });

  // 3. レイアウト（base.html）を使えるようにする
  eleventyConfig.addLayoutAlias("base", "src/layouts/base.html");
  eleventyConfig.addLayoutAlias("horse", "src/layouts/horse.html");
  eleventyConfig.addLayoutAlias("timeline", "src/layouts/timeline.html");

  // 4. 入力と出力のディレクトリ設定
  return {
    dir: {
      input: ".",          // ルート全体を入力として扱う
      includes: "src/layouts",
      data: "src/data",
      output: "public"     // Netlify が公開するフォルダ
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "md", "njk"]
  };
};
