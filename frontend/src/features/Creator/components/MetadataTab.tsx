import {
    Box,
    FormControl,
    MenuItem,
    Autocomplete,
    Chip,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import './MetadataTab.style.css';

interface MetadataTabProps {
    title: string;
    difficulty: string;
    tags: string[];

    setTitle: (title: string) => void;
    setDifficulty: (difficulty: string) => void;
    setTags: (tags: string[]) => void;
}

function MetadataTab({ title, difficulty, tags, setTitle, setDifficulty, setTags }: MetadataTabProps) {
    return (
        <Box className="metadata-container">
            <Box className="metadata-field-group">
                <Typography className="metadata-label">Problem Title</Typography>
                <TextField 
                    fullWidth
                    variant="outlined"
                    placeholder="e.g. Two Sum"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="metadata-input"
                />
            </Box>

            <Box className="metadata-field-group">
                <Typography className="metadata-label">Difficulty</Typography>
                <FormControl>
                    <Select
                        className='difficulty-select'
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor: "#1f1f1f",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                }
                            }
                        }}
                    >
                        <MenuItem className='difficulty-select-item' value={"EASY"} sx={{ color: '#00b8a3 !important' }}>Easy</MenuItem>
                        <MenuItem className='difficulty-select-item' value={"MEDIUM"} sx={{ color: '#ffc01e !important' }}>Medium</MenuItem>
                        <MenuItem className='difficulty-select-item' value={"HARD"} sx={{ color: '#ff375f !important' }}>Hard</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box className="metadata-field-group">
                <Typography className="metadata-label">Tags</Typography>
                <Autocomplete
                    multiple
                    freeSolo
                    options={["Dynamic Programming", "Sliding Window", "Two pointers", "Graph", "Tree", "Array", "String", "Hash Table", "Math", "Greedy", "Backtracking", "Divide and Conquer"]}
                    value={tags}
                    onChange={(event, newValue) => setTags(newValue)}
                    renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => {
                            const { key, ...tagProps } = getTagProps({ index });
                            return (
                                <Chip 
                                    key={key}
                                    label={option} 
                                    {...tagProps} 
                                    className="metadata-chip"
                                />
                            );
                        })
                    }
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            variant="outlined" 
                            placeholder="Type and press Enter" 
                            className="metadata-input"
                        />
                    )}
                />
            </Box>

        </Box>
    )
}

export default MetadataTab;