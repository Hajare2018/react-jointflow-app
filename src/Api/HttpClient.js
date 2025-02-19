import axios from 'axios';
import config from '../config';

class HttpClient {
  api_url = '';
  uuid = '';
  domain = window.location.hostname;

  constructor() {
    this.api_url = config.REACT_APP_BASE_URL;

    this.uuid = new URLSearchParams(window.location.search).get('uuid') || '';
  }

  setup(apiUrl, accessToken, refreshToken, domain) {
    this.api_url = apiUrl;
    this.apiAccessToken = accessToken;
    this.apiRefreshToken = refreshToken;
    this.domain = domain;
  }

  setTokens(accessToken, refreshToken) {
    this.apiAccessToken = accessToken;
    this.apiRefreshToken = refreshToken;
  }

  api_token() {
    return this.apiAccessToken;
  }

  refresh_token() {
    return this.apiRefreshToken;
  }

  tenant() {
    let replaced = this.domain.split('.')[0];

    if (replaced === 'localhost') {
      // tinyclues is the test tenant for localhost dev
      return 'tinyclues';
    }

    return replaced;
  }

  generateTenantHeader() {
    const headers = {
      tenant: this.tenant() === 'tinyclues' ? 'public' : this.tenant(),
    };
    return headers;
  }

  set401ErrorHandler(callback) {
    this.on401Error = callback;
  }

