import express from 'express';
import { marked } from 'marked';
import { readFile, readdir } from 'fs/promises';
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

// 获取文档目录列表
async function getDocsList() {
    try {
        const files = await readdir(path.join(__dirname, 'docs'));
        const mdFiles = files.filter(file => file.toLowerCase().endsWith('.md'));
        const listItems = mdFiles.map(file => {
            const name = path.basename(file, '.md');
            return `<li><a href="/docs/${file}">${name}</a></li>`;
        }).join('\n');
        return `
            <ul>
                <li><a href="/" class="home-link">首页</a></li>
                ${listItems}
            </ul>
        `;
    } catch (error) {
        console.error('Error reading docs directory:', error);
        return '<p>Error loading documentation list</p>';
    }
}

async function loadTemplate() {
    templateHTML = await readFile(path.join(__dirname, 'templates', 'layout.html'), 'utf-8');
    // 注入 mcfunction CSS
    templateHTML = templateHTML.replace('{{mcfunction-css}}', mcfunctionCSS);
}
await loadTemplate();

app.get('/', (req, res) => {
    res.redirect('/README.md');
});

async function renderPage(content) {
    const htmlContent = marked(content);
    const sidebarContent = await getDocsList();
    return templateHTML
        .replace('{{content}}', htmlContent)
        .replace('{{sidebar}}', sidebarContent);
}

app.get('/:mdFile', async (req, res) => {
    try {
        const mdFile = req.params.mdFile;
        // 检查文件扩展名是否为 .md
        if (!mdFile.toLowerCase().endsWith('.md')) {
            return res.status(403).send('Only .md files are allowed.只有.md文件允许');
        }
        // 基本安全检查以防止目录遍历
        const safePath = path.normalize(mdFile).replace(/^(\.\.(\/|\\|$))+/, '');
        const filePath = path.join(__dirname, safePath);
        
        const content = await readFile(filePath, 'utf-8');
        const finalHTML = await renderPage(content);
        
        res.send(finalHTML);
    } catch (error) {
        console.error('Error:', error);
        res.status(404).send('File not found or error occurred');
    }
});

// 处理文档路由
app.get('/docs/:filename', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'docs', req.params.filename);
        const content = await readFile(filePath, 'utf-8');
        const finalHTML = await renderPage(content);
        res.send(finalHTML);
    } catch (err) {
        console.error('Error accessing docs:', err);
        res.status(404).send('文档不存在');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});