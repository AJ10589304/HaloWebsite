var teamViewModel = {
    entity: "teams",
    entitySingle: "team",
    wrapperContainerId: "teamPageWrapper",
    wrapperTemplateUrl: "js/views/partials/list_page_wrapper.ejs",
    listContainerId:"tableContainer",  
    listTemplateUrl: "js/views/partials/list_view.ejs",
    modalContainerId:"myModal", 
    alertContainerId: "alertContainer",
    data: mockTeamData,
    list: {
        options: {
            sortCol: "name",
            sortDir: "asc",
            limit: "",
            offset: "",
            filterCol: "",
            filterStr: ""
        },
        listTitle: "HALO TEAMS",
       
        id: "my-list",
        tableClasses: "table table-dark table-hover",
        thClasses:"bg-black bg-gradient",
        tdClasses: "bg-black bg-opacity-50",

        logoCol: "teamPhoto",
        nameCol: "name",

        columns: [
            {
                label: "Team Name",
                name: "name",
                popover: "true"
            },
            {
                label: "Coach Name",
                name: "coachName",
                popover: "true"
            },
            {
                label: "Coach Phone",
                name: "coachPhone",
                popover: "true"
            },
            {
                label: "Number of Players",
                name: "numPlayers",
                popover: "false"
            }
        ]
    }
}