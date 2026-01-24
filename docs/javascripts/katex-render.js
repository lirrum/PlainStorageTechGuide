window.onload = function() {
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$", right: "$", display: false },
        { left: "$$", right: "$$", display: true }
      ],
      processEscapes: true,
      ignoreHtmlClass: "tex2jax_ignore",
      throwOnError: false  
    });
    console.log("KaTeX公式解析完成"); 
  } else {
    console.error("KaTeX的auto-render.min.js未加载成功");
  }
};