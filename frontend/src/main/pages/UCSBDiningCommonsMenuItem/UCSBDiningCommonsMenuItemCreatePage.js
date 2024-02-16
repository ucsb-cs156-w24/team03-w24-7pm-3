import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({storybook=false}) {

    const objectToAxiosParams = (diningCommonsMenuItem) => ({
        url: "/api/ucsbdiningcommonsmenuitem/post",
        method: "POST",
        params: {
            diningCommonsCode: diningCommonsMenuItem.diningCommonsCode,
            name: diningCommonsMenuItem.name,
            station: diningCommonsMenuItem.station
        }
    });

    const onSuccess = (diningCommonsMenuItem) => {
        toast(`New Dining Commons Menu Item Created - id: ${diningCommonsMenuItem.id} name: ${diningCommonsMenuItem.name}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/ucsbdiningcommonsmenuitem/all"] // mutation makes this key stale so that pages relying on it reload
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/diningcommonsmenuitem" />
    }

    // Stryker disable all : placeholder for future implementation
    return (
        <BasicLayout>
            <div className="pt-2">
            <h1>Create New Dining Commons Menu Item</h1>
                <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
            </div>
        </BasicLayout >
    )
}
