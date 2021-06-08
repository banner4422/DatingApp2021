import React from 'react'
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react'
import App from './App'

afterEach(cleanup)

test('Renders correctly', async () => {
    const { debug } = render(
        <App/>
    );
    debug();
});