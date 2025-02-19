import { createAction } from "redux-actions";
import { CLONE_PROJECT, CLONE_DOCUMENT } from "../Constants/actionTypes";
import * as Clone from "../../Api/clone-data";
import { show } from "./loader";
import { clonedBoardData, clonedDocumentData } from "../Reducers/clone-data";
import { showSuccessSnackbar } from "./snackbar";
import { getDocsList, getSingleCardDocs } from "./document-upload";
import getSingleTask from "./single-task";
import { requestDocumentsData } from "../../Api/documents-data";
import requestSingleProject from "./single-project";
import { reload } from "./reload-data";
import { handleError } from "../../components/Utils";
import createJiraProject from "../../Api/create-jira-project";

const boardClone = createAction(CLONE_PROJECT);
const documentClone = createAction(CLONE_DOCUMENT);
const noFoundErr = "Error: Request failed with status code 404";

const pathname = window.location.href.split("/").includes("localhost:3000");

export function cloneBoard(params) {
  return (dispatch) =>
    Clone.requestCloneProject(params)
      .then(async (data) => {
        console.log("parans}}}}}", params);
        return await createJiraProject(params, data);
      })
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        if (params.to_template) {
          dispatch(reload({ show: true, id: data?.data?.new_board_id }));
          dispatch(requestSingleProject({ id: data?.data?.new_board_id }));
        } else if (params.forCrm) {
          dispatch(requestSingleProject({ id: data?.data?.new_board_id }));
        } else {
          if (pathname) {
            window.open(
              `http://localhost:3000/board/?id=${data?.data?.new_board_id}&navbars=${params.showNavbars}&actions=True`,
              '_self',
            );
          } else {
            window.open(
              `/board/?id=${data?.data?.new_board_id}&navbars=${params.showNavbars}&actions=True`,
              '_self',
            );
          }
        }
        dispatch(requestDocumentsData({ filterByTemplate: true }));
        dispatch(boardClone(data));
        dispatch(
          clonedBoardData({ data: data.data, errors: null }, CLONE_PROJECT)
        );
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function cloneDocument(params) {
  return (dispatch) =>
    Clone.requestCloneDocument(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        if (params?.cloneByTaskType) {
          dispatch(
            getDocsList({
              fetchByTaskType: true,
              type_id: params?.data?.task_type_id,
              archived: false,
            })
          );
        } else {
          dispatch(
            getSingleCardDocs({
              doc_id: params?.data?.card_id,
              archived: false,
            })
          );
          dispatch(
            getSingleTask({
              card_id: params?.data?.card_id,
              task_info: false,
            })
          );
        }
        dispatch(documentClone(data));
        dispatch(
          clonedDocumentData({ data: data.data, errors: null }, CLONE_DOCUMENT)
        );
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}
