import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBOrganizationUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationTable({ ucsbOrganization, currentUser }) { 

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsborganizations/edit/${cell.row.values.orgCode}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsborganizations/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'OrgCode',
            accessor: 'orgCode', // accessor is the "key" in the data
        },
        { 
            Header: 'Organization Acronym',
            accessor: 'orgTranslationShort',
        },
        {
            Header: 'Organization Name',
            accessor: 'orgTranslation',
        },
        {
            Header: 'Organization Status',
<<<<<<< HEAD
            accessor: d => d.inactive.toString(),
=======
            accessor: d=>d.inactive.toString(),
>>>>>>> 4c78ba4871658c9db1e5f836205e075487e4769f
        } 
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBOrganizationTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBOrganizationTable"));
    } 

    return <OurTable
        data={ucsbOrganization}
        columns={columns}
        testid={"UCSBOrganizationTable"}
    />;
};
