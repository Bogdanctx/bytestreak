import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

import './MarkdownRenderer.style.css';

function MarkdownRenderer({ content }: { content: string }) {
    return (
        <Box className="markdown-renderer-container">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {content}
            </ReactMarkdown>
        </Box>
    );
}

export default MarkdownRenderer;