  async handle401Error(apiCall) {
    // lock refresh so not every 401 error triggers a refresh api call
    if (this.apiRefreshToken) {
      if (!this.errorHandlingLock) {
        this.errorHandlingLock = true;

        const { status, data } = await this.refreshToken({
          data: { refresh: this.apiRefreshToken },
        });

        if (status === 200) {
          this.apiAccessToken = data.access;
          this.on401Error(data.access);
        }

        this.errorHandlingLock = false;
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.makeRequest(apiCall).then(resolve).catch(reject);
        }, 500);
      });
    } else {
      return Promise.reject({ status: 401 });
    }
  }

  async makeRequest({ url, method, data, options = { headers: {} } }) {
    const params = [url];

    if (method !== 'get' && method !== 'delete') {
      params.push(data);
    }

    const { withAuth, contentType, tenant, headers, ...otherOptions } = options;
    const defaultHeaders = {
      Accept: '*/*',
      'X-DTS-SCHEMA': tenant || this.tenant(),
      ...headers,
    };

    if (withAuth !== false) {
      defaultHeaders.Authorization = `Bearer ${this.apiAccessToken}`;
    }

    if (contentType) {
      if (!['application/json', 'multipart/form-data'].includes(contentType)) {
        throw new Error(`Unsupported content type: "${contentType}"`);
      } else {
        defaultHeaders['Content-Type'] = contentType;
      }
    }

    params.push({
      ...otherOptions,
      headers: defaultHeaders,
      validateStatus: (status) => status < 300 || status === 401,
    });

    const result = await axios[method](...params);

    if (result.status === 401) {
      if (result.data.code === 'user_inactive') {
        localStorage.removeItem('jointflows:user');
        window.location = '/login';
        return;
      } else if (options.on401Error) {
        return options.on401Error();
      }

      if (url.includes('/token/refresh')) {
        // If token refresh fails clear localstorage and logout user
        localStorage.removeItem('jointflows:user');
        window.location = '/login';
        return;
      }

      return this.handle401Error({ url, method, data, options });
    } else {
      return result;
    }
  }

  makeGetRequest(url, options) {
    return this.makeRequest({ url, method: 'get', options });
  }

  makePostRequest(url, data, options) {
    return this.makeRequest({ url, method: 'post', data, options });
  }

  makePutRequest(url, data, options) {
    return this.makeRequest({ url, method: 'put', data, options });
  }

  makeDeleteRequest(url, options) {
    return this.makeRequest({ url, method: 'delete', options });
  }

  async refreshToken(body) {
    return this.makePostRequest(`${this.api_url}token/refresh/`, body.data, { withAuth: false });
  }

  async fetchAllTenants() {
    return this.makeGetRequest(`${this.api_url}tenant/`);
  }

  async createNewTenant(body) {
    return this.makePostRequest(`${this.api_url}tenant/`, body.data, {
      contentType: 'multipart/form-data',
    });
  }

  async getDocumentsData(body) {
    return this.makeGetRequest(
      this.api_url +
        `boards/${body.fetch_sunburst_data ? '?sunburst_data=True' : ''}${
          body.fetch_crm_projects ? '?crm_id=' + body.crm_id : ''
        }${
          body.filterByTemplate ? '?template_list_view=True&is_template=True' : ''
        }${body.closedBoards ? '&is_complete=True' : ''}${
          body.archivedTemplates ? '&is_archived=True' : ''
        }${
          body.my_team_boards
            ? '&my_teams_boards=True'
            : body.owner !== undefined
              ? '&owner_id=' + body.owner
              : ''
        }${body.project_type !== null ? '&project_type=' + body.project_type : ''}`,
    );
  }

  async getProjectsLite(body) {
    return this.makeGetRequest(
      this.api_url +
        `boards/?light_view=True&is_complete=${body.closedBoards ? 'True' : 'False'}${
          body.my_team_boards
            ? '&my_teams_boards=True'
            : body.paused
              ? '&paused=True'
              : body.owner !== undefined
                ? '&owner_id=' + body.owner
                : ''
        }${body.project_type !== null ? '&project_type=' + body.project_type : ''}`,
    );
  }

  async getProjectsByCompany(body) {
    return this.makeGetRequest(
      this.api_url + `boards/?light_view=True&company_id=${body.company_id}`,
    );
  }

  async getSingleProject(body) {
    return this.makeGetRequest(
      this.api_url +
        `boards/${body.id}/${
          body.header ? '?headers=True' : body.ext_team_view ? '?ext_team_view=True' : ''
        }`,
    );
  }

  async getProjectData(body) {
    if (body.forQueues) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?light_view=True${
            body.task_type !== null && body.task_type !== 'none'
              ? '&cardtype=' + encodeURIComponent(body.task_type)
              : ''
          }${
            body.assignee !== null && body.assignee !== 'none' ? '&assignee=' + body.assignee : ''
          }${
            body.department !== null && body.department !== 'none'
              ? '&department=' + body.department
              : ''
          }${
            body.status !== null && body.status !== 'none' ? '&status=' + body.status : ''
          }&is_completed=${
            body.is_completed || body.status === 'completed' ? 'True' : 'False'
          }&is_board_template=False&archived=False`,
      );
    } else if (body.task_type__asc_ordering) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?light_view=True&cardtype=${encodeURIComponent(
            body.task_type__asc_ordering,
          )}&is_completed=False&is_board_template=False&archived=False&ordering=${body.orderBy}`,
      );
    } else if (body.task_type__desc_ordering) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?light_view=True&cardtype=${encodeURIComponent(
            body.task_type__desc_ordering,
          )}&is_completed=False&is_board_template=False&archived=False&ordering=-${body.orderBy}`,
      );
    } else if (body.isLegal) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?light_view=True&is_board_template=False&archived=False&task_type__is_legal=True&is_completed=False`,
      );
    }
    if (body.isLegal__completed) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?light_view=True&is_board_template=False&archived=False&task_type__is_legal=True&is_completed=True`,
      );
    } else if (body.isLegal__upcoming) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?light_view=True&start_date__gt=${new Date()
            .toJSON()
            .slice(0, 10)
            .replace(/-/g, '-')}&is_board_template=False&archived=False&task_type__is_legal=True`,
      );
    } else if (body.allCards) {
      return this.makeGetRequest(this.api_url + `cards/`);
    } else if (body.filteredByBoard) {
      return this.makeGetRequest(
        this.api_url + `cards/?archived=False&board__id=${body.id}&task_details_view=True`,
      );
    }
  }

  async fetchSingleCard(body) {
    if (body.task_info) {
      return this.makeGetRequest(this.api_url + `cards/?id=${body.card_id}&task_info_only=True`);
    } else if (body.maap_task) {
      return this.makeGetRequest(this.api_url + `cards/${body.card_id}?maap=True`);
    } else {
      return this.makeGetRequest(this.api_url + `cards/${body.card_id}/`);
    }
  }

  async fetchFilteredCards(body) {
    if (body.allCards) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?is_board_template=False&archived=False&internal_assignee__id=${body.user_id}&is_completed=False`,
      );
    } else if (body.allOpenCards) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?is_board_template=False&archived=False&internal_assignee__id=${body.user_id}&is_completed=False`,
      );
    } else if (body.filterList) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?is_board_template=False&archived=False&internal_assignee__id=${
            body.user_id
          }${body.status !== 'completed' ? '&is_completed=False' : ''}${
            body.type !== 'none' ? '&cardtype' + '=' + encodeURIComponent(body.type) : ''
          }${body.status !== 'none' ? '&status' + '=' + body.status : ''}`,
      );
    } else if (body.completed) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?is_board_template=False&archived=False&internal_assignee__id=${body.user_id}&is_completed=True`,
      );
    } else if (body.upcoming) {
      return this.makeGetRequest(
        this.api_url +
          `cards/?start_date__gt=${new Date()
            .toJSON()
            .slice(0, 10)
            .replace(/-/g, '-')}&is_board_template=False&archived=False&internal_assignee__id=${
            body.user_id
          }&is_completed=False`,
      );
    }
  }

  async saveTask(body) {
    return this.makePostRequest(this.api_url + 'cards/', body, { contentType: 'application/json' });
  }

  async saveTasksPreview(body) {
    return this.makePutRequest(this.api_url + 'upload-board-thumbnail/', body, {
      contentType: 'application/json',
    });
  }

  async updateTask(body) {
    if (!body.id) {
      return this.makePutRequest(this.api_url + `cards/`, body, {
        contentType: 'application/json',
      });
    } else {
      return this.makePutRequest(this.api_url + `cards/${body.id}/`, body, {
        contentType: 'application/json',
      });
    }
  }

  async saveProject(body) {
    return this.makePostRequest(this.api_url + `boards/`, body.data, {
      contentType: 'application/json',
    });
  }

  async updateProject(body) {
    if (body.boards) {
      return this.makePutRequest(this.api_url + `boards/`, body, {
        contentType: 'application/json',
      });
    } else {
      return this.makePutRequest(this.api_url + `boards/${body.id}/`, body.data, {
        contentType: 'application/json',
      });
    }
  }

  async getDocumentsType() {
    return this.makeGetRequest(this.api_url + `documenttype/`);
  }

  async singleDocumentsType(body) {
    return this.makeGetRequest(this.api_url + `documenttype/${body.id}/`);
  }

  async postDocumentsType(body) {
    return this.makePostRequest(this.api_url + 'documenttype/', body, {
      contentType: 'application/json',
    });
  }

  async editDocumentsType(body) {
    return this.makePutRequest(this.api_url + `documenttype/${body.id}/`, body, {
      contentType: 'application/json',
    });
  }

  async deleteDocumentsType(body) {
    return this.makeDeleteRequest(this.api_url + 'documenttype/' + body.id);
  }

  async loadComments(body) {
    return this.makeGetRequest(
      this.api_url +
        `card-comments-events/${body.id}/?client_visible=${body.client_visible ? 'True' : 'False'}`,
    );
  }

  async loadBoardComments(body) {
    return this.makeGetRequest(this.api_url + `comment/?board_id=${body.board_id}`);
  }

  async postComments(body) {
    return this.makePostRequest(this.api_url + `comment/`, body, {
      contentType: 'application/json',
    });
  }

  async postBoardComments(body) {
    return this.makePostRequest(this.api_url + `comment/`, body.data, {
      contentType: 'application/json',
    });
  }

  async putComments(body) {
    return this.makePutRequest(this.api_url + `comment/${body.id}/`, body.data, {
      contentType: 'application/json',
    });
  }

  async putBoardComments(body) {
    return this.makePutRequest(this.api_url + `comment/${body.comment_id}/`, body.data, {
      contentType: 'application/json',
    });
  }

  async getCompanies() {
    return this.makeGetRequest(this.api_url + `buyercompany/`);
  }

  async fetchCompanyDetails(body) {
    return this.makeGetRequest(this.api_url + `buyercompany/${body.id}`);
  }

  async fetchFavIcon(body) {
    return this.makeGetRequest(this.api_url + `refresh-favicon?id=${body.id}`);
  }

  async postCompany(body) {
    return this.makePostRequest(this.api_url + `buyercompany/`, body.data, {
      contentType: 'application/json',
    });
  }

  async putCompany(body) {
    return this.makePutRequest(this.api_url + `buyercompany/${body.id}/`, body.data, {
      contentType: 'application/json',
    });
  }

  async deleteCompany(body) {
    return this.makeDeleteRequest(this.api_url + `buyercompany/${body.id}/`);
  }

  async login(body) {
    return this.makePostRequest(`${this.api_url}token/`, body.data, {
      withAuth: false,
    });
  }

  userInfo(on401Error) {
    return this.makeGetRequest(this.api_url + 'userinfo/', {
      on401Error,
    });
  }

  async singleUser(body) {
    return this.makeGetRequest(this.api_url + `user/${body.id}/`);
  }

  async addUser(body) {
    return this.makePostRequest(this.api_url + `user/`, body.data, {
      contentType: 'multipart/form-data',
    });
  }

  async editUserInfo(body) {
    return this.makePutRequest(this.api_url + `user/${body.id}/`, body.data, {
      contentType: 'multipart/form-data',
    });
  }

  async editLiteUser(body) {
    return this.makePutRequest(this.api_url + `update-lightuser/`, body.data, {
      contentType: 'multipart/form-data',
    });
  }

  async fetchAllUsers(body) {
    if (body.onlyStaff) {
      return this.makeGetRequest(this.api_url + `user/?is_staff=True&is_active=True`);
    }
    if (body.onlyStaff__archived) {
      return this.makeGetRequest(this.api_url + `user/?is_staff=True&is_active=False`);
    }
    if (body.usersByCompany) {
      return this.makeGetRequest(
        this.api_url + `user/?buyer_company_id=${body.company_id}&is_active=True`,
      );
    }
    if (body.usersByCompany__archived) {
      return this.makeGetRequest(
        this.api_url + `user/?buyer_company_id=${body.company_id}&is_active=False`,
      );
    }
    if (body.onlyStaff === false) {
      return this.makeGetRequest(this.api_url + `user/?is_staff=False&is_active=True`);
    }
    if (body.onlyStaff__archived === false) {
      return this.makeGetRequest(this.api_url + `user/?is_staff=False&is_active=False`);
    }
    if (body.onlyStaff_with_sales_target) {
      return this.makeGetRequest(
        this.api_url + `user/?is_staff=True&is_active=True&sales_target_set=True`,
      );
    }
  }

  async fetchUploadedDocs(body) {
    if (body.id === null) {
      return this.makeGetRequest(
        this.api_url +
          `document?is_template=${
            body.isTemplate ? 'True' : 'False'
          }&archived=${body.archived ? 'True' : 'False'}&include_categories=${
            body.categories ? 'True' : 'False'
          }`,
      );
    } else if (body.fetchByTaskType) {
      return this.makeGetRequest(this.api_url + `document?task_type_id=${body.type_id}`);
    } else if (body.fetchByBoard) {
      return this.makeGetRequest(
        this.api_url + `document?board_id=${body.board_id}&archived=False`,
      );
    } else if (body.fetchLightList) {
      return this.makeGetRequest(
        this.api_url + `document?board_id=${body.board_id}&archived=False&view=lightList`,
      );
    } else {
      return this.makeGetRequest(this.api_url + `document?card_id=${body.doc_id}&archived=False`);
    }
  }

  async postDocument(body) {
    return this.makePostRequest(this.api_url + `document/`, body.data, {
      contentType: 'multipart/form-data',
    });
  }

  async putDocument(body) {
    return this.makePutRequest(this.api_url + `document/${body.id}/`, body.data, {
      contentType: 'multipart/form-data',
    });
  }

  async cloneProject(body) {
    return this.makePostRequest(this.api_url + `template-clone/`, body.data);
  }

  async cloneDocument(body) {
    return this.makePostRequest(this.api_url + `document-clone/`, body.data);
  }

  async fetchEvents(body) {
    if (body.board_id !== null) {
      return this.makeGetRequest(
        this.api_url +
          `tracking/?limit=10&page=${body.page}&search_fields==board__id&search=${body.board_id}&ordering=-event_date_time`,
      );
    } else {
      return this.makeGetRequest(
        this.api_url +
          `tracking/?limit=10&page=${body.page}&search_fields==card__id&search=${body.card_id}&ordering=-event_date_time`,
      );
    }
  }

  async fetchAssignees(body) {
    return this.makeGetRequest(this.api_url + `historic-assignees/${body.card_id}`);
  }

  async postMail(body) {
    return this.makePostRequest(this.api_url + `send-templated-email/`, body.data);
  }

  async fetchTenantValuesById(body) {
    return this.makeGetRequest(
      this.api_url + `tenantattribute/?&search_fields=id&search=${body.id}`,
    );
  }

  async fetchTenantValuesByName(body) {
    return this.makeGetRequest(this.api_url + `tenantattribute/${body.keyword}/`);
  }

  async fetchTenantAttributes() {
    return this.makeGetRequest(this.api_url + `tenantattribute/?ordering=-id`);
  }

  async postTenantAttributes(body) {
    return this.makePostRequest(this.api_url + `tenantattribute/`, body.data);
  }

  async putTenantAttributes(body) {
    return this.makePutRequest(this.api_url + `tenantattribute/${body.attribute_name}/`, body.data);
  }

  async postReactivationMail(body) {
    return this.makePostRequest(this.api_url + `refresh-lightuser-tokens/`, body.token, {
      withAuth: false,
    });
  }

  async passwordResetMail(body) {
    return this.makePostRequest(this.api_url + `send-reset-password-email/`, body.data);
  }

  async sendPasswordResetMail(body) {
    return this.makePostRequest(this.api_url + `send-password-reset-email/`, body.data, {
      withAuth: false,
    });
  }

  async forgotPassword(body) {
    // return await axios.patch();
    return this.makePutRequest(this.api_url + `user/${body.user_id}/`, body.password, {
      contentType: 'application/json',
    });
  }

  async getCrmDeals(body) {
    return this.makeGetRequest(
      this.api_url +
        `fetch-crm-deals/?crm=${body.crm_name}&stage_name=${body.stage}&after=${body.next}`,
    );
  }
  ///////////////////////
  async getCrmDealsBySearch(body) {
    return this.makeGetRequest(
      this.api_url +
        `fetch-crm-deals/?crm=${body.crm_name}&search_text=${body.search_text}`,
        
    );
  }
