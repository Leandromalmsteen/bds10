import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "../Form";
import history from 'util/history';
import { Router } from 'react-router-dom';
import { server } from "./fixtures";
import selectEvent from "react-select-event";
import { ToastContainer } from 'react-toastify';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Employee form create tests', () => {

    it('should show toast and redirect when submit form correctly', async () => {

        render(
            <Router history={history}>
                <ToastContainer />
                <Form />
            </Router>
        );
    
        const nameInput = screen.getByTestId("name");
        const emailInput = screen.getByTestId("email");
        const categoriesInput = screen.getByLabelText("Departamento");

        await selectEvent.select(categoriesInput, 'Sales');
        userEvent.type(nameInput, 'Abel');
        userEvent.type(emailInput, 'abel@gmail.com');

        const submitButton = screen.getByRole('button', { name: /salvar/i})
        userEvent.click(submitButton);

        await waitFor(() => {
            const toastElement = screen.getByText('Cadastrado com sucesso');
            expect(toastElement).toBeInTheDocument();
        });

        expect(history.location.pathname).toEqual('/admin/employees');
    });

    it('should show 3 error messages when just clicking submit', async () => {

        render(
            <Router history={history}>
                <Form />
            </Router>
        );
    
        const submitButton = screen.getByRole('button', { name: /salvar/i})
        userEvent.click(submitButton);

        await waitFor(() => {
            const messages = screen.getAllByText('Campo obrigatório');
            expect(messages).toHaveLength(3);
        });
    });

    it('should validate email syntax', async () => {

        render(
            <Router history={history}>
                <Form />
            </Router>
        );
    
        const emailInput = screen.getByTestId("email");
        userEvent.type(emailInput, 'abel@gmail.');

        const submitButton = screen.getByRole('button', { name: /salvar/i})
        userEvent.click(submitButton);

        await waitFor(() => {
            const message = screen.getByText('Email inválido');
            expect(message).toBeInTheDocument();
        });
    });

    it('should clear error messages when filling out the form', async () => {

        render(
            <Router history={history}>
                <Form />
            </Router>
        );
    
        const submitButton = screen.getByRole('button', { name: /salvar/i})
        userEvent.click(submitButton);

        await waitFor(() => {
            const messages = screen.getAllByText('Campo obrigatório');
            expect(messages).toHaveLength(3);
        });

        const nameInput = screen.getByTestId("name");
        const emailInput = screen.getByTestId("email");
        const categoriesInput = screen.getByLabelText("Departamento");

        await selectEvent.select(categoriesInput, 'Sales');
        userEvent.type(nameInput, 'Abel');
        userEvent.type(emailInput, 'abel@gmail.com');

        await waitFor(() => {
            const messages = screen.queryAllByText('Campo obrigatório');
            expect(messages).toHaveLength(0);
        });
    });

    it('should redirect when canceling', async () => {

        render(
            <Router history={history}>
                <Form />
            </Router>
        );
    
        const cancelButton = screen.getByRole('button', { name: /cancelar/i})
        userEvent.click(cancelButton);

        await waitFor(() => {
            expect(history.location.pathname).toEqual('/admin/employees');
        });
    });
});
