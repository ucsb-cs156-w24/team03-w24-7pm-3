import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Organization acronym", "Organization name", "Organization status"];
    const testId = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrg} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
        expect(screen.getByText(`OrgCode`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        //const submitButton = screen.getByText(/Create/);
        const submitButton = screen.getByTestId(`${testId}-submit`);
        fireEvent.click(submitButton);



        await screen.findByText(/Organization acronym is required./);
        expect(screen.getByText(/Organization acronym is required./)).toBeInTheDocument();

        await screen.findByText(/Organization name is required./);
        expect(screen.getByText(/Organization name is required./)).toBeInTheDocument();

        await screen.findByText(/Organization status is required./);
        expect(screen.getByText(/Organization status is required./)).toBeInTheDocument();


        //const acronymInput = screen.getByTestId(`${testId}-orgTranslationShort`);
        //fireEvent.click(submitButton);

        const orgNameInput = screen.getByTestId(`${testId}-orgTranslation`);
        fireEvent.change(orgNameInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);
        await screen.findByText(/Max length 30 characters/);
        //expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();

        const orgStatusInput = screen.getByTestId(`${testId}-inactive`);
        fireEvent.change(orgStatusInput, { target: { value: "a".repeat(31) } });
        fireEvent.change(orgNameInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);
        await screen.findByText(/Max length 30 characters/);
        //expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();

        const errorMessages = screen.getAllByText(/Max length 30 characters/);
        expect(errorMessages.length).toBe(2); expect(errorMessages.length).toBe(2); 

        
    });

    test('Form validation enforces maximum length for organization acronym', async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        //const submitButton = screen.getByText(/Create/);
        const submitButton = screen.getByTestId(`${testId}-submit`);
        fireEvent.click(submitButton);

        // Simulate input that exceeds the maximum length
        const acronymInput = screen.getByTestId(`${testId}-orgTranslationShort`);
        fireEvent.change(acronymInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);
    
        // Ensure error message is displayed
        await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
        });
    
        // Simulate valid input within maximum length
        fireEvent.change(screen.getByTestId(`${testId}-orgTranslationShort`), { target: { value: 'ShortAcronym' } });
    
        // Ensure error message is not displayed
        await waitFor(() => {
            expect(screen.queryByText(/Max length 30 characters/)).toBeNull();
        });
    });
    

});