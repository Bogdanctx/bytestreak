import {
    Box
} from '@mui/material';
import './Problem.style.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from '../../api';
import ProblemDataPanel from '../../features/Problem/components/ProblemDataPanel';
import CodeEditorWindow from '../../features/Problem/components/CodeEditorWindow';
import { type IProblem } from '../../entities';

function Problem() {
    const { id } = useParams<{ id: string }>();
    const [problem, setProblem] = useState<IProblem | null>(null);
    const [activeTab, setActiveTab] = useState("description");
    const [testCases, setTestCases] = useState([]);

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
            <ProblemDataPanel problem={problem} activeTab={activeTab} setActiveTab={setActiveTab} testCases={testCases} />
            <CodeEditorWindow problemId={problem.id} codeTemplates={problem.codeTemplates} setActiveTab={setActiveTab} setTestCases={setTestCases} />
        </Box>
    )
}

export default Problem;