import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /diningcommonsmenuitem", async () => {

        const queryClient = new QueryClient();
        const diningCommonsMenuItem = {
            id: 3,
            diningCommonsCode: "PORT",
            name: "Burger",
            station: "Burger Station"
        };

        axiosMock.onPost("/api/ucsbdiningcommonsmenuitem/post").reply(202, diningCommonsMenuItem);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Dining Commons Code")).toBeInTheDocument();
        });

        const diningCommonsCode = screen.getByLabelText("Dining Commons Code");
        expect(diningCommonsCode).toBeInTheDocument();

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const stationInput = screen.getByLabelText("Station");
        expect(stationInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(diningCommonsCode, { target: { value: 'DLG' } })
        fireEvent.change(nameInput, { target: { value: 'Taco' } })
        fireEvent.change(stationInput, { target: { value: 'Taco Station' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            diningCommonsCode: "DLG",
            name: "Taco",
            station: "Taco Station"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New Dining Commons Menu Item Created - id: 3 name: Burger");
        expect(mockNavigate).toBeCalledWith({ "to": "/diningcommonsmenuitem" });

    });

});


