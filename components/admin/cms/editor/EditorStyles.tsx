export default function EditorStyles() {
  return (
    <style>{`
      [data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: #DCDCDC;
        pointer-events: none;
        display: block;
      }
      .blog-content { font-family: 'Matter', Georgia, sans-serif; font-size: 18px; line-height: 1.85; color: #333; }
      .blog-content h1 { font-size: 32px; font-weight: 600; color: #111; margin: 32px 0 16px; line-height: 1.2; }
      .blog-content h2 { font-size: 24px; font-weight: 600; color: #111; margin: 32px 0 12px; line-height: 1.3; }
      .blog-content h3 { font-size: 20px; font-weight: 600; color: #111; margin: 28px 0 10px; line-height: 1.4; }
      .blog-content p { margin: 0 0 18px; color: #333; }
      .blog-content ul, .blog-content ol { margin: 0 0 18px; padding-left: 24px; }
      .blog-content li { margin-bottom: 8px; color: #333; }
      .blog-content strong { color: #111; font-weight: 600; }
      .blog-content em { font-style: italic; }
      .blog-content u { text-decoration: underline; text-underline-offset: 3px; }
      .blog-content a { color: #F97316; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
      .blog-content code { background: #F5F5F5; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; font-family: 'SF Mono', Menlo, monospace; color: #C2571A; }
      .blog-content pre { background: #1A1A1A; color: #E5E5E5; padding: 20px 24px; border-radius: 12px; margin: 24px 0; overflow-x: auto; font-family: 'SF Mono', Menlo, monospace; font-size: 14px; line-height: 1.6; }
      .blog-content pre code { background: none; padding: 0; color: inherit; font-size: inherit; }
      .blog-content blockquote { border-left: 3px solid #1A1A1A; padding: 4px 0 4px 20px; margin: 28px 0; font-style: italic; color: #555; font-size: 20px; line-height: 1.7; }
      .blog-content hr { border: none; height: 1px; background: #EBEBEB; margin: 36px auto; width: 30%; }
      .blog-content img { max-width: 100%; height: auto; border-radius: 12px; margin: 24px 0; display: block; cursor: pointer; transition: opacity 0.15s; }
      .blog-content img:hover { opacity: 0.92; }
      .blog-content figure { margin: 28px 0; position: relative; }
      .blog-content figure img { margin: 0 0 10px; }
      .blog-content figcaption { text-align: center; font-size: 14px; color: #999; line-height: 1.5; }
      .blog-content figcaption:empty:before { content: 'Add a caption...'; color: #DCDCDC; }
      .blog-content .yt-embed { position: relative; width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 16px; overflow: hidden; margin: 28px 0; background: #111; cursor: pointer; }
      .blog-content .yt-embed:hover { box-shadow: 0 0 0 2px #E08A3C; }
      .blog-content .yt-embed iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 16px; pointer-events: none; }
      .blog-content table { width: 100%; border-collapse: collapse; margin: 24px 0; }
      .blog-content th { background: #F5F5F5; padding: 10px 14px; text-align: left; font-weight: 600; color: #111; border-bottom: 2px solid #EBEBEB; }
      .blog-content td { padding: 10px 14px; border-bottom: 1px solid #F5F5F5; color: #555; }
      .blog-content s { text-decoration: line-through; color: #999; }
    `}</style>
  );
}
