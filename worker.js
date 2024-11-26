import { marked } from 'marked';
import MCFunction from 'mcfunction-highlight/node';

// 自定义 marked 渲染器来处理 mcfunction 代码块
const renderer = {
    code(code, language) {
        if (language === 'mcfunction') {
            return MCFunction.highlightWithWrapper(code);
        }
        return false;
    }
};

marked.use({ renderer });

const mcfunctionCSS = MCFunction.getCSS();

async function getAssetFromKV(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // 默认页面重定向
    if (path === '/') {
        return Response.redirect(new URL('/README.md', request.url), 301);
    }

    // 移除开头的斜杠
    path = path.replace(/^\//, '');
    
    try {
        const response = await fetch(new URL(path, request.url));
        if (!response.ok) {
            throw new Error(`Failed to fetch ${path}`);
        }

        const content = await response.text();
        
        // 如果是 Markdown 文件，进行渲染
        if (path.endsWith('.md')) {
            const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minecraft 数据包文档</title>
    <style>
        ${mcfunctionCSS}
        body {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
        }
        pre {
            padding: 1em;
            overflow-x: auto;
            background: #f5f5f5;
            border-radius: 4px;
        }
        code {
            background: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    ${marked(content)}
</body>
</html>`;
            return new Response(html, {
                headers: {
                    'content-type': 'text/html;charset=UTF-8',
                },
            });
        }

        // 其他文件按原样返回
        return new Response(content);
    } catch (error) {
        return new Response('Not Found', { status: 404 });
    }
}

export default {
    async fetch(request, env, ctx) {
        return getAssetFromKV(request, env);
    },
};
