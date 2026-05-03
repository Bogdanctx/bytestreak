import { useState } from 'react';
import { Box, Typography, Button, CircularProgress, TextField, MenuItem, Select, IconButton } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import { type IQuiz } from '../../../types/quiz.types';
import QuizManagementCard from './QuizManagementCard/QuizManagementCard';

import './QuizManagement.style.css';

// Extindem interfața local pentru a include un ID unic pentru drag-and-drop
interface IQuizClient extends IQuiz {
    clientId: string;
}

export default function QuizManagement() {
    const [quizQueue, setQuizQueue] = useState<IQuizClient[]>([]);
    const [bulkCount, setBulkCount] = useState<number>(5);
    const [customTopic, setCustomTopic] = useState<string>('');
    const [programmingLanguage, setProgrammingLanguage] = useState<string>('Any');
    
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const generateMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/quizzes/generate-quiz?programmingLanguage=${programmingLanguage}&customTopic=${customTopic || ''}`);
            return res.data;
        },
        onSuccess: (newQuiz) => {
            const quizWithId = { ...newQuiz, clientId: crypto.randomUUID() };
            setQuizQueue(prev => {
                const updated = [...prev, quizWithId];
                if (selectedIndex === null) setSelectedIndex(updated.length - 1);
                return updated;
            });
            notify("Quiz generated successfully", "success");
        },
        onError: (err: any) => notify(`Failed to generate: ${err.message}`, "error")
    });

    const generateBulkMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post(`/quizzes/generate-bulk?count=${bulkCount}`);
            return res.data; 
        },
        onSuccess: (newQuizzes: IQuiz[]) => {
            const quizzesWithIds = newQuizzes.map(q => ({ ...q, clientId: crypto.randomUUID() }));
            setQuizQueue(prev => {
                const isFirstBatch = prev.length === 0;
                const updated = [...prev, ...quizzesWithIds];
                if (isFirstBatch) setSelectedIndex(0);
                return updated;
            });
            notify(`${newQuizzes.length} quizzes generated`, "success");
        },
        onError: (err: any) => notify(`Failed to generate bulk: ${err.message}`, "error")
    });

    const saveMutation = useMutation({
        mutationFn: async (quizzes: IQuizClient[]) => {
            const payload = quizzes.map((q, index) => ({ ...q, queueIndex: index }));
            await api.put('/quizzes/update-order', payload);
        },
        onSuccess: () => {
            notify("Quizzes saved successfully", "success");
            setQuizQueue([]);
            setSelectedIndex(null);
        },
        onError: () => notify("Failed to save quizzes", "error")
    });

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        
        const items = Array.from(quizQueue);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        setQuizQueue(items);
        
        // Menține selecția vizuală pe același quiz după reordonare
        if (selectedIndex === result.source.index) {
            setSelectedIndex(result.destination.index);
        } else if (selectedIndex !== null) {
            if (result.source.index < selectedIndex && result.destination.index >= selectedIndex) {
                setSelectedIndex(selectedIndex - 1);
            } else if (result.source.index > selectedIndex && result.destination.index <= selectedIndex) {
                setSelectedIndex(selectedIndex + 1);
            }
        }
    };

    const removeQuizFromQueue = (e: React.MouseEvent, indexToRemove: number) => {
        e.stopPropagation(); // Previne selectarea elementului la ștergere
        setQuizQueue(prev => prev.filter((_, index) => index !== indexToRemove));
        
        if (selectedIndex === indexToRemove) {
            setSelectedIndex(null);
        } else if (selectedIndex !== null && selectedIndex > indexToRemove) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    return (
        <Box id="quiz-management-container">
            {/* Toolbar (Rămâne neschimbat) */}
            <Box id="quiz-management-toolbar">
                <Box className="quiz-toolbar-left" gap={2}>
                    <Select size="small" value={programmingLanguage} onChange={(e) => setProgrammingLanguage(e.target.value)} sx={{ bgcolor: 'var(--bg-0)', color: 'var(--text-primary)', minWidth: 120 }}>
                        <MenuItem value="Any">Any</MenuItem>
                        <MenuItem value="Python">Python</MenuItem>
                        <MenuItem value="C++">C++</MenuItem>
                    </Select>
                    <TextField size="small" placeholder="Custom Topic (Optional)" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} sx={{ input: { color: 'var(--text-primary)' }, bgcolor: 'var(--bg-0)', width: 200 }} />
                    <Button className="quiz-btn-generate" onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
                        {generateMutation.isPending ? <CircularProgress size={20} /> : "Generate 1 Quiz"}
                    </Button>
                </Box>
                <Box className="quiz-toolbar-left" gap={2}>
                    <TextField type="number" size="small" value={bulkCount} onChange={(e) => setBulkCount(Number(e.target.value))} slotProps={{ htmlInput: { min: 1, max: 50 } }} sx={{ input: { color: 'var(--text-primary)' }, bgcolor: 'var(--bg-0)', width: 80 }} />
                    <Button className="quiz-btn-create" onClick={() => generateBulkMutation.mutate()} disabled={generateBulkMutation.isPending}>
                        {generateBulkMutation.isPending ? <CircularProgress size={20} /> : "Generate Bulk"}
                    </Button>
                    <Button variant="contained" color="success" disabled={quizQueue.length === 0 || saveMutation.isPending} onClick={() => saveMutation.mutate(quizQueue)} sx={{ fontWeight: 'bold' }}>
                        {saveMutation.isPending ? <CircularProgress size={20} /> : "Save quizzes"}
                    </Button>
                </Box>
            </Box>

            {/* Split Layout Container */}
            <Box display="flex" flex={1} gap={3} overflow="hidden">
                
                {/* Partea stângă: Queue List */}
                <Box display="flex" flexDirection="column" width="350px" bgcolor="var(--bg-1)" borderRadius="12px" border="1px solid var(--bg-3)" overflow="hidden">
                    <Box p={2} bgcolor="var(--bg-2)" borderBottom="1px solid var(--bg-3)">
                        <Typography variant="h6" color="var(--text-primary)" fontFamily='"Momo Trust Display", sans-serif'>
                            Queue ({quizQueue.length})
                        </Typography>
                    </Box>
                    
                    <Box flex={1} overflow="hidden" display="flex" flexDirection="column" p={2}>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="quiz-queue">
                                {(provided) => (
                                    <Box id="quiz-list-container" {...provided.droppableProps} ref={provided.innerRef}>
                                        {quizQueue.length === 0 ? (
                                            <Typography className="quiz-empty-state">No quizzes generated yet.</Typography>
                                        ) : (
                                            quizQueue.map((quiz, index) => (
                                                <Draggable key={quiz.clientId} draggableId={quiz.clientId} index={index}>
                                                    {(provided) => (
                                                        <Box
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className="quiz-card"
                                                            mb={1.5}
                                                            onClick={() => setSelectedIndex(index)}
                                                            sx={{ 
                                                                cursor: 'pointer',
                                                                borderColor: selectedIndex === index ? 'var(--accent-main)' : 'var(--bg-3)',
                                                                boxShadow: selectedIndex === index ? '0 0 0 1px var(--accent-main)' : 'none'
                                                            }}
                                                        >
                                                            <Box className="quiz-card-header" sx={{ p: 1.5 }}>
                                                                <Box className="quiz-card-header-left">
                                                                    <Box {...provided.dragHandleProps} display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}>
                                                                        <DragIndicatorIcon sx={{ color: 'var(--text-secondary)', cursor: 'grab', mr: 0.5 }} />
                                                                    </Box>
                                                                    <Typography className="quiz-card-index">#{index + 1}</Typography>
                                                                    <Typography className="quiz-card-preview" sx={{ maxWidth: '120px' }}>
                                                                        {quiz.programmingLanguage}
                                                                    </Typography>
                                                                </Box>
                                                                <Box className="quiz-card-header-right">
                                                                    <IconButton size="small" onClick={(e) => removeQuizFromQueue(e, index)}>
                                                                        <DeleteIcon sx={{ color: 'var(--difficulty-hard)' }} />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Box>
                </Box>

                {/* Partea dreaptă: Detail View */}
                <Box flex={1} overflow="hidden">
                    {selectedIndex !== null && quizQueue[selectedIndex] ? (
                        <QuizManagementCard quiz={quizQueue[selectedIndex]} />
                    ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" height="100%" bgcolor="var(--bg-1)" borderRadius="12px" border="1px dashed var(--bg-3)">
                            <Typography color="var(--text-secondary)">Select a quiz from the queue to preview.</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}