import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByText(/teamId/);
        await screen.findByText(/RequesterEmail/);
        await screen.findByText(/tableOrBreakoutRoom/);
        await screen.findByText(/requestTime/);
        await screen.findByText(/Solved/); 
        await screen.findByText(/explanation/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a HelpRequest", async () => {

        render(
            <Router  >
                <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
            </Router>
        );
        await screen.findByTestId(/HelpRequestForm-id/);
        expect(screen.getByText(/id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-RequesterEmail");
        const requesterEmail = screen.getByTestId("HelpRequestForm-RequesterEmail");
        const requestTime = screen.getByTestId("HelpRequestForm-requestTime");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmail, { target: { value: 'bad-input' } });
        fireEvent.change(requestTime, { target: { value: 'what teh' } });
        fireEvent.click(submitButton);

        await screen.findByText(/requesterEmail must be a valid email/);
    });

    // test("Correct Error messsages on bad input pt 2 LOOOL", async () => {
    //     const mockSubmitAction = jest.fn();
    //     render(
    //         <Router  >
    //             <HelpRequestForm submitAction={mockSubmitAction}/>
    //         </Router>
    //     );
    //     await screen.findByTestId("HelpRequestForm-requestTime");
    //     const requestTime = screen.getByTestId("HelpRequestForm-requestTime");
    //     const submitButton = screen.getByTestId("HelpRequestForm-submit");

    //     fireEvent.change(requestTime, { target: { value: 'hahahahaha' } });
    //     fireEvent.click(submitButton);

    //     await screen.findByText(/requestTime must be in ISO format/);
    // });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-submit");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/RequesterEmail is required./);
        expect(screen.getByText(/teamId is required./)).toBeInTheDocument();
        expect(screen.getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
        expect(screen.getByText(/requestTime is required./)).toBeInTheDocument();
        expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-RequesterEmail");

        const requesterEmail = screen.getByTestId("HelpRequestForm-RequesterEmail");
        const teamId = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoom = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTime = screen.getByTestId("HelpRequestForm-requestTime");
        const explanation = screen.getByTestId("HelpRequestForm-explanation");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmail, { target: { value: 'xdpete@ucsb.edu' } });
        fireEvent.change(teamId, { target: { value: 'noon on January 2nd' } });
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'noon on January 2nd' } });
        fireEvent.change(requestTime, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(explanation, { target: { value: 'noon on January 2nd' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/requesterEmail must be a valid email/)).not.toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-cancel");
        const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


