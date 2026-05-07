import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { api } from '../../api';
import CodeEditorWindow from '../../features/Problem/CodeEditorWindow';
import ProblemDataPanel from '../../features/Problem/ProblemDataPanel';
import { type IProblem, type ISubmissionResult } from '../../types/problem.types';
import './Problem.style.css';
import { useQuery } from '@tanstack/react-query';

function Problem() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("description");
    const [results, setResults] = useState<ISubmissionResult[]>([]);
    const { data: codingProblem, isLoading } = useQuery<IProblem>({
        queryKey: ['codingProblem'],
        queryFn: async () => {
            let response = await api.get(`/problems/${id}/description`);
            
            response.data.codeTemplates = JSON.parse(response.data.codeTemplates);
            response.data.description = response.data.description.replace(/\\n/g, '\n');
            
            return response.data;
        },
    })

    if (isLoading || !codingProblem) {
        return <div>Loading...</div>;
    }

    return (
        <Box className="problem-page-container">
            <ProblemDataPanel problem={codingProblem} activeTab={activeTab} setActiveTab={setActiveTab} results={results} />
            <CodeEditorWindow problemId={codingProblem.id} codeTemplates={codingProblem.codeTemplates} setActiveTab={setActiveTab} setResults={setResults} />
        </Box>
    )
}

export default Problem;
