import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit HelpRequest");
            expect(screen.queryByTestId("HelpRequest-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 1 } }).reply(200, {
                id : 1,
                explanation : "teamId",
                requestTime: "2015-05-03T10:15:30.000",
                requesterEmail: "xdpete@ucsb.edu",
                solved: "false",
                tableOrBreakoutRoom : "teamId",
                teamId : "teamId"
            });
            axiosMock.onPut('/api/helprequest').reply(200, {
                id: "1",
                explanation : "teamId1",
                requestTime: "2015-06-03T10:15:30.000",
                requesterEmail: "xdddd@ucsb.edu",
                solved: "true",
                tableOrBreakoutRoom : "teamId1",
                teamId : "teamId1"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");

            const email = screen.getByLabelText("RequesterEmail");
            expect(email).toBeInTheDocument();
            expect(email).toHaveValue("xdpete@ucsb.edu")
            const des = screen.getByLabelText("teamId");
            expect(des).toBeInTheDocument();
            expect(des).toHaveValue("teamId")
            
            const time = screen.getByLabelText("requestTime");
            expect(time).toBeInTheDocument();
            expect(time).toHaveValue("2015-05-03T10:15:30.000")

            const tOb = screen.getByLabelText("tableOrBreakoutRoom");
            expect(tOb).toBeInTheDocument();
            expect(tOb).toHaveValue("teamId")

            const solved = screen.getByLabelText("Solved");
            expect(solved).toBeInTheDocument();
            // expect(solved).toHaveValue("false")
            const explanation = screen.getByLabelText("explanation");
            expect(explanation).toBeInTheDocument();
            expect(explanation).toHaveValue("teamId")
            const submitButton = screen.getByTestId("HelpRequestForm-submit");
            expect(submitButton).toHaveTextContent("Update");


            fireEvent.change(email, { target: { value: 'lolol@ucsb.edu' } });
            fireEvent.change(solved, { target: { value: 'true' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 1 requesterEmail: xdddd@ucsb.edu");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "lolol@ucsb.edu",
                teamId : "teamId",
                tableOrBreakoutRoom : "teamId",
                requestTime: "2015-05-03T10:15:30.000",
                explanation : "teamId",
                solved: "false",
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");

            const email = screen.getByLabelText("RequesterEmail");
            expect(email).toBeInTheDocument();
            expect(email).toHaveValue("xdpete@ucsb.edu")
            const des = screen.getByLabelText("teamId");
            expect(des).toBeInTheDocument();
            expect(des).toHaveValue("teamId")
            
            const time = screen.getByLabelText("requestTime");
            expect(time).toBeInTheDocument();
            expect(time).toHaveValue("2015-05-03T10:15:30.000")

            const tOb = screen.getByLabelText("tableOrBreakoutRoom");
            expect(tOb).toBeInTheDocument();
            expect(tOb).toHaveValue("teamId")

            const solved = screen.getByLabelText("Solved");
            expect(solved).toBeInTheDocument();
            // expect(solved).toHaveValue("false")
            const explanation = screen.getByLabelText("explanation");
            expect(explanation).toBeInTheDocument();
            expect(explanation).toHaveValue("teamId")
            const submitButton = screen.getByTestId("HelpRequestForm-submit");
            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(email, { target: { value: 'lolol@ucsb.edu' } });
            fireEvent.change(solved, { target: { value: 'true' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 1 requesterEmail: xdddd@ucsb.edu");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
        });

       
    });
});
