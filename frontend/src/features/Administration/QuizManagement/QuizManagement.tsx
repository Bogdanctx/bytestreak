import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Button, CircularProgress, TextField, MenuItem, Select } from '@mui/material';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { api } from '../../../api';
import { type IQuiz } from '../../../types/quiz.types';

import './QuizManagement.style.css';
import notify from '../../../components/ui/ToastNotification';
import QuizManagementCard from './QuizManagementCard/QuizManagementCard';
import QuizQueueCard from './QuizQueueCard/QuizQueueCard';

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
            queryClient.setQueryData(['quizQueue'], (oldQueue: IQuiz[] = []) => [...oldQueue, newQuiz]);
            setSelectedIndex(quizQueue.length); 
            setQuizzesListModified(true);
            notify('Quiz generated successfully!', 'success');
        }
    });

    const generateBulkMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post(`/quizzes/generate-bulk?numberOfQuizzes=${bulkCount}`);
            return response.data as IQuiz[];
        },
        onSuccess: (newQuizzes) => {
            newQuizzes.forEach((quiz, index) => {
                quiz.queuePriority = quizQueue.length + index + 1;
            });
            queryClient.setQueryData(['quizQueue'], (oldQueue: IQuiz[] = []) => [...oldQueue, ...newQuizzes]);
            setSelectedIndex(quizQueue.length + newQuizzes.length - 1);
            setQuizzesListModified(true);

            if (newQuizzes.length > 0) {
                notify(`${newQuizzes.length} quizzes generated successfully!`, 'success');
            }
            else {
                notify('No quizzes were generated. Please try again.', 'info');
            }
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
        if (!result.destination) return;
        
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
            } else if (result.source.index > selectedIndex && result.destination.index <= selectedIndex) {
                setSelectedIndex(selectedIndex + 1);
            }
        }
    };

    return (
        <Box id="quiz-management-container">
            <Box id="quiz-management-header">
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Select id="quiz-select-programming-language" 
                            size="small" 
                            value={programmingLanguage} 
                            onChange={(e) => setProgrammingLanguage(e.target.value)}
                            sx={{
                                '& .MuiSelect-icon': { color: 'white' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--bg-4)' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--bg-3)' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--bg-3)' }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: 'var(--bg-4)',
                                        color: 'white',
                                        '& .MuiMenuItem-root:hover': { backgroundColor: 'var(--bg-3)' },
                                        '& .MuiMenuItem-root.Mui-selected': { backgroundColor: 'var(--bg-3)' }
                                    }
                                }
                            }}
                        >
                        <MenuItem value="Any">Any</MenuItem>
                        <MenuItem value="Python">Python</MenuItem>
                        <MenuItem value="C++">C++</MenuItem>
                    </Select>
                    <TextField 
                        id="quiz-custom-topic" 
                        size="small" 
                        placeholder="Custom Topic (Optional)" 
                        value={customTopic} 
                        onChange={(e) => setCustomTopic(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'var(--bg-4)' },
                                '&:hover fieldset': { borderColor: 'var(--bg-3)' },
                                '&.Mui-focused fieldset': { borderColor: 'var(--bg-3)' },
                            }
                        }}
                    />
                    <Button className={"quiz-generate-button"} 
                            onClick={() => generateQuizMutation.mutate()} 
                            disabled={generateQuizMutation.isPending}
                    >
                        {generateQuizMutation.isPending ? <CircularProgress size={20} /> : "Generate 1 Quiz"}
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField id="quiz-bulk-count" 
                                type="number" 
                                size="small" 
                                value={bulkCount} 
                                onChange={(e) => setBulkCount(Number(e.target.value))} 
                                slotProps={{ htmlInput: { min: 1, max: 50 } }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'var(--bg-4)' },
                                        '&:hover fieldset': { borderColor: 'var(--bg-3)' },
                                        '&.Mui-focused fieldset': { borderColor: 'var(--bg-3)' },
                                    }
                                }}
                    />
                    <Button className={"quiz-generate-button"} onClick={() => generateBulkMutation.mutate()} disabled={generateBulkMutation.isPending}>
                        {generateBulkMutation.isPending ? <CircularProgress size={20} /> : "Generate Bulk"}
                    </Button>
                    <Button variant="contained" 
                            color="success" 
                            id="quiz-save-quizzes-button"
                            disabled={quizQueue.length === 0 || saveQuizzesMutation.isPending || !quizzesListModified} 
                            onClick={() => saveQuizzesMutation.mutate(quizQueue)}
                        >
                        {saveQuizzesMutation.isPending ? <CircularProgress size={20} /> : "Save quizzes"}
                    </Button>
                </Box>
            </Box>

            <Box id="quiz-management-content">

                <Box id="quiz-queue-wrapper">
                    <Typography id="quiz-list-title" variant="h6">
                        Queue ({quizQueue.length})
                    </Typography>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="quiz-queue">
                            {(provided) => (
                                <Box id="quiz-scrollable-list" {...provided.droppableProps} ref={provided.innerRef}>
                                    {quizQueue.length === 0 ? (
                                        <Typography className="quiz-empty-state">No quizzes generated yet.</Typography>
                                    ) : (
                                        quizQueue.map((quiz, index) => (
                                            <Draggable 
                                                    key={quiz.id ? quiz.id.toString() : `unsaved-${index}`} 
                                                    draggableId={quiz.id ? quiz.id.toString() : `unsaved-${index}`} 
                                                    index={index}
                                                >
                                                {(provided) => 
                                                    <QuizQueueCard 
                                                        key={quiz.id ? quiz.id.toString() : `unsaved-${index}`} 
                                                        quiz={quiz} 
                                                        quizIndex={index} 
                                                        provided={provided} 
                                                        isSelected={selectedIndex === index} 
                                                        setSelectedQuiz={setSelectedIndex}
                                                        onRemove={removeQuizFromQueue}
                                                    />
                                                }
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Box>

                <Box id="quiz-preview-container">
                    {selectedIndex !== null && quizQueue[selectedIndex] ? (
                        <QuizManagementCard quiz={quizQueue[selectedIndex]} />
                    ) : (
                        <Typography className="quiz-empty-state">Select a quiz from the queue to preview details.</Typography>
                    )}
                </Box>

            </Box>
        </Box>
    );
}