import HttpClient from "./HttpClient";

export default async function createJiraProject(params, data) {
  const {
    data: { new_board_id },
  } = data;
  const {
    data: { board },
  } = await HttpClient.getJiraIntegrationStatus(params.data.template_id);

  if (board.jiraSyncEnabled) {
    // Get template by id
    const [{ data: templateData }, { data: newBoardData }] = await Promise.all([
      HttpClient.getSingleProject({
        id: params.data.template_id,
      }),
      HttpClient.getSingleProject({
        id: new_board_id,
      }),
    ]);

    // Create Jira project
    const createJiraProjectResponse = await fetch(
      "https://2huvkghp234lxpdvm5axgeicdy0yyjfg.lambda-url.eu-west-1.on.aws/rest/api/3/project",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: `${params.data.project_name.split(" ").join("").substring(0, 4).toUpperCase()}${new_board_id}`,
          name: params.data.project_name,
          projectTypeKey: "business",
          assigneeType: "PROJECT_LEAD",
          leadAccountId: "712020:5eabd565-72d9-409a-b56f-5f87c2898b37",
        }),
      }
    );

    const createJiraProjectData = await createJiraProjectResponse.json();
    await HttpClient.updateJiraIntegrationStatus({
      boardId: new_board_id,
      jiraSyncEnabled: true,
      jiraProjectKey: createJiraProjectData.key,
    });

    // Save Jira id to project
    for await (const card of templateData[0].cards) {
      if (board.cards[card.id]?.jiraSyncEnabled) {
        const jiraResponse = await fetch(
          "https://2huvkghp234lxpdvm5axgeicdy0yyjfg.lambda-url.eu-west-1.on.aws/rest/api/3/issue",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: {
                project: {
                  key: createJiraProjectData.key,
                },
                summary: card.title,
                description: {
                  content: [
                    {
                      content: [
                        {
                          text: card.description,
                          type: "text",
                        },
                      ],
                      type: "paragraph",
                    },
                  ],
                  type: "doc",
                  version: 1,
                },
                issuetype: {
                  name: "Task",
                },
              },
            }),
          }
        );

        const jiraData = await jiraResponse.json();
        await HttpClient.updateTaskJiraIntegrationStatus({
          boardId: new_board_id,
          taskId: newBoardData[0].cards.find((c) => c.title === card.title).id,
          jiraIssueKey: jiraData.key,
          jiraSyncEnabled: true,
        });
      }
    }
  }

  return data;
}
