import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';

import './MarkdownRenderer.style.css';

function MarkdownRenderer({ content }: { content: string }) {
    return (
        <Box className="markdown-renderer-container">
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </Box>
    );
}

export default MarkdownRenderer;