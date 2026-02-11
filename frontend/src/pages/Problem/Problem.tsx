import {
    Box
} from '@mui/material';
import './Problem.style.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from '../../api';
import ProblemDescription from '../../features/Problem/components/ProblemDescription';
import CodeEditorWindow from '../../features/Problem/components/CodeEditorWindow';

function Problem() {
    const { id } = useParams<{ id: string }>();
    const [problem, setProblem] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        api.get(`/problems/${id}/description`)
            .then(response => {
                response.data.tags = response.data.tags.split(',');
                response.data.codeTemplatesJson = JSON.parse(response.data.codeTemplatesJson);
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
            <ProblemDescription problem={problem} activeTab={activeTab} setActiveTab={setActiveTab} />
            <CodeEditorWindow problemId={problem.id} codeTemplates={problem.codeTemplatesJson} />
        </Box>
    )
}

export default Problem;