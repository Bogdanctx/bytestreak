import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Button, CircularProgress, TextField, MenuItem, Select, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { api } from '../../../api';
import { type IQuiz } from '../../../types/quiz.types';
import QuizManagementCard from './QuizManagementCard/QuizManagementCard';

import './QuizManagement.style.css';
import notify from '../../../components/ui/ToastNotification';
import { set } from 'react-hook-form';

export default function QuizManagement() {
    const [bulkCount, setBulkCount] = useState<number>(5);
    const [customTopic, setCustomTopic] = useState<string>('');
    const [programmingLanguage, setProgrammingLanguage] = useState<string>('Any');    
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [quizzesListModified, setQuizzesListModified] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const { data: quizQueue = [] } = useQuery<IQuiz[]>({
        queryKey: ['quizQueue'],
        queryFn: async () => {
            const response = await api.get('/quizzes/queue');
            return response.data;
        }
    });
    
    const generateQuizMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post('/quizzes/generate-quiz', { programmingLanguage, customTopic });
            return response.data as IQuiz;
        },
        onSuccess: (newQuiz) => {
            newQuiz.queuePriority = quizQueue.length + 1;
            
            queryClient.setQueryData(['quizQueue'], (oldQueue: IQuiz[] = []) => {
                const newQueue = [...oldQueue, newQuiz];
                return newQueue;
            });
            setSelectedIndex(quizQueue.length); // select the newly added quiz in the queue for preview after generation
            setQuizzesListModified(true);
            notify('Quiz generated successfully!', 'success');
        }
    });

    const generateBulkMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post(`/quizzes/generate-bulk?count=${bulkCount}`);
            return response.data as IQuiz[];
        },
        onSuccess: (newQuizzes) => {
            newQuizzes.forEach((quiz, index) => {
                quiz.queuePriority = quizQueue.length + index + 1;
            });

            queryClient.setQueryData(['quizQueue'], (oldQueue: IQuiz[] = []) => {
                const newQueue = [...oldQueue, ...newQuizzes];
                return newQueue;
            });
            setSelectedIndex(quizQueue.length + newQuizzes.length - 1);
            setQuizzesListModified(true);
            notify(`${newQuizzes.length} quizzes generated successfully!`, 'success');
        }
    });

    const saveQuizzesMutation = useMutation({
        mutationFn: async (quizzes: IQuiz[]) => {
            const response = await api.put('/quizzes/save', quizzes);
            return response.data;
        },
        onSuccess: () => {
            notify('Quizzes saved successfully!', 'success');
            setQuizzesListModified(false);
        }
    });

    const removeQuizMutation = useMutation({
        mutationFn: async (index: number) => {
            const response = await api.delete(`/quizzes/delete?id=${quizQueue[index].id}`);
            return response.data;
        },
        onSuccess: () => {
            notify('Quiz removed successfully!', 'success');
        }
    });


    const removeQuizFromQueue = (e: React.MouseEvent, indexToRemove: number) => {
        e.stopPropagation();
        const quizToRemove = quizQueue[indexToRemove];

        if (quizToRemove.id) {
            removeQuizMutation.mutate(indexToRemove);
        }

        queryClient.setQueryData(['quizQueue'], (oldQueue: IQuiz[] = []) => {
            const newQueue = [...oldQueue];
            newQueue.splice(indexToRemove, 1);
            return newQueue;
        });

        if (selectedIndex === indexToRemove) {
            setSelectedIndex(null);
        } 
        else if (selectedIndex !== null && selectedIndex > indexToRemove) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        
        const items = Array.from(quizQueue);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedQueue = items.map((quiz, index) => ({
            ...quiz,
            queuePriority: index + 1
        }));

        queryClient.setQueryData(['quizQueue'], updatedQueue);
        setQuizzesListModified(true);
        
        if (selectedIndex === result.source.index) {
            setSelectedIndex(result.destination.index);
        } 
        else if (selectedIndex !== null) {
            if (result.source.index < selectedIndex && result.destination.index >= selectedIndex) {
                setSelectedIndex(selectedIndex - 1);
            } 
            else if (result.source.index > selectedIndex && result.destination.index <= selectedIndex) {
                setSelectedIndex(selectedIndex + 1);
            }
        }
    };
 

    return (
        <Box id="quiz-management-container">
            <Box id="quiz-management-toolbar">
                <Box className="quiz-toolbar-left" gap={2}>
                    <Select size="small" value={programmingLanguage} onChange={(e) => setProgrammingLanguage(e.target.value)} sx={{ bgcolor: 'var(--bg-0)', color: 'var(--text-primary)', minWidth: 120 }}>
                        <MenuItem value="Any">Any</MenuItem>
                        <MenuItem value="Python">Python</MenuItem>
                        <MenuItem value="C++">C++</MenuItem>
                    </Select>
                    <TextField size="small" placeholder="Custom Topic (Optional)" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} sx={{ input: { color: 'var(--text-primary)' }, bgcolor: 'var(--bg-0)', width: 200 }} />
                    <Button className="quiz-btn-generate" onClick={() => generateQuizMutation.mutate()} disabled={generateQuizMutation.isPending}>
                        {generateQuizMutation.isPending ? <CircularProgress size={20} /> : "Generate 1 Quiz"}
                    </Button>
                </Box>
                <Box className="quiz-toolbar-left" gap={2}>
                    <TextField type="number" size="small" value={bulkCount} onChange={(e) => setBulkCount(Number(e.target.value))} slotProps={{ htmlInput: { min: 1, max: 50 } }} sx={{ input: { color: 'var(--text-primary)' }, bgcolor: 'var(--bg-0)', width: 80 }} />
                    <Button className="quiz-btn-create" onClick={() => generateBulkMutation.mutate()} disabled={generateBulkMutation.isPending}>
                        {generateBulkMutation.isPending ? <CircularProgress size={20} /> : "Generate Bulk"}
                    </Button>
                    <Button variant="contained" 
                            color="success" 
                            className="quiz-modal-btn-save"
                            disabled={quizQueue.length === 0 || saveQuizzesMutation.isPending || !quizzesListModified} 
                            onClick={() => saveQuizzesMutation.mutate(quizQueue)}
                        >
                        {saveQuizzesMutation.isPending ? <CircularProgress size={20} /> : "Save quizzes"}
                    </Button>
                </Box>
            </Box>

            <Box display="flex" flex={1} gap={3} overflow="hidden">
                
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
                                                <Draggable 
                                                        key={quiz.id ? quiz.id.toString() : `unsaved-${index}`} 
                                                        draggableId={quiz.id ? quiz.id.toString() : `unsaved-${index}`} 
                                                        index={index}
                                                    >
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