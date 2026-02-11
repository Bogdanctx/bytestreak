import './MarkdownRenderer.style.css';
import ReactMarkdown from 'react-markdown';
import { Box } from '@mui/material';

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