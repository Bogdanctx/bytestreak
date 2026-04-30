import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { api } from '../../api';
import CodeEditorWindow from '../../features/Problem/components/CodeEditorWindow';
import ProblemDataPanel from '../../features/Problem/components/ProblemDataPanel';
import { type IProblem, type ISubmissionResult } from '../../types/problem.types';
import './Problem.style.css';

function Problem() {
    const { id } = useParams<{ id: string }>();
    const [problem, setProblem] = useState<IProblem | null>(null);
    const [activeTab, setActiveTab] = useState("description");
    const [results, setResults] = useState<ISubmissionResult[]>([]);

    useEffect(() => {
        api.get(`/problems/${id}/description`)
            .then(response => {
                console.log("Fetched problem data:", response.data);

                response.data.codeTemplates = JSON.parse(response.data.codeTemplates);
                response.data.description = response.data.description.replace(/\\n/g, '\n');

                setProblem(response.data);
            })
            .catch(error => {
                console.error("Error fetching problem data:", error);
            });
    }, [id]);

    if (!problem) {
        return null;
    }

    return (
        <Box className="problem-page-container">
            <ProblemDataPanel problem={problem} activeTab={activeTab} setActiveTab={setActiveTab} results={results} />
            <CodeEditorWindow problemId={problem.id} codeTemplates={problem.codeTemplates} setActiveTab={setActiveTab} setResults={setResults} />
        </Box>
    )
}

export default Problem;