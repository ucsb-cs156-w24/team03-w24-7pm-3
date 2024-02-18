import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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

describe("HelpRequestCreatePage tests", () => {

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
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /helprequest", async () => {

        const queryClient = new QueryClient();
        const restaurant = {
            id: "1",
            requesterEmail: "xdpete@ucsb.edu",
            teamId: "123",
            tableOrBreakoutRoom: "34",
            explanation: "stuck on code gg",
            requestTime: "2015-05-03T10:15:30",
            solved: "false"
        }

        axiosMock.onPost("/api/helprequest/post").reply(202, restaurant);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("RequesterEmail")).toBeInTheDocument();
        });

        const email = screen.getByLabelText("RequesterEmail");
        expect(email).toBeInTheDocument();

        const des = screen.getByLabelText("teamId");
        expect(des).toBeInTheDocument();

        const time = screen.getByLabelText("requestTime");
        expect(time).toBeInTheDocument();

        const tOb = screen.getByLabelText("tableOrBreakoutRoom");
        expect(tOb).toBeInTheDocument();

        const solved = screen.getByLabelText("Solved");
        expect(solved).toBeInTheDocument();

        const explanation = screen.getByLabelText("explanation");
        expect(explanation).toBeInTheDocument();
        const createButton = screen.getByText("Create");

        expect(createButton).toBeInTheDocument();

        fireEvent.change(email, { target: { value: 'xdddd@ucsb.edu' } })
        fireEvent.change(des, { target: { value: 'teamId' } })
        fireEvent.change(time, { target: { value: '2015-05-03T10:15:30' } })
        fireEvent.change(tOb, { target: { value: 'teamId' } })
        fireEvent.change(solved, { target: { value: 'true' } })
        fireEvent.change(explanation, { target: { value: 'teamId' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            explanation : "teamId",
            requestTime: "2015-05-03T10:15:30.000",
            requesterEmail: "xdddd@ucsb.edu",
            solved: false,
            tableOrBreakoutRoom : "teamId",
            teamId : "teamId"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New helpRequest Created - id: 1 requesterEmail: xdpete@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

    });
});


