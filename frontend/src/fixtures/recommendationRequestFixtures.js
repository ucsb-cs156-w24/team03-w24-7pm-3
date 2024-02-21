const recommendationRequestFixtures = {
    oneRec:
    [
        {
            "id": 1,
            "requesterEmail": "req1@ucsb.edu",
            "professorEmail": "prof1@ucsb.edu",
            "explanation": "explanation 1",
            "dateRequested": "2022-04-20T00:00:00",
            "dateNeeded" : "2022-05-01T00:00:00",
            "done" : "false"
        }
    ],

    threeRec:
    [
        {
            "id": 2,
            "requesterEmail": "req2@ucsb.edu",
            "professorEmail": "prof2@ucsb.edu",
            "explanation": "explanation 2",
            "dateRequested" : "2022-05-20T00:00:00",
            "dateNeeded" : "2022-11-15T00:00:00",
            "done" : "false"   
        },

        {
            "id": 3,
            "requesterEmail": "req3@ucsb.edu",
            "professorEmail": "prof3@ucsb.edu",
            "explanation": "explanation 3",
            "dateRequested" : "2022-05-20T00:00:00",
            "dateNeeded" : "2022-11-15T00:00:00",
            "done" : "false"   
        },

        {
            "id": 4,
            "requesterEmail": "req4@ucsb.edu",
            "professorEmail": "prof4@ucsb.edu",
            "explanation": "explanation 4",
            "dateRequested" : "2022-05-20T00:00:00",
            "dateNeeded" : "2022-11-15T00:00:00",
            "done" : "false"      
        },
    ]
};

export {recommendationRequestFixtures};