//////////////////////////
  async getCrmCompany(body) {
    return this.makePostRequest(this.api_url + `fetch-crm-company/`, body?.data, {
      contentType: 'application/json',
    });
  }

  async postCrmContacts(body) {
    return this.makePostRequest(this.api_url + `fetch-crmdeal-contacts/`, body?.data, {
      contentType: 'application/json',
    });
  }

  async fetchCrmStatus(body) {
    return this.makeGetRequest(
      this.api_url +
        `fetch-crmdeal-stage/?crm=${body.crm_name}${
          body.crm_name === 'hubspot' ? '&pipeline=' + body.pipeline_id : ''
        } `,
    );
  }

  async fetchUuidData(body) {
    return this.makeGetRequest(this.api_url + `tenant/${body.uuid}`, this.generateTenantHeader());
  }

  async newTenant(body) {
    return this.makePostRequest(this.api_url + `tenant/`, body.data, this.generateTenantHeader());
  }

  async newSuperUser(body) {
    return this.makePostRequest(
      this.api_url + `tenant-superuser/`,
      body.data,
      body.admin ? {} : this.generateTenantHeader(),
    );
  }

  async fetchSubDomainProp(body) {
    return this.makePostRequest(
      this.api_url + `check_sub_domain_prop/`,
      body,
      this.generateTenantHeader(),
    );
  }

  async postFeedback(body) {
    return this.makePostRequest(this.api_url + `common/review-api/add_review/`, body);
  }

  async fetchAccessGroup() {
    return this.makeGetRequest(this.api_url + `access/access-group/`);
  }

  async fetchSingleAccessGroup(body) {
    return this.makeGetRequest(this.api_url + `access/access-group/${body.id}/`);
  }

  async postGroupAccess(body) {
    return this.makePostRequest(this.api_url + `access/access-group/`, body.data);
  }

  async putGroupAccess(body) {
    return this.makePutRequest(this.api_url + `access/access-group/${body.id}/`, body.data);
  }

  async postAccessGroup(body) {
    return this.makePostRequest(this.api_url + `access/core-user-group/`, body);
  }

  async removeAccessGroup(body) {
    return this.makeDeleteRequest(this.api_url + `access/core-user-group/${body.group}/`);
  }

  async fetchPermissions(body) {
    return this.makeGetRequest(
      this.api_url + `access/core-user-permissions/${body.user_id}/all_permissions/`,
    );
  }

  async fetchAccessPermissions() {
    return this.makeGetRequest(this.api_url + `access/access-permissions/`);
  }

  async fetchGroupPermissions() {
    return this.makeGetRequest(this.api_url + `access/access-group-permission/`);
  }

  async postGroupPermissions(body) {
    return this.makePostRequest(this.api_url + `access/access-group-permission/`, body.data);
  }

  async removeGroupPermissions(body) {
    return this.makeDeleteRequest(this.api_url + `access/access-group-permission/${body.id}`);
  }

  async getProjectInsights(body) {
    return this.makeGetRequest(this.api_url + `insight/?board_id=${body.board_id}`);
  }

  async putProjectInsights(body) {
    return this.makePutRequest(this.api_url + `insight/${body.id}/`, body.data);
  }

  async fetchSecretUrl() {
    return this.makePutRequest(this.api_url + `get-otp-secret-url/`, { mfa: 'True' });
  }

  async postOtp(body) {
    return this.makePostRequest(this.api_url + `verify-user-mfa/`, body);
  }

  async getToken2(body) {
    return this.makePostRequest(`${this.api_url}token-2/`, body?.data, {
      withAuth: false,
    });
  }

  async otpLogin(body) {
    return this.makePostRequest(this.api_url + `totp/login/`, body, {
      withAuth: false,
    });
  }

  async checkCrmConnection(body) {
    return this.makeGetRequest(this.api_url + `check-connection/?crm=${body.crm}`);
  }

  async fetchClauses(body) {
    if (body.fullData) {
      return this.makeGetRequest(
        this.api_url + `get-clause/?document_src=${body.doc_id}&full_data=True`,
      );
    }
    if (body.approved) {
      return this.makeGetRequest(
        this.api_url + `get-clause/?word_paraid=${body.para_id}&approved_status=True`,
      );
    }
    if (body.stareClauses) {
      return this.makeGetRequest(
        this.api_url + `get-clause/?document_src=${body.doc_id}&stare_clause=True`,
      );
    }
    if (body.hidden) {
      return this.makeGetRequest(
        this.api_url + `get-clause/?document_src=${body.doc_id}&hide=True`,
      );
    }
    if (body.modified) {
      return this.makeGetRequest(
        this.api_url + `get-clause/?document_src=${body.doc_id}&has_been_modified=True`,
      );
    }
    if (!body.hidden) {
      return this.makeGetRequest(
        this.api_url + `get-clause/?document_src=${body.doc_id}&hide=False`,
      );
    }
  }

  async fetchSingleClause(body) {
    return this.makeGetRequest(this.api_url + `get-clause/${body.clause_id}/`);
  }

  async putClause(body) {
    return this.makePutRequest(this.api_url + `clause/${body.clause_id}/`, body.data);
  }

  async fetchClauseLibrary(body) {
    if (body.fetchLibrary) {
      return this.makeGetRequest(
        this.api_url +
          `get-clause/?word_paraid=${body.para_id}&approved_status=True&library_data=True`,
      );
    }
    if (body.fetchHistory) {
      return this.makeGetRequest(
        this.api_url +
          `get-clause/?word_paraid=${body.para_id}&history_data=True&file_uuid=${body.file_uuid}`,
      );
    }
  }

  async postSlackId(body) {
    return this.makePostRequest(this.api_url + `get-user-slack-id/`, body.data);
  }

  async fetchFaqs(body) {
    if (body.all) {
      return this.makeGetRequest(this.api_url + `faq/`);
    }
    if (!body.archive) {
      return this.makeGetRequest(this.api_url + `faq/?hide=false&archive=false`);
    }
  }

  async singleFaq(body) {
    return this.makeGetRequest(this.api_url + `faq/${body.id}/`);
  }

  async addFaq(body) {
    return this.makePostRequest(this.api_url + `faq/`, body.data);
  }

  async editFaq(body) {
    return this.makePutRequest(this.api_url + `faq/${body.id}/`, body.data);
  }

  async fetchForecast(body) {
    return this.makeGetRequest(
      this.api_url +
        `forecast/?start_date=${body.start_date}&end_date=${body.end_date}${
          body.id !== null ? '&user_id=' + body.id : ''
        }${body.project_type !== null ? '&project_type=' + body.project_type : ''}`,
    );
  }

  async fetchUserHierarchy(body) {
    return this.makeGetRequest(
      this.api_url +
        `user-hierarchy/?${body.user !== undefined ? 'user_id=' + body.user : ''}${
          body.company_id !== undefined ? 'buyer_company_id=' + body.company_id : ''
        }`,
    );
  }

  async fetchOrgHierarchy() {
    return this.makeGetRequest(this.api_url + `user-hierarchy/`);
  }

  async fetchSlackHistory(body) {
    return this.makeGetRequest(
      this.api_url + `slack-channel-history/?channel_id=${body.slack_channel_id}`,
    );
  }

  async fetchBoardMembers(body) {
    return this.makeGetRequest(
      this.api_url +
        `slack-channel-get-members/?channel_id=${body.slack_channel_id}&board_id=${body.board_id}`,
    );
  }

  async postSlackMessage(body) {
    return this.makePostRequest(this.api_url + `post-slack-message/`, body.data);
  }

  async newSlackChannel(body) {
    return this.makePostRequest(this.api_url + `slack-create-channel/`, body.data);
  }

  async slackChannelInvitation(body) {
    return this.makePostRequest(this.api_url + `slack-invite-to-channel/`, body.data);
  }

  async slackWorkspaceInvitation(body) {
    return this.makePostRequest(this.api_url + `slack-invite-to-workspace/`, body.data);
  }

  async fetchDealPolice(body) {
    return this.makeGetRequest(
      this.api_url +
        `dealpolice/?dealpolice_id=${body.deal_police_id}&external_contact_id=${body.external_contact_id}`,
    );
  }

  async createDealPoilce(body) {
    return this.makePostRequest(this.api_url + `dealpolice/`, body);
  }

  async updateDealPolice(body) {
    return this.makePutRequest(this.api_url + `dealpolice/${body.deal_police_id}/`, body.data);
  }

  async projectLiteView(body) {
    return this.makeGetRequest(this.api_url + `maap/${body.board}/`);
  }

  async fetchTaskSteps(body) {
    if (body.fetchByTaskType) {
      return this.makeGetRequest(this.api_url + `steps/?task_type_id=${body.id}`);
    } else {
      return this.makeGetRequest(this.api_url + `steps/?card_id=${body.id}`);
    }
  }

  async getOneStep(body) {
    return this.makeGetRequest(this.api_url + `steps/${body.id}/`);
  }

  async createTaskSteps(body) {
    return this.makePostRequest(this.api_url + `steps/`, body.data);
  }

  async editTaskSteps(body) {
    if (body.isTaskType) {
      return this.makePutRequest(this.api_url + `steps/${body.id}/`, body.data);
    } else if (body.reorderSteps) {
      return this.makePutRequest(this.api_url + `steps/`, body);
    } else {
      return this.makePutRequest(this.api_url + `steps/${body.id}/`, body.data);
    }
  }

  async testUserEmail(body) {
    return this.makeGetRequest(this.api_url + `test-user-email/?user_id=${body.id}`);
  }

  async newPasswordEmail(body) {
    return this.makePostRequest(this.api_url + `send-new-password-email/`, body.data);
  }

  async resetUserMFA(body) {
    return this.makePostRequest(this.api_url + `reset-user-mfa/`, body.data);
  }

  async crmSync(body) {
    return this.makePostRequest(this.api_url + `crm-feedback-push/`, body.data);
  }

  async vendorDetails() {
    return this.makeGetRequest(this.api_url + `vendor-attributes/`);
  }

  async promptContext(body) {
    return this.makeGetRequest(
      this.api_url + `promptcontext/?card_id=${body.card_id}&task_type_id=${body.task_type_id}`,
    );
  }

  async populateFromType(body) {
    return this.makePostRequest(this.api_url + `populate-from-type/`, body.data);
  }

  async fetchNotifications() {
    return this.makeGetRequest(this.api_url + `notifications/?page_size=10`);
  }

  async giveMaapAccess(body) {
    return this.makePostRequest(this.api_url + `give-maap-access/`, body.data);
  }

  async fetchTags(body) {
    return this.makeGetRequest(this.api_url + `tags/?board_id=${body.id}`);
  }

  async postTag(body) {
    return this.makePostRequest(this.api_url + `tags/`, body.data);
  }

  async deleteTag(body) {
    return this.makeDeleteRequest(this.api_url + `tags/${body.id}`);
  }

  async getContents(body) {
    if (body.fetchContent) {
      return this.makeGetRequest(this.api_url + `cblocks/${body.id}/`);
    } else {
      return this.makeGetRequest(this.api_url + `cblocks/?board_id=${body.id}`);
    }
  }

  async getSingleContent(body) {
    return this.makeGetRequest(this.api_url + `cblocks/${body.id}/`);
  }

  async postContent(body) {
    return this.makePostRequest(this.api_url + `cblocks/`, body.data);
  }

  async putContent(body) {
    if (body.updateOrder) {
      return this.makePutRequest(this.api_url + `cblocks/`, body.data);
    } else {
      return this.makePutRequest(this.api_url + `cblocks/${body.id}/`, body.data);
    }
  }

  async fetchGroupView(body) {
    return this.makeGetRequest(this.api_url + `maap-group-view/${body.id}/`);
  }

  async giveCompanyAccess(body) {
    return this.makePostRequest(this.api_url + `give-companyview-access/`, body.data);
  }

  async putBoardJsonAttributes(body) {
    return this.makePutRequest(this.api_url + `boards-cust-attributes/${body.board}/`, body.data);
  }

  async fetchCompanyHierarchy(body) {
    return this.makeGetRequest(this.api_url + `company-hierarchy/?company_id=${body.id}`);
  }

  async postCustomAttributes(body) {
    return this.makePostRequest(
      this.api_url + `boards-upgrade-cust-attributes/${body.id}/`,
      body.data,
    );
  }

  async editMeddpicc(body) {
    return this.makePutRequest(this.api_url + `boards-update-meddpicc/${body.id}/`, body.data);
  }

  async getMaapLink(body) {
    return this.makeGetRequest(
      this.api_url + `get-maap-url/?card_id=${body.card}&user_id=${body.user}`,
    );
  }

  async getGroupViewLink(body) {
    return this.makeGetRequest(
      this.api_url + `get-groupview-url/?company_id=${body.company_id}&user_id=${body.user_id}`,
    );
  }

  async assignUser(body) {
    return this.makePostRequest(this.api_url + `reassign-board-owner/`, body.data);
  }

  async getCrmDeal(body) {
    return this.makeGetRequest(
      this.api_url + `fetch-crm-single-deal/?crm=${body.crm}&deal_id=${body.deal}`,
    );
  }

  async getStatuses(body) {
    return this.makeGetRequest(this.api_url + `playbookstatuses/?board_id=${body.id}`);
  }

  async postPlaybookStatus(body) {
    return this.makePostRequest(this.api_url + `playbookstatuses/`, body.data);
  }

  async putPlaybookStatus(body) {
    return this.makePutRequest(this.api_url + `playbookstatuses/${body.id}/`, body.data);
  }

  async deletePlaybookStatus(body) {
    return this.makeDeleteRequest(this.api_url + `playbookstatuses/${body.id}/`);
  }

  async getAnotherStatuses() {
    return this.makeGetRequest(this.api_url + `statuses/`);
  }

  async getSingleStatus(body) {
    return this.makeGetRequest(this.api_url + `playbookstatuses/${body.id}/`);
  }

  async reassignOwner(body) {
    return this.makePostRequest(this.api_url + `reassign-owner/`, body.data);
  }

  async getWatchers(body) {
    return this.makeGetRequest(this.api_url + `watchers/?card_id=${body.id}`);
  }

  async postWatchers(body) {
    return this.makePostRequest(this.api_url + `watchers/`, body.data);
  }

  async deleteWatcher(body) {
    return this.makeDeleteRequest(this.api_url + `watchers/${body.id}/`);
  }

  async getJiraIntegrationStatus(boardId) {
    return this.makeGetRequest(
      `https://6jhd3pwqecijep5adi6sdctbda0mzjxo.lambda-url.eu-west-1.on.aws/${boardId}`,
    );
  }

  async updateJiraIntegrationStatus({ boardId, jiraSyncEnabled, jiraProjectKey }) {
    const body = jiraProjectKey ? { jiraSyncEnabled, jiraProjectKey } : { jiraSyncEnabled };

    return this.makePostRequest(
      `https://6jhd3pwqecijep5adi6sdctbda0mzjxo.lambda-url.eu-west-1.on.aws/${boardId}`,
      body,
    );
  }

  async updateTaskJiraIntegrationStatus({ boardId, taskId, jiraSyncEnabled, jiraIssueKey }) {
    const body = jiraIssueKey ? { jiraSyncEnabled, jiraIssueKey } : { jiraSyncEnabled };

    return this.makePostRequest(
      `https://6jhd3pwqecijep5adi6sdctbda0mzjxo.lambda-url.eu-west-1.on.aws/${boardId}/${taskId}`,
      body,
    );
  }

  async getCobaltSessionToken() {
    const response = await fetch('https://api.gocobalt.io/api/v2/public/session-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `tk82c9b86a-6707-498d-9fc0-627ff7c8a8c2`,
      },
      body: JSON.stringify({
        linked_account_id: this.tenant(),
      }),
    });

    const data = await response.json();

    return data.token;
  }

  async postTrackingData(body) {
    return this.makePostRequest(this.api_url + `maaptracking/`, body.data);
  }
}

export default new HttpClient();
