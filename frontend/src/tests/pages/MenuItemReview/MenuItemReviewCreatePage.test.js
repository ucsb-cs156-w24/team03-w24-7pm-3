import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

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


describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {

        const queryClient = new QueryClient();
        const review = {
            id: 3,
            itemId: 3,
            reviewerEmail: "testemail@ucsb.edu",
            stars: 3,
            dateReviewed: "2022-07-04T12:00",
            comments: "Barely Passable"
        };

        axiosMock.onPost("/api/menuitemreview/post").reply(202, review);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Menu Item ID")).toBeInTheDocument();
        });

        const itemIdInput = screen.getByLabelText("Menu Item ID");
        expect(itemIdInput).toBeInTheDocument();

        const reviewerEmailInput = screen.getByLabelText("Email");
        expect(reviewerEmailInput).toBeInTheDocument();

        const starsInput = screen.getByLabelText("Stars");
        expect(starsInput).toBeInTheDocument();

        const dateReviewedInput = screen.getByLabelText("Date (iso format)");
        expect(dateReviewedInput).toBeInTheDocument();

        const commentsInput = screen.getByLabelText("Comments");
        expect(commentsInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(itemIdInput, { target: { value: 3 } })
        fireEvent.change(reviewerEmailInput, { target: { value: 'testemail@ucsb.edu' } })
        fireEvent.change(starsInput, { target: { value: 3 } })
        fireEvent.change(dateReviewedInput, { target: { value: '2022-07-04T12:00' } })
        fireEvent.change(commentsInput, { target: { value: 'Barely Passable' } })

        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            itemId: "3",
            reviewerEmail: "testemail@ucsb.edu",
            stars: "3",
            dateReviewed: "2022-07-04T12:00",
            comments: "Barely Passable"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New review Created - id: 3 itemId: 3");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

    });

});


