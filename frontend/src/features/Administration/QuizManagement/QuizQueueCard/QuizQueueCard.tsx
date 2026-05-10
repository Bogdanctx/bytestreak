import { Box, Typography, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';

import type { IQuiz } from '../../../../types/quiz.types';
import type { DraggableProvided } from '@hello-pangea/dnd';

import './QuizQueueCard.style.css';

interface IQuizQueueCardProps {
    quizIndex: number;
    quiz: IQuiz;
    provided: DraggableProvided;
    isSelected: boolean;
    setSelectedQuiz: (quizIndex: number) => void;
    onRemove: (e: React.MouseEvent, quizIndex: number) => void;
}

function QuizQueueCard({ quizIndex, quiz, provided, isSelected, setSelectedQuiz, onRemove }: IQuizQueueCardProps) {
    return (
        <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`quiz-queue-card ${isSelected ? 'selected' : ''}`}
            onClick={() => setSelectedQuiz(quizIndex)}
        >
            <Box className="quiz-queue-card-content">
                <Box className="quiz-queue-card-left">
                    <Box 
                        {...provided.dragHandleProps} 
                        className="quiz-drag-handle" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DragIndicatorIcon className="quiz-drag-icon" />
                    </Box>
                    <Typography className="quiz-queue-index">#{quizIndex + 1}</Typography>
                    <Typography className="quiz-queue-lang">
                        {quiz.programmingLanguage}
                    </Typography>
                </Box>
                
                <Box className="quiz-queue-card-right">
                    <IconButton size="small" onClick={(e) => onRemove(e, quizIndex)}>
                        <DeleteIcon className="quiz-delete-icon" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}

export default QuizQueueCard;