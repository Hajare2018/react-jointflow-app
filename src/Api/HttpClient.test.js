import '@testing-library/jest-dom/vitest';
import { vi, expect, describe, it, afterEach, beforeAll } from 'vitest';
import axios from 'axios';
import HttpClient from './HttpClient';

const TEST_API_URL = 'http://tenantname.appjointflows.com/';
const DOMAIN = 'tenantname.appjointflows.com';
const TEST_ACCESS_TOKEN = 'test-access-token';
const TEST_REFRESH_TOKEN = 'test-refresh-token';

function generateMockResponse(data, status = 200) {
  return {
    status,
    data,
  };
}

describe('HttpClient', () => {
  beforeAll(() => {
    HttpClient.setup(TEST_API_URL, TEST_ACCESS_TOKEN, TEST_REFRESH_TOKEN, DOMAIN);
  });
  describe('API calls', () => {
    afterEach(async () => {
      // Restore all mocks after each test
      vi.restoreAllMocks();
    });
    describe('refreshToken', () => {
      it('sends the correct headers and payload and returns the response', async () => {
        const mockedResponse = [];
        const axiosSpy = vi
          .spyOn(axios, 'post')
          .mockResolvedValue(generateMockResponse(mockedResponse));

        const result = await HttpClient.refreshToken({
          data: {
            refresh: TEST_REFRESH_TOKEN,
          },
        });
        expect(axiosSpy).toHaveBeenCalledWith(
          `${TEST_API_URL}token/refresh/`,
          {
            refresh: TEST_REFRESH_TOKEN,
          },
          {
            headers: {
              Accept: '*/*',
              'X-DTS-SCHEMA': 'tenantname',
            },
            validateStatus: expect.anything(),
          },
        );
        expect(result.status).toEqual(200);
        expect(result.data).toEqual(mockedResponse);
      });
    });

    describe('fetchAllTenants', () => {
      it('sends the correct headers and payload and returns the response', async () => {
        const mockedResponse = [];
        const axiosSpy = vi
          .spyOn(axios, 'get')
          .mockResolvedValue(generateMockResponse(mockedResponse));

        const result = await HttpClient.fetchAllTenants();
        expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
            'X-DTS-SCHEMA': 'tenantname',
          },
          validateStatus: expect.anything(),
        });
        expect(result.status).toEqual(200);
        expect(result.data).toEqual(mockedResponse);
      });
    });

    // describe('createNewTenant', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.createNewTenant();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getDocumentsData', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getDocumentsData();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getProjectsLite', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getProjectsLite();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getProjectsByCompany', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getProjectsByCompany();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getSingleProject', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getSingleProject();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getProjectData', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getProjectData();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchSingleCard', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchSingleCard();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchFilteredCards', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchFilteredCards();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('saveTask', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.saveTask();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('saveTasksPreview', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.saveTasksPreview();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('updateTask', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.updateTask();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('saveProject', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.saveProject();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('updateProject', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.updateProject();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getDocumentsType', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getDocumentsType();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('singleDocumentsType', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.singleDocumentsType();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postDocumentsType', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postDocumentsType();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('editDocumentsType', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.editDocumentsType();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('deleteDocumentsType', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.deleteDocumentsType();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('loadComments', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.loadComments();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('loadBoardComments', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.loadBoardComments();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postComments', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postComments();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postBoardComments', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postBoardComments();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putComments', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putComments();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putBoardComments', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putBoardComments();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getCompanies', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getCompanies();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchCompanyDetails', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchCompanyDetails();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchFavIcon', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchFavIcon();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postCompany', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postCompany();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putCompany', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putCompany();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('deleteCompany', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.deleteCompany();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('login', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.login();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('singleUser', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.singleUser();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('addUser', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.addUser();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('editUserInfo', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.editUserInfo();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('editLiteUser', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.editLiteUser();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchAllUsers', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchAllUsers();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchUploadedDocs', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchUploadedDocs();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postDocument', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postDocument();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putDocument', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putDocument();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('cloneProject', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.cloneProject();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('cloneDocument', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.cloneDocument();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchEvents', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchEvents();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchAssignees', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchAssignees();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postMail', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postMail();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchTenantValuesById', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchTenantValuesById();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchTenantValuesByName', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchTenantValuesByName();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchTenantAttributes', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchTenantAttributes();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postTenantAttributes', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postTenantAttributes();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putTenantAttributes', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putTenantAttributes();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postReactivationMail', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postReactivationMail();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('passwordResetMail', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.passwordResetMail();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('sendPasswordResetMail', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.sendPasswordResetMail();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('forgotPassword', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.forgotPassword();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getCrmDeals', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getCrmDeals();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getCrmCompany', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getCrmCompany();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postCrmContacts', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postCrmContacts();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchCrmStatus', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchCrmStatus();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchUuidData', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchUuidData();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('newTenant', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.newTenant();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('newSuperUser', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.newSuperUser();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchSubDomainProp', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchSubDomainProp();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postFeedback', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postFeedback();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchAccessGroup', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchAccessGroup();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchSingleAccessGroup', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchSingleAccessGroup();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postGroupAccess', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postGroupAccess();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putGroupAccess', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putGroupAccess();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postAccessGroup', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postAccessGroup();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('removeAccessGroup', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.removeAccessGroup();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchPermissions', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchPermissions();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchAccessPermissions', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchAccessPermissions();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchGroupPermissions', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchGroupPermissions();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postGroupPermissions', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postGroupPermissions();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('removeGroupPermissions', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.removeGroupPermissions();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getProjectInsights', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getProjectInsights();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putProjectInsights', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putProjectInsights();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchSecretUrl', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchSecretUrl();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postOtp', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postOtp();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getToken2', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getToken2();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('otpLogin', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.otpLogin();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('checkCrmConnection', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.checkCrmConnection();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchClauses', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchClauses();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchSingleClause', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchSingleClause();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putClause', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putClause();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchClauseLibrary', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchClauseLibrary();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postSlackId', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postSlackId();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchFaqs', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchFaqs();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('singleFaq', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.singleFaq();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('addFaq', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.addFaq();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('editFaq', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.editFaq();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchForecast', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchForecast();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchUserHierarchy', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchUserHierarchy();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchOrgHierarchy', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchOrgHierarchy();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchSlackHistory', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchSlackHistory();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchBoardMembers', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchBoardMembers();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postSlackMessage', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postSlackMessage();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('newSlackChannel', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.newSlackChannel();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('slackChannelInvitation', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.slackChannelInvitation();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('slackWorkspaceInvitation', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.slackWorkspaceInvitation();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchDealPolice', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchDealPolice();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('createDealPoilce', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.createDealPoilce();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('updateDealPolice', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.updateDealPolice();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('projectLiteView', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.projectLiteView();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchTaskSteps', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchTaskSteps();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getOneStep', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getOneStep();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('createTaskSteps', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.createTaskSteps();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('editTaskSteps', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.editTaskSteps();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('testUserEmail', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.testUserEmail();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('newPasswordEmail', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.newPasswordEmail();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('resetUserMFA', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.resetUserMFA();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('crmSync', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.crmSync();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('vendorDetails', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.vendorDetails();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('promptContext', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.promptContext();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('populateFromType', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.populateFromType();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchNotifications', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchNotifications();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('giveMaapAccess', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.giveMaapAccess();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchTags', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchTags();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postTag', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postTag();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('deleteTag', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.deleteTag();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getContents', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getContents();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getSingleContent', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getSingleContent();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postContent', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postContent();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putContent', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putContent();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchGroupView', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchGroupView();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('giveCompanyAccess', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.giveCompanyAccess();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putBoardJsonAttributes', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putBoardJsonAttributes();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('fetchCompanyHierarchy', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.fetchCompanyHierarchy();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postCustomAttributes', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postCustomAttributes();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('editMeddpicc', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.editMeddpicc();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getMaapLink', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getMaapLink();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getGroupViewLink', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getGroupViewLink();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('assignUser', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.assignUser();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getCrmDeal', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getCrmDeal();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getStatuses', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getStatuses();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('postPlaybookStatus', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.postPlaybookStatus();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('putPlaybookStatus', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.putPlaybookStatus();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('deletePlaybookStatus', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.deletePlaybookStatus();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getAnotherStatuses', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getAnotherStatuses();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('getSingleStatus', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.getSingleStatus();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });

    // describe('reassignOwner', () => {
    //   it('sends the correct headers and payload and returns the response', async () => {
    //     const mockedResponse = [];
    //     const axiosSpy = vi
    //       .spyOn(axios, 'get')
    //       .mockResolvedValue(generateMockResponse(mockedResponse));

    //     const result = await HttpClient.reassignOwner();
    //     expect(axiosSpy).toHaveBeenCalledWith(`${TEST_API_URL}tenant/`, {
    //       headers: {
    //         Accept: '*/*',
    //         Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
    //         'X-DTS-SCHEMA': 'tenantname',
    //       },
    //       validateStatus: expect.anything(),
    //     });
    //     expect(result.status).toEqual(200);
    //     expect(result.data).toEqual(mockedResponse);
    //   });
    // });
  });
});
