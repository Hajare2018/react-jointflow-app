import HttpClient from './HttpClient';

export default async function updateJiraTicket({ boardId, taskId, title, description }) {
  const { data } = await HttpClient.getJiraIntegrationStatus(boardId);

  if (data.board.jiraSyncEnabled && data.board.cards[taskId]?.jiraSyncEnabled) {
    const updateJiraTicketResponse = await fetch(
      `https://2huvkghp234lxpdvm5axgeicdy0yyjfg.lambda-url.eu-west-1.on.aws/rest/api/3/issue/${data.board.cards[taskId].jiraIssueKey}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            summary: title,
            description: {
              content: [
                {
                  content: [
                    {
                      text: description,
                      type: 'text',
                    },
                  ],
                  type: 'paragraph',
                },
              ],
              type: 'doc',
              version: 1,
            },
          },
        }),
      },
    );

    const updateJiraTicketData = await updateJiraTicketResponse.json();

    return updateJiraTicketData;
  }
}
