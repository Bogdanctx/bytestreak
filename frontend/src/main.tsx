import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';

import App from './App.tsx';
import './fonts.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StyledEngineProvider injectFirst>
		<App />
	</StyledEngineProvider>
)
