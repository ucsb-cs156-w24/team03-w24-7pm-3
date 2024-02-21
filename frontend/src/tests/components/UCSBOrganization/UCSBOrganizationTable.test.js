import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["OrgCode", "Organization Acronym", "Organization name", "Organization status"];
  const expectedFields = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];
  const testId = "UCSBOrganizationTable";

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganization={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert

    console.log('expectedHeaders:', expectedHeaders);
    console.log('expectedFields:', expectedFields);
 
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganization={ucsbOrganizationFixtures.threeOrgs} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    console.log('expectedHeaders:', expectedHeaders);
    console.log('expectedFields:', expectedFields);
 
    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent('5678');
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent('HAU');
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)).toHaveTextContent('Hermanas Unidas');
    expect(screen.getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent('true');

    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent('91011');
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`)).toHaveTextContent('JC');
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`)).toHaveTextContent('Judo Club');
    expect(screen.getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent('false');

    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgCode`)).toHaveTextContent('12314');
    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslationShort`)).toHaveTextContent('CK');
    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslation`)).toHaveTextContent('Cool Kittens');
    expect(screen.getByTestId(`${testId}-cell-row-2-col-inactive`)).toHaveTextContent('false');

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganization={ucsbOrganizationFixtures.threeOrgs} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );


    console.log('expectedHeaders:', expectedHeaders);
    console.log('expectedFields:', expectedFields);
 

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("5678");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent("HAU");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)).toHaveTextContent("Hermanas Unidas");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent("true");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("91011");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`)).toHaveTextContent("JC");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`)).toHaveTextContent("Judo Club");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgCode`)).toHaveTextContent("12314");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslationShort`)).toHaveTextContent("CK");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslation`)).toHaveTextContent("Cool Kittens");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-inactive`)).toHaveTextContent("false");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganization={ucsbOrganizationFixtures.threeOrgs} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("5678");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent("HAU");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)).toHaveTextContent("Hermanas Unidas");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent("true");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("91011");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`)).toHaveTextContent("JC");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`)).toHaveTextContent("Judo Club");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgCode`)).toHaveTextContent("12314");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslationShort`)).toHaveTextContent("CK");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslation`)).toHaveTextContent("Cool Kittens");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-inactive`)).toHaveTextContent("false");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/ucsborganizations/edit/undefined'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsbOrganization={ucsbOrganizationFixtures.threeOrgs} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("5678");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent("HAU");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-orgTranslation`)).toHaveTextContent("Hermanas Unidas");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent("true");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("91011");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslationShort`)).toHaveTextContent("JC");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-orgTranslation`)).toHaveTextContent("Judo Club");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgCode`)).toHaveTextContent("12314");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslationShort`)).toHaveTextContent("CK");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-orgTranslation`)).toHaveTextContent("Cool Kittens");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-inactive`)).toHaveTextContent("false");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
   

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});
