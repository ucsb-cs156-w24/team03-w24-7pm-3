import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemTable from 'main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable';
import { useCurrentUser, hasRole } from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function UCSBDiningCommonsMenuItemIndexPage() {

	const currentUser = useCurrentUser();

	const { data: ucsbDiningCommonsMenuItems, error: _error, status: _status } =
		useBackend(
			// Stryker disable next-line all : don't test internal caching of React Query
			["/api/ucsbdiningcommonsmenuitem/all"],
			{ method: "GET", url: "/api/ucsbdiningcommonsmenuitem/all" },
			// Stryker disable next-line all : don't test default value of empty list
			[]
		);

	const createButton = () => {
		if (hasRole(currentUser, "ROLE_ADMIN")) {
			return (
				<Button
					variant="primary"
					href="/diningcommonsmenuitem/create"
					style={{ float: "right" }}
				>
					Create Dining Commons Menu Item
				</Button>
			)
		}
	}
	// Stryker disable all : placeholder for future implementation
	return (
		<BasicLayout>
			<div className="pt-2">
                {createButton()}
                <h1>Dining Commons Menu Items</h1>
                <UCSBDiningCommonsMenuItemTable ucsbDiningCommonsMenuItems={ucsbDiningCommonsMenuItems} currentUser={currentUser} />
            </div>
		</BasicLayout>
	)
}
