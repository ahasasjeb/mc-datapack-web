import express from 'express';
import { marked } from 'marked';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import MCFunction from 'mcfunction-highlight/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// 自定义 marked 渲染器来处理 mcfunction 代码块
const renderer = {
    code(code, language) {
        if (language === 'mcfunction') {
            return MCFunction.highlightWithWrapper(code);
        }
        return false; // 使用默认渲染
    }
};

marked.use({ renderer });

// 读取并缓存模板
let templateHTML = '';
let mcfunctionCSS = MCFunction.getCSS();

async function loadTemplate() {
    templateHTML = await readFile(path.join(__dirname, 'templates', 'layout.html'), 'utf-8');
    // 注入 mcfunction CSS
    templateHTML = templateHTML.replace('{{mcfunction-css}}', mcfunctionCSS);
}
await loadTemplate();

app.get('/', (req, res) => {
    res.redirect('/README.md');
});

app.get('/:mdFile', async (req, res) => {
    try {
        const mdFile = req.params.mdFile;
        // 基本安全检查以防止目录遍历
        const safePath = path.normalize(mdFile).replace(/^(\.\.(\/|\\|$))+/, '');
        const filePath = path.join(__dirname, safePath);
        
        const content = await readFile(filePath, 'utf-8');
        const htmlContent = marked(content);
        
        // 将HTML内容插入模板
        const finalHTML = templateHTML.replace('{{content}}', htmlContent);
        
        res.send(finalHTML);
    } catch (error) {
        console.error('Error:', error);
        res.status(404).send('File not found or error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});