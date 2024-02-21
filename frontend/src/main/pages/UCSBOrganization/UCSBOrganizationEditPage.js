import React from 'react'
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";

import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: ucsborganizations, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/ucsborganizations?orgCode=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/ucsborganizations`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (ucsborganizations) => ({
        url: "/api/ucsborganizations",
        method: "PUT",
        params: {
            id: ucsborganizations.id,
        },
        data: {
            name: ucsborganizations.orgTranslation,
            orgcode: ucsborganizations.orgCode,
            acronym: ucsborganizations.orgTranslationShort,
            inactive: ucsborganizations.inactive
        }
    });

    const onSuccess = (ucsborganizations) => {
        toast(`Organization Updated - id: ${ucsborganizations.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/ucsborganizations?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/ucsborganizations" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Organization</h1>
                {
                    ucsborganizations && <UCSBOrganizationForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={ucsborganizations} />
                }
            </div>
        </BasicLayout>
    )
}
