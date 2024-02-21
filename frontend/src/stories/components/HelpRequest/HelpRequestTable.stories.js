import React from 'react';
import HelpRequestTable from 'main/components/HelpRequest/HelpRequestTable';
import { helpRequestFixtures } from 'fixtures/helpRequestFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/HelpRequest/HelpRequestTable',
    component: HelpRequestTable
};

const Template = (args) => {
    return (
        <HelpRequestTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    helpRequest: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    helpRequest: helpRequestFixtures.threeRequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    helpRequest: helpRequestFixtures.threeRequests,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/helprequest', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};