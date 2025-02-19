import { queryOptions } from '@tanstack/react-query';
import HttpClient from '../../Api/HttpClient';

function handle401(apiCall) {
  return async () => {
    try {
      const response = await apiCall();

      return response;
    } catch (e) {
      if (e.status === 401) {
        return null;
      } else {
        throw e;
      }
    }
  };
}

export const singleCardQuery = (cardId) =>
  queryOptions({
    queryKey: ['card', cardId],
    queryFn: handle401(async () => {
      const { data } = await HttpClient.fetchSingleCard({
        card_id: cardId,
        maap_task: true,
      });

      return data[0];
    }),
  });

export const projectQuery = (projectId) =>
  queryOptions({
    queryKey: ['project', projectId],
    queryFn: handle401(async () => {
      const { data } = await HttpClient.projectLiteView({ board: projectId });

      return data[0];
    }),
  });

export const contentsQuery = (projectId) =>
  queryOptions({
    queryKey: ['contents', projectId],
    queryFn: handle401(async () => {
      const { data } = await HttpClient.getContents({
        fetchContent: false,
        id: projectId,
      });

      return data;
    }),
  });

export const vendorQuery = () =>
  queryOptions({
    queryKey: ['vendor'],
    queryFn: handle401(async () => {
      const { data } = await HttpClient.vendorDetails();

      return data;
    }),
  });

export const watchersQuery = (taskId) =>
  queryOptions({
    queryKey: ['watchers', taskId],
    queryFn: handle401(async () => {
      const { data } = await HttpClient.getWatchers({ id: taskId });

      return data;
    }),
  });

export const loader = (queryClient) => async (opts) => {
  const url = new URL(opts.request.url);
  const cardId = url.searchParams.get('task_id');
  const projectId = url.searchParams.get('board');
  await queryClient.ensureQueryData(singleCardQuery(cardId));
  await queryClient.ensureQueryData(watchersQuery(cardId));
  await queryClient.ensureQueryData(projectQuery(projectId));
  await queryClient.ensureQueryData(contentsQuery(projectId));
  await queryClient.ensureQueryData(vendorQuery());

  return { cardId, projectId };
};
